<?
include 'PHP/Database.php';

$URL = substr($_SERVER['REQUEST_URI'], 1);

if ($SQL->query("SELECT 1 FROM timetables WHERE Link_FullAccess = '$URL'")->num_rows === 1)
{
    $FullAcess = true;
    include 'MainSequence.php';
}
else if ($SQL->query("SELECT 1 FROM timetables WHERE Link_ReadOnly = '$URL'")->num_rows === 1)
{
    include 'MainSequence.php';
}
else
{
    http_response_code(404);
};
?>