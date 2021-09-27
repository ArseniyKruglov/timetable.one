<?
include '../../PHP/Database.php';

$URL = $_POST['URL'];
$UserID = $SQL->query("SELECT UserID FROM users WHERE Link_FullAccess = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $Date = $_POST['Date'];
    $LessonNumber = $_POST['LessonNumber'];
    $Subject = $_POST['Subject'];

    if ($Subject === '')
        $SQL->query("DELETE FROM added_lessons WHERE (Date = $Date) AND (LessonNumber = $LessonNumber) AND (UserID = $UserID)");
    else
        $SQL->query("UPDATE added_lessons SET Subject = '$Subject' WHERE (Date = $Date) AND (LessonNumber = $LessonNumber) AND (UserID = $UserID)");
}
else
{
    http_response_code(403);
};