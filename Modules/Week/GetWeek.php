<?
include '../../PHP/Database.php';

$URL = $_POST['URL'];
$TimetableID = $SQL->query("SELECT TimetableID FROM timetables WHERE (Link_FullAccess = '$URL') OR (Link_ReadOnly = '$URL')");

if ($TimetableID->num_rows === 1)
{
    $TimetableID = $TimetableID->fetch_row()[0];
    $From = $_POST['From'];
    $To = $_POST['To'];
    
    $aHometasks = [];
    foreach ($SQL->query("SELECT Subject, Date, Text, Attachments FROM hometasks WHERE (Date >= $From) AND (Date <= $To)")->fetch_all() as &$aLesson)
        array_push($aHometasks, ['Subject' => $aLesson[0], 'Date' => (int) $aLesson[1], 'Text' => $aLesson[2], 'Attachments' => json_decode($aLesson[3])]);
    
    $aReplacements = [];
    foreach ($SQL->query("SELECT Date, LessonNumber, Replacement FROM replacements WHERE (Date >= $From) AND (Date <= $To)")->fetch_all() as &$aReplacement)
        array_push($aReplacements, ['Date' => (int) $aReplacement[0], 'LessonNumber' => (int) $aReplacement[1], 'Replacement' => $aReplacement[2]]);
    
    echo json_encode(['Hometasks' => $aHometasks, 'Replacements' => $aReplacements]);
}
else
{
    http_response_code(403);
};