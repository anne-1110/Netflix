const hero = document.getElementById("hero-section");

const backgrounds = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZtzeDVwrX1dF8ls7o-OCjSit6uCBHq8o5f6MOZqohlw&s=10",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjGAMEXzzbces-N9pjNzx9gAQ4qPaEOuLT70k-NFdzLQ&s=10",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZtzeDVwrX1dF8ls7o-OCjSit6uCBHq8o5f6MOZqohlw&s=10",

];

let index = 0;

//Functtion to change the background
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