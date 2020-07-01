const { Router } = require('express');
const UserComponent = require('./index');
const { authenticateToken, refreshToken, signIn } = require('../Auth/index');

const router = Router();

/**
 * Route for creating a new user
 */
router.post('/signup', UserComponent.create, signIn);

/**
 * Route for extracting all users from the database and returning them
 */
router.get('/users', authenticateToken, refreshToken, UserComponent.findAll);

/**
 * Route for extracting end returning information from the token's payload
 */
router.get('/info', authenticateToken, refreshToken, UserComponent.getInfo);

module.exports = router;
