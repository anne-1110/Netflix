const hero = document.getElementById("hero-section");

const backgrounds = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZtzeDVwrX1dF8ls7o-OCjSit6uCBHq8o5f6MOZqohlw&s=10",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjGAMEXzzbces-N9pjNzx9gAQ4qPaEOuLT70k-NFdzLQ&s=10",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZtzeDVwrX1dF8ls7o-OCjSit6uCBHq8o5f6MOZqohlw&s=10",
];

let index = 0;

//Function to change the background
function changeBackground() {
  hero.style.backgroundImage = `
        linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.8)),
        url('${backgrounds[index]}')
    `;

  index++;

  if (index >= backgrounds.length) {
    index = 0;
  }
}

// Show first image
changeBackground();

// Change every 5 seconds
setInterval(changeBackground, 5000);

var token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NDlkNTM2MDQ1Y2YwYTFmZjYwNjBmYzZmZWM4MGQxZSIsIm5iZiI6MTc4NDEwNDk3MC4yNzgsInN1YiI6IjZhNTc0ODBhNWMwZGFjYTY4NDVmMjE4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9S7__9EyyacpvO7gVEsjb9TOX34BJwso17V69xvAscw";

const options = {
  // Method get
  headers: {
    "content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
console.log(token);

function likeMovie(id) {
  console.log(id);
  let likedMovies = localStorage.getItem("likedMovies") || "";
  //remove id if already added
  //   likedMovies.push(id);
  likedMovies = likedMovies.replace("," + id + ",", ",");
  likedMovies = likedMovies.replace("," + id + "");
  likedMovies = likedMovies.replace(id + "," + "");
  likedMovies = likedMovies.replace(id, "");
  localStorage.setItem("likedMovies", likedMovies);
  return;
}


const modal = document.getElementById("movieModal");
const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalRating = document.getElementById("modalRating");
const modalOverview = document.getElementById("modalOverview");
const closeBtn = document.querySelector(".close");
const searchInput = document.getElementById("search");


let allMovies = [];

searchInput.addEventListener("input", function () {

    const searchValue = searchInput.value.toLowerCase();

    const filteredMovies = allMovies.filter(movie => {

        const titleMatch = movie.title
            .toLowerCase()
            .includes(searchValue);

        const genreMatch = movie.genre_ids.some(id =>
            genreMap[id]?.toLowerCase().includes(searchValue)
        );

        return titleMatch || genreMatch;

    });

    fetchMovies(filteredMovies);
    // displayActionMovies(filteredMovies);
    // displayKidsMovies(filteredMovies);


});



function showMovie(movie) {

    modalPoster.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`: "";

    modalTitle.textContent = movie.title || movie.name || "No Title";

    modalDate.textContent =
        "Release Date: " + (movie.release_date || movie.first_air_date || "N/A");

    modalRating.textContent =
        "Rating: " + (movie.vote_average || "N/A");

    modalOverview.textContent =
        movie.overview || "No description available.";

    modal.style.display = "flex";
}

closeBtn.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



function getLikedMovies() {
    try {
        const data = localStorage.getItem('likedMovies');
        if (!data) return []; // Return empty array if no data
        
        const parsed = JSON.parse(data);
        // Ensure we return an array even if data is corrupted
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error parsing likedMovies:', error);
        // If data is corrupted, clear it and start fresh
        localStorage.removeItem('likedMovies');
        return [];
    }
}

function getLiked(movieId) {
    return getLikedMovies().includes(movieId);
}

function likeMovie(movieId) {
    try {
        let likedMovies = getLikedMovies();
        const index = likedMovies.indexOf(movieId);
        
        if (index === -1) {
            likedMovies.push(movieId);
        } else {
            likedMovies.splice(index, 1);
        }
        
        localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
    } catch (error) {
        console.error('Error saving liked movie:', error);
    }
}    


async function fetchMovies() {
    try {
        const response = await fetch(
            "https://api.themoviedb.org/3/trending/all/day?language=en-US",
            options
        );

        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();
        const movieData = data.results;

        const container = document.querySelector("#next");
        // const container = document.querySelector("#next .movies-container");
        container.innerHTML = ""; 
        allMovies = movieData;

        movieData.map((eachMovie) => {
            const imgNext = document.createElement("img");
            imgNext.src = `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`;
            imgNext.classList.add("movie-poster");
            imgNext.onclick = function () {
                showMovie(eachMovie);
            }

            let button = document.createElement("button");
            button.classList.add("like-btn");

            const icon = document.createElement("i");
            const liked = getLiked(eachMovie.id);

            if (liked) {
                icon.classList.add("fa-solid", "fa-heart");
                // Element.style.color = 'red'
            } else {
                icon.classList.add("fa-regular", "fa-heart");
            }

            button.appendChild(icon);

            button.onclick = function () {
                likeMovie(eachMovie.id);
                // Toggle between solid and regular
                icon.classList.toggle("fa-solid");
                icon.classList.toggle("fa-regular");
            };

            const section = document.createElement("section");
            section.appendChild(imgNext);
            section.appendChild(button);
            document.querySelector("#next").appendChild(section);
        });
    } catch (error) {
        console.error("Error from fetchMovies", error);
    }
}

fetchMovies();


async function fetchAction() {
     try {
        const response = await fetch(
            "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
            options
        );

        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();
        const actionData = data.results;

        const container = document.querySelector("#action");
        container.innerHTML = ""; 
        // allMovies = actionData;

        actionData.map((eachMovie) => {
            const imgAction = document.createElement("img");
            imgAction.src = `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`;
            imgAction.classList.add("movie-poster");
            imgAction.onclick = function () {
                showMovie(eachMovie);
            }

            let button = document.createElement("button");
            button.classList.add("like-btn");

            const icon = document.createElement("i");
            const liked = getLiked(eachMovie.id);

            if (liked) {
                icon.classList.add("fa-solid", "fa-heart");
            } else {
                icon.classList.add("fa-regular", "fa-heart");
            }

            button.appendChild(icon);

            button.onclick = function () {
                likeMovie(eachMovie.id);
                // Toggle between solid and regular
                icon.classList.toggle("fa-solid");
                icon.classList.toggle("fa-regular");
            };

            const section = document.createElement("section");
            section.appendChild(imgAction);
            section.appendChild(button);
            document.querySelector("#action").appendChild(section);
        });
    } catch (error) {
        console.error("Error from fetchAction", error);
    }
}

fetchAction(); 



async function fetchKids() {
     try {
        const response = await fetch(
            "https://api.themoviedb.org/3/trending/all/day?language=en-US",
            options
        );

        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();
        const kidsData = data.results;

        const container = document.querySelector("#kids");
        container.innerHTML = ""; 
        // allMovies = kidsData;

        kidsData.map((eachMovie) => {
            const imgKids = document.createElement("img");
            imgKids.src = `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`;
            imgKids.classList.add("movie-poster");
            imgKids.onclick = function () {
                showMovie(eachMovie);
            }

            let button = document.createElement("button");
            button.classList.add("like-btn");

            const icon = document.createElement("i");
            const liked = getLiked(eachMovie.id);

            if (liked) {
                icon.classList.add("fa-solid", "fa-heart");

            } else {
                icon.classList.add("fa-regular", "fa-heart");
            }

            button.appendChild(icon);

            button.onclick = function () {
                likeMovie(eachMovie.id);
                // Toggle between solid and regular
                icon.classList.toggle("fa-solid");
                icon.classList.toggle("fa-regular");
            };

            const section = document.createElement("section");
            section.appendChild(imgKids);
            section.appendChild(button);
            document.querySelector("#kids").appendChild(section);
        });
    } catch (error) {
        console.error("Error from fetchKids", error);
    }
}

fetchKids(); 




// Global search mechanism
//     const search = document.getElementById("search"); 
//     if (search) {
//     search.addEventListener("keyup", function(){ 
//             const value = search.value.toLowerCase(); 
//             // Select sections inside ALL lists or just #next depending on your goal
//             const cards = document.querySelectorAll(".movies-container section"); 
            
//             cards.forEach((card) => { 
//             // Safely pull string title cached right inside the HTML element node
//             const cardTitle = card.getAttribute("data-title").toLowerCase();
//             if (cardTitle.includes(value)) { 
//                 card.style.display = "block"; 
//             } else { 
//                 card.style.display = "none"; 
//             } 
//         }); 
//     }); 
// }

// if (search) {
//   search.addEventListener("keyup", function() { 
//     const value = search.value.toLowerCase(); 
//     // Targets all sections generated inside your movie rows
//     const cards = document.querySelectorAll(".movies-container section"); 
    
//     cards.forEach((card) => { 
//       // 1. Get the attribute safely
//       const titleAttr = card.getAttribute("data-title");
      
//       // 2. FIX: If titleAttr is null, use "" instead of crashing on .toLowerCase()
//       const cardTitle = titleAttr ? titleAttr.toLowerCase() : "";
      
//       // 3. Perform the search filter toggle
//       if (cardTitle.includes(value)) { 
//         card.style.display = "block"; 
//       } else { 
//         card.style.display = "none"; 
//       } 
//     }); 
//   }); 
// }


// async function fetchTv() { 
//   try { 
//     const response = await fetch( 
//       "https://api.themoviedb.org/3/watch/providers/tv?language=en-US", 
//       options 
//     ); 
//     if (!response.ok) throw new Error("Failed to fetch movies"); 
//     const data = await response.json();
//     const tvData = data.results; 

//     const providers = data.results.slice(0, 20); 

//     providers.forEach((eachMovie) => { 
//       const imgTv = document.createElement("img"); 
//       imgTv.src = `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`; 
//       imgTv.classList.add("movie-poster"); 

//       let button = document.createElement("button"); 
//       button.classList.add("like-btn"); 

//       const icon = document.createElement("i"); 
//       const liked = getLiked(eachMovie.id); 

//       if (liked) { 
//         icon.classList.add("fa-solid", "fa-heart"); 
//         icon.style.color = 'red'; 
//       } else { 
//         icon.classList.add("fa-regular", "fa-heart"); 
//       } 

//       button.appendChild(icon); 

//       button.onclick = function () { 
//         likeMovie(eachMovie.id); 
//         icon.classList.toggle("fa-solid"); 
//         icon.classList.toggle("fa-regular"); 
        
//         // Toggle the red color along with the heart fill state
//         if(icon.classList.contains("fa-solid")) {
//           icon.style.color = "red";
//         } else {
//           icon.style.color = "";
//         }
//       }; 

//       // Create a wrapper card section for each item
//       const section = document.createElement("section"); 
//       section.classList.add("tv-card"); 
//       section.appendChild(imgTv); 
//       section.appendChild(button); 

//       document.querySelector("#tv").appendChild(section); 
//     }); 
//   } catch (error) { 
//     console.error("Error from fetchTv", error); 
//   } 
// }
// fetchTv();
























// // Define these functions OUTSIDE the fetchMovies function
// function getLiked(movieId) {
//     try {
//         const likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || '[]';
//         return JSON.parse(likedMovies).includes(movieId);
//     } catch (error) {
//         console.error('Error parsing likedMovies:', error);
//         return false;
//     }
// }

// function likeMovie(movieId) {
//     try {
//         let likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
//         const index = likedMovies.indexOf(movieId);
        
//         if (index === -1) {
//             likedMovies.push(movieId);
//         } else {
//             likedMovies.splice(index, 1);
//         }
        
//         localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
//     } catch (error) {
//         console.error('Error saving liked movie:', error);
//     }
// }

// function getLiked(id) {
//   // Get liked movies from localStorage, parse as array
//   const likedMovies = localStorage.getItem("likedMovies") || [];

//   // Check if the id exists in the array
//   const isLiked = likedMovies.includes(id);

//   //   console.log(`Movie ${id} is ${isLiked ? 'liked' : 'not liked'}`);
//   return isLiked;
// }

// async function fetchMovies() {
//   try {
//     const response = await fetch(
//       "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
//       options,
//     );

//     if (!response.ok) throw new Error("Failed to fetch movies");

//     console.log(response);

//     const data = await response.json();

//     console.log(data.results[0]);

//     console.log(data.results);
//     const movieData = data.results;

//     movieData.map((eachMovie) => {
//       const imgNext = document.createElement("img");
//       imgNext.src = `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`;
//       // console.log(`https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`);
//       // document.getElementById('next').appendChild(imgNext);
//       imgNext.classList.add("movie-poster");
//       let button = document.createElement("button");
//       button.classList.add("like-btn");

//       const icon = document.createElement("i");
//       const liked = getLiked(eachMovie.id);

//       if (liked){
//           icon.classList.add("fa-solid", "fa-heart");

//       }else {

//           icon.classList.add("fa-regular", "fa-heart");
//      }
//      // Save back to localStorage
//     localStorage.setItem('likedMovies', JSON.stringify(likedMovies));

//     // Get like status for a specific movie
//     function getLiked(movieId) {
//         const likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || [];
//         return likedMovies.includes(movieId);
//     }
//       button.appendChild(icon);

//       button.onclick = function () {
//         likeMovie(eachMovie.id);

//         // Toggle between solid and regular
//         icon.classList.toggle("fa-solid");
//         icon.classList.toggle("fa-regular");
//       };
//       const section = document.createElement("section");
   
   
//       section.appendChild(imgNext);
//       section.appendChild(button);
//     //   button.appendChild(likeStatus);
//       document.querySelector("#next").appendChild(section);
//     });
//   } catch (error) {
//     console.error("Error from fetchMovies", error);
//   }
// }

// fetchMovies();
// Fix the localStorage helper functions

// try {
//     const response = await fetch(
//       "https://api.themoviedb.org/3/trending/all/day?language=en-US",
//       options,
//     );

//     console.log(response);

//     const data = await response.json();

//     console.log(data.results[0]);

//     console.log(data.results);
//     const actionData = data.results;

//     actionData.map((eachMovie) => {
//       const imgAction = document.createElement("img");
//       imgAction.src = `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`;
//       console.log(`https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`);
//       document.getElementById("action").appendChild(imgAction);
//     });
//   } catch (error) {
//     console.error("Error from fetchMovies", error);
//   }
// }

// fetchAction();

// async function fetchKids() {
//   try {
//     const response = await fetch(
//       "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
//       // "https://api.themoviedb.org/3/watch/providers/tv?language=en-US",
//       options,
//     );

//     console.log(response);

//     const data = await response.json();

//     console.log(data.results[0]);

//     console.log(data.results);
//     const kidsData = data.results;

//     kidsData.map((eachMovie) => {
//       const img = document.createElement("img");
//       img.src = `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`;
//       console.log(`https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`);
//       document.getElementById("kids").appendChild(img);
//     });
//   } catch (error) {
//     console.error("Error from fetchMovies", error);
//   }
// }

// fetchKids();

// const imgAction = document.createElement("img");
// imgAction.src = `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`;
// console.log(`https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`);
// document.getElementById('action').appendChild(imgAction);

// const img = document.createElement("img");
// img.src = `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`;
// console.log(`https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`);
// document.getElementById('kids').appendChild(img);

// document.getElementById('next').appendChild(img);
// document.getElementById('action').appendChild(img);

// Top rated movies

// https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1

// TV Providers
// https://api.themoviedb.org/3/watch/providers/tv?language=en-US

// Backdrop for the Hero Section Full Image of movies

//  const poster = element.backdrop_path;
//       const fullPosterUrl = https://image.tmdb.org/t/p/original/${poster};

// https://image.tmdb.org/t/p/original

// // TMDB API Request Options
// const token =
//   "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YmE4ZDFhNzZlZjI0YTVlODMwYmI3YzQwMDZkYzdjZiIsIm5iZiI6MTc4NDEwNDg3My41MjYsInN1YiI6IjZhNTc0N2E5NWFhMjY2ZGZlMzcyMjEzMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.coX_G4tT_Xp8urySLfsJZTCBfPeBxitoj0vHREJ0WZs";

// const options = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     Authorization: `Bearer ${token}`,
//   },
// };




