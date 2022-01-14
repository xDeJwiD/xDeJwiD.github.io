var main = document.querySelector('.main')
var games = document.querySelector('.games')

function poka() {
    main.classList.add('hidden');
    games.classList.remove('hidden');
}

function usun() {
    games.classList.add('hidden');
    main.classList.remove('hidden');
}