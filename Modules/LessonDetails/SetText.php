<?
include '../../PHP/Database.php';

$URL = $_POST['URL'];
$UserID = $SQL->query("SELECT UserID FROM users WHERE Link_FullAccess = '$URL'");

if ($UserID->num_rows === 1)
{
    $UserID = $UserID->fetch_row()[0];
    $Date = $_POST['Date'];
    $Subject = $_POST['Subject'];
    $Text = $_POST['Text'];

    if ($Text == '')
        $SQL->query("DELETE FROM hometasks WHERE (Date = $Date) AND (Subject = '$Subject') AND (UserID = $UserID)");
    else
        $SQL->query("INSERT INTO hometasks VALUES ($UserID, '$Subject', $Date, '$Text') ON DUPLICATE KEY UPDATE Text = '$Text'");
}
else
{
    http_response_code(403);
};