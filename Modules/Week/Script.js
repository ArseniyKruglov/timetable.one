function Week_Fill(aWeekPeriod)
{
    for (let loop_oChange of _oWeek.Changes)
        if (aWeekPeriod[0] <= loop_oChange.Date && loop_oChange.Date <= aWeekPeriod[1])
        {
            let eLesson = Timetable_GetLessonElement(loop_oChange.Date, loop_oChange.Index);
            if (eLesson)
            {
                if (loop_oChange.Change === '')
                    eLesson.classList.add('Canceled');
                else
                    eLesson.children[1].children[0].innerHTML = loop_oChange.Change;
            };
        };

    for (let loop_oAddedLesson of _oWeek.SuddenLessons)
        if (aWeekPeriod[0] <= loop_oAddedLesson.Date && loop_oAddedLesson.Date <= aWeekPeriod[1])
            SuddenLesson_Constructor(loop_oAddedLesson.Date, loop_oAddedLesson.Index, loop_oAddedLesson.Title, true, false, false);

    for (let loop_oLessonNote of _oWeek.LessonNotes)
        if (aWeekPeriod[0] <= loop_oLessonNote.Date && loop_oLessonNote.Date <= aWeekPeriod[1])
            for (let loop_eLesson of Timetable_GetLessonElements(loop_oLessonNote.Date))
            {
                let sChange = loop_eLesson.children[1].children[0].innerHTML;
                let sTitle = loop_eLesson.children[1].children[1].innerHTML;
                if ((sChange ? sChange : sTitle) === loop_oLessonNote.Title)
                    loop_eLesson.classList.add('Note');
            };

    for (let loop_oDayNote of _oWeek.DayNotes)
        if (aWeekPeriod[0] <= loop_oDayNote.Date && loop_oDayNote.Date <= aWeekPeriod[1])
        {
            const eDay = Timetable_GetDayElement(loop_oDayNote.Date);
            if (eDay !== null)
                eDay.classList.add('Note');
        };
}

function Week_Select()
{
    Timetable_Draw();
    Timetable_Overflow(document.getElementById('Timetable'));
    document.fonts.ready.then(Timetable_Scroll);

    let sWeekClass;
    if (_iWeekOffset === 0)
        sWeekClass = 'Current';
    else if (_iWeekOffset === 1)
        sWeekClass = 'Next';
    else if (_iWeekOffset < 0)
        sWeekClass = 'Past';
    document.getElementById('Week').className = `Island ${sWeekClass}`;

    const aWeekPeriod = Week_GetPeriod(_iWeekOffset);
    Week_Fill(aWeekPeriod);

    const iCurrentYear = new Date().getFullYear();
    aWeekPeriod[0] = Time_From1970(aWeekPeriod[0]);
    aWeekPeriod[1] = Time_From1970(aWeekPeriod[1]);
    if (aWeekPeriod[0].getFullYear() === iCurrentYear && aWeekPeriod[1].getFullYear() === iCurrentYear)
        document.getElementById('Week_Period').innerHTML = `${Date_Format_Short(aWeekPeriod[0])} – ${Date_Format_Short(aWeekPeriod[1])}`;
    else
        document.getElementById('Week_Period').innerHTML = `${Date_Format_Short(aWeekPeriod[0], true)} – ${Date_Format_Short(aWeekPeriod[1], true)}`;
}