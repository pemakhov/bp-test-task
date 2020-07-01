const { Router } = require('express');
const UserComponent = require('./index');
const { authenticateToken, refreshToken } = require('../Auth/index');

const router = Router();

router.post('/signup', UserComponent.create);
router.get('/users', authenticateToken, refreshToken, UserComponent.findAll);
router.get('/info', authenticateToken, refreshToken, UserComponent.getInfo);

module.exports = router;
