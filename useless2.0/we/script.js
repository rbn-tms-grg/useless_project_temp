const planets = [
    {
        name: "Mars",
        weatherElement: document.getElementById("marsWeather"),
        tempElement: document.getElementById("marsTemp"),
        extremeEvent: "Dust Storm"
    },
    {
        name: "Saturn",
        weatherElement: document.getElementById("saturnWeather"),
        tempElement: document.getElementById("saturnTemp"),
        extremeEvent: "Super Windstorm"
    },
    {
        name: "Pluto",
        weatherElement: document.getElementById("plutoWeather"),
        tempElement: document.getElementById("plutoTemp"),
        extremeEvent: "Extreme Cold"
    }
];

function getRandomWeather() {
    const weatherTypes = ["Sunny", "Cloudy", "Windy", "Icy", "Stormy"];
    return weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
}

function getRandomTemperature(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updatePlanetWeather(planet, minTemp, maxTemp) {
    const newWeather = getRandomWeather();
    const newTemp = getRandomTemperature(minTemp, maxTemp);

    planet.weatherElement.innerText = newWeather;
    planet.tempElement.innerText = `${newTemp}°C`;

    if ((newWeather === "Stormy" && planet.name === "Mars") ||
        (newWeather === "Windy" && planet.name === "Saturn" && newTemp < -160) ||
        (newTemp < -220 && planet.name === "Pluto")) {
        alert(`Warning on ${planet.name}: ${planet.extremeEvent}!`);
    }
}

function updateAllWeather() {
    updatePlanetWeather(planets[0], -130, -50); // Mars: -130°C to -50°C
    updatePlanetWeather(planets[1], -180, -130); // Saturn: -180°C to -130°C
    updatePlanetWeather(planets[2], -240, -210); // Pluto: -240°C to -210°C
}

// Update every 5 seconds to simulate "live" notifications
setInterval(updateAllWeather, 5000);
