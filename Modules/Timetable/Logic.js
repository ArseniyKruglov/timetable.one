function Timetable_GetDayTimetable(iDate)
{
    for (let loop_aTimetable of _aTimetable)
        if ((loop_aTimetable[1]['Begin'] || Number.MIN_SAFE_INTEGER) <= iDate && iDate <= (loop_aTimetable[1]['End'] || Number.MAX_SAFE_INTEGER))
            return loop_aTimetable[1]['Lessons'][(iDate - loop_aTimetable[1]['AnchorDate'] % loop_aTimetable[1]['Days'].length + loop_aTimetable[1]['Days'].length) % loop_aTimetable[1]['Days'].length];   

    return false;
}

function Timetable_GetLessonLinkAttributes(iDate, iIndex)
{
    return `href='${location.pathname}?Date=${iDate}&Lesson=${iIndex}' onclick='event.preventDefault(); new LessonDetails(${iDate}, ${iIndex});'`    
}

function Timetable_GetLessonIndexes(iDate, bIncludeCanceled)
{
    let aLessonIndexes = [];
    
    const mTimetable = Timetable_GetDayTimetable(iDate);
    if (mTimetable)
    {
        for (let loop_aLesson of mTimetable)
            aLessonIndexes.push(loop_aLesson[0]);
    
        if (!bIncludeCanceled)
            for (let loop_oChange of _oWeek.Changes)
                if (loop_oChange.Date === iDate && loop_oChange.Change === '')
                {
                    const iIndex = aLessonIndexes.indexOf(loop_oChange.Index);

                    if (iIndex !== -1)
                        aLessonIndexes.splice(iIndex, 1);
                };
    };
    for (let loop_aAddedLesson of _oWeek.SuddenLessons)
        if (loop_aAddedLesson.Date === iDate)
            aLessonIndexes.push(loop_aAddedLesson.Index);

    return aLessonIndexes;
}

function Timetable_GetPeriod(iDate)
{
    if (_mAlarms.size)
    {
        const aLessonIndexes = Timetable_GetLessonIndexes(iDate);

        if (aLessonIndexes.length)
        {
            const aBegin = Alarm_Get(Math.min(...aLessonIndexes), iDate);
            const aEnd = Alarm_Get(Math.max(...aLessonIndexes), iDate);
            
            return `${aBegin ? Time_Format(aBegin[0]) : '?'} – ${aEnd ? Time_Format(aEnd[1]) : '?'}`;
        }
        else
        {
            return ['Chill', 'Отдых'][_iLanguage];
        };
    }
    else
    {
        return '';
    };
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

function Timetable_SetPoint_Lesson(iDate, sTitle, bPoint)
{
    for (let loop_eLesson of Timetable_GetLessonElements(iDate))
    {
        let loop_sChange = loop_eLesson.children[1].children[0].innerHTML;
        let loop_sTitle = loop_eLesson.children[1].children[1].innerHTML;

        if ((loop_sChange || loop_sTitle) === sTitle)
        {
            if (bPoint)
                loop_eLesson.classList.add('Note');
            else
                loop_eLesson.classList.remove('Note');
        };
    };
}

function Timetable_FocusLesson(iDate, iIndex)
{
    _iWeekOffset = Week_DateToOffset(iDate);
    Week_Select();

    let eLesson = Timetable_GetLessonElement(iDate, iIndex);
    eLesson.children[1].focus();
    eLesson.classList.add('Focused');
    setTimeout(() => { addEventListener('click', () => { eLesson.classList.remove('Focused'); }, { once: true }); }, 0);
}

function Week_DateToOffset(iDate)
{
    return Math.floor((iDate - Week_GetPeriod(0)[0]) / 7);
}