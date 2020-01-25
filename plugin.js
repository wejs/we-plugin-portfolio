/**
 * Main we-plugin-portifolio file
 */
module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setResource({
    name: 'portfolio',
      findOne: {
      metatagHandler: 'portifolioFindOne'
    }
  });

  plugin.events.on('we:after:load:plugins', function (we) {
    if (!we.router.metatag) return;

    we.router.metatag.add('portifolioFindOne', function metatagPortifolioFindOne(req, res, next) {

      let hostname = req.we.config.hostname;

      res.locals.metatag +=
        '<meta property="og:url" content="'+hostname+req.urlBeforeAlias+'" />'+
        '<meta property="og:title" content="'+res.locals.title+'" />' +
        '<meta property="og:site_name" content="'+res.locals.appName+'" />'+
        '<meta property="og:type" content="profile" />';

        if (res.locals.data.description) {
          let description = we.utils.stripTagsAndTruncate(
            res.locals.data.description, 200
          );
          res.locals.metatag += '<meta property="og:description" content="'+
            description+
          '" />';
          res.locals.metatag += '<meta content="'+description+'" name="description">';
        }

        if (res.locals.data.featuredImage && res.locals.data.featuredImage[0]) {
          let img = res.locals.data.featuredImage[0];

          res.locals.metatag +=
            '<meta property="og:image" content="'+img.urls.large+'" />'+
            '<meta property="og:image:type" content="'+img.mime+'" />'+
            '<meta property="og:image:width" content="'+we.config.upload.image.styles.large.width+'" />'+
            '<meta property="og:image:height" content="'+we.config.upload.image.styles.large.height+'" />';
        }

        if (res.locals.data.tags && res.locals.data.tags.length) {
          res.locals.metatag +=
            '<meta name="keywords" content="'+res.locals.data.tags.join(',')+'" />';
        }

      next();
    });
  });

  return plugin;
};