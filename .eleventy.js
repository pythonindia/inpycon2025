const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const isProd = process.env.ELEVENTY_ENV === "prod";
const outDir = "public";

module.exports = function (eleventyConfig) {
	// PLUGINS
	eleventyConfig.addPlugin(pluginRss);

	// shortcode to render markdown from string => {{ STRING | markdown | safe }}
	eleventyConfig.addFilter("markdown", function (value) {
		let markdown = require("markdown-it")({
			html: true,
		});
		return markdown.render(value);
	});

	eleventyConfig.addFilter("dateInfo", function (dateStr) {
		// Get day of month
		const dayOfMonth = parseInt(dateStr.split("-")[2]);

		// Default result
		let result = {
			dayName: "NA",
			monthDay: "NA",
			label: "NA",
		};

		// Mapping logic
		switch (dayOfMonth) {
			case 12:
				result = {
					dayName: "Friday",
					monthDay: "September 12th",
					label: "Workshop Day",
				};
				break;
			case 13:
				result = {
					dayName: "Saturday",
					monthDay: "September 13th",
					label: "Conference Day 1",
				};
				break;
			case 14:
				result = {
					dayName: "Sunday",
					monthDay: "September 14th",
					label: "Conference Day 2",
				};
				break;
			case 15:
				result = {
					dayName: "Monday",
					monthDay: "September 15th",
					label: "DevSprint",
				};
				break;
		}

		return result;
	});

	eleventyConfig.addFilter("getEndTime", function (startTime, duration) {
		const [sh, sm] = startTime.split(":").map(Number);
		const [dh, dm] = duration.split(":").map(Number);

		// Total minutes
		let totalMinutes = sh * 60 + sm + dh * 60 + dm;

		// Calculate end hour and minutes
		let endHour = Math.floor(totalMinutes / 60);
		let endMinute = totalMinutes % 60;

		// Wrap around 24 hours (optional, if needed)
		if (endHour >= 24) endHour = endHour % 24;

		// Pad with zero if needed
		const endHourStr = endHour.toString().padStart(2, "0");
		const endMinuteStr = endMinute.toString().padStart(2, "0");

		return `${endHourStr}:${endMinuteStr}`;
	});

	// rebuild on CSS changes
	eleventyConfig.addWatchTarget("./src/_includes/css/");

	// Markdown
	eleventyConfig.setLibrary(
		"md",
		markdownIt({
			html: true,
			breaks: true,
			linkify: true,
			typographer: true,
		})
	);

	//create collections
	eleventyConfig.addCollection("sections", async (collection) => {
		return collection.getFilteredByGlob("./src/sections/*.md");
	});

	// STATIC FILES
	eleventyConfig.addPassthroughCopy({ "./src/static/": "/" });

	// TRANSFORM -- Minify HTML Output
	eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
		if (outputPath && outputPath.endsWith(".html")) {
			let minified = htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			});
			return minified;
		}
		return content;
	});

	// add a sectionheader shortcode
	eleventyConfig.addPairedShortcode("sectionheader", function (content) {
		return `<div class="black-han-sans-regular font-normal text-2xl md:text-4xl md:text-center text-[#000000] text-center lg:text-left">
					<p>${content}</p>
				</div>`;
	});

	// add an aside shortcode
	eleventyConfig.addPairedShortcode("aside", function (content) {
		return `<blockquote class="p-4 my-4">
					<p class="text-xl italic font-medium leading-relaxed">${content}</p>
				</blockquote>`;
	});

	// TODO: Add more shortcodes as needed
	//   - defaultlist
	//	 - cards
	// ...

	return {
		pathPrefix: isProd ? "inpycon2025" : "",
		dir: {
			input: "src",
			output: outDir,
			data: "./_data",
			includes: "./_includes",
			layouts: "./_layouts",
		},
		templateFormats: ["md", "njk", "11ty.js"],
		htmlTemplateEngine: "njk",
	};
};
