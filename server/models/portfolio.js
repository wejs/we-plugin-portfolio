/**
 * portifolio
 *
 * @module      :: Model
 * @description :: portifolio model
 *
 */

module.exports = function (we) {
  var model = {
    // define you model here
    // see http://docs.sequelizejs.com/en/latest/docs/models-definition
    definition: {
      title: {
        type: we.db.Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: we.db.Sequelize.TEXT,
        formFieldType: 'html',
        formFieldHeight: 300
      },
      projectDate: {
        type: we.db.Sequelize.DATE,
        allowNull: true
      },
      published: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: false,
        formFieldType: 'boolean'
      },
      publishedAt: {
        type: we.db.Sequelize.DATE,
        formFieldType: null, // hide this field
        allowNull: true
      }
    },
    // Associations
    // see http://docs.sequelizejs.com/en/latest/docs/associations
    associations: {
      creator: { type: 'belongsTo', model: 'user' }
    },
    options: {
      // title field, for default title record pages
      titleField: 'title',

      termFields: {
        tags: {
          vocabularyName: 'Tags',
          canCreate: true,
          formFieldMultiple: true,
          onlyLowercase: true
        },
        category: {
          vocabularyName: 'Category',
          canCreate: false,
          formFieldMultiple: false
        }
      },

      imageFields: {
        featuredImage: { formFieldMultiple: false },
        images: { formFieldMultiple: true }
      },

      fileFields: {
        attachment: { formFieldMultiple: true }
      },

      // Class methods for use with: we.db.models.[yourmodel].[method]
      classMethods: {},
      // record method for use with record.[method]
      instanceMethods: {},
      // Sequelize hooks
      // See http://docs.sequelizejs.com/en/latest/api/hooks
      hooks: {
        createUpdate: function createUpdate(record, opts, done) {
          if (record.published) {
            record.publishedAt = new Date();
          } else {
            record.publishedAt = null;
          }

          done();
        },
        beforeUpdate: function beforeUpdate(record, opts, done) {
          if (record.published) {
            record.publishedAt = new Date();
          } else {
            record.publishedAt = null;
          }

          done();
        }
      }
    }
  };

  return model;
};