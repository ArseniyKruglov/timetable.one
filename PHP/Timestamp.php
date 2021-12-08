<?
function To1970($Date)
{
    return ceil(strtotime($Date) / 60 / 60 / 24);
}

function From1970($Date)
{
    return date('Y-m-d', $Date * 24 * 60 * 60);
}