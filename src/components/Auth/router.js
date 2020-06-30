const { Router } = require('express');
const AuthComponent = require('./index');

const router = Router();

router.post('/signin', AuthComponent.signIn);
router.post('/refresh', AuthComponent.updateToken);

module.exports = router;
