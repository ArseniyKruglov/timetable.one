function DayDetails_AddLesson()
{
    window._aDayDetails_AddLesson_LessonNumbers = Timetable_GetLessonNumbers(_DayDetails_iDate);

    Overlay_Open
    (
        'DayDetails_AddLesson',
        DayDetails_AddLesson_Draw,
        () => {},
        DayDetails_AddLesson_Close
    );
}

function DayDetails_AddLesson_Close()
{
    Overlay_Remove('DayDetails_AddLesson');
    
    delete _aDayDetails_AddLesson_LessonNumbers;
}