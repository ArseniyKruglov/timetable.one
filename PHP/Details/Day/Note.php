<?
include '../..//Database.php';

$URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
$UserID = $SQL->query("SELECT UserID FROM users WHERE Link_FullAccess = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $Date = $_POST['Date'];
    $Note = $_POST['Note'];

    if ($Note == '')
        $SQL->query("DELETE FROM DayNotes WHERE (Date = $Date) AND (UserID = $UserID)");
    else
        $SQL->query("INSERT INTO DayNotes VALUES ($UserID, $Date, '$Note')
                        ON DUPLICATE KEY UPDATE Note = '$Note'");
}
else
{
    http_response_code(403);
};