/**
 * Content controller
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */
module.exports = {
 /**
   * Default find action
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [get] /portfolio
   * description: "Find/query portfolio list"
   * responses:
   *   "200":
   *     description: "Find/query portfolio success"
   *     schema:
   *       type: object
   *       properties:
   *         portfolio:
   *           $ref: "#/definitions/portfolio"
   */
  find(req, res) {
    if (!req.we.acl.canStatic('access_portfolio_unpublished', req.userRoleNames)) {
      res.locals.query.where.published = true;
    }

    const Op = req.we.Op;

    res.locals.query.order = [
      ['highlighted', 'DESC'],
      ['createdAt', 'DESC'],
      ['publishedAt', 'DESC'],
      ['id', 'DESC']
    ];

    if (req.query.q) {
      res.locals.query.where[Op.or] = {
        title: {
          [Op.like]: '%'+req.query.q+'%'
        },
        body: {
          [Op.like]: '%'+req.query.q+'%'
        }
      };
    }

    return res.locals.Model
    .findAndCountAll(res.locals.query)
    .then( (record)=> {
      res.locals.metadata.count = record.count;
      res.locals.data = record.rows;
      return res.ok();
    })
    .catch(res.queryError);
  },

  /**
   * Default findOne action
   *
   * Record is preloaded in context loader by default and is avaible as res.locals.data
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [get] /portfolio/{portfolioId}
   * description: "Find one portfolio by id"
   * responses:
   *   "200":
   *     description: "Find portfolio by id success"
   *     schema:
   *       type: object
   *       properties:
   *         portfolio:
   *           $ref: "#/definitions/portfolio"
   */
  findOne(req, res, next) {
    if (!res.locals.data) return next();

    // check if can access contents unpublished
    if (!res.locals.data.published) {
      if (!req.we.acl.canStatic('access_portfolio_unpublished', req.userRoleNames)) {
        return res.forbidden();
      }
    }

    req.we.hooks.trigger('we:after:send:ok:response', {
      res: res, req: req
    }, (err)=> {
      if (err) return res.serverError(err);
      return res.ok();
    });
  },

  /**
   * Default count action
   *
   * Built for only send count as JSON
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [get] /portfolio/count
   * description: "Count portfolio"
   * responses:
   *   "200":
   *     description: "Count portfolio success"
   *     schema:
   *       type: object
   *       properties:
   *         count:
   *           type: number
   *           example: 10
   */
  count(req, res) {
    return res.locals.Model
    .count(res.locals.query)
    .then( (count)=> {
      res.status(200).send({ count: count });
      return null;
    })
    .catch(res.queryError);
  },

  /**
   * Create and create page actions
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [post] /portfolio
   * description: "Create one portfolio"
   * responses:
   *   "201":
   *     description: "Create one portfolio"
   *     schema:
   *       type: object
   *       properties:
   *         portfolio:
   *           $ref: "#/definitions/portfolio"
   */
  create(req, res) {
    if (!res.locals.template) {
      res.locals.template = res.locals.model + '/' + 'create';
    }

    if (!res.locals.data) {
      res.locals.data = {};
    }

    if (req.method === 'POST') {
      if (req.isAuthenticated && req.isAuthenticated()) {
        req.body.creatorId = req.user.id;
      }

      req.we.utils._.merge(res.locals.data, req.body);

      return res.locals.Model
      .create(req.body)
      .then(function afterCreate (record) {
        res.locals.data = record;
        res.created();
        return null;
      })
      .catch(res.queryError);
    } else {
      // send the admin or editor to admin create content page:
      res.redirect('/admin/#/portfolio/create');
    }
  },

  /**
   * Edit, edit page and update action
   *
   * Record is preloaded in context loader by default and is avaible as res.locals.data
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [update|put] /portfolio/{portfolioId}
   * description: "Update one portfolio"
   * responses:
   *   "200":
   *     description: "Update one by id portfolio success"
   *     schema:
   *       type: object
   *       properties:
   *         portfolio:
   *           $ref: "#/definitions/portfolio"
   */
  edit(req, res) {
    if (!res.locals.template) {
      res.locals.template = res.local.model + '/' + 'edit';
    }

    let record = res.locals.data;

    if (req.we.config.updateMethods.indexOf(req.method) >-1) {
      if (!record) {
        return res.notFound();
      }

      record.update(req.body)
      .then(function reloadAssocs(n) {
        return n.reload()
        .then(function() {
          return n;
        });
      })
      .then(function afterUpdate (newRecord) {
        res.locals.data = newRecord;
        res.updated();
        return null;
      })
      .catch(res.queryError);
    } else {

      // send the admin or editor to admin edit content page:
      res.redirect('/admin/#/portfolio/'+record.id);
    }
  },

  /**
   * Delete and delete action
   *
   * @param  {Object} req express.js request
   * @param  {Object} res express.js response
   *
   * @api [delete] /portfolio/{portfolioId}
   * description: "Delete one portfolio by id"
   * responses:
   *   "204":
   *     description: "Delete one portfolio record by id success"
   */
  delete(req, res) {
    if (!res.locals.template) {
      res.locals.template = res.local.model + '/' + 'delete';
    }

    let record = res.locals.data;

    if (!record) {
      return res.notFound();
    }

    res.locals.deleteMsg = res.locals.model + '.delete.confirm.msg';

    if (req.method === 'POST' || req.method === 'DELETE') {
      record
      .destroy()
      .then(function afterDestroy () {
        res.locals.deleted = true;
        res.deleted();
        return null;
      })
      .catch(res.queryError);
    } else {
      res.ok();
    }
  }
};