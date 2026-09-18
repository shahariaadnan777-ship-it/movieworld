// 🔑 এখানে তোমার TMDB API Key বসাও
const API_KEY = '61413488ec332d7af695a46b93946aea';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// Fetch function
async function fetchMovies(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
}

// Card তৈরি
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  const poster = movie.poster_path
    ? IMG_URL + movie.poster_path
    : 'https://via.placeholder.com/300x450?text=No+Image';
  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  card.innerHTML = `
    <img src="${poster}" alt="${movie.title}" loading="lazy">
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <span class="rating">⭐ ${rating}</span>
      <span class="year">${year}</span>
    </div>
  `;

  card.addEventListener('click', () => {
    window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank');
  });

  return card;
}

// Movies render
function renderMovies(movies, gridId) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = '';
  if (!movies.length) {
    grid.innerHTML = '<p style="color:#888;">No movies found</p>';
    return;
  }
  movies.forEach(m => grid.appendChild(createMovieCard(m)));
}

// Hero setup
function setHero(movie) {
  const hero = document.getElementById('hero');
  const bg = movie.backdrop_path
    ? BACKDROP_URL + movie.backdrop_path
    : IMG_URL + movie.poster_path;
  hero.style.backgroundImage = `url(${bg})`;
  document.getElementById('heroTitle').textContent = movie.title;
  document.getElementById('heroOverview').textContent =
    movie.overview || 'No description available.';
  document.getElementById('heroBtn').onclick = () =>
    window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank');
}

// Init
async function init() {
  const popular = await fetchMovies('/movie/popular');
  const topRated = await fetchMovies('/movie/top_rated');
  const nowPlaying = await fetchMovies('/movie/now_playing');
  const upcoming = await fetchMovies('/movie/upcoming');

  if (popular.length) setHero(popular[0]);
  renderMovies(popular, 'popularGrid');
  renderMovies(topRated, 'topRatedGrid');
  renderMovies(nowPlaying, 'nowPlayingGrid');
  renderMovies(upcoming, 'upcomingGrid');
}

// Search
async function searchMovies() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();

  document.getElementById('searchSection').style.display = 'block';
  renderMovies(data.results || [], 'searchGrid');
  document.getElementById('searchSection').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('searchBtn').addEventListener('click', searchMovies);
document.getElementById('searchInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') searchMovies();
});

// Start
init();