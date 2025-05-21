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

    //Create collections for blogs
    eleventyConfig.addCollection('blogs', (collection) => {
        return collection.getFilteredByGlob('./src/blogs/*.md').sort((a, b) => {
            return new Date(b.data.date) - new Date(a.data.date);
        });
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
