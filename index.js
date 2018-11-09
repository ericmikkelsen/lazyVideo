const LazyVideo = class {
  constructor() {
    /* did we get the thumbs up from css? */
    if (this.everythingCool()) {
      this.selector = ".js\\:lazyVideo";
      this.setup();
    }
  }
  everythingCool() {
    const CSSProps = window.getComputedStyle(document.documentElement);
    const CSSSaysOk = CSSProps.getPropertyValue("--lazyVideo").includes("1")
      ? 1
      : 0;
    const JSHasIntersectionObserver = "IntersectionObserver" in window ? 1 : 0;
    if (CSSSaysOk && JSHasIntersectionObserver) {
      this.CSSProps = CSSProps;
      return 1;
    }
    return 0;
  }
  setup() {
    this.videos = [...document.querySelectorAll(this.selector)];
    this.options = {
      threshold:
        parseFloat(this.CSSProps.getPropertyValue("--lazyVideo__threshold")) ||
        1,
      rootMargin:
        this.CSSProps.getPropertyValue("--lazyVideo__margin").trim() || "50%"
    };

    this.videos.forEach(video => {
      const observer = new IntersectionObserver(
        this.intersectedVideo,
        this.options
      );
      observer.observe(video);
    });
  }
  intersectedVideo(entries) {
    const video = entries[0].target;

    if (entries[0].isIntersecting) {
      // the video element
      if (!video.src) {
        video.src = video.getAttribute("data-src");
      }
      if (video.autoplay && video.muted && video.paused) {
        video.play();
      }
    } else if (video.autoplay && video.muted && !video.paused && video.src) {
      video.pause();
    }
  }
};
