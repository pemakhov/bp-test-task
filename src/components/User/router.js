const { Router } = require('express');
const UserComponent = require('./index');
const { authenticateToken } = require('../Auth/token');

const router = Router();

router.post('/signup', UserComponent.create);
router.get('/users', authenticateToken, UserComponent.findAll);
router.get('/info', authenticateToken, UserComponent.getInfo);

module.exports = router;
