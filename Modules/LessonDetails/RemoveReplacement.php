<?
include '../../PHP/Database.php';

$Date = $_POST['Date'];
$Number = $_POST['Number'];
$Replacement = $_POST['Replacement'];

$SQL->query("DELETE FROM replacements WHERE (Date = $Date) AND (Number = $Number)");