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
    $Change = $_POST['Change'];

    if ($Title == $Change)
        $SQL->multi_query("UPDATE `Changes` SET `Title` = NULL WHERE (`Date` = $Date) AND (`Index` = $Index) AND (`UserID` = $UserID);
                           DELETE FROM `Changes` WHERE (`Title` = NULL) AND (`Place` = NULL) AND (`Educator` = NULL)");
    else
        $SQL->query("INSERT INTO `Changes` VALUES ($UserID, $Date, $Index, '$Change', NULL, NULL)
                        ON DUPLICATE KEY UPDATE `Title` = '$Change'");
}
else
{
    http_response_code(403);
};