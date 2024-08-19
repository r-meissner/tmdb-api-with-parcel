const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjE2NWQwYjZmNWQ3YmMyZjRiNTZmZmUxYTM3NzI2ZCIsIm5iZiI6MTcyMTQ2MzIwNi4yNTI5ODgsInN1YiI6IjY2OWI2NzhjY2E3NTY0NmZkNDY5YjMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.m5gwpj__zGc1_-DcMK85DQo5JNZpOoCH0rHVTN9H18U'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');

    // Create the search bar and search button elements with enhanced styling
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('flex', 'justify-center', 'items-center', 'mb-4', 'p-4');
    searchContainer.style.position = 'relative';
    searchContainer.style.maxWidth = '800px';
    searchContainer.style.margin = '0 auto';

    const searchInput = document.createElement('input');
    searchInput.id = 'search-input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search for movies...';
    searchInput.classList.add('p-3', 'pl-20', 'w-full', 'rounded-full', 'shadow', 'focus:outline-none', 'focus:ring-2', 'focus:ring-yellow-500', 'bg-gray-800', 'text-white');
    searchInput.style.border = 'none';

    const searchIcon = document.createElement('span');
    searchIcon.style.position = 'absolute';
    searchIcon.style.left = '30px';
    searchIcon.style.color = '#9ca3af'; // Tailwind's gray-400 color
    searchIcon.innerHTML = `
       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
           <path fill-rule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.292 4.293a1 1 0 01-1.414 1.414l-4.292-4.293zm-1.414-2.121a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd" />
       </svg>`;
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);

    const searchButton = document.createElement('button');
    searchButton.id = 'search-button';
    searchButton.classList.add('bg-yellow-500', 'hover:bg-yellow-600', 'text-black', 'font-bold', 'py-2', 'px-4', 'rounded-full', 'ml-2', 'shadow-md');
    searchButton.textContent = 'Search';

    searchContainer.appendChild(searchButton);

    // Insert the search bar at the top of the favorites container
    favoritesContainer.insertAdjacentElement('beforebegin', searchContainer);

    let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

    // Function to display all favorite movies
    function displayMovies(movies) {
        favoritesContainer.innerHTML = ''; // Clear the container first
        const renderedMovieIds = new Set(); // Track rendered movies by ID

        movies.forEach(async (movie) => {
            if (!renderedMovieIds.has(movie.id)) {
                renderedMovieIds.add(movie.id);
                const movieDetails = await fetchMovieDetails(movie.id);
                renderMovieCard(movieDetails, movie.notes);
            }
        });
    }

    // Initial rendering of favorite movies
    displayMovies(favoriteMovies);

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMovies = favoriteMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm)
        );

        // Clear the favorites container
        favoritesContainer.innerHTML = '';

        if (filteredMovies.length > 0) {
            // If movies match the search term, display them
            displayMovies(filteredMovies);
        } else {
            // If no movies match, display an error message
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'No movies found in your favorites.';
            errorMessage.classList.add('text-center', 'text-yellow-400', 'text-xl', 'font-bold', 'mt-4');
            favoritesContainer.appendChild(errorMessage);
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
    
        // Rating System
        const ratingContainer = document.createElement('div');
        ratingContainer.classList.add('flex', 'justify-center', 'items-center', 'mb-4');
    
        // Function to render stars based on the current rating
        function renderStars(rating) {
            ratingContainer.innerHTML = ''; // Clear the container first
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ${i <= rating ? 'text-yellow-500' : 'text-gray-400'}" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd" d="M12 2c-.69 0-1.27.34-1.62.88L8.82 6.15l-4.33.63c-.86.13-1.2 1.18-.58 1.77l3.13 3.04-.74 4.32c-.15.86.75 1.51 1.54 1.1l3.88-2.04 3.88 2.04c.79.41 1.69-.24 1.54-1.1l-.74-4.32 3.13-3.04c.62-.59.28-1.64-.58-1.77l-4.33-.63-1.56-3.27C13.27 2.34 12.69 2 12 2z" clip-rule="evenodd"/>
                    </svg>`;
                star.addEventListener('click', () => {
                    saveRating(movie.id, i);
                });
                ratingContainer.appendChild(star);
            }
        }
    
        // Function to save the rating
        function saveRating(movieId, rating) {
            favoriteMovies = favoriteMovies.map(fav => {
                if (fav.id === movieId) {
                    return { ...fav, rating: rating };
                }
                return fav;
            });
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            renderStars(rating); // Re-render stars with the new rating
        }
    
        // Get the current rating for this movie, or default to 0
        const currentRating = favoriteMovies.find(fav => fav.id === movie.id)?.rating || 0;
        renderStars(currentRating);
        descriptionOverlay.appendChild(ratingContainer);
    
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('flex', 'space-x-2');
    
        // Function to create buttons with tooltips
        function createButtonWithTooltip(iconSVG, tooltipText) {
            const button = document.createElement('button');
            button.classList.add('relative', 'bg-yellow-500', 'hover:bg-yellow-600', 'text-black', 'font-bold', 'py-2', 'px-4', 'rounded-full', 'ml-2', 'shadow-md');
            button.innerHTML = iconSVG;
    
            // Tooltip
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip-text');
            tooltip.textContent = tooltipText;
    
            // Tooltip styling
            tooltip.style.position = 'absolute';
            tooltip.style.top = '100%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.marginTop = '8px';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.backgroundColor = '#333';
            tooltip.style.color = '#fff';
            tooltip.style.fontSize = '12px';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.3s';
    
            button.appendChild(tooltip);
    
            // Show tooltip on hover
            button.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });
    
            // Hide tooltip when not hovering
            button.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
    
            return button;
        }
    
        // Save Button with Icon and Custom Tooltip
        const saveButton = createButtonWithTooltip(`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v13a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm4 1a1 1 0 000 2h6a1 1 0 000-2H7z"/>
            </svg>`, "Save Notes");
        saveButton.addEventListener('click', () => {
            if (!favoriteMovies.some(fav => fav.id === movie.id)) {
                favoriteMovies.push({ id: movie.id, notes: notesTextarea.value });
                localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            } else {
                favoriteMovies = favoriteMovies.map(fav => {
                    if (fav.id === movie.id) {
                        return { ...fav, notes: notesTextarea.value };
                    }
                    return fav;
                });
                localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            }
            saveButton.style.backgroundColor = '#fbbf24'; // Change color on click
            setTimeout(() => {
                saveButton.style.backgroundColor = ''; // Revert to original color
            }, 200);
        });
        buttonContainer.appendChild(saveButton);
    
        // Clear Button with Icon and Custom Tooltip
        const clearButton = createButtonWithTooltip(`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L12 10.586l4.293-4.293a1 1 0 111.414 1.414L13.414 12l4.293 4.293a1 1 0 01-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 12 6.293 7.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>`, "Clear Notes");
        clearButton.addEventListener('click', () => {
            notesTextarea.value = '';
            favoriteMovies = favoriteMovies.map(fav => {
                if (fav.id === movie.id) {
                    return { ...fav, notes: '' };
                }
                return fav;
            });
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
            clearButton.style.backgroundColor = '#fbbf24'; // Change color on click
            setTimeout(() => {
                clearButton.style.backgroundColor = ''; // Revert to original color
            }, 200);
        });
        buttonContainer.appendChild(clearButton);
    
        // Remove Button with Icon and Custom Tooltip
        const removeButton = createButtonWithTooltip(`
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.883.99V4H5a1 1 0 100 2h10a1 1 0 100-2h-3.117v-1.01A1 1 0 0011 2H9zm4 4h-6v10h6V6z" clip-rule="evenodd"/>
            </svg>`, "Remove Movie Card");
        removeButton.addEventListener('click', () => {
            favoriteMovies = favoriteMovies.filter(fav => fav.id !== movie.id);
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
