<?
include '../Library/PHP/Handler.php';

function Callback($SQL, $UserID)
{
    ignore_user_abort(true);
    include '../Library/PHP/Timestamp.php';

    $Date = IntToDate((int) $GLOBALS['_POST']['Date']);
    $Title = $GLOBALS['_POST']['Title'];
    $Folder = $GLOBALS['_POST']['Folder'];



    $SQL->query("DELETE FROM `Files` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Title` = '$Title') AND (`Folder` = '$Folder')");

    include '../Library/PHP/vendor/autoload.php';
    include '../Library/PHP/Passwords.php';
    $SFTP = new \phpseclib3\Net\SFTP('sftp.selcdn.ru', 22);
    $SFTP->login($Passwords['Selectel']['Login'], $Passwords['Selectel']['Password']);
    if ($Folder)
        $SFTP->delete("/timetable.one Dev/$Folder");
};

Handler('Callback');