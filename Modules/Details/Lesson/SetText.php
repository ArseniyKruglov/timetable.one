<?
include '../../../PHP/Database.php';

$URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
$UserID = $SQL->query("SELECT UserID FROM users WHERE Link_FullAccess = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $Date = $_POST['Date'];
    $Subject = $_POST['Subject'];
    $Text = $_POST['Text'];

    if ($Text == '')
        $SQL->query("DELETE FROM LessonNotes WHERE (Date = $Date) AND (Subject = '$Subject') AND (UserID = $UserID)");
    else
        $SQL->query("INSERT INTO LessonNotes VALUES ($UserID, $Date, '$Subject', '$Text') ON DUPLICATE KEY UPDATE Text = '$Text'");
}
else
{
    http_response_code(403);
};