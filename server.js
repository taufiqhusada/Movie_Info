const express = require('express');
const fetch = require('node-fetch');
const graylog2 = require("graylog2");
const app = express();
const PORT = process.env.PORT || 3000;

// Create a new Graylog client
const graylog = new graylog2.graylog({
  servers: [{ 'host': '127.0.0.1', port: 12201 }],
  hostname: 'your-hostname', // Optional
  facility: 'express-app', // Optional
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Render the index page
app.get('/', (req, res) => {
    graylog.log('graylog ping');
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
    graylog.log('Movie search successful', { searchTerm });
  } catch (error) {
    graylog.error('Error fetching movies:', { error: error.message });
    res.status(500).json({ error: "An error occurred while fetching movies" });
  }
});

// Endpoint to fetch details of a specific movie by its ID
app.get('/details/:id', async (req, res) => {
    try {
      const movieID = req.params.id;
      const URL = `https://omdbapi.com/?i=${movieID}&apikey=8fd874db`;
      const response = await fetch(URL);
      
      // Check if response is successful
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      
      // Parse response as JSON
      const movieDetails = await response;

      if (movieDetails.size == 0){
        graylog.error('Error fetching movie details: movie detail result is empty');
      } else {
        graylog.log('Movie details fetched successfully', { movieDetails });
      }

      // Log the movie details
      
  
      // Send the movie details in the response
      res.json({ details: movieDetails });
    } catch (error) {
      // Log the error
      graylog.error('Error fetching movie details:', { error: error.message });
      
      // Send an error response
      res.status(500).json({ error: "An error occurred while fetching movie details" });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
