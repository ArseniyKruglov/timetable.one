function Week_Fill(aWeekPeriod)
{
    for (let loop_oReplacement of _oWeek['Replacements'])
        if (aWeekPeriod[0] <= loop_oReplacement['Date'] && loop_oReplacement['Date'] <= aWeekPeriod[1])
        {
            let eLesson = Timetable_GetLessonElement(loop_oReplacement['Date'], loop_oReplacement['Index']);
            if (eLesson)
            {
                if (loop_oReplacement['Replacement'] === '')
                    eLesson.classList.add('Canceled');
                else
                    eLesson.children[1].children[0].innerHTML = loop_oReplacement['Replacement'];
            };
        };

    for (let loop_oAddedLesson of _oWeek['AddedLessons'])
        if (aWeekPeriod[0] <= loop_oAddedLesson['Date'] && loop_oAddedLesson['Date'] <= aWeekPeriod[1])
        {
            let eLesson = document.createElement('div');
            eLesson.className = 'Lesson Added';
            eLesson.innerHTML =    `<span>${loop_oAddedLesson['Index']}</span>
                                    <a ${Timetable_GetLessonLinkAttributes(loop_oAddedLesson['Date'], loop_oAddedLesson['Index'])}>
                                        <span></span>
                                        <span>${loop_oAddedLesson['Title']}</span>
                                    </a>
                                    <span></span>`;

            let eAfter = null;
            for (let loop_aLesson of Timetable_GetLessonElements(loop_oAddedLesson['Date']))
                if (parseInt(loop_aLesson.children[0].innerHTML) > loop_oAddedLesson['Index'])
                {
                    eAfter = loop_aLesson;
                    break;
                };
            Timetable_GetDayElement(loop_oAddedLesson['Date']).children[1].insertBefore(eLesson, eAfter);
        };

    for (let loop_oLessonNote of _oWeek['LessonNotes'])
        if (aWeekPeriod[0] <= loop_oLessonNote['Date'] && loop_oLessonNote['Date'] <= aWeekPeriod[1])
            for (let loop_eLesson of Timetable_GetLessonElements(loop_oLessonNote['Date']))
            {
                let sReplacement = loop_eLesson.children[1].children[0].innerHTML;
                let sTitle = loop_eLesson.children[1].children[1].innerHTML;
                if ((sReplacement ? sReplacement : sTitle) === loop_oLessonNote['Title'])
                    loop_eLesson.classList.add('Note');
            };

    for (let loop_oDayNote of _oWeek['DayNotes'])
        if (aWeekPeriod[0] <= loop_oDayNote['Date'] && loop_oDayNote['Date'] <= aWeekPeriod[1])
        {
            const eDay = Timetable_GetDayElement(loop_oDayNote['Date']);
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
    document.getElementById('Week_Period').innerHTML = `${Date_Format_Short(Time_From1970(aWeekPeriod[0]))} – ${Date_Format_Short(Time_From1970(aWeekPeriod[1]))}`;
}