<?
include '../Handler.php';
include '../Constants.php';
include '../Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = From1970((int) $POST['Date']);
    $Index = $POST['Index'];

    $Title = $POST['Title'];
    $Place = $POST['Place'];
    $Educator = $POST['Educator'];

    $Title_INSERT = $Title ? ("'" . substr($Title, 0, $GLOBALS['MaxTitleLength']) . "'") : 'NULL';
    $Place_INSERT = $Place ? ("'" . substr($Place, 0, $GLOBALS['MaxPlaceLength']) . "'") : 'NULL';
    $Educator_INSERT = $Educator ? ("'" . substr($Educator, 0, $GLOBALS['MaxEducatorLength']) . "'") : 'NULL';

    $Title_UPDATE = ($Title === 'null') ? 'NULL' :( "'" . $Title . "'");
    $Place_UPDATE = ($Place === 'null') ? 'NULL' : ("'" . $Place . "'");
    $Educator_UPDATE = ($Educator === 'null') ? 'NULL' : ("'" . $Educator . "'");



    $Request = "INSERT INTO `Changes` VALUES ($UserID, '$Date', $Index, $Title_INSERT, $Place_INSERT, $Educator_INSERT)
                    ON DUPLICATE KEY UPDATE";
    if ($Title)
        $Request .= "`Title` = $Title_UPDATE";
    if ($Place)
        $Request .= "`Place` = $Place_UPDATE";
    if ($Educator)
        $Request .= "`Educator` = $Educator_UPDATE";

    $SQL->query($Request);
};

Handler('Callback');