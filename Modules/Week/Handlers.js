function Week_Previous()
{
    _iWeekOffset--;
    Week_Select();
    Timetable_Height(true);
}

function Week_Current()
{
    let iInitial = Week_GetInitialWeekOffset();
    if (_iWeekOffset !== iInitial)
    {
        _iWeekOffset = iInitial;
        Week_Select();
        Timetable_Height(true);
    };
}

function Week_Next()
{
    _iWeekOffset++;
    Week_Select();    
    Timetable_Height(true);
}