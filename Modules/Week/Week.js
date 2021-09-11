function Week_Get()
{
    let iWeekFirstDay = new Date().getDaysSince1970() - new Date().getDayOfWeek() + _iWeekOffset * 7;
    fetch(`/Modules/Week/GetWeek.php?From=${iWeekFirstDay}&To=${iWeekFirstDay + 6}`)
    .then((response) =>
    {
        return response.json();
    })
    .then((aJSON) =>
    {
        window._aWeek = aJSON;

        for (let loop_eLesson of document.querySelectorAll(`#Timetable > * > * > :last-child > *`))
        {
            loop_eLesson.classList.remove('Canceled');
            loop_eLesson.classList.remove('Note');
        };

        for (let loop_aReplacement of _aWeek[1])
        {
            let eLesson = document.querySelector(`[onclick="LessonDetails(${loop_aReplacement[1]}, ${loop_aReplacement[0]});"]`);
            if (loop_aReplacement[2] === '')
            {
                eLesson.children[1].innerHTML = _aTimetable[Time_DateToDayOfTimetable(loop_aReplacement[0])].get(loop_aReplacement[1])[0];
                eLesson.classList.add('Canceled');
            }
            else
            {
                eLesson.children[1].innerHTML = loop_aReplacement[2];
            };
        };

        for (let loop_aHometask of _aWeek[0])
            for (let loop_eLesson of document.querySelector(`[onclick="DayDetails(${loop_aHometask[1]})"]`).parentElement.children[1].children)
                if (loop_eLesson.children[1].innerHTML === loop_aHometask[0])
                    loop_eLesson.classList.add('Note');
    });
}

// function Week_Previous()
// {
//     _iWeekOffset--;
//     Week_Get();
// }

// function Week_Next()
// {
//     _iWeekOffset++;
//     Week_Get();
// }