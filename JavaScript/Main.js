_iToday = new Date().get1970();
_iWeekOffset = Week_GetInitialWeekOffset();
_iLanguage = Language_Get();

document.body.innerHTML =  `<nav>
                                <div class='Selected' onclick='this.firstElementChild.click()'>
                                    <custom-round-button icon=Timetable scale=30 onclick='Tab_Select(0)'></custom-round-button>
                                    <div>${['Timetable', 'Расписание'][_iLanguage]}</div>
                                </div>
                                <div onclick='this.firstElementChild.click()'>
                                    <custom-round-button icon=Edit scale=30 onclick='Tab_Select(1)'></custom-round-button>
                                    <div>${['Editor', 'Редактор'][_iLanguage]}</div>
                                </div>
                                <div onclick='this.firstElementChild.click()'>
                                    <custom-round-button icon=Settings scale=30 onclick='Tab_Select(2)'></custom-round-button>
                                    <div>${['Settings', 'Настройки'][_iLanguage]}</div>
                                </div>
                            </nav>

                            <main>
                                <div id='TimetableTab'>
                                    <div id='Information' class='Island EmptyHidden'></div>

                                    <div id='TimetableHeight'>
                                        <div id='TimetableScroll' class='Island'>
                                            <div id='Timetable'></div>
                                        </div>
                                    </div>
                                    
                                    <div id='Week' class='Island'>
                                        <custom-round-button icon='Chevron Left' scale=20 onclick='Week_Previous()' hover-color='var(--Gray70)'></custom-round-button>
                                        <button id='Week_Period' onclick='Week_Current()'></button>
                                        <custom-round-button icon='Chevron Right' scale=20 onclick='Week_Next()' hover-color='var(--Gray70)'></custom-round-button>
                                    </div>
                                </div>
                            </main>`;
Week_Select();
Timetable_Height(false);
addEventListener('resize', () => { Timetable_Overflow(document.getElementById('Timetable')); Timetable_Height(false); });


Information_Draw();

{
    let aPath = location.pathname.split('/');
    let oQuery = Object.fromEntries(new URLSearchParams(window.location.search));

    window._sURL = aPath[1];

    if (oQuery.Date !== undefined)
    {
        if (oQuery.LessonNumber !== undefined)
            new LessonDetails(parseInt(oQuery.Date), parseInt(oQuery.LessonNumber));
        else
            new DayDetails(parseInt(oQuery.Date));
    };
}


// addEventListener('focus', Week_Update);
onkeydown = (Event) =>
{
    if (Overlay_IsOpened() === false)
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
// addEventListener('swiped-right', () => { if (Overlay_IsOpened() === false) document.getElementById('Week').children[0].click(); });
// addEventListener('swiped-left', () => { if (Overlay_IsOpened() === false) document.getElementById('Week').children[2].click(); });



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