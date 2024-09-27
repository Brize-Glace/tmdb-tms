const tmdbApi = require("../services/tmdb.service");
const Film = require("../models/film");
const formatDate = require("../utils/dateFormatter");

const getTopRatedFilms = async (req, res) => {
    console.log('Getting top-rated films...');
    const response = await tmdbApi.get('/movie/top_rated');
    const films = response.data.results.map((film) => {
      const posterPath = film.poster_path;
      const filmData = new Film(film.id, film.title, film.overview, film.release_date);
      filmData.posterPath = `https://image.tmdb.org/t/p/w500${posterPath}`;
      return filmData;
    });
    console.log(films);
    res.render('index', { films: films, isSearchResults: false });
};

const getPopularContent = async (req, res) => {
  try {
    const [filmsResponse, seriesResponse] = await Promise.all([
      tmdbApi.get('/movie/popular'),
      tmdbApi.get('/tv/popular')
    ]);
    const films = filmsResponse.data.results.map(film => ({
      id: film.id,
      title: film.title,
      posterPath: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
      backdropPath: `https://image.tmdb.org/t/p/w1280${film.backdrop_path}`,
      overview: film.overview,
      release_date: film.release_date,
      status: film.status,
      runtime: film.runtime,
      genres: film.genres
    }));

    const series = seriesResponse.data.results.map(serie => ({
      id: serie.id,
      title: serie.name,
      posterPath: `https://image.tmdb.org/t/p/w500${serie.poster_path}`,
      backdropPath: `https://image.tmdb.org/t/p/w1280${serie.backdrop_path}`,
      overview: serie.overview,
      release_date: serie.first_air_date,
      status: serie.status,
      runtime: serie.episode_run_time,
      genres: serie.genres
    }));

    res.render('popular', { films, series });
  } catch (error) {
    console.error('Error fetching popular content:', error);
    res.status(500).send('Internal Server Error');
  }
}

const getFilmDetails = async (req, res) => {
  console.log("Getting film details for ID:", req.params.id);
  const filmId = req.params.id;
  try {
      const response = await tmdbApi.get(`/movie/${filmId}`);
      const film = new Film(
          response.data.id,
          response.data.title,
          response.data.overview,
          formatDate(response.data.release_date)
      );
      film.posterPath = `https://image.tmdb.org/t/p/w500${response.data.poster_path}`;
      film.backdropPath = `https://image.tmdb.org/t/p/w1280${response.data.backdrop_path}`;
      film.status = response.data.status;
      film.runtime = response.data.runtime;
      film.voteAverage = response.data.vote_average;
      film.voteCount = response.data.vote_count;
      film.genres = response.data.genres.map((genre) => genre.name);
      console.log(film);
      res.render("film", { film: film });
  } catch (error) {
      console.error("Error fetching film details:", error);
      res.status(500).send("Internal Server Error");
  }
};

const searchFilms = async (req, res) => {
  console.log('Searching for films...');
  const query = req.query.query;
  if (!query) {
    return res.status(400).send('Missing query parameter');
  }
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query: query
      }
    });
    const films = response.data.results.map((film) => {
      const posterPath = film.poster_path;
      const filmData = new Film(film.id, film.title);
      filmData.posterPath = `https://image.tmdb.org/t/p/w500${posterPath}`;
      return filmData;
    });
    console.log(films);
    res.render('index', { films: films, isSearchResults: true });
  } catch (error) {
    console.error('Error searching for films:', error);
    res.status(500).send('Internal Server Error');
  }
}
const getTopRatedSeries = async (req, res) => {
  console.log('Getting top-rated series...');
  const response = await tmdbApi.get('/tv/top_rated');
  const series = response.data.results.map((serie) => {
    const posterPath = serie.poster_path;
    const seriesData = new Film(serie.id, serie.name, serie.overview, serie.first_air_date);
    seriesData.posterPath = `https://image.tmdb.org/t/p/w500${posterPath}`;
    return seriesData;
  });
  console.log(series);
  res.render('series', { series: series, isSearchResults: false });
};
const searchSeries = async (req, res) => {
  console.log('Searching for series...');
  const query = req.query.query;
  if (!query) {
    return res.status(400).send('Missing query parameter');
  }
  try {
    const response = await tmdbApi.get('/search/tv', {
      params: {
        query: query
      }
    });
    const series = response.data.results.map((serie) => {
      const posterPath = serie.poster_path;
      const seriesData = new Film(serie.id, serie.name);
      seriesData.posterPath = `https://image.tmdb.org/t/p/w500${posterPath}`;
      return seriesData;
    });
    console.log(series);
    res.render('series', { series: series, isSearchResults: true });
  } catch (error) {
    console.error('Error searching for series:', error);
    res.status(500).send('Internal Server Error');
  }
}
const getSerieDetails = async (req, res) => {
  const serieId = req.params.id;
  console.log("Getting serie details for ID:", serieId);

  // Log the URL being requested
  const url = `/tv/${serieId}`;
  console.log("Requesting URL:", url);

  try {
      const response = await tmdbApi.get(url);

      if (!response.data) {
          throw new Error("No data found in response");
      }

      const series = new Film(
          response.data.id,
          response.data.name || response.data.title,
          response.data.overview,
          formatDate(response.data.first_air_date || response.data.release_date)
      );

      series.posterPath = `https://image.tmdb.org/t/p/w500${response.data.poster_path}`;
      series.backdropPath = `https://image.tmdb.org/t/p/w1280${response.data.backdrop_path}`;
      series.status = response.data.status;
      series.runtime = response.data.episode_run_time ? response.data.episode_run_time[0] : null;
      series.voteAverage = response.data.vote_average;
      series.voteCount = response.data.vote_count;
      series.genres = response.data.genres.map((genre) => genre.name);

      console.log(series);
      res.render("serieDetails", { serie: series }); 
  } catch (error) {
      console.error("Error fetching serie details:", error);
      res.status(500).send("Internal Server Error");
  }
};
module.exports = { getTopRatedFilms, getPopularContent, getFilmDetails, searchFilms, getTopRatedSeries, getSerieDetails, searchSeries };