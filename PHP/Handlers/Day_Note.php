<?
include '../Handler.php';
include '../Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = From1970((int) $POST['Date']);
    $Note = substr($POST['Note'], 0, 65535);

    $SQL->query("DELETE FROM `Notes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Title` IS NULL)");
    if ($Note !== '')
        $SQL->query("INSERT INTO `Notes` VALUES ($UserID, '$Date', NULL, '$Note')");
};

Handler('Callback');