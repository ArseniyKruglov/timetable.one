function DayDetails_AddLesson()
{
    function Enter(Event)
    {
        if (Event.which === 13)
            document.querySelector(`#DayDetails_AddLesson > button`).click();
    };



    Overlay_Open
    (
        'DayDetails_AddLesson',
        () => { DayDetails_AddLesson_Draw(); addEventListener('keydown', Enter); },
        () => {},
        () => { DayDetails_AddLesson_Close(); removeEventListener('keydown', Enter); }      //  Не сработало
    );
}

function DayDetails_AddLesson_Close()
{
    Overlay_Remove('DayDetails_AddLesson');
}