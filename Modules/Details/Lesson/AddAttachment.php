<?php
    function GenerateName($length)
    {
        $sCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for ($i = 0; $i < $length; $i++)
            $sString .= $sCharacters[random_int(0, 61)];
    
        return $sString;
    }

    if ($_FILES)
    {
        include '../../../PHP/Database.php';
        include '../../../PHP/Passwords.php';

        include '../../vendor/autoload.php';
        $SFTP = new \phpseclib3\Net\SFTP('sftp.selcdn.ru', 22);
        $SFTP->login($Selectel['Login'], $Selectel['Password']);

        $Link = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
        $Date = $_POST['Date'];
        $Subject = $_POST['Subject'];
        $Files = $_FILES['file'];

        for ($i = 0; $i < count($files['name']); $i++)
        {
            $File = fopen($Files['tmp_name'][$i], 'r');;
            $Filename = $Files['name'][$i];
            $Folder = GenerateName(64);

            $SFTP->put("/timetable.one Dev/$Folder/$Filename",  $File);
        };
    };
?>