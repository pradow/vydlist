const app = (function () {
  const body = document.querySelector("body");
  const addForm = document.querySelector(".jsAddForm");
  const addInput = document.querySelector("#addInput");
  const videoArea = document.querySelector(".jsVideoArea");
  const playlistArea = document.querySelector(".jsPlaylistArea");
  let userData = {
    videosArr: [],
  };
  let isDuplicate = false;
  let videoPlayingInfo = {};

  if (!localStorage.hasOwnProperty("vydlistApp")) {
    updateLocalStorage();
  } else {
    userData = JSON.parse(localStorage.getItem("vydlistApp"));
  }

  function updateLocalStorage() {
    localStorage.setItem("vydlistApp", JSON.stringify(userData));
    events.emit("userDataChange", userData);
  }

  function createVideoElement(videoInfo) {
    console.log("createVideoElement");
    if (videoInfo.site === "youtube") {
      return `<iframe class="playlist-iframe" src="https://www.youtube.com/embed/${videoInfo.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    if (videoInfo.site === "vimeo") {
      return `<iframe src="https://player.vimeo.com/video/${videoInfo.id}" class="playlist-iframe" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  }

  function selectActiveVideo(e) {
    userData.videosArr.forEach((item) => {
      if (
        item.id === e.currentTarget.dataset.id &&
        item.site === e.currentTarget.dataset.site
      ) {
        videoPlayingInfo = item;
      }
    });

    const el = createVideoElement(videoPlayingInfo);

    videoArea.innerHTML = el;

    playlistArea.querySelectorAll("[data-site]").forEach((item) => {
      if (item.dataset.id === videoPlayingInfo.id) {
        item.classList.add("playing-video");
      } else {
        item.classList.remove("playing-video");
      }
    });

    body.classList.remove(...body.classList);

    body.classList.add("video-playing", videoPlayingInfo.site);
  }

  function deleteItem(e) {
    const id = e.currentTarget.parentNode.dataset.id;
    const site = e.currentTarget.parentNode.dataset.site;

    userData = {
      ...userData,
      videosArr: userData.videosArr.filter((item) => {
        if (!(id === item.id && site === item.site)) {
          return item;
        }
      }),
    };

    updateLocalStorage();

    playlistArea.removeChild(e.currentTarget.parentNode);

    if (userData.videosArr.length === 0) {
      populatePlaylist();
    }
  }

  function createPlaylistElement(videoInfo) {
    let playlistItemWrapper = document.createElement("div");
    let videoEl = document.createElement("div");
    let deleteButton = document.createElement("button");

    playlistItemWrapper.classList.add("playlist-item-wrapper");
    playlistItemWrapper.setAttribute("data-id", videoInfo.id);
    playlistItemWrapper.setAttribute("data-site", videoInfo.site);

    videoEl.classList.add("playlist-item");
    videoEl.setAttribute("data-id", videoInfo.id);
    videoEl.setAttribute("data-site", videoInfo.site);
    videoEl.setAttribute("data-link", videoInfo.link);

    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = `<i class="fa fa-trash-o" aria-hidden="true" title="delete from playlist"></i>`;
    deleteButton.addEventListener("click", deleteItem);

    videoEl.innerHTML = `<div class="playlist-item-overlay"></div>${createVideoElement(
      videoInfo
    )}`;

    videoEl.addEventListener("click", selectActiveVideo);

    playlistItemWrapper.appendChild(videoEl);
    playlistItemWrapper.appendChild(deleteButton);

    return playlistItemWrapper;
  }

  function createVideoListItem(videoLink) {
    let videoInfo;
    let videoId;

    if (videoLink.includes("youtube")) {
      videoId = videoLink.slice(videoLink.indexOf("v=") + 2);

      if (videoId.includes("&")) {
        videoId = videoId.slice(0, videoId.indexOf("&"));
      }

      videoInfo = {
        id: videoId,
        img: `https://i.ytimg.com/vi_webp/${videoLink.slice(
          videoLink.indexOf("v=") + 2
        )}/sddefault.webp`,
        site: "youtube",
        link: videoLink,
      };
    }

    if (videoLink.includes("vimeo")) {
      if (videoLink.slice(videoLink.indexOf(".com/")).match(/\//g).length > 1) {
        return "invalid";
      }
      videoInfo = {
        id: videoLink.slice(videoLink.indexOf(".com/") + 5),
        img: "",
        site: "vimeo",
        link: videoLink,
      };
    }

    if (!videoInfo) {
      return "invalid";
    }

    userData.videosArr.forEach((item) => {
      if (item.id === videoInfo.id && item.site === videoInfo.site) {
        isDuplicate = true;
      }
    });

    if (isDuplicate) {
      isDuplicate = false;
      return "duplicate";
    }

    let videoEl = createPlaylistElement(videoInfo);

    userData = { ...userData, videosArr: [...userData.videosArr, videoInfo] };

    updateLocalStorage();

    return videoEl;
  }

  function addVideo(e) {
    e.preventDefault();
    if (!addInput.value.replace(/ /g, "")) {
      return;
    }

    const videoListItem = createVideoListItem(addInput.value);
    addInput.value = "";
    if (videoListItem === "duplicate") {
      alert("This video is already in your playlist");
      return;
    }

    if (videoListItem === "invalid") {
      alert("Invalid link");
      return;
    }

    if (userData.videosArr.length === 1) {
      playlistArea.innerHTML = "";
    }

    playlistArea.appendChild(videoListItem);
  }

  function populatePlaylist() {
    let htmlToAppend = document.createDocumentFragment();

    if (userData.videosArr.length > 0) {
      userData.videosArr.forEach((item, index) => {
        htmlToAppend.appendChild(createPlaylistElement(item));
      });
    } else {
      const message = document.createElement("div");
      message.classList.add("alert-message");
      message.innerHTML = `<p>Add a youtube or vimeo video using the input above</p>
      <img src="dist/images/rocket.png" alt="rocket">`;
      htmlToAppend.appendChild(message);
    }

    playlistArea.innerHTML = "";
    playlistArea.appendChild(htmlToAppend);
  }

  addForm.addEventListener("submit", addVideo);

  populatePlaylist();
})();
