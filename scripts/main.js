import tabJoursEnOrdre from "./Utilitaire/gestionTemps.js";
// console.log("DEPUIS MAIN JS:" + tabJoursEnOrdre);

const CLEFAPI = "7cda005e3ff4c8054e901f491045ddcc";
let resultatsAPI;

const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-prevision-nom");
const tempPourH = document.querySelectorAll(".heure-prevision-valeur");
const joursDiv = document.querySelectorAll(".jour-prevision-nom");
const tempJoursDiv = document.querySelectorAll(".jour-prevision-temp");
const imgIcone = document.querySelector(".logo-meteo");
const chargementContainer = document.querySelector(".overlay-icone-chargement");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      //console.log(position);
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
      AppelAPI(long, lat);
    },
    () => {
      alert(
        `Vous avez refusé la géolocalisation, l'application ne peur pas fonctionner, veuillez l'activer.!`
      );
    }
  );

  function AppelAPI(long, lat) {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`
    )
      .then((reponse) => {
        return reponse.json();
      })
      .then((data) => {
        console.log(data);

        resultatsAPI = data;
        temps.innerText = resultatsAPI.current.weather[0].description;
        temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°`;
        localisation.innerText = resultatsAPI.timezone;

        let heureActuelle = new Date().getHours();
        for (let i = 0; i < heure.length; i++) {
          let heureIncr = heureActuelle + i * 3;
          if (heureIncr > 24) {
            heure[i].innerText = `${heureIncr - 24} h`;
          } else if (heureIncr === 24) {
            heure[i].innerText = "00 h";
          } else {
            heure[i].innerText = `${heureIncr} h`;
          }
        }
        for (let h = 0; h < tempPourH.length; h++) {
          tempPourH[h].innerText = `${Math.trunc(
            resultatsAPI.hourly[h * 3].temp
          )}°`;

          // trois premières lettre des jours
          for (let gt = 0; gt < tabJoursEnOrdre.length; gt++) {
            joursDiv[gt].innerText = tabJoursEnOrdre[gt].slice(0, 3);
          }

          //Ajouter les températures par jour
          for (let temp = 0; temp < 7; temp++) {
            tempJoursDiv[temp].innerText = `${Math.trunc(
              resultatsAPI.daily[temp + 1].temp.day
            )}°`;
          }

          // Logo pour affichage dynamique jour ou nuit de 6 heures du matin à < 21 heures
          if (heureActuelle >= 6 && heureActuelle < 21) {
            imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`;
          } else {
            imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`;
          }
          chargementContainer.classList.add("disparition");
        }
      });
  }
}
