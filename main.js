const logoImg = document.querySelector("#logoImg");
const searchNameId = document.querySelector("#search_name_id");
const pokeContainer = document.querySelector(".poke_container");
const searchBtnAll = document.querySelectorAll(".search_btn button");
let pokeGen = "gen_1";
const genList = {
  gen_1: { limit: 151, offset: 151 },
  gen_2: { limit: 100, offset: 251 },
  gen_3: { limit: 135, offset: 386 },
  gen_4: { limit: 107, offset: 493 },
  gen_5: { limit: 156, offset: 649 },
  gen_6: { limit: 72, offset: 721 },
  gen_7: { limit: 88, offset: 809 },
  gen_8: { limit: 96, offset: 905 },
  gen_9: { limit: 110, offset: 1015 },
};
async function getPokemon(limit, offset) {
  pokeContainer.innerHTML = "";
  console.log(pokeContainer.innerHTML);
  const pokeByGenUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const pokeByGen = await fetch(pokeByGenUrl);
  const dataByGen = await pokeByGen.json();
  if (searchNameId.value === "all") renderPoke(dataByGen.results);
  searchNameId.addEventListener("input", (e) => {
    e.preventDefault();
    const searchValue = e.target.value;
    const filteredList = dataByGen.results.filter((item) =>
      item.name.includes(searchValue)
    );
    pokeContainer.innerHTML = "";

    renderPoke(filteredList);
  });
}

async function renderPoke(list) {
  list.forEach((item) => {
    const pokeName = item.name;
    fetch(item.url)
      .then((response) => response.json())
      .then((data) => {
        const pokeImg = data.sprites.other.dream_world.front_default;
        const pokeId = data.id;
        logoImg.src = pokeImg;
        const pokeTypes = data.types
          .map((item) => {
            const typeName = item.type.name;
            return `<img src="/img/${typeName}.png" alt="" />`;
          })
          .join(" ");
        const pokeGenDisplay = genRender(pokeGen);
        renderPokeList(pokeName, pokeImg, pokeGenDisplay, pokeId, pokeTypes);
      });
  });
}

function genRender(poreGen) {
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
  document
    .querySelector(".poke_container")
    .insertAdjacentHTML("beforeend", html);
}
searchBtnAll.forEach((item) => {
  item.addEventListener("click", (e) => {
    pokeGen = e.target.id;
    const pokeLimit = genList[pokeGen].limit;
    const pokeOffset = genList[pokeGen].offset;
    getPokemon(pokeLimit, pokeOffset);
  });
});
