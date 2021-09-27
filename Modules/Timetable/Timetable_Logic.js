function Timetable_GetDayTimetable(iDate)
{
    for (let loop_aTimetable of _aTimetable)
        if ((loop_aTimetable[1]['Begin'] || Number.MIN_SAFE_INTEGER) <= iDate && iDate <= (loop_aTimetable[1]['End'] || Number.MAX_SAFE_INTEGER))
            return loop_aTimetable[1]['Lessons'][(iDate - loop_aTimetable[1]['AnchorDate'] % loop_aTimetable[1]['Days'].length + loop_aTimetable[1]['Days'].length) % loop_aTimetable[1]['Days'].length];   

    return false;
}

function Timetable_GetLessonLinkAttributes(iDate, iLessonNumber)
{
    return `href='${location.pathname}?Date=${iDate}&LessonNumber=${iLessonNumber}' onclick='event.preventDefault(); LessonDetails(${iDate}, ${iLessonNumber});'`    
}

function Timetable_GetLessonNumbers(iDate)
{
    let mTimetable = Timetable_GetDayTimetable(iDate);
    if (mTimetable === false)
        return false;

    let aLessonNumbers = [];
    for (let loop_aLesson of mTimetable)
        aLessonNumbers.push(loop_aLesson[0]);

    for (let loop_oReplacement of _oWeek['Replacements'])
        if (loop_oReplacement['Date'] === iDate && loop_oReplacement['Replacement'] === '')
            aLessonNumbers.splice(aLessonNumbers.indexOf(loop_oReplacement['LessonNumber']), 1);
            
    for (let loop_aAddedLesson of _oWeek['AddedLessons'])
        if (loop_aAddedLesson['Date'] === iDate)
            aLessonNumbers.push(loop_aAddedLesson['LessonNumber']);
    
    return aLessonNumbers;
}

function Timetable_GetPeriod(iDate)
{
    let aTimetable = Timetable_GetLessonNumbers(iDate);
    if (aTimetable === false || aTimetable.length === 0)
        return ['Chill', 'Отдых'][_iLanguage];

    let tBegin = Alarm_Get(Math.min(...aTimetable));
    let tEnd = Alarm_Get(Math.max(...aTimetable));

    let sBegin;
    if (tBegin)
        sBegin = Time_FormatTime(tBegin[0]);

    let sEnd;
    if (tEnd)
        sEnd = Time_FormatTime(tEnd[1]);
    
    return `${sBegin || ['Unknown', 'Неизвестно'][_iLanguage]} – ${sEnd || ['Unknown', 'Неизвестно'][_iLanguage]}`;
}