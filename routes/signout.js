const router = require('express').Router();

router.post('/api/signout', (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});

module.exports = router;
