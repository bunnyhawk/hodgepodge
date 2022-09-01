require('dotenv').config();
const marked = require("marked");
const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN
});

const {
  documentToHtmlString
} = require('@contentful/rich-text-html-renderer');

function imageProcessing(photo, className) {
  return `<img class='${className}'
            srcset="https:${photo.fields.file.url}?w=480&fm=webp&q=80&fit=fill&f=faces 480w,
            https:${photo.fields.file.url}?w=800&fm=webp&q=80&fit=fill&f=faces 800w" sizes="(max-width: 600px) 480px,800px"
            src="https:${photo.fields.file.url}?w=480&fit=fill&f=faces"
            alt="${photo.fields.description || photo.fields.title}">`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('images');

  eleventyConfig.addShortcode('documentToHtmlString', documentToHtmlString);
  eleventyConfig.addShortcode("imageProcessing", imageProcessing);
  eleventyConfig.addShortcode("marked", marked);

  eleventyConfig.addShortcode("theySayEntry", function (entry) {
    return `
      <li class="feedback swiper-slide">
        <p>${entry.theySayCopy}</p>
        <div class="source">
          <strong>${entry.theySayPerson}</strong>
          <div>${entry.theySayTitle}</div>
        </div>
      </li>`;
  });

  eleventyConfig.addShortcode("baddie", function (baddie) {
    return `
      <li class="baddie">
        <a class="baddie-logo blue" href="${baddie.baddieLink}" target="_blank" rel="noopener noreferrer">
          ${imageProcessing(baddie.baddieImage)}
        </a>
        <span class="baddie-name">${baddie.baddieName}</span>
        <span class="baddie-relationship">${baddie.baddieRelationship}</span>
      </li>`;
  });
};
