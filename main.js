const logoImg = document.querySelector("#logoImg");
const searchNameId = document.querySelector("#search_name_id");
const pokeContainer = document.querySelector(".poke_container");
const searchBtnAll = document.querySelectorAll(".search_btn button");
const searchType = document.querySelector(".search_type");
let pokeList = [];
let pokeGen = "gen_1";
let selectedTypes = [];
let searchValue = "";
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

typeList.forEach((item) => {
  const html = `
  <div>
  <input type="checkbox" id="${item}" />
  <label for="${item}"><img src="img/${item}.png" alt="" /></label>
</div>
  `;
  searchType.insertAdjacentHTML("afterbegin", html);
});

const genList = {
  gen_1: { limit: 151, offset: 0 },
  gen_2: { limit: 100, offset: 152 },
  gen_3: { limit: 135, offset: 253 },
  gen_4: { limit: 107, offset: 389 },
  gen_5: { limit: 156, offset: 649 },
  gen_6: { limit: 72, offset: 546 },
  gen_7: { limit: 88, offset: 619 },
  gen_8: { limit: 96, offset: 708 },
  gen_9: { limit: 110, offset: 819 },
};
async function getPokemon(limit, offset) {
  searchNameId.value = "";
  pokeContainer.innerHTML = "";
  pokeList = [];
  const pokeByGenUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(pokeByGenUrl);
  const dataByGen = await response.json();
  const pokeListByGen = dataByGen.results;
  pokeListByGen.forEach(async (item) => {
    const pokeName = item.name;
    const res = await fetch(item.url);
    const data = await res.json();
    const pokeImg = data.sprites.other.dream_world.front_default;
    const pokeId = data.id;
    const pokeTypes = data.types.map((item) => item.type.name);
    const pokeTypesImg = data.types
      .map((item) => {
        const typeName = item.type.name;
        return `<img src="/img/${typeName}.png" alt="" />`;
      })
      .join(" ");
    const pokeGenDisplay = genRender(pokeGen);
    const pokeInfo = {
      name: pokeName,
      img: pokeImg,
      id: pokeId,
      types: pokeTypes,
      typesImg: pokeTypesImg,
      gen: pokeGenDisplay,
    };
    pokeList.push(pokeInfo);
    renderPokeList(pokeName, pokeImg, pokeGenDisplay, pokeId, pokeTypesImg);
  });
}

function renderPoke(list) {
  pokeContainer.innerHTML = "";
  list.forEach((item) => {
    renderPokeList(item.name, item.img, item.gen, item.id, item.typesImg);
  });
}

function genRender(pokeGen) {
  if (pokeGen === "gen_1") return "G I";
  if (pokeGen === "gen_2") return "G II";
  if (pokeGen === "gen_3") return "G III";
  if (pokeGen === "gen_4") return "G IV";
  if (pokeGen === "gen_5") return "G V";
  if (pokeGen === "gen_6") return "G VI";
  if (pokeGen === "gen_7") return "G VII";
  if (pokeGen === "gen_8") return "G VIII";
  if (pokeGen === "gen_9") return "G IX";
}

function renderPokeList(name, imgUrl, gen, id, pokeType) {
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

searchBtnAll.forEach((item) => {
  item.addEventListener("click", (e) => {
    pokeGen = e.target.id;
    const pokeLimit = genList[pokeGen].limit;
    const pokeOffset = genList[pokeGen].offset;
    getPokemon(pokeLimit, pokeOffset);
  });
});

searchNameId.addEventListener("input", (e) => {
  searchValue = e.target.value.toLowerCase();
  e.preventDefault();
  const pokeFilterListByName = filterByName(pokeList, searchValue);
  const filterByBoth =
    selectedTypes.length > 0
      ? filterByType(pokeFilterListByName)
      : pokeFilterListByName;
  renderPoke(filterByBoth);
});

searchType.addEventListener("input", () => {
  selectedTypes = [];
  const alltypes = document.querySelectorAll("form input");
  for (element of alltypes) {
    if (element.checked == true) {
      selectedTypes.push(element.id);
    }
  }
  const pokeFilterListByTypes = filterByType(pokeList);
  const filterByboth =
    searchValue.length > 0
      ? filterByName(pokeFilterListByTypes, searchValue)
      : pokeFilterListByTypes;
  renderPoke(filterByboth);
});

function filterByName(list, searchValue) {
  return searchValue.length > 0
    ? list.filter((item) => item.name.includes(searchValue))
    : list;
}

function filterByType(list) {
  return list.filter((obj) => {
    return selectedTypes.every((item) => obj.types.includes(item));
  });
}
