const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

module.exports = class {
  async data() {
    const cssFile = path.join(__dirname, '..', 'css', 'main.css');

    return {
      permalink: `css/page.css`,
      rawFilepath: cssFile,
      rawCss: fs.readFileSync(cssFile),
    };
  }

  async render({ rawCss, rawFilepath }) {
    return await postcss([
      require('postcss-import'),
      require('autoprefixer'),
      require('tailwindcss'),
      require('cssnano')
    ])
      .process(rawCss, { from: rawFilepath })
      .then((result) => result.css);
  }
};
