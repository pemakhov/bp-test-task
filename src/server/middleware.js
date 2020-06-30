const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

module.exports = {
  init(app) {
    app.use(bodyParser.json());
    app.use(cookieParser());
  },
};
