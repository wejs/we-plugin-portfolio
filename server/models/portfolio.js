/**
 * portifolio
 *
 * @module      :: Model
 * @description :: portifolio model
 *
 */

module.exports = function (we) {
  const model = {
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
      },
      highlighted: {
        type: we.db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        formFieldType: null
      },
      showInLists: {
        type: we.db.Sequelize.BOOLEAN,
        defaultValue: true,
        formFieldType: null
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
      tableName: 'portfolios',

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
      instanceMethods: {
        setPublishDates() {
          if (this.published) {
            this.publishedAt = new Date();
          } else {
            this.publishedAt = null;
          }
        }
      },
      hooks: {
        beforeCreate(record) {
          record.setPublishDates();
        },
        beforeUpdate(record) {
          record.setPublishDates();
        }
      }
    }
  };

  return model;
};