import fetch from 'node-fetch';

const EMAIL = "mohammaa@uia.no"; 
const RIS = "https://spacescavanger.onrender.com";
const API = "https://api.le-systeme-solaire.net/rest/bodies/";

async function start() {
  console.log("Starting mission");

  const startResponse = await fetch(`${RIS}/start?player=${EMAIL}`);

  const mission = await startResponse.json();
  console.log("Mission received:", mission.message);
  console.log("Challenge:", mission.challenge);

  fetchSolarData("Sun");
}

async function fetchSolarData(englishName) {
    console.log("Fetching solar system data");
    const response = await fetch(`${API}/${englishName}`);
    
    const data = await response.json();
    console.log(data)
  }

start();