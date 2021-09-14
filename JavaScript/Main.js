function Language_Get()
{
    let sLanguage = (window.navigator.userLanguage || window.navigator.language).toUpperCase();

    if (sLanguage.includes('RU') || sLanguage.includes('UA') || sLanguage.includes('BE') || sLanguage.includes('KK'))
        return 1;
    
    return 0;
}

_iWeekOffset = 0;
_iBeginDate = 18869;
_iLanguage = Language_Get();
_oWeek = { 'Hometasks' : [], 'Replacements' : [] };

document.body.innerHTML =  `<main>
                                <div id='Timetable'></div>
                            </main>`;

Timetable_Draw();

{
    let iWeekFirstDay = new Date().getDaysSince1970() - new Date().getDayOfWeek() + (_iWeekOffset - 2) * 7;
    let iWeekLastDay = iWeekFirstDay + 4 * 7 - 1;
    Week_Update(iWeekFirstDay, iWeekLastDay);
}



function Midnight()
{

}

setTimeout
(
    () => { Midnight(); setInterval(Midnight, 24 * 60 * 60 * 1000); },
    new Date().setHours(24, 0, 0, 0) - new Date()
);

document.body.hidden = false;