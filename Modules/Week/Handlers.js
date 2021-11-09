function Week_Previous()
{
    _iWeekOffset--;
    Week_Select();
    Timetable_Height(true);
}

function Week_Current()
{
    _iWeekOffset = Week_GetInitialWeekOffset();
    Week_Select();
    Timetable_Height(true);
}

function Week_Next()
{
    _iWeekOffset++;
    Week_Select();    
    Timetable_Height(true);
}