const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Render the index page
app.get('/', (req, res) => {
    res.render('index');
});

// Endpoint to search for movies
app.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.movieSearchBox.trim();
        const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=8fd874db`;
        const response = await fetch(URL);
        const data = await response.json();
        res.json({ movies: data.Search });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: "An error occurred while fetching movies" });
    }
});

// Endpoint to fetch details of a specific movie by its ID
app.get('/details/:id', async (req, res) => {
    try {
        const movieID = req.params.id;
        const URL = `https://omdbapi.com/?i=${movieID}&apikey=8fd874db`;
        const response = await fetch(URL);
        const movieDetails = await response.json();
        res.json({ details: movieDetails});
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: "An error occurred while fetching movie details" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

