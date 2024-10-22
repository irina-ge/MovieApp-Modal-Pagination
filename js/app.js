const API_KEY = "my-API-key-here"; // Insert my API key here

// URLs for fetching data (popular movies, genres, search, and movie details)
const API_URL_POPULAR = (page) => 
`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
const API_URL_GENRES = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const API_URL_SEARCH = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const API_URL_MOVIE_DETAILS = `https://api.themoviedb.org/3/movie/`;

let genresList = [];
let currentPage = 1; // The current page for pagination
const totalPages = 10; // Total number of pages for pagination

// Initialization function to start the app
async function init() {
  try {
    await getGenres(); // Fetch the list of genres
    getMovies(API_URL_POPULAR(currentPage));  // Load movies for the current page
  } catch (error) {
    console.error("Error while loading data:", error);
  }
}

// Function to fetch the list of genres from the API
async function getGenres() {
  const resp = await fetch(API_URL_GENRES); // Fetch genres from API
  const respData = await resp.json();
  genresList = respData.genres; // Save genres to a global array
  console.log("Genres loaded:", genresList);
}

// Function to fetch movies from the given URL (either popular or search)
async function getMovies(url) {
  const resp = await fetch(url); // Fetch movies from the API
  const respData = await resp.json();
  showMovies(respData.results); // Display the movies on the page
  updatePagination(); // Update pagination controls
}

// Function to display the movies on the page
function showMovies(movies) {
  const moviesEl = document.querySelector(".movies");

  // Clear previous movies
  moviesEl.innerHTML = "";

  // Create HTML elements for each movie and display it
  movies.forEach((movie) => {9
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <div class="movie__cover-inner">
        <img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          class="movie__cover"
          alt="${movie.title}"
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.title}</div>
        <div class="movie__category">
          ${movie.genre_ids.map((id) => getGenreNameById(id)).join(", ")}
        </div>
        ${
          movie.vote_average
            ? `
        <div class="movie__average movie__average--${getClassByRate(
          movie.vote_average
        )}">${movie.vote_average.toFixed(1)}</div>
        `
            : ""
        }
      </div>
    `;

    // Add click event to open the modal for movie details
    movieEl.addEventListener("click", () => openModal(movie.id));
    moviesEl.appendChild(movieEl);
  });
}

// Function to get the name of a genre by its ID
function getGenreNameById(id) {
  const genre = genresList.find((genre) => genre.id === id);
  return genre ? genre.name : "Unknown"; // Return genre name or "Unknown" if not found
}

// Function to assign a color class to the movie rating based on its value
function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Function to update pagination controls (previous, next buttons, and page number)
function updatePagination() {
  const prevButton = document.querySelector("#prevPage");
  const nextButton = document.querySelector("#nextPage");
  const pageNumber = document.querySelector("#pageNumber");

  if (pageNumber) {
    pageNumber.textContent = `Page ${currentPage}`; // Display current page number
  }

  prevButton.disabled = currentPage === 1; // Disable "Previous" button on first page
  nextButton.disabled = currentPage === totalPages; // Disable "Next" button on last page
}

// Event listener for the "Previous" button to load the previous page
document.querySelector("#prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies(API_URL_POPULAR(currentPage)); // Load movies for the previous page
  }
});

// Event listener for the "Next" button to load the next page
document.querySelector("#nextPage").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    getMovies(API_URL_POPULAR(currentPage)); // Load movies for the next page
  }
});

// Modal window for displaying movie details
const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const resp = await fetch(`${API_URL_MOVIE_DETAILS}${id}?api_key=${API_KEY}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const respData = await resp.json();

  // Show modal window with movie details
  modalEl.classList.add("modal--show");
  document.body.classList.add("stop-scrolling");

  modalEl.innerHTML = `
    <div class="modal__card">
      <img class="modal__movie-backdrop" src="https://image.tmdb.org/t/p/w500${respData.poster_path}" alt="">
      <h2>
        <span class="modal__movie-title">${respData.title}</span>
        <span class="modal__movie-release-year"> - ${respData.release_date}</span>
      </h2>
      <ul class="modal__movie-info">
        <li class="modal__movie-genre">
          Genre - ${respData.genres.map((el) => `<span>${el.name}</span>`).join(", ")}
        </li>
        ${respData.runtime ? `<li class="modal__movie-runtime">Runtime - ${respData.runtime} min</li>` : ''}
        <li>Website: <a class="modal__movie-site" href="${respData.homepage}">${respData.homepage}</a></li>
        <li class="modal__movie-overview">Overview - ${respData.overview}</li>
      </ul>
      <button type="button" class="modal__button-close">Close</button>
    </div>
  `;

  // Add event listener to close the modal window
  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
}

// Function to close the modal window
function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove("stop-scrolling");
}

// Close modal window when clicking outside of it
window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});

// Close modal window by pressing the "Escape" key
window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
});


// Search movies based on the input query
const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl); // Search and display the found movies
    search.value = ""; // Clear the search field
  }
});

// Initialize the application
init();