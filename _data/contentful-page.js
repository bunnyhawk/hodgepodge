const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN
});

module.exports = async () => {

  const getPageEntries = (contentType) => {
    return client.getEntries({ content_type: contentType }).then(function (response) {
      const page = response.items
        .map(function (page) {
          page.fields.date = new Date(page.sys.updatedAt);
          return page.fields;
        });

      return page;
    }).catch(console.error);
  }

  const homePageEntries = await getPageEntries('homepage');
  const brandEntries = await getPageEntries('brand');
  const theySayEntries = await getPageEntries('theySayEntry');
  const whatWeDoIcons = await getPageEntries('whatWeDoIcons');
  const baddies = await getPageEntries('baddies');

  return [{
    ...homePageEntries[0],
    ...brandEntries[0],
    ...whatWeDoIcons[0],
    theySayEntries,
    baddies
  }];
};
