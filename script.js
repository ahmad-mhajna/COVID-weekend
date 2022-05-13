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
  button.addEventListener("click", (event) => {
    getregions(event.target.getAttribute("data-region"));
  });
});

function search(event) {
  if (event.target.value === "") resultcontainer.innerText = "";
  else {
    const searchinput = event.target.value.toLowerCase();
    const countries = Object.keys(countryObj);
    const searchresult = countries.filter((country) =>
      country.toLowerCase().includes(searchinput)
    );
    genresult(searchresult);
  }
}

function genresult(resultarr) {
  if (resultarr === "emptysearch") resultcontainer.innerText = "";
  resultarr.forEach((result) => {
    const button = document.createElement("button");
    button.classList.add("country-btn");
    button.innerText = result;
    button.addEventListener("click", selectCountry);
    resultcontainer.append(button);
  });
}
async function selectCountry(event) {
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
  } else {
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
  }
  Chartdata = Object.values(regionobj);
  genChart();
}
getregions("asia");
