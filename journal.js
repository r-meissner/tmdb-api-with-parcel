const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjE2NWQwYjZmNWQ3YmMyZjRiNTZmZmUxYTM3NzI2ZCIsIm5iZiI6MTcyMTQ2MzIwNi4yNTI5ODgsInN1YiI6IjY2OWI2NzhjY2E3NTY0NmZkNDY5YjMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.m5gwpj__zGc1_-DcMK85DQo5JNZpOoCH0rHVTN9H18U'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');
    
    // Create the search bar and search button elements
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('flex', 'justify-center', 'mb-4', 'p-4');

    const searchInput = document.createElement('input');
    searchInput.id = 'search-input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search movies...';
    searchInput.classList.add('p-2', 'border', 'rounded-l', 'w-full', 'max-w-md');
    searchContainer.appendChild(searchInput);

    const searchButton = document.createElement('button');
    searchButton.id = 'search-button';
    searchButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'rounded-r', 'hover:bg-blue-600');
    searchButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.292 4.293a1 1 0 01-1.414 1.414l-4.292-4.293zm-1.414-2.121a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd" />
        </svg>`;
    searchContainer.appendChild(searchButton);

    // Insert the search bar at the top of the favorites container
    favoritesContainer.insertAdjacentElement('beforebegin', searchContainer);

    let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favoriteMovies.length === 0) {
        favoritesContainer.innerHTML = '<p class="text-center text-xl col-span-3">No favorite movies added yet.</p>';
        return;
    }

    favoriteMovies.forEach(async (movie) => {
        const movieDetails = await fetchMovieDetails(movie.id);
        renderMovieCard(movieDetails, movie.notes);
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMovies = favoriteMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm)
        );
        favoritesContainer.innerHTML = ''; // Clear the container
        if (filteredMovies.length > 0) {
            filteredMovies.forEach(async (movie) => {
                const movieDetails = await fetchMovieDetails(movie.id);
                renderMovieCard(movieDetails, movie.notes);
            });
        } else {
            favoritesContainer.innerHTML = '<p class="text-center text-xl col-span-3">No movies match your search.</p>';
        }
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
        movieCard.classList.add('relative', 'bg-gray-800', 'rounded', 'shadow-md', 'mb-4', 'overflow-hidden', 'group');

        const poster = document.createElement('img');
        const imageSize = "w300";
        poster.src = 'https://image.tmdb.org/t/p/' + imageSize + movie.poster_path;
        poster.alt = movie.title;
        poster.classList.add('w-full', 'h-auto', 'block');
        movieCard.appendChild(poster);

        const descriptionOverlay = document.createElement('div');
        descriptionOverlay.classList.add('absolute', 'inset-0', 'bg-gray-900', 'bg-opacity-75', 'opacity-0', 'group-hover:opacity-100', 'flex', 'flex-col', 'items-center', 'justify-center', 'p-4', 'transition-opacity', 'duration-300');

        const descriptionText = document.createElement('p');
        descriptionText.textContent = movie.overview;
        descriptionText.classList.add('text-white', 'text-center', 'mb-4');
        descriptionOverlay.appendChild(descriptionText);

        const notesLabel = document.createElement('label');
        notesLabel.textContent = 'Personal Notes:';
        notesLabel.classList.add('text-yellow-400', 'mb-2');
        descriptionOverlay.appendChild(notesLabel);

        const notesTextarea = document.createElement('textarea');
        notesTextarea.classList.add('w-full', 'border', 'rounded', 'p-2', 'mb-2');
        notesTextarea.value = notes || '';
        descriptionOverlay.appendChild(notesTextarea);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('flex', 'space-x-2');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('bg-blue-500', 'text-white', 'py-1', 'px-3', 'rounded', 'hover:bg-blue-600', 'active:bg-blue-700');
        saveButton.addEventListener('click', () => {
            favoriteMovies = favoriteMovies.map(fav => {
                if (fav.id === movie.id) {
                    return { ...fav, notes: notesTextarea.value };
                }
                return fav;
            });
            console.log('Updated favorites:', favoriteMovies); // Debugging statement
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            saveButton.style.backgroundColor = '#2563eb'; // Change color on click
            setTimeout(() => {
                saveButton.style.backgroundColor = ''; // Revert to original color
            }, 200);
        });
        buttonContainer.appendChild(saveButton);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.classList.add('bg-red-500', 'text-white', 'py-1', 'px-3', 'rounded', 'hover:bg-red-600', 'active:bg-red-700');
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
            clearButton.style.backgroundColor = '#dc2626'; // Change color on click
            setTimeout(() => {
                clearButton.style.backgroundColor = ''; // Revert to original color
            }, 200);
        });
        buttonContainer.appendChild(clearButton);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Movie';
        removeButton.classList.add('bg-gray-500', 'text-white', 'py-1', 'px-3', 'rounded', 'hover:bg-gray-600', 'active:bg-gray-700');
        removeButton.addEventListener('click', () => {
            favoriteMovies = favoriteMovies.filter(fav => fav.id !== movie.id);
            console.log('Removed movie:', movie.id); // Debugging statement
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            favoritesContainer.removeChild(movieCard);
        });
        buttonContainer.appendChild(removeButton);

        descriptionOverlay.appendChild(buttonContainer);
        movieCard.appendChild(descriptionOverlay);

        const title = document.createElement('h1');
        title.textContent = movie.title;
        title.classList.add('p-4', 'font-bold', 'text-xl', 'mb-2', 'text-yellow-400', 'text-center', 'truncate');
        movieCard.appendChild(title);

        favoritesContainer.appendChild(movieCard);
    }
});