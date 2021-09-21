function Week_Update()
{
    SendRequest('/Modules/Week/GetWeek.php', { }, true)
    .then((aJSON) =>
    {
        _oWeek = aJSON;

        let bLessonDetailsOverlay = (window._LessonDetails_iDate && window._LessonDetails_iLessonNumber);
        if (bLessonDetailsOverlay)
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

        Week_Draw();
    });
}

function Week_Draw()
{
    // TO DO: проверка на дапазон дат

    for (let loop_oReplacement of _oWeek['Replacements'])
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
        for (let loop_eLesson of Timetable_GetLessonElements(loop_oHometask['Date']))
        {
            let sReplacement = loop_eLesson.children[1].children[0].innerHTML;
            let sSubject = loop_eLesson.children[1].children[1].innerHTML;
            if ((sReplacement ? sReplacement : sSubject) === loop_oHometask['Subject'])
                loop_eLesson.classList.add('Note');
        };
}