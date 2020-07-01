const { Router } = require('express');
const AuthComponent = require('./index');
const { authenticateToken } = require('./index');

const router = Router();

router.post('/signin', AuthComponent.signIn);
router.get('/logout', authenticateToken, AuthComponent.logout);
router.get('/tokens', AuthComponent.getTokens);

module.exports = router;
