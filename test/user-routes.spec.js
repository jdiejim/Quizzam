const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');

const knex = require('../src/knex');
const { app } = require('../server');

chai.use(chaiHttp);

describe('Testing ________ API routes', () => {
  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  afterEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        done();
      });
  });

  describe('Some Route', () => {
    it('should do something', (done) => {
      chai.request(app)
        .get('/quizzes')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          done();
        });
    });
  });
});