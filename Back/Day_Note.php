<?
include '../Library/PHP/Handler.php';

function Callback($SQL, $UserID)
{
    include '../Library/PHP/Timestamp.php';
    include '../Library/PHP/Constants.php';

    $Date = IntToDate((int) $GLOBALS['_POST']['Date']);
    $Note = substr($GLOBALS['_POST']['Note'], 0, $Constants['MaxNoteLength']);

    $SQL->query("DELETE FROM `Notes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Title` IS NULL)");
    if ($Note !== '')
        $SQL->query("INSERT INTO `Notes` VALUES ($UserID, '$Date', NULL, '$Note')");
};

Handler('Callback');