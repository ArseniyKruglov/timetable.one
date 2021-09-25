function Week_Previous()
{
    _iWeekOffset--;
    Week_Select();    
}

function Week_Current()
{
    _iWeekOffset = Week_GetInitialWeekOffset();
    Week_Select();    
}

function Week_Next()
{
    _iWeekOffset++;
    Week_Select();    
}