const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjE2NWQwYjZmNWQ3YmMyZjRiNTZmZmUxYTM3NzI2ZCIsIm5iZiI6MTcyMTQ2MzIwNi4yNTI5ODgsInN1YiI6IjY2OWI2NzhjY2E3NTY0NmZkNDY5YjMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.m5gwpj__zGc1_-DcMK85DQo5JNZpOoCH0rHVTN9H18U'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');
    let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favoriteMovies.length === 0) {
        favoritesContainer.innerHTML = '<p class="text-center text-xl col-span-3">No favorite movies added yet.</p>';
        return;
    }

    favoriteMovies.forEach(async (movie) => {
        const movieDetails = await fetchMovieDetails(movie.id);
        renderMovieCard(movieDetails, movie.notes);
    });

    async function fetchMovieDetails(movieId) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options);
            if (!response.ok) throw new Error('Failed to fetch movie details');
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }

    function renderMovieCard(movie, notes) {
        console.log('Rendering movie:', movie, 'with notes:', notes); // Debugging statement
        const movieCard = document.createElement('div');
        movieCard.classList.add('bg-gray-800', 'p-4', 'rounded', 'shadow-md');

        const poster = document.createElement('img');
        const imageSize = "w300";
        poster.src = 'https://image.tmdb.org/t/p/' + imageSize + movie.poster_path;
        poster.alt = movie.title;
        poster.classList.add('w-30', 'h-auto', 'mx-auto');
        movieCard.appendChild(poster);

        const title = document.createElement('h1');
        title.textContent = movie.title;
        title.classList = "p-4 font-bold text-xl mb-2 text-yellow-400 text-center";
        movieCard.appendChild(title);

        const overview = document.createElement('p');
        overview.textContent = movie.overview;
        overview.classList = "text-gray-300 text-base p-4";
        movieCard.appendChild(overview);

        const notesLabel = document.createElement('label');
        notesLabel.textContent = 'Personal Notes:';
        notesLabel.classList = "p-4 mb-2 text-yellow-400";
        movieCard.appendChild(notesLabel);

        const notesTextarea = document.createElement('textarea');
        notesTextarea.classList.add('w-full', 'border', 'rounded', 'p-2', 'mt-2');
        notesTextarea.value = notes || '';
        movieCard.appendChild(notesTextarea);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList = "bg-yellow-500 hover:bg-yellow-700 text-gray-900 max-w-fit font-bold py-2 px-4 m-4 rounded";
        saveButton.addEventListener('click', () => {
            favoriteMovies = favoriteMovies.map(fav => {
                if (fav.id === movie.id) {
                    return { ...fav, notes: notesTextarea.value };
                }
                return fav;
            });
            console.log('Updated favorites:', favoriteMovies); // Debugging statement
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            saveButton.style.backgroundColor = '#ffb366'; // Change color on click
            setTimeout(() => {
                saveButton.style.backgroundColor = ''; // Revert to original color
            }, 200);
        });
        movieCard.appendChild(saveButton);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.classList = "bg-yellow-500 hover:bg-yellow-700 text-gray-900 max-w-fit font-bold py-2 px-4 m-4 rounded";
        clearButton.addEventListener('click', () => {
            notesTextarea.value = '';
            favoriteMovies = favoriteMovies.map(fav => {
                if (fav.id === movie.id) {
                    return { ...fav, notes: '' };
                }
                return fav;
            });
            console.log('Cleared favorites:', favoriteMovies); // Debugging statement
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            clearButton.style.backgroundColor = '#ffb366'; // Change color on click
            setTimeout(() => {
                clearButton.style.backgroundColor = ''; // Revert to original color
            }, 200);
        });
        movieCard.appendChild(clearButton);


        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Movie';
        removeButton.classList = "bg-yellow-500 hover:bg-yellow-700 text-gray-900 max-w-fit font-bold py-2 px-4 m-4 rounded";
        removeButton.addEventListener('click', () => {
            favoriteMovies = favoriteMovies.filter(fav => fav.id !== movie.id);
            console.log('Removed movie:', movie.id); // Debugging statement
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            favoritesContainer.removeChild(movieCard);
        });
        movieCard.appendChild(removeButton);


        favoritesContainer.appendChild(movieCard);
    }
});

