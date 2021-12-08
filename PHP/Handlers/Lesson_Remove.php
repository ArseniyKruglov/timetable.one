<?
include '../Handler.php';
include '../Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = From1970((int) $POST['Date']);
    $Index = $POST['Index'];;

    $SQL->query("DELETE FROM `Changes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Index` = $Index)");
};

Handler('Callback');