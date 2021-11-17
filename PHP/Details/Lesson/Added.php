<?
include '../../Database.php';

$URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
$UserID = $SQL->query("SELECT `UserID` FROM `users` WHERE `Link_FullAccess` = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $Date = $_POST['Date'];
    $Index = $_POST['Index'];
    $Title = $_POST['Title'];

    if ($Title === '')
        $SQL->query("DELETE FROM `AddedLessons` WHERE (`Date` = $Date) AND (`Index` = $Index) AND (`UserID` = $UserID)");
    else
        $SQL->query("UPDATE `AddedLessons` SET `Title` = '$Title' WHERE (`Date` = $Date) AND (`Index` = $Index) AND (`UserID` = $UserID)");
}
else
{
    http_response_code(403);
};