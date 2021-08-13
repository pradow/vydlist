const app = (function () {
  const addForm = document.querySelector(".jsAddForm");
  const addInput = document.querySelector("#addInput");
  let videoArea = document.querySelector(".jsVideoArea");
  let playlistArea = document.querySelector(".jsPlaylistArea");

  function createVideoElement(videoInfo) {
    if (videoInfo.site === "youtube") {
      return `<iframe class="playlist-iframe" src="https://www.youtube.com/embed/${videoInfo.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    if (videoInfo.site === "vimeo") {
      return `<iframe src="https://player.vimeo.com/video/${videoInfo.id}" class="playlist-iframe" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  }

  function selectActiveVideo(e) {
    const selectedVideo = e.currentTarget;
    const el = createVideoElement({
      id: selectedVideo.dataset.id,
      site: selectedVideo.dataset.site,
    });
    videoArea.innerHTML += el;
  }

  function createVideoListItem(videoLink) {
    let videoInfo = {
      id: "",
      img: "",
      site: "",
      link: "",
    };

    let videoEl = "";

    if (videoLink.includes("youtube")) {
      videoInfo = {
        id: videoLink.slice(videoLink.indexOf("v=") + 2),
        img: `https://i.ytimg.com/vi_webp/${videoLink.slice(
          videoLink.indexOf("v=") + 2
        )}/sddefault.webp`,
        site: "youtube",
        link: videoLink,
      };
    }

    if (videoLink.includes("vimeo")) {
      videoInfo = {
        id: videoLink.slice(videoLink.indexOf(".com/") + 5),
        site: "vimeo",
        link: videoLink,
      };
    }

    videoEl = createVideoElement(videoInfo);

    return `<div class="playlist-item" data-id=${videoInfo.id} data-site=${videoInfo.site} data-link=${videoInfo.link}>
    <div class="playlist-item-overlay"></div>
        ${videoEl}
    </div>`;
  }

  function addVideo(e) {
    e.preventDefault();
    if (!addInput.value.replace(/ /g, "")) {
      return;
    }

    const videoListItem = createVideoListItem(addInput.value);

    playlistArea.innerHTML += videoListItem;

    document
      .querySelector(`[data-link="${addInput.value}"]`)
      .addEventListener("click", selectActiveVideo);
  }

  addForm.addEventListener("submit", addVideo);
})();
