const fs = require("fs").promises;

init();

async function init() {
  await createFile()

  console.log("Question thirteen - States With More Cities");
  console.log(await getStatesWithMoreOrLessCities(true));

  console.log("Question four - States With Smaller Cities");
  console.log(await getStatesWithMoreOrLessCities(false));

  console.log("Question five - Bigger Name Cities");
  console.log(await getBiggerOrSmallerNameCities(true));

  console.log("Question six - Smaller Name Cities");
  console.log(await getBiggerOrSmallerNameCities(false));

  console.log("Question seven - Bigger City Name");
  console.log(await getBiggerOrSmallerCityName(true));

  console.log("Question eight - Smaller City Name");
  console.log(await getBiggerOrSmallerCityName(false));
}

// Question One
async function createFile() {
  let data = await fs.readFile("./files/Estados.json");
  const states = JSON.parse(data);

  data = await fs.readFile("./files/Cidades.json");
  const cities = JSON.parse(data);

  for (state of states) {
    const stateCities = cities.filter((city) => city.Estado == state.ID);
    await fs.writeFile(
      `./states/${state.Sigla}.json`,
      JSON.stringify(stateCities)
    );
  }
}

// Question Two
async function getCitiesCount(uf) {
  const data = await fs.readFile(`./states/${uf}.json`);
  const cities = JSON.parse(data);
  return cities.length;
}

async function getStatesWithMoreOrLessCities(more) {
  const states = JSON.parse(await fs.readFile("./files/Estados.json"));
  const list = [];

  for (state of states) {
    const count = await getCitiesCount(state.Sigla);
    list.push({ uf: state.Sigla, count });
  }

  list.sort((a, b) => {
    if (a.count < b.count) return 1;
    else if (a.count > b.count) return -1;
    else return 0;
  });

  const result = [];
  if (more) {
    list
      .slice(0, 5)
      .forEach((item) => result.push(item.uf + " - " + item.count));
  } else {
    list.slice(-5).forEach((item) => result.push(item.uf + " - " + item.count));
  }

  return result;
}

async function getBiggerOrSmallerNameCities(bigger) {
  const states = JSON.parse(await fs.readFile("./files/Estados.json"));
  const result = [];

  for (state of states) {
    let city;
    if (bigger) {
      city = await getBiggerName(state.Sigla);
    } else {
      city = await getSmallerName(state.Sigla);
    }

    result.push(`${city.Nome} - ${state.Sigla}`);
  }
  return result;
}

async function getBiggerName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) {
      result = city;
    } else if (city.Nome.length > result.Nome.length) {
      result = city;
    } else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() < result.Nome.toLowerCase()
    )
      result = city;
  });

  return result;
}

async function getSmallerName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) {
      result = city;
    } else if (city.Nome.length < result.Nome.length) {
      result = city;
    } else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() < result.Nome.toLowerCase()
    )
      result = city;
  });

  return result;
}

async function getBiggerOrSmallerCityName(bigger) {
  const states = JSON.parse(await fs.readFile("./files/Estados.json"));
  const list = [];

  for (state of states) {
    let city;
    if (bigger) {
      city = await getBiggerName(state.Sigla);
    } else {
      city = await getSmallerName(state.Sigla);
    }
    list.push({ name: city.Nome, uf: state.Sigla });
  }
  let result = list.reduce((prev, current) => {
    if (bigger) {
      if (prev.name.length > current.name.length) return prev;
      else if (prev.name.length < current.name.length) return current;
      else
        return prev.name.toLowerCase() < current.name.toLowerCase()
          ? prev
          : current;
    } else {
      if (prev.name.length < current.name.length) return prev;
      else if (prev.name.length > current.name.length) return current;
      else
        return prev.name.toLowerCase() < current.name.toLowerCase()
          ? prev
          : current;
    }
  });
  return (result = `${result.name} " - " ${result.uf}`);
}
