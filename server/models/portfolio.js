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
    associations: {
      creator: { type: 'belongsTo', model: 'user' }
    },
    options: {
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
      classMethods: {},
      instanceMethods: {
        setPublishDates(record) {
          if (record.published && !record.publishedAt) {
            record.publishedAt = new Date();
          }
        }
      },
      hooks: {
        beforeValidate(record) {
          if (!record.highlighted) {
            record.highlighted = 0;
          }
        },
        beforeCreate(record) {
          record.setPublishDates(record);
        },
        beforeUpdate(record) {
          record.setPublishDates(record);
        }
      }
    }
  };

  return model;
};