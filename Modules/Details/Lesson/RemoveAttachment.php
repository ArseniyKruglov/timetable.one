<?
include '../../../PHP/Database.php';

$URL = substr(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH), 1);
$UserID = $SQL->query("SELECT UserID FROM users WHERE Link_FullAccess = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $Date = $_POST['Date'];
    $Subject = $_POST['Subject'];
    $Folder = $_POST['Folder'];
   
    $Attachments = $SQL->query("SELECT Attachments FROM LessonNotes WHERE (UserID = $UserID) AND (Date = $Date) AND (Subject = '$Subject')");
    $Attachments = ($Attachments->num_rows === 1) ? json_decode($Attachments->fetch_row()[0]) : [];
    for ($i = 0; $i < count($Attachments); $i++)
        if ($Attachments[$i][0] === $Folder)
            array_splice($Attachments, $i, 1);
    $Attachments = json_encode($Attachments);
    $SQL->multi_query( "INSERT INTO LessonNotes VALUES ($UserID, $Date, '$Subject', '', '[]')
                            ON DUPLICATE KEY UPDATE Attachments = '$Attachments';
                        
                        DELETE FROM LessonNotes WHERE (UserID = $UserID) AND (Text = '') AND (Attachments = '[]')");
}
else
{
    http_response_code(403);
};