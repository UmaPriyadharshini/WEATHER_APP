const timeE1 = document.getElementById('time');
const dateE1 = document.getElementById('date');
const currentWeatherItemsE1 = document.getElementById('current-weather-item');
const timezone = document.getElementById('time-zone');
const countryE1 = document.getElementById('country');
const weatherforecastE1 = document.getElementById('weather-forecast');
const currentTempE1 = document.getElementById('current-temp');

const days = ['sunday','monday','tuseday','wenesday','thursday','friday','saturday'];

const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];


const API_KEY ='12c6cfce4f6f9ac00fcb20f1fa2a4079';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hours= time.getHours();
    const minutes = time.getMinutes();
    const hourIn12HrFormat= hours >= 13? hours %12 :hours
    const ampm = hours >=12 ? 'PM' : 'AM'
    
    
    timeE1.innerHTML = (hourIn12HrFormat < 10? '0'+hourIn12HrFormat : hourIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ''+ `<span id="am-pm">${ampm}</span>`

    dateE1.innerHTML = days[day] +','+ date+' '+ months[month]

} ,1000);

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude} = success.coords;
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)

        showWeatherData(data);
        })

    })

    
}


function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>`;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}


