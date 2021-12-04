<?
include '../Handler.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = $POST['Date'];
    $Index = $POST['Index'];
    $Title = $POST['Title'];
    $Change = substr($POST['Change'], 0, 100);

    if ($Title == $Change)
        $SQL->multi_query("UPDATE `Changes` SET `Title` = NULL WHERE (`Date` = $Date) AND (`Index` = $Index) AND (`UserID` = $UserID);
                           DELETE FROM `Changes` WHERE (`Title` = NULL) AND (`Place` = NULL) AND (`Educator` = NULL)");
    else
        $SQL->query("INSERT INTO `Changes` VALUES ($UserID, $Date, $Index, '$Change', NULL, NULL)
                        ON DUPLICATE KEY UPDATE `Title` = '$Change'");
};

Handler('Callback');