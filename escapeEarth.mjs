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

  //Fourth Challenge
  const JupiterMoons = await amountOfJupiterMoons();
  await submitAnswer(JupiterMoons);

  //Fifth Challenge
  const largestMoon = await largestMoonOfJupiter();
  await submitAnswer(largestMoon);

  //Sixth Challenge
  const plutoClassification = await findPlutoClassification();
  await submitAnswer(plutoClassification);
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

async function amountOfJupiterMoons() {
    const jupiter = await fetchSolarData("bodies/Jupiter");
    let amountOfMoons = 0;

    for (let i = 0; i < jupiter.moons.length; i++) {
        amountOfMoons = i + 1;
    }
    return amountOfMoons;
}

async function largestMoonOfJupiter() {
    const jupiter = await fetchSolarData("bodies/Jupiter");
    const moons = jupiter.moons;
    const moonURLs = [];
    for (let i = 0; i < moons.length; i++) {
        moonURLs.push(moons[i].rel);
    }

    let moonSizes = [];
    for (let i = 0; i < moonURLs.length; i++) {
        const response = await fetch(moonURLs[i]);
        const moonData = await response.json();
        moonSizes.push({Name: moonData.englishName, Size: moonData.meanRadius});
    }

    let largestMoonName = null;
    let largestMoonSize = 0;

    for (let i = 0; i < moonSizes.length; i++) {
        if(moonSizes[i].Size > largestMoonSize) {
            largestMoonSize = moonSizes[i].Size;
            largestMoonName = moonSizes[i].Name;
        }
    }

    return largestMoonName;
}

async function findPlutoClassification() {
   const pluto = await fetchSolarData("bodies/pluto");
   const bodyType = pluto.bodyType;
   return bodyType;
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