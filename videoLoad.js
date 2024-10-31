self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("video-cache").then(function (cache) {
      return cache.addAll([
        "./img/vdo/Mod.webm", // Sekcja 1
        "./img/vdo/Gopro.webm", // Sekcja 2
        "./img/vdo/Arch.webm", // Sekcja 3
        "./img/vdo/Nuke.webm", // Sekcja 4
        "./img/vdo/Nothing.webm", // Sekcja 5
        "./img/vdo/F1.webm", // Sekcja 6
        "./img/vdo/Wheel.webm", // Sekcja 7
      ]);
    })
  );
});
