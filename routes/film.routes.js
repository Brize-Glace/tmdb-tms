const express = require('express');
const router = express.Router();
const filmController = require('../controllers/film.controller');

router.get('/', filmController.getPopularContent);
router.get('/films', filmController.getTopRatedFilms);
router.get('/film/:id', filmController.getFilmDetails);
router.get('/search', filmController.searchFilms);
router.get('/series', filmController.getTopRatedSeries);
router.get('/serieDetails/:id', filmController.getSerieDetails);
router.get('/searchSeries', filmController.searchSeries);

module.exports = router;