function Timetable_GetDayElement(iDate)
{
    let eDay = document.querySelector(`.Day [onclick="event.preventDefault(); Route_Forward('/Day?Date=${iDate}');`);
    if (eDay)
        return eDay.parentElement;
    else
        return null;
};

function Timetable_GetLessonElement(iDate, iIndex)
{
    let eLesson = document.querySelector(`.Lesson [onclick="event.preventDefault(); Route_Forward('/Lesson?Date=${iDate}&Lesson=${iIndex}');"]`);
    if (eLesson)
        return eLesson.parentElement;
    else
        return null;
};

function Timetable_GetLessonElements(iDate)
{
    let eDay = document.querySelector(`.Day [onclick="event.preventDefault(); Route_Forward('/Day?Date=${iDate}');"]`);
    if (eDay)
        return Timetable_GetDayElement(iDate).children[1].children;
    else
        return [];
}