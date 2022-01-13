const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/api/', moviesRouter);
router.use('/api/', usersRouter);

module.exports = router;
