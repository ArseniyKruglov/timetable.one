<?
include '../Handler.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = $POST['Date'];
    $Index = $POST['Index'];
    $Title = substr($POST['Title'], 0, 100);
   
    $SQL->query("INSERT INTO `Changes` VALUES ($UserID, $Date, $Index, '$Title', NULL, NULL)");
    echo "INSERT INTO `Changes` VALUES ($UserID, $Date, $Index, '$Title', NULL, NULL)";
};

Handler('Callback');