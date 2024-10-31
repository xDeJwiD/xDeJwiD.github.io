document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const navButtons = document.querySelectorAll("#wrapper-nav .btn");
  const videoElement = document.querySelector(".display video");
  let currentIndex = 0;
  let isAnimating = false;

  const backgroundVideos = [
    "./img/vdo/Mod.webm", // Sekcja 1
    "./img/vdo/Gopro.webm", // Sekcja 2
    "./img/vdo/Arch.webm", // Sekcja 3
    "./img/vdo/Nuke.webm", // Sekcja 4
    "./img/vdo/Nothing.webm", // Sekcja 5
    "./img/vdo/F1.webm", // Sekcja 6
    "./img/vdo/Wheel.webm", // Sekcja 7
  ];

  const sectionsmoreshown = document.querySelectorAll(".section-more");

  // Funkcja sprawdzająca, czy wszystkie elementy mają klasę "hidden"
  function areAllSectionsHidden() {
    return Array.from(sectionsmoreshown).every((section) =>
      section.classList.contains("hidden")
    );
  }

  function gotoSection(index, direction) {
    if (isAnimating || index < 0 || index >= sections.length) return;

    isAnimating = true;
    const currentSection = sections[currentIndex];
    const nextSection = sections[index];

    // Przypisujemy klasę active od razu po kliknięciu lub scrollu
    updateActiveButtonByIndex(index);

    // Zmieniamy wideo z efektem
    changeVideo(index); // Wygaszamy obecne wideo przed zmianą sekcji

    // Przestawiamy nową sekcję na górze lub na dole, w zależności od kierunku
    nextSection.style.transform = `translateY(${direction === "down" ? 100 : -100}%)`;
    nextSection.style.zIndex = 3; // Przestawiamy nową sekcję na wierzch
    nextSection.style.visibility = "visible"; // Upewniamy się, że nowa sekcja jest widoczna
    nextSection.style.transition = "none"; // Wyłączamy przejście, żeby ustawić pozycję

    setTimeout(() => {
      nextSection.style.transition = "transform 0.75s ease-in-out";
      currentSection.style.transition = "transform 0.75s ease-in-out";

      currentSection.style.transform = `translateY(${direction === "down" ? -100 : 100}%)`; // Aktualna sekcja schodzi w dół lub w górę
      nextSection.style.transform = `translateY(0)`; // Nowa sekcja pojawia się

      setTimeout(() => {
        currentSection.style.zIndex = -1; // Przesuwamy starą sekcję na niższy poziom
        currentSection.style.visibility = "hidden"; // Ukrywamy starą sekcję
        currentSection.style.transform = "translateY(100%)"; // Resetujemy jej pozycję na dole
        currentIndex = index;
        isAnimating = false;

        // Upewniamy się, że klasa active jest przyznana
        updateActiveButtonByIndex(currentIndex);
      }, 750);
    }, 20);
  }

  function updateActiveButtonByIndex(index) {
    navButtons.forEach((button) => button.classList.remove("active"));
    navButtons[index].classList.add("active");
  }

  function changeVideo(index) {
    if (videoElement) {
      // Zmniejszamy przezroczystość do 0
      videoElement.style.transition = "opacity 0.75s ease-in-out"; // Standardowy czas na zmianę sekcji
      videoElement.style.opacity = 0;

      // Czekamy na zakończenie animacji wygaszania
      setTimeout(() => {
        // Zmieniamy źródło wideo tylko, jeśli zmieniamy sekcję
        if (videoElement.src !== backgroundVideos[index]) {
          videoElement.src = backgroundVideos[index];

          // Upewniamy się, że wideo jest odtwarzane po zmianie źródła
          videoElement.muted = true; // Wyłączamy dźwięk dla autoplay
          videoElement.play().catch((error) => {
            console.error("Error playing video:", error);
          });
        }

        // Przywracamy przezroczystość do 1 po załadowaniu nowego wideo
        videoElement.onloadeddata = () => {
          videoElement.style.opacity = 1;
        };

        updateVideoStyle(); // Zaktualizuj styl po zmianie src
      }, 750); // Czas wygaszania, który powinien być taki sam jak czas przejścia
    } else {
      console.error("Element wideo nie został znaleziony.");
    }
  }

  // Funkcja sprawdzająca i ustawiająca styl w zależności od src
  function updateVideoStyle() {

    if (videoElement.src.includes("Mod.webm")) {
      videoElement.classList.add("modue");
    }
    else if (videoElement.src.includes("Wheel.webm")) {
      videoElement.classList.add("wheel");
    } else {
      videoElement.classList.remove("modue");
      videoElement.classList.remove("wheel");
    }

  }

  function handleScroll(event) {
    if (isAnimating) return;

    let delta;
    if (event.deltaY !== undefined) {
      // Dla urządzeń z kółkiem myszy
      delta = event.deltaY;
    } else if (event.touches) {
      // Dla urządzeń dotykowych
      const touch = event.touches[0];
      const touchEnd = touch.clientY;
      delta = lastTouchY - touchEnd; // Zmiana kierunku dla urządzeń mobilnych
      lastTouchY = touchEnd;
    }

    if (areAllSectionsHidden()) {
      // Używamy normalnego kierunku na komputerze
      if (delta > 0) {
        gotoSection(currentIndex + 1, "down"); // Dla komputera
      } else if (delta < 0) {
        gotoSection(currentIndex - 1, "up"); // Dla komputera
      }
    } else {
      console.log("Not all sections are hidden, skipping scroll event");
      // Jeśli przynajmniej jeden element nie jest ukryty, nie wykonuj akcji
    }
  }

  function pinSections() {
    sections.forEach((section) => {
      section.style.position = "fixed";
      section.style.top = "0";
      section.style.left = "0";
      section.style.width = "100%";
      section.style.height = "100vh";
      section.style.zIndex = 0;
      section.style.transform = "translateY(100%)";
    });

    sections[0].style.transform = "translateY(0)";
    sections[0].style.zIndex = 3;

    // Szybka animacja pojawiania wideo po załadowaniu strony
    if (videoElement) {
      videoElement.src = backgroundVideos[0]; // Ładujemy pierwsze wideo
      videoElement.muted = true; // Wyłączamy dźwięk dla autoplay
      videoElement.play().catch((error) => {
        console.error("Error playing initial video:", error);
      }); // Odtwarzamy wideo od razu

      updateVideoStyle(); // Zaktualizuj styl po zmianie src
      // Po załadowaniu wideo, płynnie je pokazujemy
      videoElement.onloadeddata = () => {
        setTimeout(() => {
          videoElement.style.opacity = 1; // Płynne pojawienie się wideo
        }, 100); // Krótkie opóźnienie przed animacją
      };
    }
  }

  function scrollToSection(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute("href");
    const targetIndex = Array.from(sections).findIndex(
      (section) => `#${section.id}` === targetId
    );

    if (targetIndex !== -1 && targetIndex !== currentIndex) {
      gotoSection(targetIndex, targetIndex > currentIndex ? "down" : "up");
    }
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", scrollToSection);
  });

  pinSections();

  window.addEventListener("wheel", handleScroll);
  window.addEventListener("touchstart", (event) => {
    lastTouchY = event.touches[0].clientY; // Zapisujemy pozycję dotyku
  });
  window.addEventListener("touchmove", handleScroll);
});
