function Week_Update(iWeekFirstDay, iWeekLastDay)
{
    SendRequest('/Modules/Week/GetWeek.php', { 'From': iWeekFirstDay, 'To': iWeekLastDay }, true)
    .then((aJSON) =>
    {
        // Очистка

        _oWeek['Hometasks'] = _oWeek['Hometasks'].filter(oHometask => iWeekFirstDay <= oHometask['Date'] || iWeekLastDay <= oHometask['Date']);
        _oWeek['Replacements'] = _oWeek['Replacements'].filter(oReplacement => iWeekFirstDay <= oReplacement['Date'] || iWeekLastDay <= oReplacement['Date']);

        for (let iDate = iWeekFirstDay; iDate <= iWeekLastDay; iDate++)
            if (document.querySelector(`[onclick="DayDetails(${iDate})"]`))
                for (let loop_eLesson of document.querySelector(`[onclick="DayDetails(${iDate})"]`).parentElement.children[1].children)
                {
                    loop_eLesson.children[1].children[0].innerHTML = '';
                    loop_eLesson.classList.remove('Canceled');
                    loop_eLesson.classList.remove('Note');
                };



        // Заполнение

        for (let loop_oReplacement of aJSON['Replacements'])
        {
            _oWeek['Replacements'].push(loop_oReplacement);

            let eLesson = document.querySelector(`[onclick="LessonDetails(${loop_oReplacement['Date']}, ${loop_oReplacement['LessonNumber']});"]`).parentElement;
            if (loop_oReplacement['Replacement'] === '')
                eLesson.classList.add('Canceled');
            else
                eLesson.children[1].children[0].innerHTML = loop_oReplacement['Replacement'];
        };

        for (let loop_oHometask of aJSON['Hometasks'])
        {
            _oWeek['Hometasks'].push(loop_oHometask);

            for (let loop_eLesson of document.querySelector(`[onclick="DayDetails(${loop_oHometask['Date']})"]`).parentElement.children[1].children)
            {
                let sReplacement = loop_eLesson.children[1].children[0].innerHTML;
                let sSubject = loop_eLesson.children[1].children[1].innerHTML;

                if ((sReplacement ? sReplacement : sSubject) === loop_oHometask['Subject'])
                    loop_eLesson.classList.add('Note');
            };
        };
    });
}

function Week_DateToDayOfTimetable(iDate)
{
    return (iDate - _iBeginDate) % _aTimetable.length;
}

function Week_Previous()
{
    _iWeekOffset--;
    Week_Select();    
}

function Week_Current()
{
    _iWeekOffset = 0;
    Week_Select();    
}

function Week_Next()
{
    _iWeekOffset++;
    Week_Select();    
}

function Week_Select()
{
    Timetable_Draw();

    let iWeekFirstDay = new Date().getDaysSince1970() - new Date().getDayOfWeek() + (_iWeekOffset - 2) * 7;
    let iWeekLastDay = iWeekFirstDay + 4 * 7 - 1;
    Week_Update(iWeekFirstDay, iWeekLastDay);
}