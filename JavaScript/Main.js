_iToday = new Date().get1970();
_iWeekOffset = Week_GetInitialWeekOffset();
_iLanguage = Language_Get();

document.body.innerHTML =  `<main class='${_mAlarms.size === 0 ? 'NoAlarms' : ''}'>
                                <div id='Information'></div>

                                <div id='Timetable'></div>
                                
                                <div id='Week'>
                                    <custom-round-button icon='Chevron Left' scale=20 onclick='Week_Previous()'></custom-round-button>
                                    <button id='Week_Period' onclick='Week_Current()'></button>
                                    <custom-round-button icon='Chevron Right' scale=20 onclick='Week_Next()'></custom-round-button>
                                </div>
                            </main>`;
Week_Select();

if (_mAlarms.size !== 0)
    Information_Draw();

{
    let oQuery = Object.fromEntries(new URLSearchParams(window.location.search));
    if (oQuery['Date'] !== undefined && oQuery['LessonNumber'] !== undefined)
        LessonDetails(parseInt(oQuery['Date']), parseInt(oQuery['LessonNumber']));
}


addEventListener('focus', Week_Update);
onkeydown = (Event) =>
{
    if (Overlay_IsOpened() === false)
        switch(Event.which) 
        {
            case 37:
                Week_Previous();
                break;

            case 39:
                Week_Next();
                break;
        };
};
addEventListener('swiped-left', () => { if (Overlay_IsOpened() === false) Week_Next(); });
addEventListener('swiped-right', () => { if (Overlay_IsOpened() === false) Week_Previous(); });



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