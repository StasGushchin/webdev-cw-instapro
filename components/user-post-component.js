import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage, page } from "../index.js";
import { dislike, postLike } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsUserPageComponent({ appEl, posts, token }) {
  const userPost = posts[0];
  const { user } = userPost;

  const appHtml = posts
    .map((post) => {
      const createDate = formatDistanceToNow(new Date(post.createdAt), {
        locale: ru,
      });
      const likesLength = post.likes.length;
      return `<li class="post"> 
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
              likesLength > 1 ? `и еще ${likesLength - 1}` : ""
            }`
      }</strong>
    </p>
  </div>
    <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
    </p>
    <p class="post-date">
        ${createDate}
    </p>
    `;
    })
    .join("");

  const appPostsHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    <div class="posts-user-header">
        <img src="${user.imageUrl}" class="posts-user-header__user-image">
            <p class="posts-user-header__user-name">${user.name}</p>
    </div>
    <ul class="posts">
    ${appHtml}
    </ul>
  </div>`;
  appEl.innerHTML = appPostsHtml;

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
