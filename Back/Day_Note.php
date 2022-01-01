<?
include '../Library/PHP/Handler.php';
include '../Library/PHP/Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    include '../Library/PHP/Constants.php';

    $Date = IntToDate((int) $POST['Date']);
    $Note = substr($POST['Note'], 0, $Constants['MaxNoteLength']);

    $SQL->query("DELETE FROM `Notes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Title` IS NULL)");
    if ($Note !== '')
        $SQL->query("INSERT INTO `Notes` VALUES ($UserID, '$Date', NULL, '$Note')");
};

Handler('Callback');