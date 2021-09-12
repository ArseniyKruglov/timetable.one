function Language_Get()
{
    let sLanguage = (window.navigator.userLanguage || window.navigator.language).toUpperCase();

    if (sLanguage.includes('RU') || sLanguage.includes('UA') || sLanguage.includes('BE') || sLanguage.includes('KK'))
        return 1;
    
    return 0;
}

_iWeekOffset = 1;
_iBeginDate = 18869;
_iLanguage = Language_Get();

document.body.innerHTML =  `<main>
                                <div id='Timetable'></div>
                            </main>`;

Timetable_Draw();
Week_Get();



function Midnight()
{

}

setTimeout
(
    () => { Midnight(); setInterval(Mdinight, 24 * 60 * 60 * 1000); },
    new Date().setHours(24, 0, 0, 0) - new Date()
);

document.body.hidden = false;