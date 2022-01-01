<?
include '../Library/PHP/Handler.php';
include '../Library/PHP/Timestamp.php';

function Callback($SQL, $POST, $UserID)
{
    include '../Library/PHP/Constants.php';

    $Date = IntToDate((int) $POST['Date']);
    $Index = $POST['Index'];

    $Title = $POST['Title'];
    $Place = $POST['Place'];
    $Educator = $POST['Educator'];



    if (isset($Title) || isset($Place) || isset($Educator))
    {
        $Title_UPDATE = ($Title === NULL || $Title === 'null' || $POST['OriginalTitle'] === $Title) ? 'NULL' :( "'" . substr($Title, 0, $Constants['MaxTitleLength']) . "'");
        $Place_UPDATE = ($Place === NULL || $Place === 'null') ? 'NULL' :( "'" . substr($Place, 0, $Constants['MaxPlaceLength']) . "'");
        $Educator_UPDATE = ($Educator === NULL || $Educator === 'null') ? 'NULL' :( "'" . substr($Educator, 0, $Constants['MaxEducatorLength']) . "'");



        $Request = "INSERT INTO `Changes` VALUES ($UserID, '$Date', $Index, $Title_UPDATE, $Place_UPDATE, $Educator_UPDATE)
                        ON DUPLICATE KEY UPDATE ";

        $Comma = false;

        if (isset($Title))
        {
            $Request .= "`Title` = $Title_UPDATE";
            $Comma = true;
        };
        if (isset($Place))
        {
            $Request .= ($Comma ? ', ' : '') . "`Place` = $Place_UPDATE";
            $Comma = true;
        };
        if (isset($Educator))
        {
            $Request .= ($Comma ? ', ' : '') . "`Educator` = $Educator_UPDATE";
        };

        $Request .= ";
                     DELETE FROM `Changes` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Index` = $Index) AND (`Title` IS NULL) AND (`Place` IS NULL) AND (`Educator` IS NULL);";
    };

    if (isset($POST['UserFields']))
    {
        if ($POST['UserFields'] === 'null')
        {
            $Request .= "DELETE FROM `Changes_Fields` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Index` = $Index)";
        }
        else
        {
            foreach (array_keys($POST['UserFields']) as &$FieldID)
            {
                $Text = $POST['UserFields'][$FieldID];

                if ($Text === 'null')
                    $Request .= "DELETE FROM `Changes_Fields` WHERE (`UserID` = $UserID) AND (`Date` = '$Date') AND (`Index` = $Index) AND (`FieldID` = $FieldID)";
                else
                    $Request .= "INSERT INTO `Changes_Fields` VALUES ($UserID, '$Date', $Index, $FieldID, '$Text')
                                    ON DUPLICATE KEY UPDATE `Text` = '$Text'";
            };
        };
    };

    $SQL->multi_query($Request);
};

Handler('Callback');