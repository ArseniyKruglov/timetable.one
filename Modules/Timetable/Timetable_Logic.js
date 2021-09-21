function Timetable_GetDayTimetable(iDate)
{
    for (let loop_aTimetable of _aTimetable)
        if (loop_aTimetable[1]['Begin'] <= iDate && iDate <= loop_aTimetable[1]['End'])
            return loop_aTimetable[1]['Lessons'][(iDate - loop_aTimetable[1]['AnchorDate']) % loop_aTimetable[1]['Days'].length];

    return false;
}