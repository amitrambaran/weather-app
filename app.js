const apiKey = "e5c70d2a66ae1d10e85c6dd2081e302d";
var data; 

retrieveData();

function retrieveData(){
    searchQuery = document.querySelector("input[type='text']");
    searchQuery.addEventListener("keypress", function(e){
        if(e.which === 13){
            if(searchQuery.value === ""){
                alert("Please enter a city.");
            }
            console.log(searchQuery.value);
            let url = "http://api.openweathermap.org/data/2.5/weather?q=" + searchQuery.value + "&appid=" + apiKey;
            //console.log(url);
            httpRequest(url);
        }

    });

}

function httpRequest(url){
    var httpReq = new XMLHttpRequest();

    httpReq.onload = function(){
        if (httpReq.status == 200 && httpReq.readyState == 4){
            console.log("Status OK");
            data = JSON.parse(httpReq.responseText);
            console.log(data);
            document.getElementById("temperature").textContent = data.main.temp;
        }
        else{
            console.log("Status error");
        }
    }

    httpReq.open("GET", url);
    httpReq.send();
}