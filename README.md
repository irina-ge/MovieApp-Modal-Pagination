# Movie App

This is a web application that allows users to search for movies, view popular movies, and explore movie details including genres, ratings, and descriptions. The data is fetched from The Movie Database (TMDb) API.

## Features

- View popular movies
- Search for movies by title
- View detailed information about each movie (genres, rating, runtime, etc.)
- Pagination to navigate between movie listings
- Responsive design for desktop, tablet, and mobile

## Technologies used

- HTML5, CSS3, JavaScript
- [TMDb API](https://developer.themoviedb.org/docs/getting-started)
- Responsive design using CSS media queries

## Installation

1. Clone the repository to your local machine.
2. Open the project in your preferred code editor.
3. Add Your API Key (See the section below for instructions).
To use this project, you need an API key from The Movie Database (https://developer.themoviedb.org/docs/getting-started).
### How to add the API key.
Open the js/app.js file in your code editor.
Find the following line at the top of the file: 
const API_KEY = 'my-API-key-here'; // Insert my API key here
Replace 'my-API-key-here' with your actual API key.
Save the changes.

### How to Use
Open index.html in a web browser or run the project using a local server.
On the homepage, you will see a list of popular movies fetched from the TMDb API.
Use the search bar to find a specific movie by its title.
Click on any movie to view detailed information in a modal window.
Use the pagination buttons to navigate between pages of popular movies.
