<?
include '../Handler.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = $POST['Date'];
    $Note = substr($POST['Note'], 0, 65535);

    if ($Note == '')
        $SQL->query("DELETE FROM `DayNotes` WHERE (`Date` = $Date) AND (`UserID` = $UserID)");
    else
        $SQL->query("INSERT INTO `DayNotes` VALUES ($UserID, $Date, '$Note')
                        ON DUPLICATE KEY UPDATE `Note` = '$Note'");
};

Handler('Callback');