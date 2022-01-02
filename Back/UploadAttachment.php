<?
include '../Library/PHP/Handler.php';
include '../Library/PHP/Timestamp.php';

function Callback($SQL, $UserID)
{
    $Date = IntToDate((int) $GLOBALS['_POST']['Date']);
    $Title = $GLOBALS['_POST']['Title'];
    $File = $GLOBALS['_FILES']['File'];



    $Foldername = hash('sha256', microtime(true) * random_int(0, 10000));
    $Filename = $File['name'];

    $SQL->query("INSERT INTO `Attachments` VALUES ($UserID, '$Date', '$Title', '$Foldername', '$Filename')");

    echo $Foldername;
};

Handler('Callback');