<?
include '../../PHP/Database.php';

$URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
$User = $SQL->query("SELECT * FROM users WHERE (Link_FullAccess = '$URL') OR (Link_ReadOnly = '$URL') OR (Link_TimetableOnly = '$URL')");


if ($User->num_rows === 1)
{
    $User = $User->fetch_row();
    $UserID = $User[0];

    if ($User[1] === $URL)
        $AccessLevel = 2;
    else if ($User[2] === $URL)
        $AccessLevel = 1;
    else if ($User[3] === $URL)
        $AccessLevel = 0;

        
        
    $aReplacements = [];
    $aAddedLessons = [];
    $aLessonNotes = [];
    $aDayNotes = [];

    foreach ($SQL->query("SELECT Date, LessonNumber, Replacement FROM replacements WHERE UserID = $User[0]")->fetch_all() as &$aReplacement)
        array_push($aReplacements, ['Date' => (int) $aReplacement[0], 'LessonNumber' => (int) $aReplacement[1], 'Replacement' => $aReplacement[2]]);

    foreach ($SQL->query("SELECT Date, LessonNumber, Subject FROM AddedLessons WHERE UserID = $User[0]")->fetch_all() as &$aAddedLesson)
        array_push($aAddedLessons, ['Date' => (int) $aAddedLesson[0], 'LessonNumber' => (int) $aAddedLesson[1], 'Subject' => $aAddedLesson[2]]);

    if ($AccessLevel > 0)
    {
        foreach ($SQL->query("SELECT Subject, Date, Text, Attachments FROM LessonNotes WHERE UserID = $User[0] ORDER BY Date DESC")->fetch_all() as &$aLesson)
            array_push($aLessonNotes, ['Subject' => $aLesson[0], 'Date' => (int) $aLesson[1], 'Text' => $aLesson[2], 'Attachments' => json_decode($aLesson[3])]);

        foreach ($SQL->query("SELECT Date, Note FROM DayNotes WHERE UserID = $User[0] ORDER BY Date DESC")->fetch_all() as &$aLesson)
            array_push($aDayNotes, ['Date' => (int) $aLesson[0], 'Note' => $aLesson[1]]);
    };

    echo json_encode(['LessonNotes' => $aLessonNotes, 'AddedLessons' => $aAddedLessons, 'Replacements' => $aReplacements, 'DayNotes' => $aDayNotes], JSON_UNESCAPED_UNICODE);
}
else
{
    http_response_code(404);
};