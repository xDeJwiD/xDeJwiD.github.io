<?php
$conn = mysqli_connect($_SERVER['DB_HOST'],$_SERVER['DB_LOGIN'],$_SERVER['DB_PASSWD'],$_SERVER['DB_DB']);
$conn->query("SET NAMES 'utf8'");
$sql = "SELECT * FROM `zarciki` ORDER BY rand() LIMIT 1";
$wynik = mysqli_query($conn, $sql);
$info = mysqli_fetch_assoc($wynik);
$ile = $info["Lp"];
$odczyty = mysqli_query($conn,"UPDATE `zarciki` SET `odczyty` = `odczyty` + 1 WHERE `Lp` = $ile")
?>
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://zerdzinski.pl/heh/joke.css">
    <title>Żarciki itp.</title>
    <style>
        :root{
            --wymiar: calc(1vw + 0.5625vh);
            --mniej: calc(0.75 * var(--wymiar));
        }
        .heh {
            position: relative;
            overflow:clip;
        }
        p, h1{
            text-align: center;
        }
        .content{
            height: 62.5%;
            overflow:hidden;
            font-size: var(--wymiar);
        }
        .kod{
            font-family: monospace;
            font-size: var(--mniej);
        }
        footer {
            margin:auto;
            clear: both;
            width:100%;
            position: absolute;
            bottom: 0;
            height: 10vh;
            text-align: center;
        }
        footer button{
            display: inline-block;
            height: 7vh;
            width:20vw;
            margin-left: 2vw;;
        }
        .heh table{
            font-size: var(--mniej);
            text-align: center;
            position:absolute;
            left:10%;
            width:80%;
            bottom: 0;
            margin-bottom: 2vh;
        }
        th{
            text-align: center;
        }
        
    </style>
</head>


<body>

    <div class="background"></div>
    <div class="menu">
        <ul>
            <li><a href="https://zerdzinski.pl">Home</a></li>
            <li><a href="#">Kontakt</a></li>
            <li><a href="../sklep/sklep.html">Sklep</a></li>
        </ul>

        <ul class="ikony">
            <li>
                <a href="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                        </svg>
                </a>
            </li>
            <li>
                <a href="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                </a>
            </li>
            <li>
                <a href="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart2" viewBox="0 0 16 16">
                        <path
                            d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                    </svg>
                </a>
            </li>
        </ul>
    </div>
    <div class="heh">
        <h1><big><big>Losowe hehe</big></big></h1>
        <p><span class="kod">Numer żartu: <?php echo $info["Lp"]; ?>, obejrzane <?php echo $info["odczyty"] ?> razy</span></p>
        <div class="content">
            <h4 style="text-align:center">Tytuł żartu: "<?php echo $info['tytul'] ?>"</h4>
        <p style="text-align:center;"><?php echo $info["tresc"]?></p>

        <table >
            <tr>
                <th colspan="2">Kto za to odpowiada? </th>
            </tr>
            <tr>
                <td>Kto: </td>
                <td><?php echo $info['kto']?>
                </td>
            </tr>
            <tr>
                <td>Coś więcej o tej osobie: </td>
                <td><?php echo $info['email']?>
                </td>
            </tr>
            <tr>
                <td>Kategoria żartu: </td>
                <td><?php echo $info['kategoria']?></td>
            </tr>
            <tr>
                <td>Kiedy to tu się pojawiło? </td>
                <td><?php echo $info['kiedy']?></td>
            </tr>
            </table>
            </div>
            </div>
    <footer>
                <button onclick="window.location.reload();">Dawaj następny!</button>
                <a href="https://zerdzinski.pl/heh/dodajzarcik.php"><button>Jesteś lepszy od nas? Dodaj własny żart!</button></a>


    </footer>
</body>

</html>