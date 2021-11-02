_iToday = new Date().get1970();
_iWeekOffset = Week_GetInitialWeekOffset();
_iLanguage = Language_Get();

document.body.innerHTML =  `<main class='${_mAlarms.size === 0 ? 'NoAlarms' : ''}'>
                                <div id='Information'></div>

                                <div id='Timetable'></div>
                                
                                <div id='Week'>
                                    <custom-round-button icon='Chevron Left' scale=20 onclick='Week_Previous()' hover-color='var(--Gray00)'></custom-round-button>
                                    <button id='Week_Period' onclick='Week_Current()'></button>
                                    <custom-round-button icon='Chevron Right' scale=20 onclick='Week_Next()' hover-color='var(--Gray00)'></custom-round-button>
                                </div>
                            </main>`;
Week_Select();

if (_mAlarms.size !== 0)
    Information_Draw();

{
    let aPath = location.pathname.split('/');
    let oQuery = Object.fromEntries(new URLSearchParams(window.location.search));

    window._sURL = aPath[1];

    if (aPath[2] === 'Chart')
    {
        Chart(oQuery.Date);
    }
    else
    {
        if (oQuery.Date !== undefined)
        {
            if (oQuery.LessonNumber !== undefined)
                LessonDetails(parseInt(oQuery.Date), parseInt(oQuery.LessonNumber));
            else
                DayDetails(parseInt(oQuery.Date));
        }
    };
}


// addEventListener('focus', Week_Update);
onkeydown = (Event) =>
{
    if (Overlay_IsOpened() === false)
        switch(Event.which) 
        {
            case 37:
                document.getElementById('Week').children[0].click();
                break;

            case 39:
                document.getElementById('Week').children[2].click();
                break;
        };
};
addEventListener('swiped-right', () => { if (Overlay_IsOpened() === false) document.getElementById('Week').children[0].click(); });
addEventListener('swiped-left', () => { if (Overlay_IsOpened() === false) document.getElementById('Week').children[2].click(); });



function Midnight()
{
    _iToday = new Date().get1970();


    
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