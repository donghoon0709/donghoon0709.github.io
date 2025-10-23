const rss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // 정적 파일 복사
  eleventyConfig.addPassthroughCopy({ "src/styles": "styles" });

  // 플러그인
  eleventyConfig.addPlugin(rss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // 컬렉션: posts (최신순)
  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/posts/**/*.md").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addPassthroughCopy({ "src/scripts": "scripts" });

  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return [];
    if (typeof n !== "number") return array;
    if (n < 0) return array.slice(n);
    return array.slice(0, n);
  });

  // 단축 필터: 날짜 포맷 예시
  eleventyConfig.addFilter("dateISO", (dateObj) => {
    if (!dateObj) return "";
    try {
      return dateObj.toISOString().slice(0,10);
    } catch (error) {
      return "";
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    // Nunjucks/Liquid/11ty.js 중 선택, 여기선 Nunjucks
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};