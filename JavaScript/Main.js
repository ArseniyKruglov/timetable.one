_iToday = new Date().to1970();
_iWeekOffset = Week_GetInitialWeekOffset();
_iLanguage = Language_Get();

document.body.innerHTML =  `<main>
                                <div id='TimetableTab'>
                                    <div id='Information' class='Island EmptyHidden'></div>

                                    <div id='TimetableHeight'>
                                        <div id='TimetableScroll' class='Island'>
                                            <div id='Timetable'></div>
                                        </div>
                                    </div>
                                    
                                    <div id='Week' class='Island'>
                                        <custom-round-button icon='Chevron Left' onclick='Week_Previous()'></custom-round-button>
                                        <button id='Week_Period' onclick='Week_Current()'></button>
                                        <custom-round-button icon='Chevron Right' onclick='Week_Next()'></custom-round-button>
                                    </div>
                                </div>
                            </main>`;
Week_Select();
Timetable_Height(false);
addEventListener('resize', () => { Timetable_Overflow(document.getElementById('Timetable')); _aHeights = []; Timetable_Height(false); });


Information_Draw();

{
    window._sURL = location.pathname.split('/')[1];
    const oQuery = Object.fromEntries(new URLSearchParams(window.location.search));

    
    if (oQuery.Date)
    {
        if (oQuery.Lesson)
            new LessonDetails(parseInt(oQuery.Date), parseInt(oQuery.Lesson));
        else
            new Day_UI(parseInt(oQuery.Date));
    };
}



addEventListener('focus', Information_Draw);
onkeydown = (Event) =>
{
    if (!Overlay_IsOpened())
        switch(Event.which) 
        {
            case 37:
                document.getElementById('Week').firstElementChild.click();
                break;

            case 39:
                document.getElementById('Week').lastElementChild.click();
                break;
        };
};



function Midnight()
{
    _iToday++;


    
    for (let loop_eDay of document.getElementById('Timetable').children)
        loop_eDay.classList.remove('Today', 'Tomorrow');

    let eToday = Timetable_GetDayElement(_iToday);
    if (eToday)
        eToday.classList.add('Today');

    let eTomorrow = Timetable_GetDayElement(_iToday + 1);
    if (eTomorrow)
        eTomorrow.classList.add('Tomorrow');
}

setTimeout
(
    () => { Midnight(); setInterval(Midnight, 24 * 60 * 60 * 1000); },
    new Date().setHours(24, 0, 0, 0) - new Date()
);