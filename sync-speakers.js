#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const scheduleFilePath = 'src/_data/schedule.json';
const speakersFilePath = 'src/_data/speakers.json';

function getAnswerByQuestion(answers, questionId) {
    if (!answers || !Array.isArray(answers)) return null;

    const answer = answers.find(a => a.question === questionId);
    return answer ? answer.answer : null;
}

function extractSpeakers(scheduleData) {
    const speakers = new Map();

    function processEvents(events) {
        events.forEach(event => {
            if (event.persons && event.persons.length > 0) {
                event.persons.forEach(person => {
                    if (!speakers.has(person.guid)) {
                        const linkedinUrl = getAnswerByQuestion(person.answers, 19);
                        let xUrl = getAnswerByQuestion(person.answers, 20);
                        let instagramUrl = getAnswerByQuestion(person.answers, 21);
                        let gravatarUrl = getAnswerByQuestion(person.answers, 17);
                        let title = getAnswerByQuestion(person.answers, 16);

                        let speaker = {
                            code: person.code,
                            name: person.public_name,
                            socials: {},
                        }

                        if (title !== null) {
                            speaker.title = title;
                        }

                        if (linkedinUrl !== null) {
                            speaker.socials.linkedin = linkedinUrl;
                        }

                        if (xUrl !== null) {
                            speaker.socials.x = xUrl;
                        }

                        if (instagramUrl !== null) {
                            speaker.socials.instagram = instagramUrl;
                        }

                        if (gravatarUrl !== null) {
                            speaker.socials.gravatarUrl = gravatarUrl;
                        }

                        speakers.set(person.code, speaker);
                    }
                });
            }
        });
    }

    if (scheduleData && scheduleData.schedule && scheduleData.schedule.conference && scheduleData.schedule.conference.days) {
        scheduleData.schedule.conference.days.forEach(day => {
            if (day.rooms) {
                Object.values(day.rooms).forEach(roomEvents => {
                    processEvents(roomEvents);
                });
            }
        });
    } else {
        console.error('Invalid schedule data structure');
        return [];
    }

    return Array.from(speakers.values());
}

async function fetchGravatarImageUrl(gravatarUrl) {
    try {
        // Extract username from gravatar URL (e.g., "vivekkeshore" from "https://gravatar.com/vivekkeshore")
        const username = gravatarUrl.split('/').pop();

        // Fetch profile data from Gravatar API
        const apiUrl = `https://api.gravatar.com/v3/profiles/${username}`;

        return new Promise((resolve, reject) => {
            https.get(apiUrl, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const profile = JSON.parse(data);

                        if (profile.hash) {
                            // Generate the actual image URL
                            const imageUrl = `https://gravatar.com/avatar/${profile.hash}.png?size=2048&default=initials`;
                            resolve(imageUrl);
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        console.log(`Failed to parse profile data for ${username}:`, error.message);
                        resolve(null);
                    }
                });
            }).on('error', (error) => {
                console.log(`Failed to fetch profile for ${username}:`, error.message);
                resolve(null);
            });
        });
    } catch (error) {
        console.log(`Invalid gravatar URL: ${gravatarUrl}`);
        return null;
    }
}

async function generateGravatarImageUrls(speakers) {
    console.log('Fetching gravatar image URLs...');

    for (const speaker of speakers) {
        if (speaker.socials && speaker.socials.gravatarUrl && speaker.socials.gravatarUrl.startsWith('https://gravatar.com/')) {
            console.log(`Fetching image URL for ${speaker.name}...`);
            const imageUrl = await fetchGravatarImageUrl(speaker.socials.gravatarUrl);
            if (imageUrl || imageUrl !== null) {
                speaker.imageLink = imageUrl;
            }
        }
    }

    return speakers;
}

async function main() {
    try {
        if (!fs.existsSync(scheduleFilePath)) {
            console.error(`Schedule file not found: ${scheduleFilePath}`);
            process.exit(1);
        }

        console.log('Loading schedule data...');
        const scheduleData = JSON.parse(fs.readFileSync(scheduleFilePath, 'utf8'));

        console.log('Extracting speakers...');
        let speakers = extractSpeakers(scheduleData);

        console.log(`Found ${speakers.length} unique speakers`);

        // Fetch gravatar image URLs
        speakers = await generateGravatarImageUrls(speakers);

        speakers.sort((a, b) => a.name.localeCompare(b.name));

        fs.writeFileSync(speakersFilePath, JSON.stringify(speakers, null, 2));
        console.log(`Speakers data written to: ${speakersFilePath}`);

        const speakersWithLinkedIn = speakers.filter(s => s.socials.linkedin).length;
        const speakersWithX = speakers.filter(s => s.socials.x).length;
        const speakersWithInstagram = speakers.filter(s => s.socials.instagram).length;
        const speakersWithGravatar = speakers.filter(s => s.socials.gravatarUrl).length;
        const speakersWithImageLink = speakers.filter(s => s.socials.imageLink).length;
        const speakersWithTitle = speakers.filter(s => s.title).length;

        console.log('\nSummary:');
        console.log(`- Total speakers: ${speakers.length}`);
        console.log(`- Speakers with Title: ${speakersWithTitle}`);
        console.log(`- Speakers with LinkedIn profiles: ${speakersWithLinkedIn}`);
        console.log(`- Speakers with X profiles: ${speakersWithX}`);
        console.log(`- Speakers with Instagram profiles: ${speakersWithInstagram}`);
        console.log(`- Speakers with gravatar URLs: ${speakersWithGravatar}`);
        console.log(`- Speakers with image links: ${speakersWithImageLink}`);
    } catch (error) {
        console.error('Error processing schedule:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
    });
}

module.exports = {
    extractSpeakers,
    generateGravatarImageUrls,
    getAnswerByQuestion
};
