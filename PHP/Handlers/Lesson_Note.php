<?
include '../Handler.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = $POST['Date'];
    $Title = $POST['Title'];
    $Note = substr($POST['Note'], 0, 65535);

    $SQL->multi_query( "INSERT INTO `LessonNotes` VALUES ($UserID, $Date, '$Title', '$Note')
                            ON DUPLICATE KEY UPDATE `Note` = '$Note';

                        DELETE FROM `LessonNotes` WHERE (`UserID` = $UserID) AND (`Note` = '')");
};

Handler('Callback');