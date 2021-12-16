<?
function Language_Get()
{
    $Language = strtoupper($_SERVER['HTTP_ACCEPT_LANGUAGE']);

    function str_contains($Haystack, $Needle)
    {
        return $Needle !== '' && mb_strpos($Haystack, $Needle) !== false;
    }

    if (str_contains($Language, 'RU') || str_contains($Language, 'UA') || str_contains($Language, 'BE') || str_contains($Language, 'KK'))
        return 'RU';
    else
        return 'EN';
};