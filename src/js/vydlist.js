const app = (function () {
  const addForm = document.querySelector(".jsAddForm");
  const addInput = document.querySelector("#addInput");
  let videoArea = document.querySelector(".jsVideoArea");
  let playlistArea = document.querySelector(".jsPlaylistArea");

  function createVideoElement(videoInfo) {
    if (videoInfo.site === "youtube") {
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoInfo.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
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

    return ` <div
    class="playlist-video jsPlaylistVideo"
    data-id=${videoInfo.id}
    data-img=${videoInfo.img}
    data-site=${videoInfo.site}
    data-link=${videoInfo.link}
    style="background-image: url(${videoInfo.img})"
  ></div>`;
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
