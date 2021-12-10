<?
include '../Handler.php';
include '../Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = From1970((int) $POST['Date']);
    $Index = $POST['Index'];
    $Title = substr($POST['Title'], 0, 100);

    $SQL->query("INSERT INTO `Changes` VALUES ($UserID, '$Date', $Index, '$Title', NULL, NULL)
                    ON DUPLICATE KEY UPDATE `Title` = '$Title'");
};

Handler('Callback');