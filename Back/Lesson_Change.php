<?
include '../Library/PHP/Handler.php';
include '../Library/PHP/Constants.php';
include '../Library/PHP/Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    $Date = IntToDate((int) $POST['Date']);
    $Index = $POST['Index'];

    $Title = $POST['Title'];
    $Place = $POST['Place'];
    $Educator = $POST['Educator'];

    $Title_INSERT = $Title === NULL ? 'NULL' : ("'" . substr($Title, 0, $GLOBALS['MaxTitleLength']) . "'");
    $Place_INSERT = $Place === NULL ? 'NULL' : ("'" . substr($Place, 0, $GLOBALS['MaxPlaceLength']) . "'");
    $Educator_INSERT = $Educator === NULL ? 'NULL' : ("'" . substr($Educator, 0, $GLOBALS['MaxEducatorLength']) . "'");

    $Title_UPDATE = ($Title === 'null') ? 'NULL' :( "'" . $Title . "'");
    $Place_UPDATE = ($Place === 'null') ? 'NULL' : ("'" . $Place . "'");
    $Educator_UPDATE = ($Educator === 'null') ? 'NULL' : ("'" . $Educator . "'");



    $Request = "INSERT INTO `Changes` VALUES ($UserID, '$Date', $Index, $Title_INSERT, $Place_INSERT, $Educator_INSERT)";
    if ($Title !== NULL || $Place !== NULL || $Educator !== NULL)
        $Request .= " ON DUPLICATE KEY UPDATE ";

    $Comma = false;
    if ($Title !== NULL)
    {
        $Request .= "`Title` = $Title_UPDATE";
        $Comma = true;
    };
    if ($Place !== NULL)
    {
        $Request .= ($Comma ? ', ' : '') . "`Place` = $Place_UPDATE";
        $Comma = true;
    };
    if ($Educator !== NULL)
    {
        $Request .= ($Comma ? ', ' : '') . "`Educator` = $Educator_UPDATE";
    };

    echo $Request;
    $SQL->query($Request);
};

Handler('Callback');