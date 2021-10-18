<?
function GenerateName($length)
{
    $sCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    $sString = '';
    for ($i = 0; $i < $length; $i++)
        $sString .= $sCharacters[random_int(0, 61)];
    return $sString;
}

if ($_FILES)
{
    include '../../../PHP/Database.php';

    $URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
    $UserID = $SQL->query("SELECT UserID FROM users WHERE Link_FullAccess = '$URL'");

    if ($UserID->num_rows === 1)
    {
        $UserID = $UserID->fetch_row()[0];
        $Date = $_POST['Date'];
        $Subject = $_POST['Subject'];
        $Files = $_FILES['File'];
        $Folders = [];

        $Attachments = $SQL->query("SELECT Attachments FROM LessonNotes WHERE (UserID = $UserID) AND (Date = $Date) AND (Subject = '$Subject')");
        $Attachments = ($Attachments->num_rows === 1) ? json_decode($Attachments->fetch_row()[0]) : [];

        // include '../../../PHP/Passwords.php';
        // include '../../../vendor/autoload.php';
        // $SFTP = new \phpseclib3\Net\SFTP('sftp.selcdn.ru', 22);
        // $SFTP->login($Selectel['Login'], $Selectel['Password']);

        for ($i = 0; $i < count($Files['name']); $i++)
        {
            $Filename = $Files['name'][$i];
            $Folder = GenerateName(64);

            array_push($Folders, $Folder);
            array_push($Attachments, [$Folder, $Filename]);

            // $File = file_get_contents($Files['tmp_name'][$i]);
            // $SFTP->put("/timetable.one Dev/$Folder/$Filename",  $File);
        };

        $Attachments = json_encode($Attachments);
        $SQL->query(   "INSERT INTO LessonNotes VALUES ($UserID, $Date, '$Subject', '', '$Attachments')
                            ON DUPLICATE KEY UPDATE Attachments = '$Attachments'");
        echo json_encode($Folders);
    }
    else
    {
        http_response_code(403);
    };
};