<?
include '../Library/PHP/Handler.php';
include '../Library/PHP/Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    include '../Library/PHP/Constants.php';

    $Date = IntToDate((int) $POST['Date']);
    $Title = $POST['Title'];
    $Note = substr($POST['Note'], 0, $MaxNoteLength);

    $SQL->query("DELETE FROM `Notes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Title` = '$Title')");
    if ($Note !== '')
        $SQL->query("INSERT INTO `Notes` VALUES ($UserID, '$Date', '$Title', '$Note')");
};

Handler('Callback');