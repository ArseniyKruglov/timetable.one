<?
include '../Handler.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = $POST['Date'];
    $Index = $POST['Index'];;

    $SQL->multi_query("DELETE FROM `Changes` WHERE (`UserID` = $UserID) AND (`Date` = $Date) AND (`Index` = $Index)");
};

Handler('Callback');