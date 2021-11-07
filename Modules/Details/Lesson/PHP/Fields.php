<?
include '../../../PHP/Database.php';

$URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
$UserID = $SQL->query("SELECT UserID FROM users WHERE Link_FullAccess = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $TimetableID = $_POST['TimetableID'];
    $DayOfTimetable = $_POST['DayOfTimetable'];
    $Number = $_POST['Number'];

    $Request = "DELETE FROM Fields WHERE (UserID = $UserID) AND (TimetableID = $TimetableID) AND (DayOfTimetable = $DayOfTimetable) AND (Number = $Number);";
    for ($i = 0; $i < count($_POST['UserField']; $i++)
        $Request .= "INSERT INTO Fields (UserID, TimetableID, DayOfTimetable, Number) VALUES ($UserID, $TimetableID, $DayOfTimetable, $Number);";
    $SQL->multi_query($Request);
}
else
{
    http_response_code(403);
};