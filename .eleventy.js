require('dotenv').config();
const marked = require("marked");
const contentful = require("contentful");
const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.CTFL_SPACE,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.CTFL_ACCESSTOKEN
});

const {
    documentToHtmlString
} = require('@contentful/rich-text-html-renderer');

// function imageProcessing(photo) {
//     return `<img class='u-max-full-width'
//             srcset="https:${photo.fields.file.url}?w=480&fm=webp&q=80&fit=fill&f=faces 480w,
//             https:${photo.fields.file.url}?w=800&fm=webp&q=80&fit=fill&f=faces 800w" sizes="(max-width: 600px) 480px,800px"
//             src="https:${photo.fields.file.url}?w=480&fit=fill&f=faces"
//             alt="${ photo.fields.title }" loading="lazy">`;
// }

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('assets');
    eleventyConfig.addPassthroughCopy('images');

    eleventyConfig.addShortcode('documentToHtmlString', documentToHtmlString);
    // eleventyConfig.addShortcode("imageProcessing", imageProcessing);
    eleventyConfig.addShortcode("marked", marked);


    eleventyConfig.addShortcode("contentBlock", function(contentBlock) {
      // console.log('contentBlock', contentBlock)
        return `
          <section>
            <h3 class="major">TESTING THIS OUT ${contentBlock.header}</h3>
          </section>`;
    });

};
