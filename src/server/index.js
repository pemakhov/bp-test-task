const express = require('express');
const middleware = require('./middleware');
const router = require('./router');

const app = express();
const PORT = process.env.port || 4000;

/**
 * Initiates express middleware
 */
middleware.init(app);

/**
 * Includes component routers
 */
router.init(app);

app.listen(PORT, () => console.log(`Listening to the requests at http://localhost:${PORT}`));
