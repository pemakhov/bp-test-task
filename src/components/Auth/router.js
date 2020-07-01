const { Router } = require('express');
const AuthComponent = require('./index');
const { authenticateToken, refreshToken } = require('./index');

const router = Router();

/**
 * Route that accepts @param id and @param password and returns token
 * @returns token
 */
router.post('/signin', AuthComponent.signIn);

/**
 * Route deleting all stored tokens
 * @param {boolean} all  or no params
 */
router.get('/logout', authenticateToken, AuthComponent.logout);

/**
 * Route extracting from database and returning all stored tokens
 * This route was not required by the task
 */
router.get('/tokens', authenticateToken, refreshToken, AuthComponent.getTokens);

module.exports = router;
