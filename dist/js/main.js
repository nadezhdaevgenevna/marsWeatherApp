window.addEventListener("DOMContentLoaded", () => {
  const API_URL =
    "https://mars.nasa.gov/rss/api/?feed=weather&category=insight_temperature&feedtype=json&ver=1.0";

  const btn = document.querySelector(".show-panel");
  const close_btn = document.querySelector(".close-btn");
  const popup = document.querySelector(".previous-days");
  const main_popup = document.querySelector(".wrapper-block");
  const lastSolElement = document.querySelector("[data-last-sol]");
  const lastDateElement = document.querySelector("[data-last-date]");
  const lastTempHighElement = document.querySelector("[data-last-temp-high]");
  const lastTempLowElement = document.querySelector("[data-last-temp-low]");
  const windSpeedElement = document.querySelector("[data-wind-speed]");
  const previousSolsTemplate = document.querySelector(
    "[data-previous-sols-template]"
  );
  const previousSolsContainer = document.querySelector("[data-previous-days]");
  const metricChange = document.getElementById("check");

  btn.addEventListener("click", () => {
    popup.style.display = "flex";
    main_popup.style.cssText = `animation:slide-in .5s ease; animation-fill-mode:
    forwards; `;
  });

  close_btn.addEventListener("click", () => {
    main_popup.style.cssText = `animation:slide-out .5s ease; animation-fill-mode:
    forwards; `;
    setTimeout(() => {
      popup.style.display = "none";
    }, 500);
  });

  window.addEventListener("click", (e) => {
    if (e.target == document.querySelector(".previous-days")) {
      main_popup.style.cssText = `animation:slide-out .5s ease; animation-fill-mode:
      forwards; `;
      setTimeout(() => {
        popup.style.display = "none";
      }, 500);
    }
  });

  let selectedSolIndex;
  getWeather().then((sols) => {
    selectedSolIndex = sols.length - 1;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();

    metricChange.addEventListener("change", () => {
      updateUnits();
      displaySelectedSol(sols);
      displayPreviousSols(sols);
    });
  });

  function updateUnits() {
    const templateUnits = document.querySelectorAll("[data-temp-unit]");
    metricChange.addEventListener("change", () => {
      if (metricChange.checked) {
        templateUnits.forEach((item) => (item.innerHTML = "°F"));
        units.forEach((i) => (i.innerText = "°F"));
      } else {
        templateUnits.forEach((i) => (i.innerText = "°C"));
      }
    });
  }
  function displaySelectedSol(sols) {
    const selectedSol = sols[selectedSolIndex];
    lastSolElement.innerHTML = selectedSol.sol;
    lastDateElement.innerHTML = displayDate(selectedSol.date);
    lastTempHighElement.innerHTML = displayTemperature(selectedSol.maxTemp);
    lastTempLowElement.innerHTML = displayTemperature(selectedSol.minTemp);
    windSpeedElement.innerHTML = displaySpeed(selectedSol.windSpeed);
  }

  function displayPreviousSols(sols) {
    while (previousSolsContainer.lastChild.id !== "close-btn") {
      previousSolsContainer.removeChild(previousSolsContainer.lastChild);
    }

    sols.forEach((solData) => {
      const solContainer = previousSolsTemplate.content.cloneNode(true);
      solContainer.querySelector("[data-sol]").innerHTML = solData.sol;
      solContainer.querySelector("[data-day]").innerHTML = displayDate(
        solData.date
      );
      solContainer.querySelector("[data-temp-high]").innerHTML =
        displayTemperature(solData.maxTemp);
      solContainer.querySelector("[data-temp-low]").innerHTML =
        displayTemperature(solData.minTemp);
      updateUnits();
      solContainer.querySelector("[data-wind-speed]").innerHTML = displaySpeed(
        solData.windSpeed
      );

      if (fahr()) {
        solContainer.querySelectorAll("[data-temp-unit]").forEach((it) => {
          it.innerText = "°F";
        });
      } else {
        solContainer.querySelectorAll("[data-temp-unit]").forEach((it) => {
          it.innerText = "°C";
        });
      }

      previousSolsContainer.appendChild(solContainer);
    });
    previousSolsContainer.lastChild.classList.add("block-last");
  }

  function getWeather() {
    return fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const { sol_keys, validity_checks, ...solData } = data;
        return Object.entries(solData).map(([sol, data]) => {
          return {
            sol: sol,
            maxTemp: data.AT.mx,
            minTemp: data.AT.mn,
            windSpeed: data.HWS.av,
            date: new Date(data.First_UTC),
          };
        });
      });
  }

  function fahr() {
    return metricChange.checked;
  }

  function displaySpeed(speed) {
    return Math.round(speed);
  }

  function displayDate(date) {
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
    });
  }

  function displayTemperature(temperature) {
    let returnTemp = temperature;
    if (fahr()) {
      returnTemp = 1.8 * temperature + 32;
    }
    return Math.round(returnTemp);
  }
});
