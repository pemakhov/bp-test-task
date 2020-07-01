const { Router } = require('express');
const AuthComponent = require('./index');

const router = Router();

router.post('/signin', AuthComponent.signIn);
router.get('/tokens', AuthComponent.getTokens);

module.exports = router;
