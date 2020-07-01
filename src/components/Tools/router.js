const { Router } = require('express');
const ToolsComponent = require('./index');
const { authenticateToken, refreshToken } = require('../Auth/index');

const router = Router();

router.get('/latency', authenticateToken, refreshToken, ToolsComponent.measureLatency);

module.exports = router;
