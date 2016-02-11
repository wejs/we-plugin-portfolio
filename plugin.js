/**
 * Plugin.js file, set configs, routes, hooks and events here
 *
 * see http://wejs.org/docs/we/plugin
 */
module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);
  // set plugin configs
  // plugin.setConfigs({
  // });
  // ser plugin routes
  // plugin.setRoutes({
  // });

  plugin.events.on('we:after:load:plugins', function (we) {
    we.router.metatag.add('portifolioFindOne', function metatagPortifolioFindOne(req, res, next) {

      var hostname = req.we.config.hostname;

      res.locals.metatag +=
        '<meta property="og:url" content="'+hostname+req.urlBeforeAlias+'" />'+
        '<meta property="og:title" content="'+res.locals.title+'" />' +
        '<meta property="og:site_name" content="'+res.locals.appName+'" />'+
        '<meta property="og:type" content="profile" />';

        if (res.locals.data.description) {
          var description = req.we.utils.string(res.locals.data.description).stripTags().truncate(200).s;
          res.locals.metatag += '<meta property="og:description" content="'+
            description+
          '" />';
          res.locals.metatag += '<meta content="'+description+'" name="description">'
        }

        if (res.locals.data.featuredImage && res.locals.data.featuredImage[0]) {
          var img = res.locals.data.featuredImage[0];

          res.locals.metatag +=
            '<meta property="og:image" content="'+hostname+img.urls.large+'" />'+
            '<meta property="og:image:type" content="'+img.mime+'" />'+
            '<meta property="og:image:width" content="'+img.width+'" />'+
            '<meta property="og:image:height" content="'+img.height+'" />';
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