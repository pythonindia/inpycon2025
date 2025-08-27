const isDev = process.env.ELEVENTY_ENV === "dev";

module.exports = {
	baseUrl: isDev ? "/" : "/2025/",
	spreadsheetURL: "https://docs.google.com/spreadsheets/d/1gIGszJWFngjaP4GuEqudAuYg95LGRLm-xO6re-DIKMA/gviz/tq?tqx=out:json"
};
