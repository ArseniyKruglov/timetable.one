<?
include '../../PHP/Database.php';

$Subject = $_POST['Subject'];
$Date = $_POST['Date'];
$Text = $_POST['Text'];

if ($Text == '')
{
    $SQL->query("DELETE FROM hometasks WHERE (Date = $Date) AND (Lesson = '$Subject')");
}
else
    $SQL->query("INSERT INTO hometasks VALUES (1, '$Subject', $Date, '$Text', '[]') ON DUPLICATE KEY UPDATE Text = '$Text'");