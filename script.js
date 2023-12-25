// Replace your existing JavaScript code with the following:

// const API_KEY = "4c09099ee1d946678d267ca844a06b51";
// const API_KEY = "d8531774a5cd485cbbc21e391e1081a1";
// const API_KEY = "b4288c5679e74ac988b96a74f4bdae49";
const API_KEY = "da1c0932e298492eae092470c0a2a900";
// const API_KEY = "e42bb9ac5a04418b8cb1310ff3c9c85b";
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

// Function to show and hide the loader
function showLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "flex"; // Set to "flex" to use flexbox for centering
}

function hideLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "none";
}

// Combine your fetchNews functions
async function fetchNews(query) {
    showLoader();

    try{
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();
        // fetchNewsAndUpdateSlider(query, data.articles);
        bindData(data.articles);}
        catch(err){console.log('An Error Occured!')}finally{

            hideLoader();
        }
  
    
    //     
    
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
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

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
// e42bb9ac5a04418b8cb1310ff3c9c85b
let currentSlide = 0;
async function getNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}`);
        const data = await response.json();

        // Select only 7 articles for the slider
        const sliderArticles = data.articles.slice(0, 7);
        const repeatedSliderArticles = Array.from({ length: 3 }, () => sliderArticles).flat();

        return repeatedSliderArticles;
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Initial render
getNews().then(showSlides);

let intervalId; // Declare a variable to store the interval ID

function showSlides(news) {
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

        // Add an error event listener to the image element
        const image = slide.querySelector("img");

        image.addEventListener("load", () => {
            // If the image is loaded successfully, move to the next slide
            nextSlide();
        });

        image.addEventListener("error", () => {
            // Handle error (optional)
        });

        slider.appendChild(slide);
    });

    // Reset the current slide to the first one
    currentSlide = 0;
    updateSlider();

    // Clear the existing interval (if any)
    clearInterval(intervalId);

    // Set a new interval for auto-scrolling the slider
    intervalId = setInterval(() => {
        nextSlide();
    }, 5000);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slider.children.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1) % slider.children.length;
    updateSlider();
}

function updateSlider() {
    slider.style.transition = "transform 0.5s ease-in-out";
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Initial render
getNews().then(showSlides);

// dropdown

// Add this to your existing JavaScript code
function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
}

// breaking news

// Function to fetch news and update li content
async function fetchAndUpdateNews(query) {
    try {
        const response = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await response.json();

        // Check if news articles are available
        if (data.articles && data.articles.length > 0) {
            // Get the news container and the ul element
            const newsContainer = document.getElementById("news-list");

            // Clear existing li elements
            newsContainer.innerHTML = "";

            // Iterate through the articles and create li elements
            data.articles.forEach(article => {
                const li = document.createElement("li");
                li.textContent = article.title;
                newsContainer.appendChild(li);
            });
        } else {
            console.error("No news articles found.");
        }
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Function to update news every 15 seconds
function updateNewsPeriodically() {
    // Initial news update
    fetchAndUpdateNews("indian-politics");

    // Schedule periodic updates
    setInterval(() => {
        fetchAndUpdateNews("india");
    }, 15000); // 15 seconds in milliseconds
}

// Call the function to start periodic updates
updateNewsPeriodically();

// latest-news block

const latestNewsContainer = document.getElementById('latest-news-list');
// Correct the API endpoint
const latestNewsUrl = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}`;

// Function to fetch latest news data
async function fetchLatestNews() {
    try {
        const response = await fetch(latestNewsUrl);
        const data = await response.json();

        // Display the latest news
        displayLatestNews(data.articles);
    } catch (error) {
        console.error('Error fetching latest news:', error);
    }
}

// Function to display latest news
function displayLatestNews(newsArticles) {
    // Clear existing content
    latestNewsContainer.innerHTML = '';

    // Display the latest news items
    newsArticles.slice(0, 8).forEach((article) => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('latest-news-item');

        const newsLink = document.createElement('a');
        newsLink.href = article.url;
        newsLink.target = '_blank';

        const newsTopic = document.createElement('span');
        newsTopic.classList.add('latest-news-topic');
        newsTopic.textContent = article.title.split(' ', 2).join(' ');

        const newsContent = document.createElement('p');
        newsContent.textContent = article.description.substring(0, 25) + '...';

        newsLink.appendChild(newsTopic);
        newsLink.appendChild(newsContent);
        newsItem.appendChild(newsLink);

        latestNewsContainer.appendChild(newsItem);
    });
}

// Fetch latest news when the page loads
document.addEventListener('DOMContentLoaded', fetchLatestNews);

// Top-news-Container
// Function to fetch news related to Uttar Pradesh
async function fetchStateNews() {
    try {
        const response = await fetch(`${url}Uttar Pradesh&apiKey=${API_KEY}`);
        const data = await response.json();

        console.log("State News API Response:", data); // Log the response data

        // Display the state news
        displayStateNews(data.articles);
    } catch (error) {
        console.error('Error fetching state news:', error);
    }
}

// Function to display state news
function displayStateNews(newsArticles) {
    const stateNewsContainer = document.getElementById('state-news-list');

    // Clear existing content
    stateNewsContainer.innerHTML = '';

    // Display the state news items
    newsArticles.slice(0, 6).forEach((article) => {
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.href = article.url;
        a.target = '_blank';
        a.textContent = article.title;

        li.appendChild(a);
        stateNewsContainer.appendChild(li);
    });
}

// Fetch state news when the page loads
document.addEventListener('DOMContentLoaded', fetchStateNews);

// like button

var btn1 = document.querySelector('#green');
var btn2 = document.querySelector('#red');

btn1.addEventListener('click', function() {

    if (btn2.classList.contains('red')) {
        btn2.classList.remove('red');
    }
    this.classList.toggle('green');

});

btn2.addEventListener('click', function() {

    if (btn1.classList.contains('green')) {
        btn1.classList.remove('green');
    }
    this.classList.toggle('red');

});

// explorer

// Add this to your existing script.js file or create a new one

function toggleExplorerOptions() {
    var explorerOptions = document.getElementById('explorerOptions');
    explorerOptions.style.display = explorerOptions.style.display === 'block' ? 'none' : 'block';
}

function onExplorerOptionClick(option) {
    // Handle the click event for each explorer option
    console.log('Explorer option clicked:', option);
    // Add your logic here
}
