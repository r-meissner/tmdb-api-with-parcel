//getting the elements
const container = document.getElementById("movie-container");
const searchButton = document.getElementById("submit-search");
const searchInput = document.getElementById("search");

//getting favorites list
let previousData = JSON.parse(localStorage.getItem('favorites')) || [];

//storing the options for the fetch-requests to movie api
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjE2NWQwYjZmNWQ3YmMyZjRiNTZmZmUxYTM3NzI2ZCIsIm5iZiI6MTcyMTQ2MzIwNi4yNTI5ODgsInN1YiI6IjY2OWI2NzhjY2E3NTY0NmZkNDY5YjMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.m5gwpj__zGc1_-DcMK85DQo5JNZpOoCH0rHVTN9H18U'
    }
}

//render top 20 movies on load
window.addEventListener('load', async () => {
    searchInput.value = ""; //reset the search field
    try {
        const res = await fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options);
        if (!res.ok) throw new Error('Something went wrong');
        const data = await res.json();
        //console.log(data)
        data.results.forEach(element => {
            renderMovieCard(element);
        });
    } catch (error) {
        console.error(error);
    }
})

//send search request to api and render results
searchButton.addEventListener("click", async () => {
    container.replaceChildren(); //remove previously rendered movies
    const query = searchInput.value.replaceAll(" ", "%20");
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`, options);
        if (!res.ok) throw new Error('Something went wrong');
        const data = await res.json();
        //console.log(data)
        if (data.total_results === 0) {
            container.innerHTML = '<p class="text-center text-xl col-span-3">No results. Try modifying your search terms.</p>';
        } else {
            data.results.forEach(element => {
                renderMovieCard(element);
            });
        }

    } catch (error) {
        console.error(error);
    }
})

function renderMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('relative', 'bg-gray-800', 'p-4', 'rounded', 'shadow-md');

    const poster = document.createElement('img');
    const imageSize = "w300";
    poster.src = 'https://image.tmdb.org/t/p/' + imageSize + movie.poster_path;
    poster.alt = movie.title;
    poster.classList.add('w-30', 'h-auto', 'mx-auto');
    movieCard.appendChild(poster);

    const title = document.createElement('h1');
    title.textContent = movie.title;
    title.classList = "p-4 font-bold text-xl mb-2 text-yellow-400 text-center truncate ...";
    movieCard.appendChild(title);

    const overview = document.createElement('p');
    overview.textContent = movie.overview;
    overview.classList = "opacity-0 hover:opacity-100 absolute overflow-y-auto bottom-20 bg-gray-800/75 text-white text-base p-4 z-10";
    movieCard.appendChild(overview);

    //render the favortie button
    const favoriteButton = document.createElement("button");
    favoriteButton.classList = "absolute top-0 right-0 bg-yellow-500 hover:bg-yellow-700 text-gray-900 font-bold max-w-fit py-2 px-4 rounded";
    //conditional rendering based on if movie is already in favorites
    let previousData = JSON.parse(localStorage.getItem('favorites')) || [];
    if (previousData.some(element => element.title === movie.title)) {
        favoriteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>';
    } else {
        favoriteButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-6'> <path stroke-linecap='round' stroke-linejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z' /></svg>";
        favoriteButton.addEventListener("click", () => {
            localStorage.setItem('favorites', JSON.stringify([...previousData, movie]));
            favoriteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>';
        });
    }
    movieCard.appendChild(favoriteButton);

    //append everything to the DOM
    container.appendChild(movieCard);
}

let debounceTimer;

// Fetch search suggestions from the API
async function fetchSearchSuggestions(query) {
    // Make an API request to fetch search suggestions based on the query
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${options.headers.Authorization.split(' ')[1]}&query=${query}&page=1`, options);
    // Parse the response data as JSON
    const data = await response.json();
    // Return the top 4 results from the data
    return data.results.slice(0, 4);
}

// Display search suggestions in the suggestions container
function displaySearchSuggestions(suggestions) {
    // Get the search suggestions container element
    const suggestionsContainer = document.getElementById('searchSuggestions');
    // Clear any previous suggestions
    suggestionsContainer.innerHTML = '';

    // Check if there are any suggestions
    if (suggestions.length > 0) {
        // If suggestions are present, remove the 'hidden' class to display the container
        suggestionsContainer.classList.remove('hidden');
        // Iterate through each suggestion item
        suggestions.forEach((item, index) => {
            // Only display movies or TV shows
            if (item.media_type === 'movie' || item.media_type === 'tv') {
                // Create a div element for each suggestion item
                const suggestionItem = document.createElement('div');
                // Classes for styling and interactivity
                suggestionItem.classList.add('p-3', 'hover:bg-gray-700', 'cursor-pointer', 'text-white', 'transition', 'duration-300');
                // Border to all items except the last one
                if (index !== suggestions.length - 1) {
                    suggestionItem.classList.add('border-b', 'border-gray-700');
                }

                // Create and set the title element
                const title = document.createElement('div');
                title.textContent = item.title || item.name;
                title.classList.add('font-semibold');

                // Create and set the year element
                const year = document.createElement('div');
                year.textContent = new Date(item.release_date || item.first_air_date).getFullYear();
                year.classList.add('text-gray-400', 'text-sm');

                // Append title and year to the suggestion item
                suggestionItem.appendChild(title);
                suggestionItem.appendChild(year);

                // Click event to set the search input value and trigger the search
                suggestionItem.addEventListener('click', () => {
                    document.getElementById('search').value = item.title || item.name;
                    suggestionsContainer.classList.add('hidden');
                    document.getElementById('submit-search').click();
                });
                // Append the suggestion item to the suggestions container
                suggestionsContainer.appendChild(suggestionItem);
            }
        });
    } else {
        // If no suggestions, hide the container 
        suggestionsContainer.classList.add('hidden');
    }
}

// Event listener to the search input for fetching and displaying suggestions
document.getElementById('search').addEventListener('input', (e) => {
    // Clear any previous debounce timer
    clearTimeout(debounceTimer);
    // Get the current input value
    const query = e.target.value;

    // If query length is more than 2 characters, fetch and display suggestions
    if (query.length > 2) {
        debounceTimer = setTimeout(async () => {
            const suggestions = await fetchSearchSuggestions(query);
            displaySearchSuggestions(suggestions);
        }, 300); // Wait for 300ms before making the API call to avoid excessive requests
    } else {
        // Hide the suggestions container if query length is less thna 3 characters
        document.getElementById('searchSuggestions').classList.add('hidden');
    }
});

// Hide suggestions container when clicking outside of the search area
document.addEventListener('click', (e) => {
    // Check if the clicked element is outside the search container
    if (!e.target.closest('.flex.items-center.justify-center.mb-6.relative')) {
        document.getElementById('searchSuggestions').classList.add('hidden');
    }
});

