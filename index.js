let usertab = document.querySelector("[user-weather]");
let searchtab = document.querySelector("[search-weather]");
let weathercontainer = document.querySelector(".weather-container");
let grantlocation = document.querySelector(".grant-location");
let grantaccessbtn = document.querySelector("[grantbutton]");
let searchform = document.querySelector(".search-form");
let loadingcontainer = document.querySelector(".loading-container");
let userinfocontainer = document.querySelector(".weather-info");
let API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currenttab = usertab;
currenttab.classList.add("current-tab");
getsessionstorage();
function switchtab(clickedtab)
{
    if(clickedtab!=currenttab)
    {
        currenttab.classList.remove("current-tab");
        currenttab = clickedtab;
        currenttab.classList.add("current-tab");
        if (!searchform.classList.contains('active'))
        {
            userinfocontainer.classList.remove('active');
            grantlocation.classList.remove('active');
            searchform.classList.add('active');
        }
        else {
            searchform.classList.remove('active');
            userinfocontainer.classList.remove('active');
            getsessionstorage();
        }
    }
}
function getsessionstorage()
{
    let localcordinates = sessionStorage.getItem('user-cordinates');
    if (!localcordinates)
    {
        grantlocation.classList.add('active');
        }
    else
    {
        let cordinates = JSON.parse(localcordinates);
        fetchuserweather(cordinates);
        }
}
usertab.addEventListener('click', () => {
    switchtab(usertab);
});
searchtab.addEventListener('click', () => {
    switchtab(searchtab);
});
 async function fetchuserweather(cordinates)
{
    const {lat,lon} = cordinates;
    grantlocation.classList.remove('active');
    loadingcontainer.classList.add('active');
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        let data = await response.json();
        loadingcontainer.classList.remove('active');
        userinfocontainer.classList.add('active');
        renderweatherdata(data);
        console.log(data);
    }
    catch (e)
    {

    }
}
function renderweatherdata(weatherinfo)
{
    let city = document.querySelector("[city-name]");
    let countryicon = document.querySelector("[country-flag]");
    let description = document.querySelector("[ weather-description]");
    let weathericon = document.querySelector("[weather-icon]");
    let temprature = document.querySelector("[temp-data]");
    let windspeed = document.querySelector("[wind-speed]");
    let humidity = document.querySelector("[ humidity]");
    let cloud = document.querySelector("[clouds]");
    city.innerText = weatherinfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherinfo?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`
    temprature.innerText = `${weatherinfo?.main?.temp}°c`;
    windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherinfo?.main?.humidity}%`;
    cloud.innerText = `${weatherinfo?.clouds?.all}%`;

}
function getlocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else {
        alert("no geolocation functionality available");
    }
}
function showPosition(position)
{
    let cordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-cordinates", JSON.stringify(cordinates));
    fetchuserweather(cordinates);
}
grantaccessbtn.addEventListener('click', getlocation);
let searchinput = document.querySelector("[ cityinput]");
searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = searchinput.value;
    if (city === "")
        return;
    fetchsearchinfo(city);
});
 async function fetchsearchinfo(city)
{
    grantlocation.classList.remove('active');
    loadingcontainer.classList.add('active');
    userinfocontainer.classList.remove('active');
    try {
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        let data = await response.json();
        loadingcontainer.classList.remove('active');
        userinfocontainer.classList.add('active');
        renderweatherdata(data);
     }
     catch (e)
    {
        
     }
}