<?
include '../Handler.php';
include '../Constants.php';
include '../Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = From1970((int) $POST['Date']);
    $Title = $POST['Title'];
    $Note = substr($POST['Note'], 0, $GLOBALS['MaxNoteLength']);

    $SQL->query("DELETE FROM `Notes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Title` = '$Title')");
    if ($Note !== '')
        $SQL->query("INSERT INTO `Notes` VALUES ($UserID, '$Date', '$Title', '$Note')");
};

Handler('Callback');