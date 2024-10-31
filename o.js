// morePanel(show/hide, p)

const videoElement = document.querySelector(".display video");

function morePanel(a, p) {
  const ele = document.querySelector("#section-more" + p);
  if (a == 1) {
    ele.classList.remove("hidden");
    ele.classList.remove("slideout");
    ele.classList.add("slidein");
    setTimeout(() => {
      videoElement.pause()
  }, 1000);
  }
  if (a == 0) {
    ele.classList.remove("slidein");
    ele.classList.add("slideout");
    videoElement.play()
    setTimeout(() => {
        ele.classList.add("hidden");
    }, 1000);
    


  }
}


