const apiKey = "e5c70d2a66ae1d10e85c6dd2081e302d";
var data;
let searchQuery = document.querySelector("input[type='text']");
let loc = document.getElementById("location");
let temp = document.getElementById("temp");
let desc = document.getElementById("desc");
let humidity = document.getElementById("humidity");
let content = document.querySelector(".content");
let dateTime = document.querySelector("#dateTime");
let body = document.getElementsByTagName("body")[0];

function Weather(city, cond, humidity, loc, timeStamp, temp, wind){
    this.city = city;
    this.cond = cond;
    this.desc = desc;
    this.humidity = humidity;
    this.loc = loc;
    this.timeStamp = timeStamp;
    this.temp = temp;
    this.wind = wind;
};


setBackground();
content.style.opacity = 0;


function setBackground(){
    let hours = new Date().getHours();
    if (hours > 6 && hours < 20){
        body.classList.add("daytime");
    }
    else{
        body.classList.add("nighttime");
    }
}

//console.log(getDateTime());
//Add event listener to text input
searchQuery.addEventListener("keypress", function (event) {
    parseSearchInput(event);
});


//Parse text input and append to API link
function parseSearchInput(event) {
    if (event.which === 13) {
        content.style.opacity = 1;        
        if (searchQuery.value === "") {
            alert("Please enter a city.");
        }
        console.log(searchQuery.value);
        let url = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchQuery.value + "&appid=" + apiKey;
        console.log(url);
        httpRequest(url);
    }
}

//Asyncronous AJAX request to API for 5 day / 3 hour weather info
function httpRequest(url) {
    var httpReq = new XMLHttpRequest();
    httpReq.onload = function () {
        if (httpReq.status == 200 && httpReq.readyState == 4) {
            console.log("Status OK");
            data = JSON.parse(httpReq.responseText);
            parseCurrentData();
            //console.log(data);
            //document.getElementById("temperature").textContent = data.main.temp;
        }
        else {
            console.log("Status error");
        }
    }
    //Open a GET request with the constructed API link; send request
    httpReq.open("GET", url);
    httpReq.send();
}

function parseCurrentData() {
    let set1 = new Weather();
    set1.desc = data.list[0].weather[0].description;
    set1.humidity = "Humidity: " + data.list[0].main.humidity + "%";
    set1.loc = data.city.name + ", " + data.city.country;
    set1.temp = "  " + parseInt(data.list[0].main.temp - 273) + "°";
    set1.wind = "Wind: " + data.list[0].wind.speed + " MPH";
    desc.innerHTML = set1.desc;
    humidity.innerHTML = set1.humidity;
    loc.innerHTML = set1.loc;
    temp.innerHTML = set1.temp;
    wind.innerHTML = set1.wind;
    dateTime.innerHTML = getDateTime();
   
}

function getDateTime() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date + ' ' + time;
    return dateTime;
}