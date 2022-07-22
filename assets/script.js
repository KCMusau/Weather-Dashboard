
const API_KEY = "11ba2df651e1872f1628a9c9e0e70d35"; // 

const CITY_API = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

const FIVE_DAY_API = (lat, long) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=${API_KEY}`;

const UVI_API = (lat,long) => `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&exclude=hourly,daily&appid=${API_KEY}`;




var LAT  = null; 
var LONG = null;
var TEMP = null; 
var WIND = null;
var HUMID = null;
var UV = null;
var CITY = "Chicago"; 

// Sets current weather
function setWeather(json){
    LAT = json.coord.lat; 
    LONG = json.coord.lon;
    WIND = json.wind.speed;
    HUMID = json.main.humidity;



    fetch(FIVE_DAY_API(LAT, LONG))
    .then(res => res.json())
    .then(setFiveDay)
    .then(  () => {
         fetch(UVI_API(LAT, LONG))
        .then(res => res.json())
        .then(setUVInformation)
        .then(setUI); 
    });  


}

// Sets UVI
function setUVInformation(json) {
    TEMP = json.current.temp; 
    UV = json.current.uvi; 
}

// Sets 5 day forecast
function setFiveDay(json){



    let result = ""; 

    for (let i = 0; i < json.list.length; i = i + 8) {

        let obj = json.list[i]; 
     
    let wind = obj.wind.speed; 
    let humidity = obj.main.humidity; 
    let temperature =  obj.main.temp; 
    let icon = obj.weather[0].icon;

    let templateDayWeather = `<div class="weather">
                <h3>${obj.dt_txt.split(" ")[0]}</h3>
                <div>Temperature: ${temperature} </div>
                <div>Wind: ${wind} </div>
                <div>Humidity: ${humidity} </div>
                <div>Icon: <img src='http://openweathermap.org/img/wn/${icon}.png'> </div>
         
            </div>`; 

            result += templateDayWeather; 
    }
    
 $("#week").html(result); 
}

//sets UI
function setUI() {
    $("#uv_index").text(UV); 
    $("#temp").text(TEMP); 
    $("#humidity").text(HUMID); 
    $("#wind").text(WIND);   
    
}

function updateCityName() {
    $("#city").text(CITY); 
    // Updates to local storage 
    updateLocalStorage(); 
}
// Saves recent city searches 
function updateLocalStorage() {

    
    let cities = localStorage.getItem("cities"); 
    if (!cities){
        cities = []; 
    }else {
        cities = JSON.parse(cities); 
    }

    // Adds user's city
    cities.push(CITY); 

    // Filters through
    cities = [...new Set(cities)]; 

    //Saves back to localstorage
    localStorage.setItem("cities", JSON.stringify(cities)); 
    

    // Put list of cities in UI
    $("#search-history").html( cities.map(c => `<option value="${c}">`)); 

}



function search() {
    CITY = $("#search-input").val() == "" ? "Chicago" : $("#search-input").val();
    
    fetch(CITY_API(CITY))
            .then(res => res.json())
            .then(setWeather)
            .then(updateCityName); 
}


search(); // Default search is executed current Weather for Chicago



