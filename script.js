const countryObj = {};
const searchinput = document.querySelector("input");
const resultcontainer = document.querySelector(".result-container");
const regionButtons = document.querySelectorAll(".region-btn");
const getData = async () => {
  const response = await axios.get(
    "https://intense-mesa-62220.herokuapp.com/restcountries.herokuapp.com/api/v1"
  );
  response.data.forEach((country) => {
    countryObj[country.name.common] = country.cca2;
  });
};

getData();

searchinput.addEventListener("input", search);
regionButtons.forEach((button) => {
  button.addEventListener("click", selectregion);
});
function selectregion(event) {
  const previousbutton = document.querySelector("#selected");
  const currentbutton = event.target;
  previousbutton.id = "";
  currentbutton.id = "selected";
  getregions(event.target.getAttribute("data-region"));
}

function search(event) {
  resultcontainer.innerText = "";
  if (event.target.value !== "") {
    const searchinput = event.target.value.toLowerCase();
    const countries = Object.keys(countryObj);
    const searchresult = countries.filter((country) =>
      country.toLowerCase().includes(searchinput)
    );
    genresult(searchresult);
  } else resultcontainer.style.display = "none";
}

function genresult(resultarr) {
  if (resultarr.length < 1) resultcontainer.innerText = "";
  else resultcontainer.style.display = "grid";
  resultarr.forEach((result) => {
    const button = document.createElement("button");
    button.classList.add("country-btn");
    button.innerText = result;
    button.addEventListener("click", selectCountry);
    resultcontainer.append(button);
  });
}
async function selectCountry(event) {
  resultcontainer.style.display = "none";
  searchinput.value = event.target.innerText;
  resultcontainer.innerText = "";
  const country = countryObj[event.target.innerText];
  const response = await axios.get(
    ` https://intense-mesa-62220.herokuapp.com/corona-api.com/countries/${country}`
  );
  const latestData = response.data.data.latest_data;
  delete latestData.calculated;
  Chartdata = Object.values(latestData);
  genChart();
}
async function getregions(region) {
  let regionobj = {
    deaths: 0,
    confirmed: 0,
    recovered: 0,
    critical: 0,
  };
  if (!region) {
    if (!window.localStorage.getItem("world")) {
      let response = await axios.get(
        "https://intense-mesa-62220.herokuapp.com/corona-api.com/countries"
      );

      await Promise.all(
        response.data.data.map((country) => {
          regionobj.deaths += country.latest_data.deaths;
          regionobj.confirmed += country.latest_data.confirmed;
          regionobj.recovered += country.latest_data.recovered;
          regionobj.critical += country.latest_data.critical;
        })
      );
      window.localStorage.setItem("world", JSON.stringify(regionobj));
    } else {
      regionobj = JSON.parse(window.localStorage.getItem("world"));
    }
  } else {
    console.log(region);
    if (!window.localStorage.getItem(region)) {
      const response = await axios.get(
        `https://intense-mesa-62220.herokuapp.com/restcountries.herokuapp.com/api/v1/region/${region}`
      );

      try {
        await Promise.all(
          response.data.map(async (country) => {
            const countryData = await axios.get(
              `https://intense-mesa-62220.herokuapp.com/corona-api.com/countries/${country.cca2}`
            );
            regionobj.deaths += countryData.data.data.latest_data.deaths;
            regionobj.confirmed += countryData.data.data.latest_data.confirmed;
            regionobj.recovered += countryData.data.data.latest_data.recovered;
            regionobj.critical += countryData.data.data.latest_data.critical;
          })
        );
      } catch (e) {
        console.error(e);
      }
      window.localStorage.setItem(region, JSON.stringify(regionobj));
    } else {
      regionobj = JSON.parse(window.localStorage.getItem(region));
    }
  }
  Chartdata = Object.values(regionobj);
  genChart();
}
getregions();
