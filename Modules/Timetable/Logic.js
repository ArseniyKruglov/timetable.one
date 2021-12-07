function Timetable_GetLessonLinkAttributes(iDate, iIndex)
{
    return `href='${location.pathname}?Date=${iDate}&Lesson=${iIndex}' onclick="event.preventDefault(); _Router.Forward('/Lesson?Date=${iDate}&Lesson=${iIndex}');"`;
}