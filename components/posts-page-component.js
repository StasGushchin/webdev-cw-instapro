import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage, page } from "../index.js";
import { dislike, postLike } from "../api.js";

export function renderPostsPageComponent({ appEl, posts, token }) {
  console.log(page);
  // TODO: реализовать рендер постов из api
  const appPostsHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    <ul id="ulContainerForPost" class="posts">
    </ul>
  </div>`;
  appEl.innerHTML = appPostsHtml;
  const ulContainer = document.getElementById("ulContainerForPost");
  const postHtml = posts.map((post) => {
    const likesLength = post.likes.length;
    return `
                  <li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${post.user.imageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                    <button data-post-id="${post.id}" class="like-button">
                      <img src="${
                        post.isLiked
                          ? "./assets/images/like-active.svg"
                          : "./assets/images/like-not-active.svg"
                      }">
                    </button>
                    <p class="post-likes-text">
                      Нравится: <strong>${
                        likesLength === 0
                          ? 0
                          : `${post.likes.at(-1).name}${
                              likesLength > 1 ? ` и еще ${likesLength - 1}` : ""
                            }`
                      }</strong>
                    </p>
                  </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                    ${post.createdAt}
                    </p>
                  </li>
                  `
              }).join("");
              ulContainer.innerHTML = postHtml;
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }


const likeButtonElements = document.querySelectorAll(".like-button");

likeButtonElements.forEach((likeButtonElement, index) => {
  likeButtonElement.addEventListener("click", (event) => {
    const post = posts[index];
    console.log(post);
    let { id } = post;
    console.log(id);
    let { isLiked } = post;
    console.log(isLiked);
    if (isLiked) {
      dislike({ token, id }).then((responseData) => {
        console.log(responseData.post.likes);
        posts[index].likes = responseData.post.likes;
        posts[index].isLiked = responseData.post.isLiked;
        renderPostsPageComponent({ appEl, posts, token });
      });
    } else {
      postLike({ token, id }).then((responseData) => {
        console.log(responseData.post.likes);
        posts[index].likes = responseData.post.likes;
        posts[index].isLiked = responseData.post.isLiked;
        renderPostsPageComponent({ appEl, posts, token });
      });
    }
  });
});
}
