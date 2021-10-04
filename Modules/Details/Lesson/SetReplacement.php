<?
include '../../../PHP/Database.php';

$URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
$UserID = $SQL->query("SELECT UserID FROM users WHERE Link_FullAccess = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $Date = $_POST['Date'];
    $LessonNumber = $_POST['LessonNumber'];
    $Subject = $_POST['Subject'];
    $Replacement = $_POST['Replacement'];

    if ($Subject == $Replacement)
        $SQL->query("DELETE FROM replacements WHERE (Date = $Date) AND (LessonNumber = $LessonNumber) AND (UserID = $UserID)");
    else
        $SQL->query("INSERT INTO replacements VALUES ($UserID, $Date, $LessonNumber, '$Replacement') ON DUPLICATE KEY UPDATE Replacement = '$Replacement'");
}
else
{
    http_response_code(403);
};