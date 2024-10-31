document.querySelectorAll('.image-container').forEach((container) => {
    const coverImage = container.querySelector('.original');

    container.addEventListener('mousemove', (event) => {
        const containerRect = container.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left; // Pozycja kursora w kontenerze
        const containerWidth = containerRect.width; // Szerokość kontenera

        // Obliczamy procentowe położenie kursora w stosunku do szerokości kontenera
        const clipPercentage = 100 - (mouseX / containerWidth) * 100;

        // Ustawiamy `clip-path` dla górnego obrazu, odsłaniając obraz od prawej strony
        coverImage.style.clipPath = `inset(0 ${clipPercentage}% 0 0)`;
    });

    // Resetujemy `clip-path` przy opuszczaniu kontenera, by całe zdjęcie było widoczne
    container.addEventListener('mouseleave', () => {
        coverImage.style.clipPath = `inset(0 0 0 0)`;
    });
});
