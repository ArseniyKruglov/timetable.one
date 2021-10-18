function DayDetails(iDate)
{    
    Overlay_Open
    (
        'DayDetails',
        () => { DayDetails_Draw(iDate) },
        () => {},
        DayDetails_Close
    );
}

function DayDetails_Close()
{
    Overlay_Remove('DayDetails');
    history.pushState('', '', location.pathname);
    delete _DayDetails_iDate;
}



function DayDetails_AddLesson()
{
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
}