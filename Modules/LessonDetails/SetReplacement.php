<?
include '../../PHP/Database.php';

$Date = $_POST['Date'];
$Number = $_POST['Number'];
$Replacement = $_POST['Replacement'];

$SQL->query("INSERT INTO replacements VALUES (1, $Date, $Number, '$Replacement') ON DUPLICATE KEY UPDATE Replacement = '$Replacement'");