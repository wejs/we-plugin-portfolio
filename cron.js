module.exports = function (we, done) {
  Promise.all([
    // Content publication:
    we.db.defaultConnection.query(
      'UPDATE `portfolios` SET `published`="1" WHERE publishedAt <= DATE_ADD(now(), INTERVAL 3 MINUTE) AND published != 1'
    )
  ])
  .then( ()=> {
    done();
    return null;
  })
  .catch(done);
};