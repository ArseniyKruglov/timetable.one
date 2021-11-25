function Week_Previous()
{
    _iWeekOffset--;
    Week_Select();
}

function Week_Current()
{
    const iInitial = Week_GetInitialWeekOffset();
    if (_iWeekOffset !== iInitial)
    {
        _iWeekOffset = iInitial;
        Week_Select();
    }
    else
    {
        Timetable_Scroll(true);
    };
}

function Week_Next()
{
    _iWeekOffset++;
    Week_Select();
}