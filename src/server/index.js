const express = require('express');
const middleware = require('./middleware');
const router = require('./router');

const app = express();
const PORT = process.env.port || 4000;

middleware.init(app);
router.init(app);

app.listen(PORT, () => console.log(`Listening to the requests at http://localhost:${PORT}`));
