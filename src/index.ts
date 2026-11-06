import "./style.css";

function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if(!element) {
    throw new Error(`${selector}がみつかりません`);
  }

  return element;
}


const app = getElement<HTMLDivElement>('#app');

app.innerHTML =`
  <header>
    <h1>料理レシピ</h1>
    <button id='addrecipe'>+</button>
  </header>
  <main>
    <div class='left'>
      <ul id='recipe-list'></ul>
    </div>
    <div class='right'>
      <input type='text' id='title' class='target-class' placeholder='タイトル'>
      <p>
        <label for="url1">URL</label>
        <input id="url1" type="url" class='target-class' placeholder="https://..." />
      </p>
      <div id='recipememo' class='target-class' contenteditable='true'></div>
    </div>

    
  </main>
  `;

const addrecipe = getElement<HTMLButtonElement>('#addrecipe');
const recipelist = getElement<HTMLUListElement>('#recipe-list');
const title = getElement<HTMLInputElement>('#title');
const url1 = getElement<HTMLInputElement>('#url1');
const recipememo = getElement<HTMLDivElement>('#recipememo');

type Recipe = {
  id: number,
  title: string;
  url: string;
  memo: string;
}

const STORAGE_KEY = 'recipes';
//localstorageに何もないときは[]を返す
const recipes: Recipe [] = JSON.parse(localStorage.getItem(STORAGE_KEY) ??'[]');

let selectedId: number | null = null;

function saveResipes() {
  localStorage.setItem(STORAGE_KEY,JSON.stringify(recipes));
}

function saveCurrentRecipe() {
  if(selectedId === null)return;

  const recipe = recipes.find((item) => item.id === selectedId);
  if(!recipe)return;

  recipe.title = title.value;
  recipe.url = url1.value;
  recipe.memo = recipememo.innerHTML;

  saveResipes();
  renderList();
}

function showRecipe(recipe: Recipe) {
  selectedId = recipe.id;
  title.value = recipe.title;
  url1.value = recipe.url;
  recipememo.innerHTML = recipe.memo;
}

function renderList() {
  recipelist.innerHTML = '';

  recipes.forEach((recipe) => {
    const li = document.createElement('li');
    const recipeButton = document.createElement('button');

    recipeButton.type = 'button';
    recipeButton.textContent = recipe.title || 'タイトルなし';

    recipeButton.addEventListener('click', () => {
      saveCurrentRecipe();
      showRecipe(recipe);
    });
    
    recipelist.appendChild(li);
    li.appendChild(recipeButton);
    })
};

addrecipe.addEventListener('click', () => {
  saveCurrentRecipe();

  const recipe: Recipe = {
    id: Date.now(),
    title: '',
    url: '',
    memo: ''
  };

  recipes.push(recipe);
  saveResipes();
  renderList();
  showRecipe(recipe);
});

title.addEventListener('input', saveCurrentRecipe);
url1.addEventListener('input', saveCurrentRecipe);
recipememo.addEventListener('input', saveCurrentRecipe);
    
renderList();


