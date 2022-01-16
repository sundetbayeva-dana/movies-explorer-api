const router = require('express').Router();
const auth = require('../midlewares/auth');

router.use(require('./signup'));
router.use(require('./signin'));

router.use(auth);
router.use(require('./users'));
router.use(require('./movies'));
router.use(require('./signout'));

module.exports = router;
