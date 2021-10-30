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

    delete _DayDetails_iDate;
}