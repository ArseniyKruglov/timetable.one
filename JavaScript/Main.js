function Language_Get()
{
    let sLanguage = (window.navigator.userLanguage || window.navigator.language).toUpperCase();

    if (sLanguage.includes('RU') || sLanguage.includes('UA') || sLanguage.includes('BE') || sLanguage.includes('KK'))
        return 1;
    
    return 0;
}

_iWeekOffset = 0;
_iLanguage = Language_Get();
_oWeek = { 'Hometasks': [], 'Replacements': []};

document.body.innerHTML =  `<main>
                                <div id='Timetable'></div>
                                <div id='Deadlines'></div>
                            </main>`;
Week_Select();
document.onkeydown = (event) =>
{
    if (Overlay_IsOpened() === false)
        switch(event.which) 
        {
            case 37:
                Week_Previous();
                break;

            case 39:
                Week_Next();
                break;
        }
};

document.addEventListener('swiped-left', () => { if (Overlay_IsOpened() === false) Week_Previous(); });
document.addEventListener('swiped-right', () => { if (Overlay_IsOpened() === false) Week_Next(); });


function Midnight()
{

}

setTimeout
(
    () => { Midnight(); setInterval(Midnight, 24 * 60 * 60 * 1000); },
    new Date().setHours(24, 0, 0, 0) - new Date()
);

document.fonts.ready.then(() =>
{
    Timetable_Focus();
    document.body.classList.remove('Unloaded');
});