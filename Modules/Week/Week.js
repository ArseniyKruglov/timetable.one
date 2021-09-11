function Week_Get()
{
    let iWeekFirstDay = new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() - new Date().getDayOfWeek())).getDaysSince1970() + _iWeekOffset * 7;
    let iWeekLastDay = iWeekFirstDay + 6;

    fetch(`/Modules/Week/GetWeek.php?From=${iWeekFirstDay}&To=${iWeekLastDay}`)
    .then((response) =>
    {
        return response.json();
    })
    .then((aJSON) =>
    {
        window._aWeek = aJSON;

        // Timetable_Draw();

        // for (let loop_aReplacement of _aWeek[1])
        // {
        //     let eLesson = document.querySelector(`[onclick="LessonDetails(${loop_aReplacement[1]}, ${loop_aReplacement[0]});"]`);
        //     if (loop_aReplacement[2] === '')
        //     {
        //         eLesson.children[1].innerHTML =_aTimetable[Time_DateToDayOfTimetable(DaysSince1970ToTime(loop_aReplacement[0]))].get(loop_aReplacement[1])[0];
        //         eLesson.classList.add('Canceled');
        //     };
        // };

        // let eTimetable = document.getElementById('Timetable');
        // for (let loop_aHometask of _aWeek[0])
        //     for (let loop_aLesson of eTimetable.children[loop_aHometask[1] - iWeekFirstDay].children[1].children)
        //         if (loop_aLesson.children[1].innerHTML === loop_aHometask[0])
        //             loop_aLesson.classList.add('Note');
    });
}

function Week_Previous()
{
    _iWeekOffset--;
    Timetable_Draw();
    Week_Get();
}

function Week_Next()
{
    _iWeekOffset++;
    Timetable_Draw();
    Week_Get();
}