const WORDS_DEFAULT = [
  {
    "word": "Telefon",
    "category": "Elektronika",
    "hint": "KONTAKT"
  },
  {
    "word": "Komputer",
    "category": "Elektronika",
    "hint": "PRACA"
  },
  {
    "word": "Laptop",
    "category": "Elektronika",
    "hint": "MOBILNY"
  },
  {
    "word": "Tablet",
    "category": "Elektronika",
    "hint": "DOTYK"
  },
  {
    "word": "Monitor",
    "category": "Elektronika",
    "hint": "OBRAZ"
  },
  {
    "word": "Klawiatura",
    "category": "Elektronika",
    "hint": "PISANIE"
  },
  {
    "word": "Myszka",
    "category": "Elektronika",
    "hint": "KURSOR"
  },
  {
    "word": "Drukarka",
    "category": "Elektronika",
    "hint": "PAPIER"
  },
  {
    "word": "Głośnik",
    "category": "Elektronika",
    "hint": "DŹWIĘK"
  },
  {
    "word": "Słuchawki",
    "category": "Elektronika",
    "hint": "MUZYKA"
  },
  {
    "word": "Samochód",
    "category": "Transport",
    "hint": "DROGA"
  },
  {
    "word": "Rower",
    "category": "Transport",
    "hint": "PEDAŁY"
  },
  {
    "word": "Autobus",
    "category": "Transport",
    "hint": "PRZYSTANEK"
  },
  {
    "word": "Pociąg",
    "category": "Transport",
    "hint": "TOROWISKO"
  },
  {
    "word": "Samolot",
    "category": "Transport",
    "hint": "LOT"
  },
  {
    "word": "Statek",
    "category": "Transport",
    "hint": "WODA"
  },
  {
    "word": "Motor",
    "category": "Transport",
    "hint": "DWA KOŁA"
  },
  {
    "word": "Helikopter",
    "category": "Transport",
    "hint": "ŚMIGŁO"
  },
  {
    "word": "Traktor",
    "category": "Transport",
    "hint": "POLE"
  },
  {
    "word": "Metro",
    "category": "Transport",
    "hint": "POD ZIEMIĄ"
  },
  {
    "word": "Łóżko",
    "category": "Meble",
    "hint": "SEN"
  },
  {
    "word": "Kanapa",
    "category": "Meble",
    "hint": "SALON"
  },
  {
    "word": "Fotel",
    "category": "Meble",
    "hint": "SIEDZENIE"
  },
  {
    "word": "Krzesło",
    "category": "Meble",
    "hint": "OPARCIE"
  },
  {
    "word": "Stół",
    "category": "Meble",
    "hint": "BLAT"
  },
  {
    "word": "Biurko",
    "category": "Meble",
    "hint": "PRACA"
  },
  {
    "word": "Szafa",
    "category": "Meble",
    "hint": "UBRANIA"
  },
  {
    "word": "Komoda",
    "category": "Meble",
    "hint": "SZUFLADY"
  },
  {
    "word": "Regał",
    "category": "Meble",
    "hint": "PÓŁKI"
  },
  {
    "word": "Półka",
    "category": "Meble",
    "hint": "ŚCIANA"
  },
  {
    "word": "Młotek",
    "category": "Narzędzia",
    "hint": "GWÓŹDŹ"
  },
  {
    "word": "Śrubokręt",
    "category": "Narzędzia",
    "hint": "ŚRUBA"
  },
  {
    "word": "Klucz francuski",
    "category": "Narzędzia",
    "hint": "NAPRAWA"
  },
  {
    "word": "Wiertarka",
    "category": "Narzędzia",
    "hint": "OTWÓR"
  },
  {
    "word": "Piła",
    "category": "Narzędzia",
    "hint": "DREWNO"
  },
  {
    "word": "Miarka",
    "category": "Narzędzia",
    "hint": "DŁUGOŚĆ"
  },
  {
    "word": "Poziomica",
    "category": "Narzędzia",
    "hint": "PROSTO"
  },
  {
    "word": "Szczypce",
    "category": "Narzędzia",
    "hint": "CHWYT"
  },
  {
    "word": "Sekator",
    "category": "Narzędzia",
    "hint": "OGRÓD"
  },
  {
    "word": "Łopata",
    "category": "Narzędzia",
    "hint": "KOPANIE"
  },
  {
    "word": "Szpital",
    "category": "Budynki",
    "hint": "ZDROWIE"
  },
  {
    "word": "Szkoła",
    "category": "Budynki",
    "hint": "NAUKA"
  },
  {
    "word": "Bank",
    "category": "Budynki",
    "hint": "PIENIĄDZE"
  },
  {
    "word": "Lekarz",
    "category": "Zawody",
    "hint": "PACJENT"
  },
  {
    "word": "Nauczyciel",
    "category": "Zawody",
    "hint": "UCZEŃ"
  },
  {
    "word": "Policjant",
    "category": "Zawody",
    "hint": "PRAWO"
  },
  {
    "word": "Strażak",
    "category": "Zawody",
    "hint": "OGIEŃ"
  },
  {
    "word": "Pilot",
    "category": "Zawody",
    "hint": "SAMOLOT"
  },
  {
    "word": "Kucharz",
    "category": "Zawody",
    "hint": "KUCHNIA"
  },
  {
    "word": "Mechanik",
    "category": "Zawody",
    "hint": "NAPRAWA"
  },
  {
    "word": "Fryzjer",
    "category": "Zawody",
    "hint": "WŁOSY"
  },
  {
    "word": "Programista",
    "category": "Zawody",
    "hint": "KOD"
  },
  {
    "word": "Architekt",
    "category": "Zawody",
    "hint": "PROJEKT"
  },
  {
    "word": "Piłka",
    "category": "Sport",
    "hint": "MECZ"
  },
  {
    "word": "Siłownia",
    "category": "Sport",
    "hint": "TRENING"
  },
  {
    "word": "Bieżnia",
    "category": "Sport",
    "hint": "BIEGANIE"
  },
  {
    "word": "Medal",
    "category": "Sport",
    "hint": "ZWYCIĘSTWO"
  },
  {
    "word": "Pływanie",
    "category": "Sport",
    "hint": "WODA"
  },
  {
    "word": "Narty",
    "category": "Sport",
    "hint": "ZIMA"
  },
  {
    "word": "Deskorolka",
    "category": "Sport",
    "hint": "TRIKI"
  },
  {
    "word": "Hantle",
    "category": "Sport",
    "hint": "CIĘŻAR"
  },
  {
    "word": "Boisko",
    "category": "Sport",
    "hint": "MECZ"
  },
  {
    "word": "Tenis",
    "category": "Sport",
    "hint": "RAKIETKA"
  },
  {
    "word": "Burza",
    "category": "Pogoda",
    "hint": "PIORUN"
  },
  {
    "word": "Deszcz",
    "category": "Pogoda",
    "hint": "KROPLE"
  },
  {
    "word": "Śnieg",
    "category": "Pogoda",
    "hint": "ZIMA"
  },
  {
    "word": "Wiatr",
    "category": "Pogoda",
    "hint": "PODMUCH"
  },
  {
    "word": "Mgła",
    "category": "Pogoda",
    "hint": "WIDOCZNOŚĆ"
  },
  {
    "word": "Grad",
    "category": "Pogoda",
    "hint": "LODOWE KULKI"
  },
  {
    "word": "Tęcza",
    "category": "Pogoda",
    "hint": "KOLORY"
  },
  {
    "word": "Upał",
    "category": "Pogoda",
    "hint": "GORĄCO"
  },
  {
    "word": "Mróz",
    "category": "Pogoda",
    "hint": "ZIMNO"
  },
  {
    "word": "Huragan",
    "category": "Pogoda",
    "hint": "ŻYWIOŁ"
  },
  {
    "word": "Księżyc",
    "category": "Kosmos",
    "hint": "NOC"
  },
  {
    "word": "Słońce",
    "category": "Kosmos",
    "hint": "ŚWIATŁO"
  },
  {
    "word": "Planeta",
    "category": "Kosmos",
    "hint": "ORBITA"
  },
  {
    "word": "Gwiazda",
    "category": "Kosmos",
    "hint": "KOSMOS"
  },
  {
    "word": "Satelita",
    "category": "Kosmos",
    "hint": "ORBITA"
  },
  {
    "word": "Asteroida",
    "category": "Kosmos",
    "hint": "SKAŁA"
  },
  {
    "word": "Galaktyka",
    "category": "Kosmos",
    "hint": "DROGA MLECZNA"
  },
  {
    "word": "Kometa",
    "category": "Kosmos",
    "hint": "OGON"
  },
  {
    "word": "Astronauta",
    "category": "Kosmos",
    "hint": "HEŁM"
  },
  {
    "word": "Teleskop",
    "category": "Kosmos",
    "hint": "OBSERWACJA"
  },
  {
    "word": "Koszulka",
    "category": "Ubrania",
    "hint": "RĘKAWY"
  },
  {
    "word": "Spodnie",
    "category": "Ubrania",
    "hint": "NOGAWKI"
  },
  {
    "word": "Bluza",
    "category": "Ubrania",
    "hint": "KAPTUR"
  },
  {
    "word": "Kurtka",
    "category": "Ubrania",
    "hint": "ZIMA"
  },
  {
    "word": "Czapka",
    "category": "Ubrania",
    "hint": "GŁOWA"
  },
  {
    "word": "Szalik",
    "category": "Ubrania",
    "hint": "SZYJA"
  },
  {
    "word": "Rękawiczki",
    "category": "Ubrania",
    "hint": "DŁONIE"
  },
  {
    "word": "Skarpetki",
    "category": "Ubrania",
    "hint": "STOPY"
  },
  {
    "word": "Buty",
    "category": "Ubrania",
    "hint": "CHODZENIE"
  },
  {
    "word": "Pasek",
    "category": "Ubrania",
    "hint": "SPODNIE"
  },
  {
    "word": "Gitara",
    "category": "Instrumenty",
    "hint": "STRUNY"
  },
  {
    "word": "Pianino",
    "category": "Instrumenty",
    "hint": "KLAWISZE"
  },
  {
    "word": "Skrzypce",
    "category": "Instrumenty",
    "hint": "SMYCZEK"
  },
  {
    "word": "Trąbka",
    "category": "Instrumenty",
    "hint": "DĘTY"
  },
  {
    "word": "Perkusja",
    "category": "Instrumenty",
    "hint": "RYTM"
  },
  {
    "word": "Flet",
    "category": "Instrumenty",
    "hint": "DĘTY"
  },
  {
    "word": "Akordeon",
    "category": "Instrumenty",
    "hint": "MIESZEK"
  },
  {
    "word": "Harfa",
    "category": "Instrumenty",
    "hint": "STRUNY"
  },
  {
    "word": "Saksofon",
    "category": "Instrumenty",
    "hint": "JAZZ"
  },
  {
    "word": "Wiolonczela",
    "category": "Instrumenty",
    "hint": "ORKIESTRA"
  },
  {
    "word": "Róża",
    "category": "Rośliny",
    "hint": "KOLCE"
  },
  {
    "word": "Tulipan",
    "category": "Rośliny",
    "hint": "WIOSNA"
  },
  {
    "word": "Słonecznik",
    "category": "Rośliny",
    "hint": "ŻÓŁTY"
  },
  {
    "word": "Kaktus",
    "category": "Rośliny",
    "hint": "PUSTYNIA"
  },
  {
    "word": "Storczyk",
    "category": "Rośliny",
    "hint": "DONICZKA"
  },
  {
    "word": "Paproć",
    "category": "Rośliny",
    "hint": "LIŚCIE"
  },
  {
    "word": "Dąb",
    "category": "Rośliny",
    "hint": "DRZEWO"
  },
  {
    "word": "Sosna",
    "category": "Rośliny",
    "hint": "IGŁY"
  },
  {
    "word": "Brzoza",
    "category": "Rośliny",
    "hint": "BIAŁA KORA"
  },
  {
    "word": "Klon",
    "category": "Rośliny",
    "hint": "LIŚĆ"
  },
  {
    "word": "Most",
    "category": "Konstrukcje",
    "hint": "RZEKA"
  },
  {
    "word": "Tunel",
    "category": "Konstrukcje",
    "hint": "POD ZIEMIĄ"
  },
  {
    "word": "Latarnia",
    "category": "Konstrukcje",
    "hint": "ŚWIATŁO"
  },
  {
    "word": "Projektor",
    "category": "Elektronika",
    "hint": "DUŻY FORMAT"
  },
  {
    "word": "Czytnik e-booków",
    "category": "Elektronika",
    "hint": "CAŁA PÓŁKA W DŁONI"
  },
  {
    "word": "Tramwaj",
    "category": "Transport",
    "hint": "MIEJSKIE TORY"
  },
  {
    "word": "Hulajnoga",
    "category": "Transport",
    "hint": "ODPYCHANIE"
  },
  {
    "word": "Taboret",
    "category": "Meble",
    "hint": "BEZ OPARCIA"
  },
  {
    "word": "Parawan pokojowy",
    "category": "Meble",
    "hint": "ODROBINA PRYWATNOŚCI"
  },
  {
    "word": "Imadło",
    "category": "Narzędzia",
    "hint": "MOCNY UŚCISK"
  },
  {
    "word": "Pilnik",
    "category": "Narzędzia",
    "hint": "WYGŁADZANIE"
  },
  {
    "word": "Ratusz",
    "category": "Budynki",
    "hint": "SPRAWY MIASTA"
  },
  {
    "word": "Obserwatorium",
    "category": "Budynki",
    "hint": "NOCNY DYŻUR"
  },
  {
    "word": "Listonosz",
    "category": "Zawody",
    "hint": "CODZIENNA TRASA"
  },
  {
    "word": "Weterynarz",
    "category": "Zawody",
    "hint": "NIETYPOWY PACJENT"
  },
  {
    "word": "Szermierka",
    "category": "Sport",
    "hint": "POJEDYNEK"
  },
  {
    "word": "Badminton",
    "category": "Sport",
    "hint": "LOTKA"
  },
  {
    "word": "Szron",
    "category": "Pogoda",
    "hint": "BIAŁY PORANEK"
  },
  {
    "word": "Rosa",
    "category": "Pogoda",
    "hint": "MOKRA TRAWA"
  },
  {
    "word": "Mgławica",
    "category": "Kosmos",
    "hint": "KOSMICZNA CHMURA"
  },
  {
    "word": "Łazik marsjański",
    "category": "Kosmos",
    "hint": "ZDALNA WYPRAWA"
  },
  {
    "word": "Kamizelka",
    "category": "Ubrania",
    "hint": "BEZ RĘKAWÓW"
  },
  {
    "word": "Krawat",
    "category": "Ubrania",
    "hint": "WĘZEŁ"
  },
  {
    "word": "Puzon",
    "category": "Instrumenty",
    "hint": "SUWAK"
  },
  {
    "word": "Tamburyn",
    "category": "Instrumenty",
    "hint": "POTRZĄSANIE"
  },
  {
    "word": "Lawenda",
    "category": "Rośliny",
    "hint": "SPOKOJNY ZAPACH"
  },
  {
    "word": "Bambus",
    "category": "Rośliny",
    "hint": "SZYBKI WZROST"
  },
  {
    "word": "Wiadukt",
    "category": "Konstrukcje",
    "hint": "DROGA NAD DROGĄ"
  },
  {
    "word": "Zapora",
    "category": "Konstrukcje",
    "hint": "ZATRZYMANY NURT"
  }
];
