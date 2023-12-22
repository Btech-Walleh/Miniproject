const API_KEY = "4c09099ee1d946678d267ca844a06b51";
const url = "https://newsapi.org/v2/everything?q=";
const API_KEY_WEATHER = "b01d0eca8e8afb063844c673bfe52529";

// Function to fetch weather data
function getWeatherData(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=metric`);
}

// Function to display weather information
function displayWeather(data) {
    const weatherContainer = document.getElementById("weather-container");
    const weatherContent = `
        <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">
        <p>${data.main.temp}°C</p>
    `;

    weatherContainer.innerHTML = weatherContent;
}

// Function to fetch weather and display it on page load
async function fetchWeather() {
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const weatherData = await getWeatherData(lat, lon);
            displayWeather(await weatherData.json());
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    }
}




// Add these functions for showing and hiding the loader




// Event listener for page load to fetch news and weather
window.addEventListener("load", () => {
    fetchNews("India");
    fetchWeather();
});


// Function to fetch news articles
// Add these functions to show and hide the loader
function showLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
}

function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}

// Modify your fetchNews function to call these functions
async function fetchNews(query) {
  showLoader();

  try {
      const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
      const data = await res.json();
      bindData(data.articles);
  } catch (error) {
      console.error("Error fetching news:", error);
  } finally {
      hideLoader();
  }
}


// Function to bind news data to HTML template
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}




// Function to fill data in news card
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Variable to keep track of the selected navigation item
let curSelectedNav = null;

// Function to handle navigation item click
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});


// Slider
const searchTerm = "world";

    const slider = document.getElementById("slider");
    const sliderNav = document.querySelector(".slider-nav");

    let currentSlide = 0;

    async function getNews() {
      try {
        const response = await fetch(`${url}${searchTerm}&apiKey=${API_KEY}`);
        const data = await response.json();
        return data.articles;
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }

    function showSlides() {
      getNews().then(news => {
        slider.innerHTML = "";

        news.forEach((article, index) => {
          const slide = document.createElement("div");
          slide.classList.add("slide");

          const content = `
            <div class="slide-content">
              <h3>${article.title}</h3>
              <p>${article.description}</p>
              <a href="${article.url}" target="_blank">Read more</a>
            </div>
            <img src="${article.urlToImage}" alt="${article.title}">
          `;

          slide.innerHTML = content;
          slider.appendChild(slide);
        });

        // Auto-scroll the slider
        setInterval(() => {
          nextSlide();
        }, 5000);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slider.children.length;
      updateSlider();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slider.children.length) % slider.children.length;
      updateSlider();
    }

    function updateSlider() {
      slider.style.transition = "transform 0.5s ease-in-out";
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Initial render
    showSlides();
    
