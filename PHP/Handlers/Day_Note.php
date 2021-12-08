<?
include '../Handler.php';
include '../Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = From1970((int) $POST['Date']);
    $Note = substr($POST['Note'], 0, 65535);

    if ($Note === '')
        $SQL->query("DELETE FROM `DayNotes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date')");
    else
        $SQL->query("INSERT INTO `DayNotes` VALUES ($UserID, '$Date', '$Note')
                        ON DUPLICATE KEY UPDATE `Note` = '$Note'");
};

Handler('Callback');