/**
 * Widget portifolio-list main file
 */

module.exports = function PortifolioListWidget(projectPath, Widget) {
  const widget = new Widget('portifolio-list', __dirname);

  widget.beforeSave = function (req, res, next) {
    req.body.configuration = {
      class: req.body.class,
      limit: Number(req.body.limit) || 5
    };

    return next();
  };

  widget.viewMiddleware = function (w, req, res, next) {
    req.we.db.models.portfolio
    .findAll({
      limit: Number(w.configuration.limit) || 5,
      where: {
        published: true,
        showInLists: true
      },
      order: [
        [ 'highlighted', 'DESC' ],
        [ 'projectDate', 'DESC' ]
      ]
    })
    .then( (t)=> {
      if (!t || !t.length) {
        w.hide = true;
      }

      w.records = t;
      next();

      return null;
    })
    .catch(next);
  };

  return widget;
};