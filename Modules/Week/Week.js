function Week_Update()
{
    SendRequest('/Modules/Week/GetWeek.php', {}, true).then((aJSON) =>
    {
        _oWeek = aJSON;

        if (window._LessonDetails_iDate !== undefined && window._LessonDetails_iLessonNumber !== undefined)
        {
            let sLessonDetails_Subject = Timetable_GetDayTimetable(_LessonDetails_iDate).get(_LessonDetails_iLessonNumber)[0];
            for (let loop_oReplacement of _oWeek['Replacements'])
                if (window._LessonDetails_iDate === loop_oReplacement['Date'] && window._LessonDetails_iLessonNumber === loop_oReplacement['LessonNumber'])
                    sLessonDetails_Subject = loop_oReplacement['Replacement'];
            document.getElementById('LessonDetails_Subject').value = sLessonDetails_Subject;

            let sLessonDetails_Text = '';
            for (let loop_oHometask of _oWeek['Hometasks'])
                if (window._LessonDetails_iDate === loop_oHometask['Date'] && sLessonDetails_Subject === loop_oHometask['Subject'])
                    sLessonDetails_Text = loop_oHometask['Text'];
            document.getElementById('LessonDetails_Text').value = sLessonDetails_Text;
        };



        let aWeekPeriod = Week_GetPeriod(_iWeekOffset);

        for (let loop_eLesson of document.querySelectorAll('.Lesson'))
        {
            loop_eLesson.classList.remove('Note', 'Canceled');
            loop_eLesson.children[1].children[0].innerHTML = '';
        };

        let eTimetable = document.getElementById('Timetable');
        for (let i = 0; i < 7; i++)
            if (eTimetable.children[i])
                eTimetable.children[i].children[0].children[1] = Week_GetPeriod(aWeekPeriod[0] + i);

        Week_Fill(aWeekPeriod);
        Information_Draw();
    });
}

function Week_Fill(aWeekPeriod)
{
    for (let loop_oReplacement of _oWeek['Replacements'])
        if (aWeekPeriod[0] <= loop_oReplacement['Date'] && loop_oReplacement['Date'] <= aWeekPeriod[1])
        {
            let eLesson = Timetable_GetLessonElement(loop_oReplacement['Date'], loop_oReplacement['LessonNumber']);
            if (eLesson)
            {
                if (loop_oReplacement['Replacement'] === '')
                    eLesson.classList.add('Canceled');
                else
                    eLesson.children[1].children[0].innerHTML = loop_oReplacement['Replacement'];
            };
        };

    for (let loop_oHometask of _oWeek['Hometasks'])
        if (aWeekPeriod[0] <= loop_oHometask['Date'] && loop_oHometask['Date'] <= aWeekPeriod[1])
            for (let loop_eLesson of Timetable_GetLessonElements(loop_oHometask['Date']))
            {
                let sReplacement = loop_eLesson.children[1].children[0].innerHTML;
                let sSubject = loop_eLesson.children[1].children[1].innerHTML;
                if ((sReplacement ? sReplacement : sSubject) === loop_oHometask['Subject'])
                    loop_eLesson.classList.add('Note');
            };
}

function Week_Select()
{
    let aWeekPeriod = Week_GetPeriod(_iWeekOffset);

    Timetable_Draw();
    Week_Fill(aWeekPeriod);
    document.getElementById('Week_Period').innerHTML = `${Time_FormatDate_Short(Time_From1970(aWeekPeriod[0]))} – ${Time_FormatDate_Short(Time_From1970(aWeekPeriod[1]))}`;
}