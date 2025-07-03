const isDev = process.env.ELEVENTY_ENV === "dev";

module.exports = {
	baseUrl: isDev ? "/" : "/2025/",
	spreadsheetURL: "https://docs.google.com/spreadsheets/d/1oyMFGGKmR6u5JVpd691iYD_6TuDi3pbvyaajAZfGkGw/gviz/tq?tqx=out:json"
};
