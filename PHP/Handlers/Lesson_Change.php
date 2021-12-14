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

    $Title_INSERT = $Title === NULL ? 'NULL' : ("'" . substr($Title, 0, $GLOBALS['MaxTitleLength']) . "'");
    $Place_INSERT = $Place === NULL ? 'NULL' : ("'" . substr($Place, 0, $GLOBALS['MaxPlaceLength']) . "'");
    $Educator_INSERT = $Educator === NULL ? 'NULL' : ("'" . substr($Educator, 0, $GLOBALS['MaxEducatorLength']) . "'");

    $Title_UPDATE = ($Title === 'null') ? 'NULL' :( "'" . $Title . "'");
    $Place_UPDATE = ($Place === 'null') ? 'NULL' : ("'" . $Place . "'");
    $Educator_UPDATE = ($Educator === 'null') ? 'NULL' : ("'" . $Educator . "'");



    $Request = "INSERT INTO `Changes` VALUES ($UserID, '$Date', $Index, $Title_INSERT, $Place_INSERT, $Educator_INSERT)";
    if ($Title !== NULL || $Place !== NULL || $Educator !== NULL)
        $Request .= " ON DUPLICATE KEY UPDATE ";

    if ($Title !== NULL)
        $Request .= "`Title` = $Title_UPDATE";
    if ($Place !== NULL)
        $Request .= ", `Place` = $Place_UPDATE";
    if ($Educator !== NULL)
        $Request .= ", `Educator` = $Educator_UPDATE";

    echo $Request;
    $SQL->query($Request);
};

Handler('Callback');