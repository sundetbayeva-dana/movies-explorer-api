const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/', moviesRouter);
router.use('/', usersRouter);

module.exports = router;
