let pageNumber = 1;
let pageSize = 10;
let isPageLoad = true;
const userContainer = document.querySelector(".users__container");
const loadingEle = document.querySelector("#loading");

const toggleLoading = (isLoading) => {
  loadingEle.classList.toggle("show", isLoading);
};

function render(item) {
  let {
    name: { first, last },
    location: { country },
    email,
    picture: { medium: userImage },
  } = item;

  let html = `  <div class="user">
    <div class="user-logo item">
      <img src="${userImage}" alt="user" />
    </div>
   <div class="user-info">
        <div class="user-name item">${first.toUpperCase()} ${last.toUpperCase()}</div>
        <div class="user-country item">${country}</div>
        <div class="user-email item">${email}</div>
   </div>
   <div class="user-link"><a href="#">...</a></div>
  </div>`;

  userContainer.insertAdjacentHTML("beforeend", html);
}

async function getRandomUsers(pageNumber, pageSize) {
  const url = `https://randomuser.me/api/?page=${pageNumber}&results=${pageSize}&seed=abc`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Something went wrong!");

  const data = await res.json();

  return data;
}

const getLastUser = () =>
  document.querySelector(".users__container >.user:last-child");

function loadUsers(pageNumber, pageSize) {
  return new Promise((resolve, reject) => {
    getRandomUsers(pageNumber, pageSize)
      .then((data) => {
        data &&
          data.results &&
          data.results.map((user) => render(user)).join("");

        if (isPageLoad) {
          observeLastUser();
          isPageLoad = false;
        }
        resolve("Completed Rendering");
      })
      .catch((error) => {
        reject(error);
      });
  });
}

toggleLoading(true);

loadUsers(pageNumber, pageSize)
  .then((data) => {
    toggleLoading(false);
  })
  .catch((error) => toggleLoading(false));

function infScrollCallback(entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;

  pageNumber++;
  toggleLoading(true);

  loadUsers(pageNumber, pageSize)
    .then((res) => {
      observeLastUser();
      toggleLoading(false);
    })
    .catch((err) => toggleLoading(false));

  observer.unobserve(entry.target);
}

const scrollObserver = new IntersectionObserver(infScrollCallback, {});

const observeLastUser = () => {
  scrollObserver.observe(getLastUser());
};
