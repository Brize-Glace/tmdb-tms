class Film {
  constructor(id, title, overview, release_date, posterPath, backdropPath, status, runtime, voteAverage, voteCount) {
    this.id = id;
    this.title = title;
    this.overview = overview;
    this.release_date = release_date;
    this.posterPath = posterPath;
    this.backdropPath = backdropPath;
    this.status = status;
    this.runtime = runtime;
    this.voteAverage = voteAverage;
    this.voteCount = voteCount;
    this.genres = [];
  }
}

module.exports = Film;