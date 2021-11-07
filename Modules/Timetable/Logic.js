function Timetable_GetDayTimetable(iDate)
{
    for (let loop_aTimetable of _aTimetable)
        if ((loop_aTimetable[1]['Begin'] || Number.MIN_SAFE_INTEGER) <= iDate && iDate <= (loop_aTimetable[1]['End'] || Number.MAX_SAFE_INTEGER))
            return loop_aTimetable[1]['Lessons'][(iDate - loop_aTimetable[1]['AnchorDate'] % loop_aTimetable[1]['Days'].length + loop_aTimetable[1]['Days'].length) % loop_aTimetable[1]['Days'].length];   

    return false;
}

function Timetable_GetLessonLinkAttributes(iDate, iLessonNumber)
{
    return `href='${location.pathname}?Date=${iDate}&LessonNumber=${iLessonNumber}' onclick='event.preventDefault(); new LessonDetails(${iDate}, ${iLessonNumber});'`    
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
    if (_mAlarms.size)
    {
        let aPeriod = Timetable_GetPeriod_Raw(iDate);
    
        if (aPeriod === false)
            return ['Chill', 'Отдых'][_iLanguage];
        else if (aPeriod[0] === null && aPeriod[1] === null)
            return ['Unknown', 'Неизвестно'][_iLanguage]
        else
            return `${aPeriod[0] || ['Unknown', 'Неизвестно'][_iLanguage]} – ${aPeriod[1] || ['Unknown', 'Неизвестно'][_iLanguage]}`;
    }
    else
    {
        return '';
    };
}

function Timetable_GetPeriod_Raw(iDate)
{
    let aTimetable = Timetable_GetLessonNumbers(iDate);
    if (aTimetable === false || aTimetable.length === 0)
        return false;

    let tBegin = Alarm_Get(Math.min(...aTimetable)),
        tEnd = Alarm_Get(Math.max(...aTimetable));

    return [tBegin ? Time_Format(tBegin[0]) : null, tEnd ? Time_Format(tEnd[1]) : null];
}

function Timetable_SetPoint_Day(iDate, bPoint)
{
    let eDay = Timetable_GetDayElement(iDate);
    if (eDay)
    {
        if (bPoint)
            eDay.classList.add('Note');
        else
            eDay.classList.remove('Note');
    };
}

function Timetable_SetPoint_Lesson(iDate, sSubject, bPoint)
{
    for (let loop_eLesson of Timetable_GetLessonElements(iDate))
    {
        let loop_sReplacement = loop_eLesson.children[1].children[0].innerHTML;
        let loop_sSubject = loop_eLesson.children[1].children[1].innerHTML;

        if ((loop_sReplacement || loop_sSubject) === sSubject)
        {
            if (bPoint)
                loop_eLesson.classList.add('Note');
            else
                loop_eLesson.classList.remove('Note');
        };
    };
}

function Timetable_FocusLesson(iDate, iLessonNumber)
{
    _iWeekOffset = Week_DateToOffset(iDate);
    Week_Select();

    let eLesson = Timetable_GetLessonElement(iDate, iLessonNumber);
    eLesson.children[1].focus();
    eLesson.classList.add('Focused');
    setTimeout(() => { addEventListener('click', () => { eLesson.classList.remove('Focused'); }, { once: true }); }, 0);
}

function Week_DateToOffset(iDate)
{
    return Math.floor((iDate - Week_GetPeriod(0)[0]) / 7);
}