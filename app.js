const apiKey = "e5c70d2a66ae1d10e85c6dd2081e302d";
var data;
searchQuery = document.querySelector("input[type='text']");

//Add event listener to text input
searchQuery.addEventListener("keypress", function (event) {
    parseSearchInput(event);
});

//Parse text input and append to API link
function parseSearchInput(event) {
    if (event.which === 13) {
        if (searchQuery.value === "") {
            alert("Please enter a city.");
        }
        console.log(searchQuery.value);
        let url = "http://api.openweathermap.org/data/2.5/weather?q=" + searchQuery.value + "&appid=" + apiKey;
        //console.log(url);
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