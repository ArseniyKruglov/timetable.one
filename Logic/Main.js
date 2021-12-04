// Basic variables

let _iToday = new Date().to1970();
let _iWeekOffset = Week_GetInitialWeekOffset();
const _iLanguage = Language_Get();



// Body

document.body.innerHTML =  `<main>
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
                            </main>`;



// Information

const _Information = new Information();


                            
// Timetable

const _Timetable = new Timetable();

_aHeights = [];
Week_Select();
Timetable_Height(false);

{
    const Redraw = () =>
    {
        _mHeights = [];
        Timetable_Height(false);
        Timetable_Overflow();
        Timetable_Scroll();
    };

    addEventListener('resize', Redraw);
    document.fonts.ready.then(Redraw);
}

_iMaxTitleLength = 100;
_iMaxNoteLength = 65535;



// URL

_sURL = location.pathname.split('/')[1];
_aHistory = [];

Route();
addEventListener('popstate', Route);



// Events

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
addEventListener('swiped-right', () =>
{
    if (!Overlay_IsOpened())
        document.getElementById('Week').firstElementChild.click();
});
addEventListener('swiped-left', () =>
{
    if (!Overlay_IsOpened())
        document.getElementById('Week').lastElementChild.click();
});



function Midnight()
{
    _iToday++;


    
    for (let loop_eDay of document.getElementById('Timetable').children)
        loop_eDay.classList.remove('Today', 'Tomorrow');

    const eToday = Timetable_GetDayElement(_iToday);
    if (eToday)
        eToday.classList.add('Today');

    const eTomorrow = Timetable_GetDayElement(_iToday + 1);
    if (eTomorrow)
        eTomorrow.classList.add('Tomorrow');
}

setTimeout
(
    () => { Midnight(); setInterval(Midnight, 24 * 60 * 60 * 1000); },
    new Date().setHours(24, 0, 0, 0) - new Date()
);