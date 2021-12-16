<?
function To1970($Date)
{
    return ceil(strtotime($Date) / 60 / 60 / 24);
}

function From1970($Date)
{
    return date('Y-m-d', $Date * 24 * 60 * 60);
}



function TimeToInt($Time)
{
    return strtotime('01-01-1970 ' . $Time . ' UTC') / 60;
}

function IntToTime($Time)
{
    return gmdate('H:i:s', $Time * 60);
}