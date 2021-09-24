function Week_GetInitialWeekOffset()
{
    if (Timetable_GetDayTimetable(_iToday).size !== 0)
        return 0;
        
    let iDayOfWeek = new Date().getDayOfWeek();
    let iLastStudyDay;
    for (let i = _iToday - iDayOfWeek + 6; i >= _iToday - iDayOfWeek; i--)
        if (Timetable_GetDayTimetable(i).size !== 0)
        {
            iLastStudyDay = i;
            break;
        };

    if (iLastStudyDay !== undefined)
    {
        if (iLastStudyDay < _iToday)
            return 1;
        else    
            return 0;
    }
    else
    {
        for (let i = _iToday - iDayOfWeek + 6 + 7; i >= _iToday - iDayOfWeek + 7; i--)
            if (Timetable_GetDayTimetable(i).size !== 0)
                return 1;

        return 0;
    };
}

function Week_GetPeriod(iWeekOffset)
{
    let iWeekBeginDate = _iToday - new Date().getDayOfWeek() + iWeekOffset * 7;    
    return [iWeekBeginDate, iWeekBeginDate + 6];
}