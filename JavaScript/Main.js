function Language_Get()
{
    let sLanguage = (window.navigator.userLanguage || window.navigator.language).toUpperCase();

    if (sLanguage.includes('RU') || sLanguage.includes('UA') || sLanguage.includes('BE') || sLanguage.includes('KK'))
        return 1;
    
    return 0;
}

_iWeekOffset = Week_GetInitialWeekOffset();
_iLanguage = Language_Get();

document.body.innerHTML =  `<main>
                                <div id='Information'></div>
                                <div id='Timetable'></div>
                            </main>`;
Week_Select();
Information_Draw();
setInterval(Information_Draw, 1000);
setInterval(() => { if (window._LessonDetails_iDate === undefined && window._LessonDetails_iLessonNumber === undefined) Week_Update(); }, 5000);        // Очень нехорошо

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
    {
        for (let loop_eDay of document.getElementById('Timetable').children)
            loop_eDay.className = '';
    
    
    
        let iToday = new Date().getDaysSince1970();
    
        let eToday = Timetable_GetDayElement(iToday);
        if (eToday)
            eToday.className = 'Today';
    
        let eTomorrow = Timetable_GetDayElement(iToday + 1);
        if (eTomorrow)
            eTomorrow.className = 'Tomorrow';
    }
}

setTimeout
(
    () => { Midnight(); setInterval(Midnight, 24 * 60 * 60 * 1000); },
    new Date().setHours(24, 0, 0, 0) - new Date()
);