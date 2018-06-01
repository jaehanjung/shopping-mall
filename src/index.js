import axios from "axios";
import { freemem } from "os";

const postAPI = axios.create({
  baseURL: process.env.API_URL
});
const rootEl = document.querySelector(".root");

function login(token) {
  console.log(`login: ${token}`)
  localStorage.setItem("token", token);
  postAPI.defaults.headers["Authorization"] = `Bearer ${token}`;
  rootEl.classList.add("root--authed");
}
function logout() {
  localStorage.removeItem("token");
  delete postAPI.defaults.headers["Authorization"];
  rootEl.classList.remove("root--authed");
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
  cart: document.querySelector("#cart-page").content,
  cartMore: document.querySelector("#cart-list").content
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
    .querySelector(".post-list__logout-btn")
    .addEventListener("click", e => {
      logout();
      indexPage();
    });
  listFragment
    .querySelector(".signup-page__btn")
    .addEventListener("click", e => {
      signupPage();
    });

  listFragment.querySelector(".cart-page__btn").addEventListener("click", e => {
    cartPage();
  });
  res.data.forEach(post => {
    const fragment = document.importNode(templates.box, true);
    fragment.querySelector(".post-item__author").textContent = post.product;
    const pEl = fragment.querySelector(".post-item__title");
    pEl.textContent = post.price;
    const itemEL = fragment.querySelector(".post-item__img");
    itemEL.setAttribute("src", post.imgURL);
    const boxEl = fragment.querySelector(".card-box");
    boxEl.addEventListener("click", e => {
      DetailPage(post.id);
    });
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
    const res = await postAPI.post("/users/login", payload);
    login(res.data.token);
    indexPage();
  });
  fragment.querySelector(".logo").addEventListener("click", e => {
    indexPage();
  });

  render(fragment);
}
//회원가입 페이지

async function signupPage() {
  const fragment = document.importNode(templates.signup, true);
  const formEl = fragment.querySelector(".Sign_form");
  formEl.addEventListener("submit", async e => {
    // e.target.elements.username === fragment.querySelector('.login__username');
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value,
    };
    e.preventDefault();
    const res = await postAPI.post("/users/register", payload);
    login(res.data.token);
    const meRes = await postAPI.get("/me");
    const userPayload = {
      name: e.target.elements.name.value,
      address: e.target.elements.address.value,
      mobile: e.target.elements.mobile.value
    }
    const userRes = await postAPI.patch(`/users/${meRes.data.id}`, userPayload);
    indexPage();
  });
  fragment.querySelector(".logo").addEventListener("click", e => {
    indexPage();
  });
  render(fragment);
}
// 상품상세 페이지
async function DetailPage(id) {
  const res = await postAPI.get(`/products/${id}`);
  const listFragment = document.importNode(templates.Detail, true);
  listFragment.querySelector(".logo").addEventListener("click", e => {
    indexPage();
  });
  const fragment = document.importNode(templates.detailMore, true);
  const formEl = fragment.querySelector(".Detail-form");

  formEl.addEventListener("submit", async e => {
    e.preventDefault();
    // e.target.elements.username === fragment.querySelector('.login__username');
    const payload = {
      productId: id
    };
    e.preventDefault();
    const res = await postAPI.post("/carts", payload);
    cartPage();
  });

  const { product, price, imgURL, content, imgsize } = res.data;
  fragment.querySelector(".Detail-title").textContent = product;
  fragment.querySelector(".Detail-title_title").textContent = product;
  fragment.querySelector(".Detail-text").textContent = content;
  const pEl = fragment.querySelector(".Detail-price");
  pEl.textContent = price;
  const itemEL = fragment.querySelector(".Detail__img");
  itemEL.setAttribute("src", imgURL);
  const imgsizeEl = fragment.querySelector(".Detail__imgsize");
  imgsizeEl.setAttribute("src", imgsize);

  listFragment.querySelector(".Detail-list").appendChild(fragment);


  render(listFragment);
}

// 장바구니 페이지
async function cartPage() {
  const res = await postAPI.get(`/carts?_expand=product`);
  const listFragment = document.importNode(templates.cart, true);
  listFragment.querySelector(".logo").addEventListener("click", e => {
    indexPage();
  });
  res.data.forEach(cart => {
    const fragment = document.importNode(templates.cartMore, true);
    fragment.querySelector(".cart-title").textContent = cart.product.product;
    const pEl = fragment.querySelector(".cart-price");
    pEl.textContent = cart.product.price;
    const itemEL = fragment.querySelector(".cart-img");
    itemEL.setAttribute("src", cart.product.imgURL);
    const totalEl = fragment.querySelector(".cart-price_total");
    totalEl.textContent = cart.product.price;
    listFragment.querySelector(".cart-list").appendChild(fragment);
  });
  render(listFragment);
}

if (localStorage.getItem("token")) {
  login(localStorage.getItem("token"));
}

indexPage();
