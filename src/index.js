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
  login: document.querySelector("#login").content,
  signup: document.querySelector("#Sign-Up").content
};
// 메인페이지
async function indexPage() {
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

  render(listFragment);
}
//로그인페이지
async function loginPage() {
  const fragment = document.importNode(templates.login, true);
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
indexPage();
