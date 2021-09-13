function Week_Update(iWeekFirstDay, iWeekLastDay)
{
    SendRequest('/Modules/Week/GetWeek.php', { 'From' : iWeekFirstDay, 'To' : iWeekLastDay }, true)
    .then((aJSON) =>
    {
        // Очистка

        _oWeek['Hometasks'] = _oWeek['Hometasks'].filter(oHometask => iWeekFirstDay <= oHometask['Date'] || iWeekLastDay <= oHometask['Date']);
        _oWeek['Replacements'] = _oWeek['Replacements'].filter(oReplacement => iWeekFirstDay <= oReplacement['Date'] || iWeekLastDay <= oReplacement['Date']);

        for (let iDate = iWeekFirstDay; iDate <= iWeekLastDay; iDate++)
            if (document.querySelector(`[onclick="DayDetails(${iDate})"]`))
            {
                let iLessonIndex = 0;

                for (let loop_eLesson of document.querySelector(`[onclick="DayDetails(${iDate})"]`).parentElement.children[1].children)
                {
                    loop_eLesson.children[1].innerHTML = [..._aTimetable[Week_DateToDayOfTimetable(iDate)]][iLessonIndex++][1][0];
                    loop_eLesson.classList.remove('Canceled');
                    loop_eLesson.classList.remove('Note');
                };
            };



        // Заполнение

        for (let loop_oReplacement of aJSON['Replacements'])
        {
            _oWeek['Replacements'].push(loop_oReplacement);

            let eLesson = document.querySelector(`[onclick="LessonDetails(${loop_oReplacement['LessonNumber']}, ${loop_oReplacement['Date']});"]`);
            if (loop_oReplacement['Replacement'] === '')
            {
                eLesson.children[1].innerHTML = _aTimetable[Week_DateToDayOfTimetable(loop_oReplacement['Date'])].get(loop_oReplacement['LessonNumber'])[0];
                eLesson.classList.add('Canceled');
            }
            else
            {
                eLesson.children[1].innerHTML = loop_oReplacement['Replacement'];
            };
        };

        for (let loop_oHometask of aJSON['Hometasks'])
        {
            _oWeek['Hometasks'].push(loop_oHometask);

            for (let loop_eLesson of document.querySelector(`[onclick="DayDetails(${loop_oHometask['Date']})"]`).parentElement.children[1].children)
                if (loop_eLesson.children[1].innerHTML === loop_oHometask['Subject'])
                    loop_eLesson.classList.add('Note');
        };
    });
}

function Week_DateToDayOfTimetable(iDate)
{
    return (iDate - _iBeginDate) % _aTimetable.length;
}