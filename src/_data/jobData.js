const axios = require('axios');

async function fetchJobData() {
    const SPREADSHEET_ID = "1oyMFGGKmR6u5JVpd691iYD_6TuDi3pbvyaajAZfGkGw";
    const URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

    try {
        const response = await axios.get(URL);
        const text = response.data;

        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;

        const jobPostings = rows.map((row) => ({
            title : row.c[1] && row.c[1].v ? row.c[1].v : "No title",
            company : row.c[2] && row.c[2].v ? row.c[2].v : "Unknown",
            companyWebsite : row.c[3] && row.c[3].v ? row.c[3].v : "#",
            jobType : row.c[4] && row.c[4].v ? row.c[4].v : "N/A",
            location : row.c[5] && row.c[5].v ? row.c[5].v : "Unknown",
            description : row.c[6] && row.c[6].v ? row.c[6].v : "No description available",
            linkToApply : row.c[7] && row.c[7].v ? row.c[7].v : "#"
        }));

        return jobPostings;
    } catch (error) {
        console.error("Error fetching job data:", error);
        return [];
    }
}

module.exports = async () => {
    return await fetchJobData();
};
