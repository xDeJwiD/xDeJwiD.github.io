# IMPOSTOR V3

Wersja na bazie V2. Osobny folder, bez zmian w V2 ani we wspólnych oryginalnych avatarach.
Uruchom `index.html` lub udostępnij cały folder jako statyczną stronę. Gra nie wymaga
instalacji npm ani budowania. Zależności npm służą wyłącznie testom w `tests/`.

## Podział kodu

| Plik | Odpowiedzialność |
| --- | --- |
| `game-core.js` | Reguły, losowanie, stan rundy, punktacja, walidacja i import starego zapisu |
| `impostor.js` | Formularze, przekazywanie telefonu, animacje, obsługa pamięci przeglądarki |
| `impostor.css` | Dotychczasowy wygląd V2 oraz poprawki dostępności i przepełnienia treści |
| `words/` | Zestawy haseł |
| `avatars/` | Kopie istniejących avatarów w rozdzielczości 512 × 512 |
| `tests/` | Testy reguł oraz przepływów DOM w jsdom |

## 1. Stan gry, punktacja i wznowienie

- Role odwołują się do niezmiennych ID graczy, a nie ich pozycji na liście.
- Każda runda ma ID, kopię swoich uczestników, role, hasło, wiedzę impostora,
  osobę rozpoczynającą, etap (`entry`, `reveal`, `playing`) i pozycję przekazania telefonu.
- Edycja składu dotyczy następnego rozdania. Wynik aktualnej rundy rozlicza się
  według jej zapamiętanych uczestników. Nowo dodana osoba nie dostaje punktu za starą rundę.
  Usunięta osoba przestaje być na liście wyników; jej punkt nie przechodzi na inną osobę.
- Rozliczenie i nowe rozdanie powstają jako jedna zmiana stanu i jeden zapis.
  Nieudane rozdanie nie nalicza punktów. Ponowna odpowiedź dla starego ID rundy jest odrzucana.
- Odświeżenie podczas wpisywania nicków albo odczytywania ról zachowuje właściwą osobę,
  hasło i role. „Kontynuuj” zawsze zaczyna od ukrytego sekretu. Po zakończeniu rozdania
  wznowienie prowadzi do lobby, bez konieczności powtarzania animacji.
- Zapis ma osobny klucz `impostorParty_v3`. V2 i COPY nie nadpisują go.
- Opcjonalny przycisk importu przenosi poprawny skład, punkty, ustawienia i zgodną historię
  z `impostorParty_v10`. Stary zapis pozostaje nietknięty. Nie importujemy niekompletnej
  starej rundy: pierwsze nowe rozdanie nie pyta o jej wynik.
- Niepoprawny zapis jest odrzucany. Brak dostępu do pamięci lub błąd zapisu nie zatrzymuje
  gry, lecz wyświetla informację, że nie należy odświeżać strony.
- Zmiana zapisu przez inną kartę ukrywa sekret, odrzuca nieaktualny formularz i pozwala
  kontynuować aktualny zapis. Gra nadal jest przeznaczona do prowadzenia w jednej karcie.

## 2. Gracze i ustawienia

- Formularz graczy pracuje na osobnej kopii. „Anuluj” odrzuca nazwy, kolejność, dodawanie,
  usuwanie oraz zlecone zerowanie punktów/historii. Reset staje się trwały dopiero po zapisie.
- Usuwanie kończy się na trzech osobach. Limit dwunastu obowiązuje również przy edycji.
- Puste i powtarzające się nazwy są odrzucane przy tworzeniu oraz zapisie zmian.
  Limit nazwy wynosi 40 znaków. Porównanie pomija wielkość liter i normalizuje Unicode.
- Ustawienia są odtwarzane z aktualnego stanu przy każdym otwarciu. Anulowane zaznaczenia
  nie zostają w następnym formularzu. Zmiana wiedzy/liczby impostorów dotyczy kolejnej rundy.
- Pierwsze przekazanie telefonu pokazuje imię ustalone w kolejności osób, zanim ta osoba
  wpisze nick. Nazwy w HTML są escapowane, a tajne treści wstawiane przez `textContent`.

## 3. Hasła i losowanie

- Usunięte niedziałające opcje AAA/BBB oraz pusty zestaw Custom i jego plik.
  Starsze zapisy z zaznaczonym Custom zachowują pozostałe zestawy; przy braku innych
  otrzymują Standardowe. Trwająca runda pozostaje bez zmian.
- Baza zawiera 420 różnych haseł: Standardowe 142, Państwa 84, Jedzenie 40,
  Zwierzęta 42, Przedmioty 40, Miejsca 36 i Wakacje 36.
  Powtórzenia między zestawami usunięto, pozostawiając hasło w zestawie tematycznym.
  Test sprawdza unikalność samych haseł w całej bazie, niezależnie od wielkości liter.
- Pula oraz liczniki deduplikują parę hasło/kategoria. Podpowiedź i kategoria nie mogą
  być dosłownie równe odpowiedzi. Każdy wpis wymaga hasła, kategorii i podpowiedzi.
- Wyczerpanie puli resetuje wyłącznie historię aktualnie wybranych haseł. Historia innych
  zestawów pozostaje. Na granicy cyklu unikamy natychmiastowego powtórzenia, jeśli są alternatywy.
- Nie ma losowania z pustej puli ani nieograniczonych pętli wyszukiwania impostorów.

Zasady z V2 pozostają: Default = 87% jeden, 8% dwóch, 5% wszyscy; tryby 1 i 2 są stałe.
Dawne „1+” nazywa się „2+” i nadal oznacza od dwóch do n−1 impostorów. W trybie wszyscy
impostorzy odpowiedź „Tak” daje wszystkim punkt, a „Nie” nie daje punktu nikomu.
Rozpoczynający jest losowany od nowa w każdej rundzie spośród aktualnych graczy.
Każdy ma równą szansę, także osoba rozpoczynająca poprzednią rundę. Wynik zostaje zapisany
przed animacją, więc odświeżenie nie losuje go ponownie. Animacja zachowuje dotychczasowy przebieg.

## 4. Sekret, animacje i dostępność

- Ekran sekretu przywrócono do układu V2: avatar, informacja dla kogo jest telefon,
  osobna karta hasła z instrukcją oraz przycisk „Przytrzymaj, by odsłonić”. Po około
  900 ms przytrzymania pojawia się hasło/rola, a przycisk zastępuje niebieski
  „Ukryj i podaj dalej”. Oba zachowują minimalną wysokość 72 px. Nie ma powiększanego
  pola przycisku ani dodatkowego przycisku „Ukryj sekret”.
- Zwolnienie początkowego przytrzymania nie ukrywa dopiero co odsłoniętego hasła.
- Anulowanie gestu, utrata fokusu i schowanie aplikacji przerywają przytrzymanie.
  Utrata widoczności/fokusu ukrywa odczytany sekret bez zmiany gracza.
- Tekst sekretu jest usuwany z DOM przy ukryciu; nie czeka niewidoczny pod przyciskiem.
- Przywrócono też czerwone wyróżnienie impostora i kategorii z V2. Jest usuwane
  przy ukryciu sekretu i przed pokazaniem kolejnej osoby.
- Animacja przekazania ma jeden anulowalny timer i nie używa pozostających nasłuchów
  `transitionend`. Reset pozycji grafik jest natychmiastowy.
- Obsługiwane jest przytrzymanie Spacji/Entera. Checkboxy i radio są dostępne z klawiatury,
  fokus jest widoczny, dialog zatrzymuje Tab wewnątrz i blokuje interakcję z tłem przez `inert`.
- Obszar avatara ma wymiary z V2. W razie potrzeby dialog przewija się,
  zamiast ucinać przycisk. Długie nazwy zawijają się. Powiększenie strony jest dozwolone.
- Preferencja ograniczania ruchu wyłącza zbędne animacje.

## 5. Grafiki i zachowanie wyglądu

Opcja „Odsłoń Beach w następnej rundzie” znajduje się wyłącznie w edycji graczy.
Normal używa `avatars/normal/av_*.png`, a Beach `avatars/beach/avb_*.png`.
Nowa gra z menu zawsze rozpoczyna z Normal, bez zaplanowanej zmiany. Zapisanie opcji
w edycji planuje jednorazowe przejście w następnym rozdaniu; anulowanie je odrzuca.
Odsłonięcie sekretu zapisuje przejście danego gracza do Beach. Ukrycie sekretu,
utrata fokusu i odświeżenie nie cofają odsłoniętego avatara. Gdy wszyscy odkryją role,
Beach staje się stałym wyglądem również w kolejnych rundach. Opcja jest wtedy nieaktywna.
Zmiana nie dotyczy ról ani punktacji. Wspólne tło pozostaje bez zmian.

W obu trybach przytrzymywanie sekretu w zaplanowanej rundzie płynnie zmienia Normal
w Beach. Anulowanie niedokończonego przytrzymania przywraca Normal. Nie ma przejścia
odwrotnego. Przejście dotyczy dwóch wewnętrznych warstw
obrazu; istniejące przesuwanie kontenerów postaci i jego timer pozostają bez zmian.
Druga warstwa pojawia się dopiero po załadowaniu obrazu. Opóźnione ładowanie poprzedniej
osoby nie zmienia kolejnej postaci. W razie błędu obrazu pozostaje podstawowy avatar.

Paleta obu trybów: ciemny ocean, turkus, piaskowe złoto i koral. Zachowane są karty,
logo, avatary, styl przycisków i układ początkowych ustawień.
Ekran sekretu ma układ z V2; poprawki przepełnienia pozwalają przewinąć dłuższą treść.
V3 nie blokuje wejścia do gry oczekiwaniem na pobranie/dekodowanie avatarów. Nowe kopie PNG
mają łącznie 2 307 604 bajty zamiast 8 502 607 bajtów, czyli o 72,9% mniej; postacie i kadr
pozostają te same. V3 jest samodzielna i nie wymaga plików ze starszych folderów.
Avatary rozpoznają warianty imion z V2 oraz nazwy z cyframi i emoji. Najpierw sprawdzane
jest imię z listy kolejności, a jeżeli go nie rozpoznano — wpisany nick. Dzięki temu
numer osoby na początkowej liście nie blokuje przypisania właściwej postaci.

## Nieświadomy impostor i dodatkowe zestawy

Wspólne tło pod przezroczystymi avatarami znajduje się w `avatars/av_background.jpg`.
To dostarczony krajobraz. Aby zmienić tło, podmień plik albo zmień adres w zmiennej
CSS `--avatar-backdrop`. Dotyczy listy graczy, edycji, losowania, statystyk i ekranu
sekretu. W ekranie sekretu tło pozostaje nieruchome podczas przejścia postaci.

Opcja „Impostor zna swoją rolę” jest domyślnie włączona. Można ją wyłączyć przy
wiedzy „Brak”, przed grą lub w ustawieniach następnego rozdania. Przy „Kategorii”
i „Podpowiedzi” przełącznik jest ukryty i obowiązuje zwykłe informowanie o roli.
Przy „Brak” pojawia się bezpośrednio pod opcjami wiedzy impostora, bez dodatkowego opisu.
Poprzedni wybór przełącznika zostaje zachowany po powrocie do „Brak”.

Nieświadomi impostorzy otrzymują wspólne alternatywne hasło z tej samej kategorii
i wybranych zestawów. Ich ekran wygląda jak ekran zwykłego gracza: bez czerwonego
wyróżnienia, etykiety impostora, kategorii i podpowiedzi. Dotyczy to również rund,
w których wszyscy są impostorami. Punktacja i rzeczywiste role pozostają bez zmian.
Oba hasła oraz aktywny wariant są zapisywane w rundzie, więc odświeżenie ich nie zmienia.
Starsze zapisy V3 działają jak wcześniej, z jawną rolą impostora.

W tym wariancie losowane są tylko hasła mające inne hasło w tej samej kategorii.
Pula bez takiej pary powoduje komunikat i nie rozlicza częściowo poprzedniej rundy.
Historia ogranicza powtórzenia głównego hasła; alternatywne hasła mogą się powtarzać.

Nowe pliki `words_objects.js`, `words_places.js` i `words_holidays.js` zawierają
odpowiednio 40, 36 i 36 haseł, w formacie `word`, `category`, `hint`. Każdy zestaw ma
cztery mniejsze kategorie, ułatwiające dobieranie powiązanej alternatywy.
Zestawy można łączyć z dotychczasowymi za pomocą zwykłych pól wyboru.

## Testy

Z katalogu repozytorium, Node.js 24:

```powershell
npm.cmd ci --prefix game/impostor/v3/tests
npm.cmd test --prefix game/impostor/v3/tests
```

Same testy reguł, bez instalowania zależności:

```powershell
node --test game/impostor/v3/tests/core.test.cjs
```

Sprawdzone: 61 testów obu trybów (reguły, 100 kolejnych rund, pełne przepływy DOM, wznowienie,
punktacja po zmianach składu, anulowanie, pusta pula, uszkodzone zapisy, błędy pamięci,
obsługa gestów i klawiatury, import, dane w HTML, reguły CSS pola sekretu).

jsdom nie renderuje układu jak przeglądarka. W tym środowisku nie było podłączonej
przeglądarki; wizualny odbiór na telefonie pozostaje do wykonania. Scenariusze odbioru:

1. Ekran ustawień oraz sekret na ekranach 360 × 640 i 390 × 844, także poziomo.
2. Krótkie/długie przytrzymanie, schowanie aplikacji i powrót, ponowne odsłonięcie.
3. Szybkie przekazanie przed końcem animacji avatara; ostatni gracz i następna runda.
4. Długie nicki/hasła, powiększenie strony, obsługa klawiaturą i ograniczony ruch.
5. Odświeżenie przed wpisaniem nicku, po odsłonięciu i podczas następnego rozdania.

## Granice lokalnej gry

Wynik nadal określają gracze, a telefon przekazują sobie samodzielnie. Nie dodano PIN-ów,
konta, serwera ani zdalnych urządzeń. Osoba celowo korzystająca z narzędzi deweloperskich
lub pamięci przeglądarki może odczytać stan. To nie jest rozwiązanie do rozgrywek wymagających
technicznego zabezpieczenia przed oszustwem; ukrywanie chroni przed przypadkowym podejrzeniem.
Import zachowuje tylko dane, które da się odtworzyć, nie zgaduje brakującego stanu V2.
