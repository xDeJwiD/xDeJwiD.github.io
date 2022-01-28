<?php
    $conn = mysqli_connect($_SERVER['DB_HOST'],$_SERVER['DB_LOGIN'],$_SERVER['DB_PASSWD'],$_SERVER['DB_DB']);
    $conn->query("SET NAMES 'utf8'");
    $sql = "SELECT * FROM `zarciki_temp`";
    $wynik = mysqli_query($conn, $sql);
    $info = mysqli_fetch_assoc($wynik);
?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://zerdzinski.pl/heh/joke.css">
    <title>Żarciki itp.</title>
    <style>
    .wpisz {

        border-radius: 25px;
        background-color: pink;
        margin: 5vh auto 0;
        height: 70vh;
        width: 80vw;
        line-height: 1.5em;
        padding-right:2vw;
    }

    .wpisz * {
        margin-top: 1vh;
        margin-left: 3vw;
    }

    .wpisz span,
    .wpisz p,
    .wpisz del,
    .wpisz i,
    .wpisz table * {
        margin: 0;
        padding: 0;
    }

    .wpisz label {
        margin-left: 1vw;
    }

    .kod {
        font-family: monospace;
    }
    .wpisz table{
        width: 100%;
        margin: 0;
        border:hidden;
        line-height: 2em;
    }
    .wpisz table tr td{
       width:20%;
       text-align: center;
    }
    .wpisz table tr td span{
        text-align: left;
    
    }
    .wpisz table input{
        width:100%;
    }
    .wpisz table tr td:nth-of-type(2){
        text-align: left;
    }

    .wpisz table tr:nth-of-type(2) td:first-of-type{
        text-align: left;
    }
    .err{
        color:red;
        text-align: center;
    }

    </style>
    <script>
         actionreplay = () => {
             if(document.getElementById('tresc').value != '' ){return true;} else {document.querySelector('.err').textContent = 'Taki chuj! A treść żartu?'; return false;}
         }

    </script>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-person" viewBox="0 0 16 16">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                    </svg>
                </a>
            </li>
            <li>
                <a href="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-search" viewBox="0 0 16 16">
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                </a>
            </li>
            <li>
                <a href="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-cart2" viewBox="0 0 16 16">
                        <path
                            d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                    </svg>
                </a>
            </li>
        </ul>
    </div>
    <article>
        <center>
            <h1><big>Dodaj własny żart!</big></h1>
        </center>
        <div class="wpisz">
            <form action="gut.php" method="get" onsubmit="return actionreplay();" id="dodaj">
                <p><i>Jedynie pole <span class="kod">treść</span> jest wymagane.</i></p><br>

                <table>
                    <tr>
                        <td rowspan="2"><label for="kto">Kim jesteś?</label></td>
                        <td><input type="text" name="a[]" id="kto" style="width:30%"></td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" name="a[]" id="czyanonim" style="width:2vw;"> <span><label for="czyanonim">Olać tę
                                    informację i jej nie wyświetlać?</label></span></td>
                    </tr><br>
                    <tr>
                        <td> <label for="email">Coś więcej o Tobie?</label></td>
                        <td>
                            <input type="text" name="a[]" id="email" style="width:60%;">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="tresc" >Treść żartu? <i>tak do 1k znaków plz </i> <del>Nie rób takich wielkich
                                    oczu, po to tu jesteś</del></label>
                        </td>
                        <td> <input type="text" name="a[]" id="tresc" style="height:15vh;">
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="kategoria">Jak byś opisał ten żart? <i>Twoja stara</i>, <i>zasłyszane na
                                    targu</i>&nbsp;?</label>
                        </td>
                        <td> <input type="text" name="a[]" id="kategoria"></td>
                    </tr>
                    <tr>
                        <td>
                            <label for="tytul">Dasz temu arcydziełu jakiś tytuł?</label>
                        </td>
                        <td><input type="text" name="a[]" id="tytul"></td>
                    </tr>
                    <tr>
                    <td colspan="2">
                    </td><b><p class="err">
                    </p></b></tr>
                </table>

            <button type="submit">Gotowe?</button>




            </form>    </div>
    </article>