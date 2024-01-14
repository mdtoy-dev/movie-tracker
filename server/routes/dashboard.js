const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/checkAuth');
const dashboardController = require('../controllers/dashboardController');

// Dashboard Routes
router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.dashboardViewMovie);
router.post('/dashboard/item/:id', isLoggedIn, dashboardController.dashboardUpdateMovie);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.dashboardDeleteMovie);
router.get('/dashboard/add', isLoggedIn, dashboardController.dashboardAddMovie);
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddMovieSubmit);
router.get('/dashboard/search', isLoggedIn, dashboardController.dashboardSearch);
router.post('/dashboard/search', isLoggedIn, dashboardController.dashboardSearchSubmit);

module.exports = router;