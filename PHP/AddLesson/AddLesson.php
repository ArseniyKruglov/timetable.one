<?
include '../Database.php';

$URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
$UserID = $SQL->query("SELECT `UserID` FROM `users` WHERE `Link_FullAccess` = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $Date = $_POST['Date'];
    $Index = $_POST['Index'];
    $Title = $_POST['Title'];
   
    $SQL->query("INSERT INTO `SuddenLessons` VALUES ($UserID, $Date, $Index, '$Title')");
}
else
{
    http_response_code(403);
};