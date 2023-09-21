// Define the base path for API
const baseAPI = "./data/";

// Set initial API URL to "SVT 1.json"
let myAPIurl = baseAPI + "SVT 1.json";

// Set up initial styles for the page
document.body.style.display = "flex";
document.body.style.marginTop = "0";
document.querySelector(".menu").style.width = "200px";
document.querySelector(".menu").style.position = "fixed";
document.querySelector(".menu-icon").style.position = "fixed";

// Initialize an empty array to store API data
let myAPIdata = [];

// Initialize a variable to track if the menu is open or not
let isMenuOpen = false;

// Define a flag to choose between two toggleMenu functions
let useFirstToggle = false;

/* --------------- First method -----------------
Potentially easier to understand for someone familiar with JavaScript animations and allows for more "fine-grained" 
control over the animation, as it directly manipulates the left CSS property in a loop.
It has more code and potentially harder to read for someone not familiar with this specific animation technique.
May feel "laggy" due to the interval-based animation.*/
function toggleMenuFirst() {
    const menu = document.querySelector(".menu");
    const menuIcon = document.querySelector(".menu-icon i");

    if (isMenuOpen) {
        let currentPosition = 0;
        const slideOutInterval = setInterval(() => {
            if (currentPosition > -200) {
                currentPosition -= 10;
                menu.style.left = currentPosition + "px";
            } else {
                clearInterval(slideOutInterval);
                menu.style.left = "-200px";
            }
        }, 10);

        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
    } else {
        let currentPosition = -200;
        const slideInInterval = setInterval(() => {
            if (currentPosition < 0) {
                currentPosition += 10;
                menu.style.left = currentPosition + "px";
            } else {
                clearInterval(slideInInterval);
                menu.style.left = "0px";
            }
        }, 10);

        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-times");
    }
    isMenuOpen = !isMenuOpen;
}
/* ------------- Second method ---------------
Utilizes CSS transitions for smoother animations, which often feels more polished. It also has less code which makes it potentially easier to read.
It has less "fine-grained" control over the animation compared to the first method and relies on CSS transitions, which can have limitations in certain scenarios.
I prefer to use this method because it feels quicker, less code and a smoother animation. */
function toggleMenuSecond() {
    const menu = document.querySelector(".menu");
    const menuIcon = document.querySelector(".menu-icon i");

    if (menu.classList.contains("open")) {
        menu.style.transition = "left 0.5s ease";
        menu.style.left = "-200px";
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
    } else {
        menu.style.transition = "left 0.5s ease";
        menu.style.left = "0";
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-times");
    }
    menu.classList.toggle("open");
}

// Choose which toggleMenu function to use based on the flag
const toggleMenu = useFirstToggle ? toggleMenuFirst : toggleMenuSecond;

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const menu = document.querySelector(".menu");
    menu.classList.add("hidden");
});

// Function to display the channel header
function displayChannelHeader(channelName) {
    const containerDiv = document.createElement("div");
    containerDiv.id = "container";
    containerDiv.style.position = "absolute";
    containerDiv.style.top = "-15px";
    containerDiv.style.left = "45%";
    containerDiv.style.transform = "translateX(-50%)";
    containerDiv.style.zIndex = "9999";
    containerDiv.style.fontSize = "35px";
    document.body.insertBefore(containerDiv, document.body.firstChild);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.top = '100px';
    buttonContainer.style.left = '50%';
    buttonContainer.style.transform = 'translateX(-50%)';
    buttonContainer.style.zIndex = '9999';

    const showAllTitlesButton = document.createElement('button');
    showAllTitlesButton.textContent = 'Visa tidigare program';
    showAllTitlesButton.classList.add('show-previous-button');
    showAllTitlesButton.style.fontSize = '18px';
    showAllTitlesButton.style.width = '632px';
    showAllTitlesButton.style.marginTop = '-40px';
    showAllTitlesButton.style.marginLeft = '-8px';

    buttonContainer.appendChild(showAllTitlesButton);

    containerDiv.appendChild(buttonContainer);

    showAllTitlesButton.addEventListener('click', showAllTitles);

    const channelHeaderDiv = document.createElement("div");
    channelHeaderDiv.id = "channel-header";
    channelHeaderDiv.style.textAlign = "center";
    channelHeaderDiv.style.fontSize = "50px";
    channelHeaderDiv.textContent = channelName;
    containerDiv.appendChild(channelHeaderDiv);
}

// Display the channel header for "SVT 1"
displayChannelHeader("SVT 1");

// Function to set the channel
function setChannel(channelName) {
    myAPIurl = baseAPI + channelName + ".json";

    const listContainer = document.getElementsByClassName("col-sm-6");
    listContainer.innerHTML = "";

    const previousChannelHeader = document.getElementById("container");
    if (previousChannelHeader) {
        previousChannelHeader.remove();
    }

    myAPIdata = []; // Reset myAPIdata to an empty array

    loadData();

    displayChannelHeader(channelName);
}

// Function to load data from API
function loadData(showAll) {
    const container = document.querySelector(".col-sm-6");
    const loadingElement = document.createElement("div");
    loadingElement.id = "loading";
    loadingElement.style.display = "none";
    loadingElement.innerHTML = '<img src="loading.gif" alt="Loading...">';
    container.appendChild(loadingElement);

    const loadingGif = document.querySelector("#loading");
    loadingGif.style.display = "block"; // Show loading GIF
    fetch(myAPIurl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Fail");
            }
            return response.json();
        })
        .then(data => {
            myAPIdata = data;

            const container = document.querySelector(".col-sm-6");

            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            if (myAPIdata.length === 0) {
                const noDataMessage = document.createElement("div");
                noDataMessage.textContent = "No data available";
                noDataMessage.classList.add("no-data-message");
                container.appendChild(noDataMessage);
            } else {
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();

                myAPIdata.sort((a, b) => {
                    return new Date(a.start) - new Date(b.start);
                });

                myAPIdata.forEach(item => {
                    const div = document.createElement("div");
                    div.classList.add("test");
                    div.style.padding = "1px";
                    div.style.margin = "2px";
                    div.style.border = "1px solid black";
                    div.style.backgroundColor = "white";
                    div.style.fontSize = "25px";

                    const scheduleElement = document.createElement("div");
                    const titleElement = document.createElement("div");

                    scheduleElement.style.fontSize = "25px";
                    scheduleElement.style.textAlign = "left";

                    titleElement.style.fontSize = "25px";
                    titleElement.style.textAlign = "left";
                    titleElement.style.verticalAlign = "top";
                    titleElement.style.marginBottom = "0";

                    const startTime = new Date(item.start);
                    const hours = startTime.getHours();
                    const minutes = startTime.getMinutes();
                    const formattedTime =
                        hours.toString().padStart(2, "0") +
                        ":" +
                        minutes.toString().padStart(2, "0");

                    if (showAll || hours * 60 + minutes >= currentTime) {
                        scheduleElement.textContent = formattedTime;
                        titleElement.textContent = item.name;

                        div.appendChild(scheduleElement);
                        div.appendChild(titleElement);

                        container.appendChild(div);
                    }
                });
            }
            loadingGif.style.display = "none"; // Hide loading GIF
            addMargin();
        })
        .catch(error => {
            console.error("Error: " + error.message);
            const container = document.querySelector(".col-sm-6");
            const noDataMessage = document.createElement("div");
            noDataMessage.textContent = "Error loading data";
            noDataMessage.classList.add("no-data-message");
            container.appendChild(noDataMessage);
            loadingGif.style.display = "none"; // Hide loading GIF
        });
}

// Initial load of data
loadData();

// Function to add margin to elements
function addMargin() {
    const elements = document.getElementsByClassName("col-sm-6 offset-sm-2");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.marginTop = "75px";
    }
}

// Function to show all titles
function showAllTitles() {
    loadData(true);
}

// Function to show default titles
function showDefaultTitles() {
    const titles = document.querySelectorAll('.js-title');
    const schedules = document.querySelectorAll('.js-schedule');

    for (let i = 0; i < titles.length; i++) {
        titles[i].style.display = 'block';
        schedules[i].style.display = 'block';
    }
}