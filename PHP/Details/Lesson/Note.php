<?
include '../../Database.php';

$URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
$UserID = $SQL->query("SELECT UserID FROM users WHERE Link_FullAccess = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $Date = $_POST['Date'];
    $Subject = $_POST['Subject'];
    $Note = $_POST['Note'];

    $SQL->multi_query( "INSERT INTO LessonNotes VALUES ($UserID, $Date, '$Subject', '$Note')
                            ON DUPLICATE KEY UPDATE Note = '$Note';

                        DELETE FROM LessonNotes WHERE (UserID = $UserID) AND (Note = '')");
}
else
{
    http_response_code(403);
};