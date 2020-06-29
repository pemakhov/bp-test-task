const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = {
  init(app) {
    app.use(bodyParser.json());
    app.use(cookieParser());
  },
};
