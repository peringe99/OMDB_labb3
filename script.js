let searchField = document.getElementById("searchMovie")
let apikey = "848502dc"
let search = (searchField.value);
let url = 'http://www.omdbapi.com/?apikey=' + apikey + '&s=' + search;
let url2 = `http://www.omdbapi.com/?s=${search}&apikey=${apikey}`
let movieResults = document.getElementById("resultDiv");

async function searchFunc(search){ 
let response = await fetch(`http://www.omdbapi.com/?s=${search}&apikey=${apikey}`)
.then(response => response.json())
return response;
}

async function idFunc(search){ 
    let response = await fetch(`http://www.omdbapi.com/?i=${search}&apikey=${apikey}`)
    .then(response => response.json())
    return response;
    }

// Sök funktion
searchField.addEventListener('keyup', function(e){
    // Börja söka filmer efter skrivit in minst 3 tecken
    if (e.target.value.length > 2) { 
        movieResults.innerHTML = "";
        let result = searchFunc(e.target.value)
        
        result.then(data => {
            let movies = data.Search;
            if (data.Response == "True") {
                movieResults.innerHTML = "";
                for (const result of movies) {
                    let image = document.createElement("img")
                    image.classList.add("poster")
                    if (result.Poster !== 'N/A') {
                        image.setAttribute('src', result.Poster);
                    } else {
                        image.setAttribute('src', '/no-poster-available.jpg');
                    }
                    image.setAttribute('class', 'movie__img');
                    image.setAttribute('data-id', result.imdbID)
                    image.setAttribute('alt', result.Title);
                    movieResults.appendChild(image);
                } 
            } else {
                movieResults.innerHTML = "";
                error = document.createElement("p");
                error.classList.add("errorMessage");
                error.innerHTML = "Sökningen matchar ej någon film";
                movieResults.appendChild(error);
            }
               
        })
    }
})

// Sidan för specifik film 
movieResults.addEventListener("click", function(e){
    if (e.target.classList.contains('movie__img')) {
        let idResult = idFunc(e.target.dataset.id) 
        idResult.then(data => {

        let blur = document.createElement("div")
        blur.classList.add("blurBg");
        let title = document.createElement("h1");
        title.classList.add("bgText");
        blur.appendChild(title);
        title.innerHTML = data.Title

        //Release Date
        let year = document.createElement("p");
        year.classList.add("releaseYear");
        blur.appendChild(year);
        year.innerHTML = ("Release Date: " + data.Released)

        //Genre
        let genre = document.createElement("p");
        genre.classList.add("movieGenre");
        blur.appendChild(genre);
        genre.innerHTML = ("Genre: " + data.Genre)

        //Movie Poster
        let movieImage = document.createElement("img");
        if (data.Poster !== 'N/A') {
            movieImage.setAttribute('src', data.Poster);
        } else {
            movieImage.setAttribute('src', '/no-poster-available.jpg');
            movieImage.classList.add("noMoviePoster");
        }
        movieImage.classList.add("bgImage");
        blur.appendChild(movieImage);

        //Add the div for the movie page
        document.body.appendChild(blur);

        //Movie Plot
        let movieSum = document.createElement("p");
        movieSum.classList.add("movieSummary");
        movieSum.innerHTML = data.Plot
        blur.appendChild(movieSum);

        // IMDB Rating
        let rating = document.createElement("p");
        rating.classList.add("movieRating");
        rating.innerHTML = "IMDB Rating: " + data.imdbRating;
        blur.appendChild(rating);

        // See more on imdb button
        let imdbPage = document.createElement("a");
        imdbPage.classList.add("imdbPage");
        imdbPage.innerHTML = "View more..."
        imdbPage.onclick = () => {
            window.location = "https://www.imdb.com/title/" + data.imdbID + "/"
        }
        blur.appendChild(imdbPage);

        // Director
        let director = document.createElement("p");
        director.classList.add("director");
        director.innerHTML = "Director: " + data.Director;
        blur.appendChild(director);

        //Button for closing movie page
        let closeButton = document.createElement("button");
        closeButton.classList.add("closeBtn");
        closeButton.innerHTML = "X"
        closeButton.onclick = () => {
            blur.remove();
        } 
        blur.appendChild(closeButton)
        })
    }
})
