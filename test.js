document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");
    const navButtons = document.querySelectorAll("#wrapper-nav .btn");
    const videoElement = document.querySelector(".display video");
    let currentIndex = 0;
    let isAnimating = false;
  
    // Zmieniamy nazwę tablicy na backgroundMedia i dodajemy obiekty z typem media
    const backgroundMedia = [
      { type: "video", src: "./img/vdo/Mod.webm" },       // Sekcja 1 - wideo
      { type: "video", src: "./img/vdo/Gopro.webm" }, // Sekcja 2 - wideo
      { type: "video", src: "./img/vdo/Arch.webm" },       // Sekcja 3 - wideo
      { type: "video", src: "./img/vdo/Nuke.webm" }, // Sekcja 4 - wideo
      { type: "video", src: "./img/vdo/Nothing.webm" },    // Sekcja 5 - wideo
      { type: "image", src: "./img/content/ferraripirelli/2.png" }  // Sekcja 6 - zdjęcie
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
  
      updateActiveButtonByIndex(index);
  
      // Zmieniamy media z efektem
      changeMedia(index);
  
      nextSection.style.transform = `translateY(${direction === "down" ? 100 : -100}%)`;
      nextSection.style.zIndex = 3;
      nextSection.style.visibility = "visible";
      nextSection.style.transition = "none";
  
      setTimeout(() => {
        nextSection.style.transition = "transform 0.75s ease-in-out";
        currentSection.style.transition = "transform 0.75s ease-in-out";
  
        currentSection.style.transform = `translateY(${direction === "down" ? -100 : 100}%)`;
        nextSection.style.transform = `translateY(0)`;
  
        setTimeout(() => {
          currentSection.style.zIndex = -1;
          currentSection.style.visibility = "hidden";
          currentSection.style.transform = "translateY(100%)";
          currentIndex = index;
          isAnimating = false;
  
          updateActiveButtonByIndex(currentIndex);
        }, 750);
      }, 20);
    }
  
    function updateActiveButtonByIndex(index) {
      navButtons.forEach((button) => button.classList.remove("active"));
      navButtons[index].classList.add("active");
    }
  
    function changeMedia(index) {
      const media = backgroundMedia[index];
  
      if (media.type === "video") {
        // Ustawiamy przezroczystość wideo na 0 przed zmianą
        videoElement.style.opacity = 0;
  
        setTimeout(() => {
          videoElement.src = media.src;
          videoElement.style.display = "block"; // Pokazujemy element wideo
          document.querySelector(".display").style.backgroundImage = "none"; // Usuwamy tło
  
          videoElement.play().catch((error) => {
            console.error("Error playing video:", error);
          });
  
          videoElement.onloadeddata = () => {
            videoElement.style.opacity = 1; // Płynne pokazanie wideo
          };
        }, 750); // Opóźnienie odpowiadające przejściu sekcji
  
      } else if (media.type === "image") {
        // Ukrywamy wideo i ustawiamy tło dla obrazu
        videoElement.style.opacity = 0;
        setTimeout(() => {
          videoElement.style.display = "none"; // Ukrywamy element wideo
          document.querySelector(".display").style.backgroundImage = `url('${media.src}')`; // Ustawiamy obraz tła
        }, 750);
      }
    }
  
    function handleScroll(event) {
      if (isAnimating) return;
  
      let delta;
      if (event.deltaY !== undefined) {
        delta = event.deltaY;
      } else if (event.touches) {
        const touch = event.touches[0];
        const touchEnd = touch.clientY;
        delta = lastTouchY - touchEnd;
        lastTouchY = touchEnd;
      }
  
      if (areAllSectionsHidden()) {
        if (delta > 0) {
          gotoSection(currentIndex + 1, "down");
        } else if (delta < 0) {
          gotoSection(currentIndex - 1, "up");
        }
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
  
      if (videoElement) {
        videoElement.src = backgroundMedia[0].src;
        videoElement.muted = true;
        videoElement.play().catch((error) => {
          console.error("Error playing initial video:", error);
        });
  
        videoElement.onloadeddata = () => {
          setTimeout(() => {
            videoElement.style.opacity = 1;
          }, 100);
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
      lastTouchY = event.touches[0].clientY;
    });
    window.addEventListener("touchmove", handleScroll);
  });
  