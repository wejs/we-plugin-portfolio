
/**
 * Return a list of updates
 *
 * @param  {Object} we we.js object
 * @return {Array}    a list of update objects
 */
function updates() {
  return [{
    version: '1.1.0',
    update(we, done) {
      we.log.info('Start project update v1.1.0');

      const sql = 'ALTER TABLE `portfolios` '+
        ' ADD COLUMN `highlighted` INT(11) DEFAULT "0" , '+
        ' ADD COLUMN `showInLists` TINYINT(1) DEFAULT 1 ';
      we.db.defaultConnection
      .query(sql)
      .then( ()=> {
        we.log.info('Done project update v1.1.0');
        done();
      })
      .catch(done);
    }
  }];
}

module.exports = updates;