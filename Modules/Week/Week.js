function Week_Update(bUpdate)
{
    let iWeekFirstDay = new Date().getDaysSince1970() - new Date().getDayOfWeek();
    let iWeekLastDay = iWeekFirstDay + 6;

    SendRequest('/Modules/Week/GetWeek.php', { 'From': iWeekFirstDay, 'To': iWeekLastDay }, true)
    .then((aJSON) =>
    {
        // Очистка

        // _oWeek['Hometasks'] = _oWeek['Hometasks'].filter(oHometask => iWeekFirstDay <= oHometask['Date'] || iWeekLastDay <= oHometask['Date']);
        // _oWeek['Replacements'] = _oWeek['Replacements'].filter(oReplacement => iWeekFirstDay <= oReplacement['Date'] || iWeekLastDay <= oReplacement['Date']);

        _oWeek = { 'Hometasks': [], 'Replacements': []};

        if (bUpdate === true)
            for (let iDate = iWeekFirstDay; iDate <= iWeekLastDay; iDate++)
                for (let loop_eLesson of Timetable_GetLessonElements(iDate))
                {
                    loop_eLesson.children[1].children[0].innerHTML = '';
                    loop_eLesson.classList.remove('Canceled');
                    loop_eLesson.classList.remove('Note');
                };



        // Заполнение
        let bLessonDetailsOverlay = (window._LessonDetails_iDate && window._LessonDetails_iLessonNumber);
        if (bLessonDetailsOverlay)
            var sLessonDetails_Subject = Timetable_GetDayTimetable(_LessonDetails_iDate).get(_LessonDetails_iLessonNumber)[0];

        for (let loop_oReplacement of aJSON['Replacements'])
        {
            _oWeek['Replacements'].push(loop_oReplacement);

            let eLesson = Timetable_GetLessonElement(loop_oReplacement['Date'], loop_oReplacement['LessonNumber']);
            if (eLesson)
                if (loop_oReplacement['Replacement'] === '')
                    eLesson.classList.add('Canceled');
                else
                    eLesson.children[1].children[0].innerHTML = loop_oReplacement['Replacement'];

            if (bLessonDetailsOverlay)
                if (window._LessonDetails_iDate === loop_oReplacement['Date'] && window._LessonDetails_iLessonNumber === loop_oReplacement['LessonNumber'])
                    sLessonDetails_Subject = loop_oReplacement['Replacement'];
        };

        if (bLessonDetailsOverlay)
            document.getElementById('LessonDetails_Subject').value = sLessonDetails_Subject;



        if (bLessonDetailsOverlay)
            var sLessonDetails_Text = '';

        for (let loop_oHometask of aJSON['Hometasks'])
        {
            _oWeek['Hometasks'].push(loop_oHometask);

            for (let loop_eLesson of Timetable_GetLessonElements(loop_oHometask['Date']))
            {
                let sReplacement = loop_eLesson.children[1].children[0].innerHTML;
                let sSubject = loop_eLesson.children[1].children[1].innerHTML;
                if ((sReplacement ? sReplacement : sSubject) === loop_oHometask['Subject'])
                    loop_eLesson.classList.add('Note');
            };

            if (bLessonDetailsOverlay)
                if (window._LessonDetails_iDate === loop_oHometask['Date'] && sLessonDetails_Subject === loop_oHometask['Subject'])
                    sLessonDetails_Text = loop_oHometask['Text'];
        };

        if (bLessonDetailsOverlay)
            document.getElementById('LessonDetails_Text').value = sLessonDetails_Text;
    });
}


function Week_Draw()
{
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