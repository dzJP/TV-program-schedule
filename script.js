let baseAPI = "./data/";
let myAPIurl = baseAPI + "SVT 1.json";

document.body.style.display = "flex";
document.body.style.marginTop = "0";
document.querySelector(".menu").style.width = "200px";
document.querySelector(".menu").style.position = "fixed";
document.querySelector(".menu-icon").style.position = "fixed";

let myAPIdata = [];

let isMenuOpen = false;

function toggleMenu() {
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

document.addEventListener("DOMContentLoaded", function () {
    const menu = document.querySelector(".menu");
    menu.classList.add("hidden");
});

function displayChannelHeader(channelName) {
    const containerDiv = document.createElement("div");
    containerDiv.id = "container";
    containerDiv.style.position = "absolute";
    containerDiv.style.top = "-12";
    containerDiv.style.left = "45%";
    containerDiv.style.transform = "translateX(-50%)";
    containerDiv.style.zIndex = "9999";
    containerDiv.style.fontSize = "35px";
    document.body.insertBefore(containerDiv, document.body.firstChild);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.top = '100px'; // Adjust as needed
    buttonContainer.style.left = '50%';
    buttonContainer.style.transform = 'translateX(-50%)';
    buttonContainer.style.zIndex = '9999';

    const showAllTitlesButton = document.createElement('button');
    showAllTitlesButton.textContent = 'Visa tidigare program';
    showAllTitlesButton.classList.add('show-previous-button');
    showAllTitlesButton.style.fontSize = '18px';
    showAllTitlesButton.style.width = '632px'; // Set width to 630 pixels
    showAllTitlesButton.style.marginTop = '-40px'; // Move up by 20 pixels
    showAllTitlesButton.style.marginLeft = '-28px';
  
    buttonContainer.appendChild(showAllTitlesButton);

    containerDiv.appendChild(buttonContainer);

    showAllTitlesButton.addEventListener('click', showAllTitles);

    const channelHeaderDiv = document.createElement("div");
    channelHeaderDiv.id = "channel-header";
    channelHeaderDiv.style.textAlign = "center";
    channelHeaderDiv.style.fontSize = "50px";
    channelHeaderDiv.textContent = channelName;
    containerDiv.appendChild(channelHeaderDiv);

    isChannelHeaderDisplayed = true;
}

displayChannelHeader("SVT 1");

function setChannel(channelName) {
    myAPIurl = baseAPI + channelName + ".json";
    console.log(myAPIurl);
    console.log(myAPIdata);

    const listContainer = document.getElementsByClassName("col-sm-6");
    listContainer.innerHTML = "";

    const previousChannelHeader = document.getElementById("container");
    if (previousChannelHeader) {
        previousChannelHeader.remove();
    }

    loadData();

    displayChannelHeader(channelName);
}

function loadData(showAll) {
    fetch(myAPIurl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Fail");
            }
            return response.json();
        })
        .then(data => {
            myAPIdata = data;

            const titleElement = document.getElementById("js-title");
            const scheduleElement = document.getElementById("js-schedule");

            const container = document.querySelector(".col-sm-6");

            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

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

                const clonedTitle = titleElement.cloneNode(true);
                const clonedSchedule = scheduleElement.cloneNode(true);

                clonedTitle.style.fontSize = "25px";

                clonedTitle.style.textAlign = "left";
                clonedSchedule.style.textAlign = "left";

                clonedTitle.style.verticalAlign = "top";
                clonedTitle.style.marginBottom = "0";

                const startTime = new Date(item.start);
                const hours = startTime.getHours();
                const minutes = startTime.getMinutes();
                const formattedTime =
                    hours.toString().padStart(2, "0") +
                    ":" +
                    minutes.toString().padStart(2, "0");

                if (showAll || hours * 60 + minutes >= currentTime) {
                    clonedSchedule.textContent = formattedTime;
                    clonedTitle.textContent = item.name;

                    div.appendChild(clonedSchedule);
                    div.appendChild(clonedTitle);

                    container.appendChild(div);
                }
            });

            myAPIdata.splice(0, 99, length);
            console.log(myAPIdata.length);
            addMargin();
        })
        .catch(error => {
            console.error("Error: " + error.message);
        });
}

loadData();

function addMargin() {
    const elements = document.getElementsByClassName("col-sm-6 offset-sm-2");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.marginTop = "75px";
    }
}

function showAllTitles() {
    loadData(true);
}

function showDefaultTitles() {
    const titles = document.querySelectorAll('.js-title');
    const schedules = document.querySelectorAll('.js-schedule');

    for (let i = 0; i < titles.length; i++) {
        titles[i].style.display = 'block';
        schedules[i].style.display = 'block';
    }
}
