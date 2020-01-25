module.exports = function (we, done) {
  Promise.all([
    // Content publication:
    we.db.defaultConnection.query(
      'UPDATE `portfolios` SET `published`="1" WHERE publishedAt <= NOW() AND published != 1'
    )
  ])
  .then( ()=> {
    done();
  })
  .catch(done);
};