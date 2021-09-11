<?
include '../../PHP/Database.php';

$From = $_GET['From'];
$To = $_GET['To'];

$aHometasks = [];
foreach ($SQL->query("SELECT Lesson, Date, Text, Attachments FROM hometasks WHERE (Date >= $From) AND (Date <= $To)")->fetch_all() as &$aLesson)
    array_push($aHometasks, [$aLesson[0], (int) $aLesson[1], $aLesson[2], json_decode($aLesson[3])]);

$aReplacements = [];
foreach ($SQL->query("SELECT Date, LessonNumber, Replacement FROM replacements WHERE (Date >= $From) AND (Date <= $To)")->fetch_all() as &$aReplacement)
    array_push($aReplacements, [(int) $aReplacement[0], (int) $aReplacement[1], $aReplacement[2]]);

echo json_encode([$aHometasks, $aReplacements]);