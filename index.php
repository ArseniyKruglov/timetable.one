<?
include 'PHP/Database.php';

$URL = substr($_SERVER['REQUEST_URI'], 1);
$User = $SQL->query("SELECT * FROM timetables WHERE (Link_FullAccess = '$URL') OR (Link_ReadOnly = '$URL') OR (Link_TimetableOnly = '$URL')");

if ($User->num_rows === 1)
{
    $User = $User->fetch_row();
    $TimetableID = $User[0];

    if ($User[3] === $URL)
        $AccessLevel = 2;
    else if ($User[4] === $URL)
        $AccessLevel = 1;
    else if ($User[5] === $URL)
        $AccessLevel = 0;

    include 'MainSequence.php';
}
else
{
    http_response_code(404);
};
?>