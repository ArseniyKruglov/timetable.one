function Week_GetInitialWeekOffset()
{
    let iToday = new Date().getDaysSince1970();
        
    if (Timetable_GetDayTimetable(iToday).size !== 0)
        return 0;
        
    let iDayOfWeek = new Date().getDayOfWeek();
    let iLastStudyDay;
    for (let i = iToday - iDayOfWeek + 6; i >= iToday - iDayOfWeek; i--)
        if (Timetable_GetDayTimetable(i).size !== 0)
        {
            iLastStudyDay = i;
            break;
        };

    if (iLastStudyDay !== undefined)
    {
        if (iLastStudyDay < iToday)
            return 1;
        else    
            return 0;
    }
    else
    {
        for (let i = iToday - iDayOfWeek + 6 + 7; i >= iToday - iDayOfWeek + 7; i--)
            if (Timetable_GetDayTimetable(i).size !== 0)
                return 1;

        return 0;
    };
}