<?
include 'PHP/Database.php';

$URL = substr($_SERVER['REQUEST_URI'], 1);

$TimetableID = $SQL->query("SELECT TimetableID FROM timetables WHERE Link_FullAccess = '$URL'");

if ($TimetableID->num_rows === 1)
{
    $TimetableID = $TimetableID->fetch_row()[0];
    $FullAcess = true;
    include 'MainSequence.php';
}
else
{
    $TimetableID = $SQL->query("SELECT TimetableID FROM timetables WHERE Link_ReadOnly = '$URL'");

    if ($TimetableID->num_rows === 1)
    {
        $TimetableID = $TimetableID->fetch_row()[0];
        include 'MainSequence.php';
    }
    else
    {
        http_response_code(404);
    };
};
?>