function Timetable_GetDayElement(iDate)
{
    let eDay = document.querySelector(`.Day [onclick="event.preventDefault(); new Day_UI(${iDate});"]`);
    if (eDay)
        return eDay.parentElement;
    else
        return null;
};

function Timetable_GetLessonElement(iDate, iIndex)
{
    let eLesson = document.querySelector(`.Lesson [onclick="event.preventDefault(); new LessonDetails(${iDate}, ${iIndex});"]`);
    if (eLesson)
        return eLesson.parentElement;
    else
        return null;
};

function Timetable_GetLessonElements(iDate)
{
    let eDay = document.querySelector(`.Day [onclick="event.preventDefault(); new Day_UI(${iDate});"]`);
    if (eDay)
        return Timetable_GetDayElement(iDate).children[1].children;
    else
        return [];
}