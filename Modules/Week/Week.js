function GetDay(iDate)
{
    let eDay = document.querySelector(`[onclick="DayDetails(${iDate})"]`);
    if (eDay)
        return eDay.parentElement;
};

function GetLesson(iDate, iLessonNumber)
{
    let eLesson = document.querySelector(`[onclick="LessonDetails(${iDate}, ${iLessonNumber});"]`);
    if (eLesson)
        return eLesson.parentElement;
};

function GetLessons(iDate)
{
    let eDay = document.querySelector(`[onclick="DayDetails(${iDate})"]`);
    if (eDay)
        return GetDay(iDate).children[1].children;
    else
        return [];
}



function Week_DateToDayOfTimetable(iDate)
{
    return (iDate - _iBeginDate) % _aTimetable.length;
}





function Week_Update(bClear)
{
    let iWeekFirstDay = new Date().getDaysSince1970() - new Date().getDayOfWeek();
    let iWeekLastDay = iWeekFirstDay + 6;

    SendRequest('/Modules/Week/GetWeek.php', { 'From': iWeekFirstDay, 'To': iWeekLastDay }, true)
    .then((aJSON) =>
    {
        // Очистка

        _oWeek['Hometasks'] = _oWeek['Hometasks'].filter(oHometask => iWeekFirstDay <= oHometask['Date'] || iWeekLastDay <= oHometask['Date']);
        _oWeek['Replacements'] = _oWeek['Replacements'].filter(oReplacement => iWeekFirstDay <= oReplacement['Date'] || iWeekLastDay <= oReplacement['Date']);

        if (bClear === true)
            for (let iDate = iWeekFirstDay; iDate <= iWeekLastDay; iDate++)
                for (let loop_eLesson of GetLessons(iDate))
                {
                    loop_eLesson.children[1].children[0].innerHTML = '';
                    loop_eLesson.classList.remove('Canceled');
                    loop_eLesson.classList.remove('Note');
                };



        // Заполнение

        for (let loop_oReplacement of aJSON['Replacements'])
        {
            _oWeek['Replacements'].push(loop_oReplacement);

            let eLesson = GetLesson(loop_oReplacement['Date'], loop_oReplacement['LessonNumber']);
            if (eLesson)
                if (loop_oReplacement['Replacement'] === '')
                    eLesson.classList.add('Canceled');
                else
                    eLesson.children[1].children[0].innerHTML = loop_oReplacement['Replacement'];
        };

        for (let loop_oHometask of aJSON['Hometasks'])
        {
            _oWeek['Hometasks'].push(loop_oHometask);

            for (let loop_eLesson of GetLessons(loop_oHometask['Date']))
            {
                let sReplacement = loop_eLesson.children[1].children[0].innerHTML;
                let sSubject = loop_eLesson.children[1].children[1].innerHTML;
                if ((sReplacement ? sReplacement : sSubject) === loop_oHometask['Subject'])
                    loop_eLesson.classList.add('Note');
            };
        };

        Deadlines_Draw();
    });
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
    Week_Update();
}