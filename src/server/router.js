const { Router } = require('express');
const http = require('http');
const UserRouter = require('../components/User/router');
const AuthRouter = require('../components/Auth/router');

module.exports = {
  init(app) {
    const router = Router();

    app.use('/', UserRouter);
    app.use('/', AuthRouter);

    app.get('/', (req, res) => res.status(200).send('Hello BandaPixels'));

    app.use((req, res) => {
      res.status(404).send(http.STATUS_CODES[404]);
    });

    app.use(router);
  },
};
