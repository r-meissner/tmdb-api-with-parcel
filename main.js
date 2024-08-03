//getting the elements
const container = document.getElementById("movie-container");
const searchButton = document.getElementById("submit-search");
const searchInput = document.getElementById("search");

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
    const query = searchInput.value.replaceAll(" ","%20");
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

function renderMovieCard (movie) {
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

    //render the favortie button
    const favoriteButton = document.createElement("button");
    favoriteButton.textContent = "Add to Favorites";
    favoriteButton.addEventListener("click", () => {
        const previousData = JSON.parse(localStorage.getItem('favorites')) || [];
        localStorage.setItem('favorites', JSON.stringify([...previousData, element]));
    });
    favoriteButton.classList = "bg-yellow-500 hover:bg-yellow-700 text-gray-900 font-bold max-w-fit py-2 px-4 my-4 mx-auto rounded";
    movieCard.appendChild(favoriteButton);

    //append everything to the DOM
    container.appendChild(movieCard);
}