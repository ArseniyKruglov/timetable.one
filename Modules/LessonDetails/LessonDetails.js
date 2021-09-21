function LessonDetails(iDate, iLessonNumber)
{    
    Overlay_Open
    (
        'LessonDetails',
        () => { LessonDetails_Draw(iDate, iLessonNumber) },
        () => {},
        LessonDetails_Close
    );
}

function LessonDetails_Close()
{
    Overlay_Remove('LessonDetails');
    history.pushState('', '', location.pathname);
    delete _LessonDetails_iDate;
    delete _LessonDetails_iLessonNumber;
}