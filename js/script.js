const global = {
  currentPage: window.location.pathname,
};

//Function to display popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  console.log(results);
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="movie-details.html?${movie.id}">
            ${
              movie.poster_path
                ? `
              <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />
              `
                : `
              <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="Movie Title"
            />
              `
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        `;
    document.querySelector('#popular-movies').appendChild(div);
  });
}

//Function to display popular TV shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  console.log(results);
  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="tv-details.html?${show.id}">
            ${
              show.poster_path
                ? `
              <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />
              `
                : `
              <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="Movie Title"
            />
              `
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${show.first_air_date}</small>
            </p>
          </div>
        `;
    document.querySelector('#popular-shows').appendChild(div);
  });
}

//Function to display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('?')[1];
  const movie = await fetchAPIData(`movie/${movieId}`);

  //Overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
  <div class="details-top">
          <div>
          ${
            movie.poster_path
              ? `
            <img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />
            `
              : `
            <img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />
            `
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)}
            </p>
            <p class="text-muted">${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
            ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $ ${addComasToNumber(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> 
            $ ${addComasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies
            .map(
              (company) => `<span>
            ${company.name}
            </span>`
            )
            .join(', ')}</div>
        </div>
  `;
  document.querySelector('#movie-details').appendChild(div);
}

//Display backdrop on details pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.2';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

//Function to fetch data from TMDB API
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGYwY2MwN2IyMjgwZGZlNjRkMjMyZDMyMjJlODM0NSIsIm5iZiI6MTczNzM2MDQzOS43ODIsInN1YiI6IjY3OGUwNDM3ZTQ1NjYzOTlhMjZlMWQzZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gTxFCR7p0OwJ0p5dFD-5szFeYXGrlhvDXApqy9d-BX8',
  },
};

//Function to set the API Request
async function fetchAPIData(endpoint) {
  const API_KEY = '';
  const API_URL = 'https://api.themoviedb.org/3/';
  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`,
    options
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

//Function to show spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

//Function to hide spinner
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}
/**
 * Two helper functions highlightActiveLink() and addCommasToNumber()
 * addCommasToNumber - uses a regex pattern to add commas after three digits
 * highlightActiveLink - highlights the currently active page by adding the classlist of 'active'
 */
// Function to highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

//Function to add commas to number
function addComasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Function to initialize the app
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      console.log('TV Details');
      break;
    case '/search.html':
      console.log('Search');
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
