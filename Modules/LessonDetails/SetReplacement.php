<?
include '../../PHP/Database.php';

$URL = $_POST['URL'];
$TimetableID = $SQL->query("SELECT TimetableID FROM timetables WHERE Link_FullAccess = '$URL'");

if ($TimetableID->num_rows === 1)
{
    $TimetableID = $TimetableID->fetch_row()[0];
    $Date = $_POST['Date'];
    $LessonNumber = $_POST['LessonNumber'];
    $Subject = $_POST['Subject'];
    $Replacement = $_POST['Replacement'];

    if ($Subject == $Replacement)
        $SQL->query("DELETE FROM replacements WHERE (Date = $Date) AND (LessonNumber = $LessonNumber) AND (TimetableID = $TimetableID)");
    else
        $SQL->query("INSERT INTO replacements VALUES ($TimetableID, $Date, $LessonNumber, '$Replacement') ON DUPLICATE KEY UPDATE Replacement = '$Replacement'");
}
else
{
    http_response_code(403);
};