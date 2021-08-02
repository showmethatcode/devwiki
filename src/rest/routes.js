const { Router } = require('express');
const { home, write } = require('./controllers/termController')

const router = Router();

router.get('/', home)
router.post('/terms/write', write)

module.exports = { router } 
