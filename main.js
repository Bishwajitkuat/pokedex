const logoImg = document.querySelector("#logoImg");
const searchNameId = document.querySelector("#search_name_id");
const pokeContainer = document.querySelector(".poke_container");
const searchBtnAll = document.querySelectorAll(".search_btn button");
const searchType = document.querySelector(".search_type_form");
const welcomeDiv = document.querySelector(".welcome_div");
const goToTop = document.querySelector("#go_to_top");
// GLOBAL VARIABLE
let pokeList = []; // store all pokemon after selecting a pokemon gen.
let selectedTypes = []; // store updated user choice of types
let searchValue = ""; // store updated user choice fo name
const typeList = [
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "steel",
  "water",
];
// dynamically adding type checkboxes
typeList.forEach((item) => {
  const html = `
  <div>
  <input class="type_input" type="checkbox" id="${item}" />
  <label for="${item}"><img src="img/${item}.png" alt="" /></label>
</div>
  `;
  searchType.insertAdjacentHTML("afterbegin", html);
});

const genList = {
  gen_1: { limit: 151, offset: 0 },
  gen_2: { limit: 100, offset: 151 },
  gen_3: { limit: 135, offset: 251 },
  gen_4: { limit: 107, offset: 386 },
  gen_5: { limit: 156, offset: 493 },
  gen_6: { limit: 72, offset: 649 },
  gen_7: { limit: 88, offset: 721 },
  gen_8: { limit: 96, offset: 809 },
  gen_9: { limit: 105, offset: 905 },
  gen_all: { limit: 1010, offset: 0 },
};
function getPokeGenFromId(id) {
  if (id <= 151) return "G I";
  else if (id <= 251) return "G II";
  else if (id <= 386) return "G III";
  else if (id <= 493) return "G IV";
  else if (id <= 649) return "G V";
  else if (id <= 721) return "G VI";
  else if (id <= 809) return "G VII";
  else if (id <= 905) return "G VIII";
  else if (id > 905) return "G IX";
}

async function getPokemon(limit, offset) {
  // resetting search by name and type input fields before rendering new generations
  searchNameId.value = "";
  pokeContainer.innerHTML = "";
  // resetting type input if selected before generations btn click
  document.querySelectorAll("form input").forEach((item) => {
    item.checked = false;
    item.closest("div").style.filter = "brightness(40%)";
  });
  pokeList = [];
  // featch for all pokemon by generations
  const pokeByGenUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(pokeByGenUrl);
  const dataByGen = await response.json();
  const pokeListByGen = dataByGen.results;
  // responst is a list containing pokemon name and url for detail, 2nd featch done for more info
  pokeListByGen.forEach(async (item) => {
    const pokeName = item.name;
    const res = await fetch(item.url);
    const data = await res.json();
    //function returns a valid url for img
    const pokeImg = validImagUrl(data.sprites);
    const pokeId = data.id;
    const pokeGenDisplay = getPokeGenFromId(pokeId);
    // making a list types for each pokemon out of an object
    const pokeTypes = data.types.map((item) => item.type.name);
    // making a string which contain all the img tags of types
    const pokeTypesImg = data.types
      .map((item) => {
        const typeName = item.type.name;
        return `<img src="img/${typeName}.png" alt="" />`;
      })
      .join(" ");
    // constraction of object for each pokemon and push into global pokeList for search by name and type
    const pokeInfo = {
      name: pokeName,
      img: pokeImg,
      id: pokeId,
      types: pokeTypes,
      typesImg: pokeTypesImg,
      gen: pokeGenDisplay,
    };
    pokeList.push(pokeInfo);
    // render one by one works better than rendering all at last
    renderPoke(pokeName, pokeImg, pokeGenDisplay, pokeId, pokeTypesImg);
  });
}

// take the object containeing img url return a valid img url in order of preference
function validImagUrl(obj) {
  if (obj.other.dream_world.front_default)
    return obj.other.dream_world.front_default;
  else if (obj.other.home.front_default) return obj.other.home.front_default;
  else if (obj.front_default) return obj.front_default;
}

// render list of pokemon
function renderPokeList(list) {
  pokeContainer.innerHTML = "";
  list.forEach((item) => {
    renderPoke(item.name, item.img, item.gen, item.id, item.typesImg);
  });
}
// render each pokemon
function renderPoke(name, imgUrl, gen, id, pokeType) {
  const html = `
    <div class="cards">
      <p class="poke_gen">${gen}</p>
      <img src="${imgUrl}" alt="poke imgs" class="poke_img" />
      <div class="poke_identity">
        <p id="poke_id">#${id}</p>
        <p class="poke_name">${name}</p>
        <p class="poke_type">${pokeType}</p>
      </div>
        </div>`;

  pokeContainer.insertAdjacentHTML("beforeend", html);
}
// event listener for generations btn
searchBtnAll.forEach((item) => {
  item.addEventListener("click", (e) => {
    // remove welcome message when generations button is clicked
    welcomeDiv.innerHTML = "";
    e.preventDefault();
    searchBtnAll.forEach((item) => (item.style.backgroundColor = "#808088"));
    e.target.style.backgroundColor = "#adff2f";
    pokeGen = e.target.id;
    const pokeGenDisplay = genList[pokeGen].gen;
    const pokeLimit = genList[pokeGen].limit;
    const pokeOffset = genList[pokeGen].offset;
    getPokemon(pokeLimit, pokeOffset);
  });
});
// fileter a pokemon list by name
function filterByName(list, searchValue) {
  return searchValue.length > 0
    ? list.filter((item) => item.name.includes(searchValue))
    : list;
}
// filter a pokemon list by type
function filterByType(list) {
  return list.filter((obj) => {
    return selectedTypes.every((item) => obj.types.includes(item));
  });
}
// event listener for any input change in search by name input field. first filter by name then filter by type if selected
searchNameId.addEventListener("input", (e) => {
  searchValue = e.target.value.toLowerCase();
  e.preventDefault();
  const pokeFilterListByName = filterByName(pokeList, searchValue);
  const filterByBoth =
    selectedTypes.length > 0
      ? filterByType(pokeFilterListByName)
      : pokeFilterListByName;
  renderPokeList(filterByBoth);
});
// event listener for any input change in type checkboxes. first filter by type then filter by name if value available.
searchType.addEventListener("input", () => {
  selectedTypes = [];
  const alltypes = document.querySelectorAll("form input");
  alltypes.forEach(
    (item) => (item.closest("div").style.filter = "brightness(40%)")
  );
  for (element of alltypes) {
    if (element.checked == true) {
      selectedTypes.push(element.id);
      element.closest("div").style.filter = "brightness(100%)";
    }
  }
  const pokeFilterListByTypes = filterByType(pokeList);
  const filterByboth =
    searchValue.length > 0
      ? filterByName(pokeFilterListByTypes, searchValue)
      : pokeFilterListByTypes;
  renderPokeList(filterByboth);
});
// top button
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    goToTop.style.visibility = "visible";
  } else {
    goToTop.style.visibility = "hidden";
  }
  // console.log(window.scrollY);
});
