<?
include '../Library/PHP/Handler.php';
include '../Library/PHP/Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = IntToDate((int) $POST['Date']);
    $Index = $POST['Index'];;

    $SQL->query("DELETE FROM `Changes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Index` = $Index)");
};

Handler('Callback');