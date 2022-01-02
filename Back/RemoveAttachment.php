<?
include '../Library/PHP/Handler.php';
include '../Library/PHP/Timestamp.php';

function Callback($SQL, $UserID)
{
    $Date = IntToDate((int) $GLOBALS['_POST']['Date']);
    $Title = $GLOBALS['_POST']['Title'];
    $Folder = $GLOBALS['_POST']['Folder'];

    $SQL->query("DELETE FROM `Attachments` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Title` = '$Title') AND (`Folder` = '$Folder')");
};

Handler('Callback');