<?
function Handler($Callback)
{
    include '../Library/PHP/Database.php';

    $URL = explode('/', parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH))[1];
    $UserID = $SQL->query("SELECT `UserID` FROM `Users` WHERE `Link_FullAccess` = '$URL'");

    if ($UserID->num_rows === 1)
        $Callback($SQL, $_POST, ($UserID->fetch_row()[0]));
    else
        http_response_code(403);
};