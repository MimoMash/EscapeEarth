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

}

start();