import axios from "axios";

const postAPI = axios.create({
  baseURL: process.env.API_URL
});
const rootEl = document.querySelector(".root");

function login(token) {
  localStorage.setItem("token", token);
  postAPI.defaults.headers["Authorization"] = `Bearer ${token}`;
  rootEl.classList.add("root--authed");
}
// 중복코드 함수로 작성
function render(fragment) {
  rootEl.textContent = "";
  rootEl.appendChild(fragment);
}

const templates = {
  mainPage: document.querySelector("#main-page").content,
  box: document.querySelector("#boxs").content,
  login: document.querySelector("#login").content,
  signup: document.querySelector("#Sign-Up").content,
  Detail: document.querySelector("#Detail-page").content,
  detailMore: document.querySelector("#Detail-more").content,
  cart: document.querySelector("#cart-page").content
};

// 메인페이지
async function indexPage() {
  const res = await postAPI.get("/products");
  const listFragment = document.importNode(templates.mainPage, true);
  listFragment
    .querySelector(".login-page__btn")
    .addEventListener("click", e => {
      loginPage();
    });
  listFragment
    .querySelector(".signup-page__btn")
    .addEventListener("click", e => {
      signupPage();
    });
  listFragment.querySelector(".card-more").addEventListener("click", e => {
    DetailPage();
  });
  listFragment.querySelector(".cart-page__btn").addEventListener("click", e => {
    cartPage();
  });
  res.data.forEach(post => {
    const fragment = document.importNode(templates.box, true);
    fragment.querySelector('.post-item__author').textContent = post.product
    const pEl = fragment.querySelector(".post-item__title");
    pEl.textContent = post.price;
    const itemEL = fragment.querySelector(".post-item__img");
    itemEL.setAttribute("src",post.imgURL)
    // pEl.addEventListener("click", e => {
    //   postContentPage(post.id);
    // });
    listFragment.querySelector(".post-list").appendChild(fragment);
  });


  render(listFragment);
}
//로그인페이지
async function loginPage() {
  const fragment = document.importNode(templates.login, true);
  const formEl = fragment.querySelector(".login__form");
  formEl.addEventListener("submit", async e => {
    // e.target.elements.username === fragment.querySelector('.login__username');
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };
    e.preventDefault();
    const res = await postAPI.post("/users/", payload);
    login(res.data.token);
    indexPage();
  })
  fragment.querySelector(".logo").addEventListener("click", e => {
    indexPage();
  });

  render(fragment);
}
//회원가입 페이지
async function signupPage() {
  const fragment = document.importNode(templates.signup, true);
  fragment.querySelector(".logo").addEventListener("click", e => {
    indexPage();
  });
  render(fragment);
}
// 상품상세 페이지
async function DetailPage() {
  const res = await postAPI.get("/products");
  const listFragment = document.importNode(templates.Detail, true);
  listFragment.querySelector(".logo").addEventListener("click", e => {
    indexPage();
  });
  res.data.forEach(post => {
    const fragment = document.importNode(templates.detailMore, true);
    fragment.querySelector('.Detail-title').textContent = post.product
    const pEl = fragment.querySelector(".Detail-price");
    pEl.textContent = post.price;
    const itemEL = fragment.querySelector(".Detail__img");
    itemEL.setAttribute("src",post.imgURL)
    // pEl.addEventListener("click", e => {
    //   postContentPage(post.id);
    // });
    listFragment.querySelector(".Detail-list").appendChild(fragment);
  });
  render(listFragment);
}

// 장바구니 페이지
async function cartPage() {
  const fragment = document.importNode(templates.cart, true);
  fragment.querySelector(".logo").addEventListener("click", e => {
    indexPage();
  });
  render(fragment);
}
indexPage();
