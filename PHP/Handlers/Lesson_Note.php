<?
include '../Handler.php';
include '../Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = From1970((int) $POST['Date']);
    $Title = $POST['Title'];
    $Note = substr($POST['Note'], 0, 65535);

    if ($Note === '')
        $SQL->query("INSERT INTO `LessonNotes` VALUES ($UserID, '$Date', '$Title', '$Note')
                        ON DUPLICATE KEY UPDATE `Note` = '$Note'");
    else
    $SQL->query("DELETE FROM `LessonNotes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date')");
};

Handler('Callback');