const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');


// Function to fetch movies based on search term
async function loadMovies(searchTerm) {
    try {
        const response = await fetch(`/search?movieSearchBox=${searchTerm}`);
        const data = await response.json();
        if (data && data.movies && data.movies.length > 0) {
            displayMovieList(data.movies);
        } else {
            searchList.innerHTML = "<p>No movies found</p>";
        }
    } catch (error) {
        searchList.innerHTML = "<p>An error occurred. Please try again later.</p>";
    }
}

// Function to display list of movies
function displayMovieList(movies) {
    searchList.innerHTML = '';
    movies.forEach(movie => {
        const movieListItem = document.createElement('div');
        movieListItem.classList.add('search-list-item');
        movieListItem.dataset.id = movie.imdbID;
        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : '/assets/image_not_found.png'}">
            </div>
            <div class="search-item-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;
        searchList.appendChild(movieListItem);
    });
    loadMovieDetails();
}

// Function to display movie details
function displayMovieDetails(details) {
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${details.Poster !== 'N/A' ? details.Poster : '/assets/image_not_found.png'}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors: </b>${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
}

// Function to load movie details when a movie item is clicked
function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            try {
                const movieID = movie.dataset.id;
                const response = await fetch(`/details/${movieID}`);
                const data = await response.json();
                if (data && data.details) {
                    displayMovieDetails(data.details);
                } else {
                    resultGrid.innerHTML = "<p>not found</p>";
                }
            } catch (error) {
                resultGrid.innerHTML = "<p>An error occurred Please try again later.</p>";
            }
        });
    });
}

// Event listener for keyup event in search box
movieSearchBox.addEventListener('keyup', function(event) {
    const searchTerm = event.target.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
});

// Event listener for click event in search box
movieSearchBox.addEventListener('click', function() {
    const searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
});