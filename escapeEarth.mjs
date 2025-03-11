import fetch from 'node-fetch';

const EMAIL = "mohammaa@uia.no"; 
const RIS = "https://spacescavanger.onrender.com";
const API = "https://api.le-systeme-solaire.net/rest/";

async function start() {
  console.log("Starting mission");

  const startResponse = await fetch(`${RIS}/start?player=${EMAIL}`);

  const mission = await startResponse.json();
  console.log("Mission received:", mission.message);
  console.log("Challenge:", mission.challenge);

  //First Challenge
  const pin = await calculateSunRadius();
  await submitAnswer(pin);
  
  //Second Challenge
  const earthsAxialTilt = await findEarthAxialTilt();
  console.log("Earth's Axial Tilt:", earthsAxialTilt);
  await fetchAllPlanetsTilt();
  await submitAnswer("Mars");

  //Third Challenge
  const planetWithShortestDay = await findPlanetWithShortestDay();
  await submitAnswer(planetWithShortestDay);
}

async function calculateSunRadius() {
    const response = await fetchSolarData("bodies/Sun");
    const pin = response.equaRadius - response.meanRadius;
    return pin;
}

async function findEarthAxialTilt() {
    const response = await fetchSolarData("bodies/Earth");
    const axialTilt = response.axialTilt;
    return axialTilt;
}

async function findPlanetWithShortestDay() {
    const bodies = await fetchSolarData("bodies");
    const planets = bodies.bodies.filter((body) => body.isPlanet);
    const dayPeriodInHours = [];
    for (let i = 0; i < planets.length; i++) {
        dayPeriodInHours.push({Planet: planets[i].englishName, DayCycle: planets[i].sideralRotation})
    }

    let shortestDay = Infinity;
    let planetWithShortestDay = null;

    for (let i = 0; i < dayPeriodInHours.length; i++) {
        if (Math.abs(dayPeriodInHours[i].DayCycle) < shortestDay) {
            shortestDay = Math.abs(dayPeriodInHours[i].DayCycle);
            planetWithShortestDay = dayPeriodInHours[i].Planet;
        }
    }

    return planetWithShortestDay;
}

async function fetchAllPlanetsTilt() {
    const bodies = await fetchSolarData("bodies");
    const planets = bodies.bodies.filter((body) => body.isPlanet);
    const planetsAxialTilts = [];
    for (let i = 0; i < planets.length; i++) {
        planetsAxialTilts.push({Planet: planets[i].englishName, AxialTilt: planets[i].axialTilt})
    }
    console.log(planetsAxialTilts); 
}

async function submitAnswer(answer) {
    console.log("Submitting answer:", answer);
    
    const response = await fetch(`${RIS}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, player: EMAIL })
    });
    
    const result = await response.json();
    console.log('Response received:', result);
    return result;
  }

async function fetchSolarData(ending) {
    const response = await fetch(`${API}${ending}`);
    const data = await response.json();
    return data;
  }

start();