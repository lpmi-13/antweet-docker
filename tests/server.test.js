process.env.NODE_ENV = 'test';

let app = require('app');

let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Requests to the server', () => {
  it('should respond with the default request', () => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.be('200');
        expect(res.body).to.be.a('array');
      .done();
      });
  });
});
