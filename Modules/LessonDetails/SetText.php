<?
include '../../PHP/Database.php';

$URL = $_POST['URL'];
$TimetableID = $SQL->query("SELECT TimetableID FROM timetables WHERE Link_FullAccess = '$URL'");

if ($TimetableID->num_rows === 1)
{
    $TimetableID = $TimetableID->fetch_row()[0];
    $Date = $_POST['Date'];
    $Subject = $_POST['Subject'];
    $Text = $_POST['Text'];

    if ($Text == '')
        $SQL->query("DELETE FROM hometasks WHERE (Date = $Date) AND (Subject = '$Subject') AND (TimetableID = $TimetableID)");
    else
        $SQL->query("INSERT INTO hometasks VALUES ($TimetableID, '$Subject', $Date, '$Text') ON DUPLICATE KEY UPDATE Text = '$Text'");
}
else
{
    http_response_code(403);
};