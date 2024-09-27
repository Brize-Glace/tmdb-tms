const axios = require('axios');
const apiKey = process.env.TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: apiKey
  }
});

module.exports = tmdbApi;