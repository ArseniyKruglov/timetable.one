function Timetable_GetDayTimetable(iDate)
{
    for (let loop_aTimetable of _aTimetable)
        if (loop_aTimetable[1]['Begin'] <= iDate && iDate <= loop_aTimetable[1]['End'])
            return loop_aTimetable[1]['Lessons'][(iDate - loop_aTimetable[1]['AnchorDate']) % loop_aTimetable[1]['Days'].length];

    return false;
}

function Timetable_GetLessonLinkAttributes(iDate, iLessonNumber)
{
    return `href='${location.pathname}?Date=${iDate}&LessonNumber=${iLessonNumber}' onclick='event.preventDefault(); LessonDetails(${iDate}, ${iLessonNumber});'`    
}

function Timetable_GetPeriod(iDate)
{
    let aTimetable = GetTimetable(iDate);
    if (aTimetable === false || aTimetable.length === 0)
        return ['Chill', 'Отдых'][_iLanguage];

    let tBegin = Alarm_Get(aTimetable[0][0]);
    let tEnd = Alarm_Get(aTimetable[aTimetable.length - 1][0]);

    let sBegin;
    if (tBegin)
        sBegin = Format(tBegin[0]);

    let sEnd;
    if (tEnd)
        sEnd = Format(tEnd[1]);
    
        return `${sBegin || ['Unknown', 'Неизвестно'][_iLanguage]} – ${sEnd || ['Unknown', 'Неизвестно'][_iLanguage]}`;
}