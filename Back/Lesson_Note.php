<?
include '../Library/PHP/Handler.php';
include '../Library/PHP/Timestamp.php';

function Callback($SQL, $UserID)
{
    include '../Library/PHP/Constants.php';

    $Date = IntToDate((int) $GLOBALS['_POST']['Date']);
    $Title = $GLOBALS['_POST']['Title'];
    $Note = substr($GLOBALS['_POST']['Note'], 0, $Constants['MaxNoteLength']);

    $SQL->query("DELETE FROM `Notes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Title` = '$Title')");
    if ($Note !== '')
        $SQL->query("INSERT INTO `Notes` VALUES ($UserID, '$Date', '$Title', '$Note')");
};

Handler('Callback');