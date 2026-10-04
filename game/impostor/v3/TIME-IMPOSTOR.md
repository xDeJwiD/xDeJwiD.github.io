# Time Impostor w V3

`time.html`, `time.js`, `time-core.js` i `time.css` są obok plików normalnego trybu.
To kopia jego przepływu i reguł. Oba tryby współdzielą `impostor.css`, logo, avatary
Normal/Beach i tło. Dane Time mają własny klucz `timeImpostor_v3`.

Zachowane: lista osób, wpisywanie nicków, przytrzymanie przez 900 ms, animacja avatarów,
ukrywanie sekretu po utracie fokusu, wznowienie, edycja graczy, punkty i atomowe rozliczenie
wyniku z następnym rozdaniem. Przycisk „Zakończ rundę” pyta, czy impostor wygrał.

Zamiast zestawów haseł wybiera się zakres 0–60 sekund i 0–2 miejsca po przecinku.
Gracze dostają jeden czas. Impostor dostaje przedział, maskę cyfr albo samą rolę.
Podpowiedź przedziałowa to pasmo 10 sekund przycięte do wybranych granic; maska
zastępuje cyfry przez X. Wąski lub stały zakres może zdradzić wynik.

Po rozdaniu od razu pojawia się wspólny timer, bez losowania rozpoczynającego ani
przypisywania prób do osób. START → STOP i wynik → RESET → kolejny START. Wynik ma dokładność
wybraną dla trwającej rundy. Nie jest zapisywany ani automatycznie punktowany.
Opuszczenie ekranu przerywa bieżący pomiar. Statystyki są dostępne pod timerem.
Zmiany ustawień dotyczą następnego rozdania.

„Pokazuj czas na żywo” jest domyślnie wyłączone: czas widać dopiero po zatrzymaniu.
Po włączeniu licznik odświeża się podczas pomiaru. STOP zatrzymuje również odświeżanie,
a następne kliknięcie tylko resetuje przycisk do START, bez uruchamiania pomiaru.

Poprzedni prototyp w osobnym folderze został usunięty. Jego zapis `timeImpostor_v1`
nie jest importowany: nie zawierał punktacji ani stanu rundy zgodnego z V3.

Weryfikacja: `npm.cmd test --prefix game/impostor/v3/tests` — testy obu trybów.
Testy jsdom sprawdzają przepływ i zdarzenia, nie renderują wyglądu na telefonie.
