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
};
// 메인페이지
async function indexPage() {
  const listFragment = document.importNode(templates.mainPage, true);


  render(listFragment);
}
//로그인페이지
async function loginPage() {
  const fragment = document.importNode(templates.login, true);

  render(fragment);
}
indexPage();
