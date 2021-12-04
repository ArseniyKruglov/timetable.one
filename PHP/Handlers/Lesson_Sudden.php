<?
include '../Handler.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = $POST['Date'];
    $Index = $POST['Index'];
    $Title = substr($POST['Title'], 0, 100);

    if ($Title === '')
        $SQL->query("DELETE FROM `SuddenLessons` WHERE (`Date` = $Date) AND (`Index` = $Index) AND (`UserID` = $UserID)");
    else
        $SQL->query("UPDATE `SuddenLessons` SET `Title` = '$Title' WHERE (`Date` = $Date) AND (`Index` = $Index) AND (`UserID` = $UserID)");
};

Handler('Callback');