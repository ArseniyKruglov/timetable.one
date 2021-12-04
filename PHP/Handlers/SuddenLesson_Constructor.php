<?
include '../Handler.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = $POST['Date'];
    $Index = $POST['Index'];
    $Title = substr($POST['Title'], 0, 100);
   
    $SQL->query("INSERT INTO `SuddenLessons` VALUES ($UserID, $Date, $Index, '$Title')");
};

Handler('Callback');