<?
include '../Handler.php';
include '../Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = From1970((int) $POST['Date']);
    $Index = $POST['Index'];
    $Change = substr($POST['Change'], 0, 100);

    $SQL->query("INSERT INTO `Changes` VALUES ($UserID, '$Date', $Index, '$Change', NULL, NULL)
                    ON DUPLICATE KEY UPDATE `Title` = '$Change'");
};

Handler('Callback');