# Movie Diary

This project is a part of the Full Stack Web & App Bootcamp at [WBS Coding School](https://www.wbscodingschool.com/). The goal of this project was to create an interactive web application using The Movie Database (TMDB) API, manage changes through pull requests, and enhance JavaScript skills in a browser environment.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
  - [Homepage](#homepage)
  - [Journal Page](#journal-page)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [Learning Outcomes](#learning-outcomes)
- [Future Enhancements](#future-enhancements)
- [Refactoring](#refactoring)
- [Contributing](#contributing)
- [License](#license)
- [Team Members](#team-members)

## Project Overview

The Movie Diary project involves creating an interactive web application that allows users to search for movies, add them to a list of favorites, and add personal notes. This project emphasizes individual and group development, code management via GitHub, and enhancing JavaScript skills in a browser environment.

## Features

### Homepage

- Retrieves and displays a list of popular movies from TMDB API.
- Includes a search bar at the top.
- Displays search results in a dialog on submitting a search.
- Each movie is displayed as a card with an image, name, and relevant info.
- Includes a button to add the movie to favorites.
- Adds the movie to an array of objects in localStorage.

### Journal Page

- Retrieves and displays the list of favorite movies from localStorage.
- Each movie is rendered with an image, name, and relevant info.
- Includes a button to add personal notes to each movie.
- Saves these notes to the corresponding object in localStorage.

## Technologies Used

<p>
  <img alt="HTML5" src="https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" />
  <img alt="TMDB API" src="https://img.shields.io/badge/-TMDB%20API-01D277?style=flat-square&logo=themoviedatabase&logoColor=white" />
  <img alt="Parcel" src="https://img.shields.io/badge/-Parcel-8B5CF6?style=flat-square&logo=parcel&logoColor=white" />
</p>

## Usage

To use the Movie Diary web application:

1. Clone the repository.
2. Navigate to the project directory.
3. Install the dependencies with `npm install`.
4. Start the development server with `npm run dev`.
5. Open `http://localhost:1234` in your browser.
6. Use the search bar to find movies and add them to your favorites.
7. Navigate to the Journal Page to view and manage your favorite movies.

### Homepage

- The homepage displays a list of popular movies.
- Use the search bar to find specific movies.

### Journal Page

- The Journal Page displays your list of favorite movies.
- Add personal notes to each movie and save them.

## Learning Outcomes

Through this project, we gained valuable experience and skills in the following areas:

- Working with APIs to fetch and display data.
- Managing state using localStorage.
- Enhancing user experience with dynamic content updates.
- Implementing responsive design using TailwindCSS.
- Collaborating effectively using GitHub and pull requests.

## Refactoring

As part of the continuous improvement process, we are currently focusing on refactoring our Movie Diary project. The goal is to enhance the internal structure, readability, and maintainability of the codebase without altering its external behavior or functionality. Key areas of focus include:

- Adding comprehensive comments
- Fixing bugs
- Improving error handling
- Enhancing the UI and styling for a more polished look

During the refactoring process, we also introduced Parcel as a bundler to streamline the development process.

## Contributing

Contributions to this project are welcome. If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Team Members

- Ruth
- Parvin
- Iryna
- Fabian

### Disclaimer

This project is created for educational purposes as part of the WBS Coding School Bootcamp.
