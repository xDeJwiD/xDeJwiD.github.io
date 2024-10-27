<?php
echo "ło kurwa, ależ to (nie) chodzi";
$conn = new mysqli($_SERVER['DB_HOST'],$_SERVER['DB_LOGIN'],$_SERVER['DB_PASSWD'],$_SERVER['DB_DB']) or die("chuj");
$lista = $_GET['a'];
foreach ($lista as $syf) {
    $syf = $lista[$syf] ;
}
echo $kto,$czyanonim,$tresc,$kategoria,$email,$tytul,
$conn->query("INSERT INTO `zarciki_temp` VALUES ($kto,$czyanonim,$tresc,$kategoria,$email,$tytul,null)")
?>
<!-- <!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wszystko poszło sprawnie</title>
    <style>
        a:visited, a:hover, a:not(:hover), a{
            color:red;
        }
    </style>
</head>
<body>

    <h1><big><big><span style="font-family:monospace;">Obywatelu!</span></big></big></h1>
    <p>Serwer otrzymał wasze żądanie (jakoś).</p>
    <p>Na ten moment admini są jednak chuja warci i nic nie działa.</p>
    <p>Nieważne, jakiego dzieła sztuki tam nie utworzyłeś, serwer ma to w dupie.</p>
    <p>Za utrudnienia <del>chuj ci w dupę</del> przepraszamy.</p>
    <p>Masz medal na pocieszenie:</p>
    <img src="./gut.png" alt="gut" width="400" height="400" align="center">
    <a style="text-decoration:none" href="https://zerdzinski.pl"><h1><big><big><span style="font-family:monospace;">Odmaszerować!</span></big></big></h1></a>
    <p><span style="font-family:monospace;"><a href="https://nonsa.pl/wiki/Gra:Strona_0,0009" title="?"><del>Nie wierzysz w nasze przeprosiny?</del></a></span></p>
</body>
</html> -->