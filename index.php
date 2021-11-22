<?
if ($_SERVER['REQUEST_URI'] == '/')
{
    include 'Landing/Index.html';
}
else
{
    include 'PHP/Database.php';
    
    $URL = explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))[1];
    $User = $SQL->query("SELECT * FROM `users` WHERE (`Link_FullAccess` = '$URL') OR (`Link_ReadOnly` = '$URL') OR (`Link_TimetableOnly` = '$URL')");
    
    if ($User->num_rows === 1)
    {
        $User = $User->fetch_row();
    
        if ($User[1] === $URL)
            $AccessLevel = 2;
        else if ($User[2] === $URL)
            $AccessLevel = 1;
        else if ($User[3] === $URL)
            $AccessLevel = 0;
    
        include 'MainSequence.php';
    }
    else
    {
        http_response_code(404);
    };
};
?>