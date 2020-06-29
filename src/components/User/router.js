const { Router } = require('express');
const UserComponent = require('./index');

const router = Router();

router.post('/signup', UserComponent.create);
router.post('/signin', UserComponent.signIn);
router.get('/users', UserComponent.findAll);

module.exports = router;
