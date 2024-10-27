document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Blokuje prawy przycisk myszy (menu kontekstowe)
});

document.addEventListener('mousedown', function(event) {
    if (event.button === 1) { // Button 1 to środkowy przycisk myszy (kółko)
        event.preventDefault(); // Blokuje kliknięcie środkowym przyciskiem myszy
    }
});
