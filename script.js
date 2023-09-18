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
        // Slide out the menu to the left
        let currentPosition = 0;
        const slideOutInterval = setInterval(() => {
            if (currentPosition > -200) {
                currentPosition -= 10; // Adjust the step as needed for desired speed
                menu.style.left = currentPosition + "px";
            } else {
                clearInterval(slideOutInterval);
                menu.style.left = "-200px"; // Ensure the menu is fully hidden
            }
        }, 10); // Adjust the interval for desired smoothness

        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
    } else {
        // Slide in the menu from the left
        let currentPosition = -200;
        const slideInInterval = setInterval(() => {
            if (currentPosition < 0) {
                currentPosition += 10; // Adjust the step as needed for desired speed
                menu.style.left = currentPosition + "px";
            } else {
                clearInterval(slideInInterval);
                menu.style.left = "0px"; // Ensure the menu is fully visible
            }
        }, 10); // Adjust the interval for desired smoothness

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
    containerDiv.style.position = "fixed";  // Set to fixed position
    containerDiv.style.top = "0px";
    containerDiv.style.left = "45%";
    containerDiv.style.transform = "translateX(-50%)";
    containerDiv.style.zIndex = "9999";
    containerDiv.style.fontSize = "35px";
    document.body.insertBefore(containerDiv, document.body.firstChild);
  
    const channelHeaderDiv = document.createElement("div");
    channelHeaderDiv.id = "channel-header";
    channelHeaderDiv.style.textAlign = "center";
    channelHeaderDiv.style.fontSize = "50px"; // font size
    channelHeaderDiv.textContent = channelName;
    containerDiv.appendChild(channelHeaderDiv);
  
    isChannelHeaderDisplayed = true;
  }
  

// Call displayChannelHeader function initially with a default channel name
displayChannelHeader("SVT 1"); // Default channel name


function setChannel(channelName) {
  myAPIurl = baseAPI + channelName + ".json";
  console.log(myAPIurl);
  console.log(myAPIdata);

  const listContainer = document.getElementsByClassName("col-sm-6");
  listContainer.innerHTML = "";

  // Remove the previous channel header if it exists
  const previousChannelHeader = document.getElementById("container");
  if (previousChannelHeader) {
      previousChannelHeader.remove();
  }

  loadData();

  // Display the channel header only if it hasn't been displayed before
  displayChannelHeader(channelName);
}

function loadData() {
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
  
        // Clear the existing content in the container
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
  
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
  
        // Sort myAPIdata by schedule start time in Ascending order
        myAPIdata.sort((a, b) => {
            return new Date(a.start) - new Date(b.start);
        });
  
        myAPIdata.forEach(item => {
          const div = document.createElement("div");
          div.classList.add("test");
          div.style.padding = "1px"; // Add padding of 5 pixels
          div.style.margin = "2px";
          div.style.border = "1px solid black"; // Add black border
          div.style.backgroundColor = "white";
          div.style.fontSize = "25px";
  
          const clonedTitle = titleElement.cloneNode(true);
          const clonedSchedule = scheduleElement.cloneNode(true);
  
          // Change the font size of the title
          clonedTitle.style.fontSize = "25px";
  
          // Align title and time to the left
          clonedTitle.style.textAlign = "left";
          clonedSchedule.style.textAlign = "left";
  
          // Align title with time
          clonedTitle.style.verticalAlign = "top";
          clonedTitle.style.marginBottom = "0"; // Remove bottom margin
  
          // Extract hours from item.start and display only hours
          const startTime = new Date(item.start);
          const hours = startTime.getHours();
          const minutes = startTime.getMinutes();
          const formattedTime =
            hours.toString().padStart(2, "0") +
            ":" +
            minutes.toString().padStart(2, "0");
  
          if (hours * 60 + minutes >= currentTime) {
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
