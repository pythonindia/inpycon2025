const env = require("./env");

async function fetchJobPostings(URL) {
    try {
        const response = await fetch(URL);
        const text = await response.text();

        const jsonString = text.substring(47).slice(0, -2);
        const json = JSON.parse(jsonString);
        const rows = json.table.rows;

        const ensureHttps = (url) => {
            if (!/^https?:\/\//.test(url)) {
                return `https://${url}`;
            }
            return url;
        };

        const isValidUrl = (url) => {
            const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
            return pattern.test(url);
        };

        const jobPostings = rows.map((row) => ({
            title: row.c[5]?.v || "No title",
            company: row.c[2]?.v || "Unknown",
            company_website: ensureHttps(row.c[4]?.v) || "#",
            job_type: row.c[6]?.v || "N/A",
            location: row.c[8]?.v || "Unknown",
            description: row.c[7]?.v || "No description available",
            link_to_apply: ensureHttps(row.c[9]?.v) || "#",
        }))
        .filter((job_post) =>
            isValidUrl(job_post.company_website) &&
            isValidUrl(job_post.link_to_apply)
        );

        return jobPostings;
    } catch (error) {
        console.error("Error fetching or processing job postings:", error);
        return [];
    }
}

module.exports = async function () {
    return await fetchJobPostings(env.spreadsheetURL);
};