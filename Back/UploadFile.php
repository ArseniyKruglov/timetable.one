<?
include '../Library/PHP/Handler.php';

function Callback($SQL, $UserID)
{
    include '../Library/PHP/Timestamp.php';

    $Date = IntToDate((int) $GLOBALS['_POST']['Date']);
    $Title = $GLOBALS['_POST']['Title'];
    $File = $GLOBALS['_FILES']['File'];



    $Filename = $File['name'];

    while (true)
    {
        $Characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        $Foldername = '';
        for ($i = 0; $i < 256; $i++)
            $Foldername .= $Characters[random_int(0, 61)];

        if ($SQL->query("SELECT 1 FROM `Files` WHERE `Folder` = '$Foldername'")->num_rows === 0)
            break;
    };

    $SQL->query("INSERT INTO `Files` VALUES ($UserID, '$Date', '$Title', '$Foldername', '$Filename')");
    echo $Foldername;



    include '../Library/PHP/vendor/autoload.php';
    include '../Library/PHP/Passwords.php';
    $SFTP = new \phpseclib3\Net\SFTP('sftp.selcdn.ru', 22);
    $SFTP->login($Passwords['Selectel']['Login'], $Passwords['Selectel']['Password']);
    $SFTP->put("/timetable.one Dev/$Foldername/$Filename", file_get_contents($File['tmp_name']));
};

Handler('Callback');