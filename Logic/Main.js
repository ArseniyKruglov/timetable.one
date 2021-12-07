// Basic variables

let _iToday = new Date().to1970();
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
                                    <custom-round-button icon='Chevron Left'></custom-round-button>
                                    <button id='Week_Period'></button>
                                    <custom-round-button icon='Chevron Right'></custom-round-button>
                                </div>
                            </main>`;



// Information

const _Information = new Information();



// Timetable

const _Timetable = new Timetable();

_iMaxTitleLength = 100;
_iMaxNoteLength = 65535;



// URL

const _Router = new Router();
_Router.Route();



// Midnight

{
    const Midnight = () =>
    {
        _iToday++;



        for (let loop_eDay of document.getElementById('Timetable').children)
            loop_eDay.classList.remove('Today', 'Tomorrow');

        const eToday = _Timetable.DateToElement(_iToday);
        if (eToday)
            eToday.classList.add('Today');

        const eTomorrow = _Timetable.DateToElement(_iToday + 1);
        if (eTomorrow)
            eTomorrow.classList.add('Tomorrow');
    }

    setTimeout
    (
        () => {Midnight(); setInterval(Midnight, 24 * 60 * 60 * 1000); },
        new Date().setHours(24, 0, 0, 0) - new Date()
    );
}