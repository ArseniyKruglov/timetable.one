<?
header('Status: 200');

mail
(
    'arseniy.krugloff@gmail.com',
    'Ошибка timetable.one',
    $_POST['Message'] . ' on line ' . $_POST['Line'] . ' at ' . $_POST['URL']
);