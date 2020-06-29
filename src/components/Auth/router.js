const { Router } = require('express');

const router = Router();

router.get('/signin', (req, res) => res.status(200).send('Signinnnnn'));

module.exports = router;
