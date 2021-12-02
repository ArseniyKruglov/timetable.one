function Week_Previous()
{
    if (_iWeekOffset > -Math.floor(_iToday / 7))
    {
        _iWeekOffset--;
        Week_Select();
    };
}

function Week_Current()
{
    const iInitial = Week_GetInitialWeekOffset();
    if (_iWeekOffset === iInitial)
    {
        Timetable_Scroll(true);
    }
    else
    {
        _iWeekOffset = iInitial;
        Week_Select();
    };
}

function Week_Next()
{
    if (_iWeekOffset < Math.floor(2147483647 / 7))
    {
        _iWeekOffset++;
        Week_Select();
    };
}