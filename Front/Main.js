function Main()
{
    window._iToday = DateToInt(new Date());
    window._iLanguage = Language_Get();



    document.body.innerHTML =  `<main>
                                    <div id='Information' class='Island EmptyHidden'></div>

                                    <div id='TimetableHeight'>
                                        <div id='TimetableScroll' class='Island'>
                                            <div id='Timetable'></div>
                                        </div>
                                    </div>

                                    <div id='Week' class='Island'>
                                        <custom-round-button icon='Chevron Left' onclick='_Timetable.WeekOffset--'></custom-round-button>
                                        <button id='Week_Period' onclick='_Timetable.WeekOffset = _Timetable.WeekOffset_Default'></button>
                                        <custom-round-button icon='Chevron Right' onclick='_Timetable.WeekOffset++'></custom-round-button>
                                    </div>
                                </main>`;



    _Timetable.Init();



    window._Information = new Information();



    window._Router = new Router();
    _Router.Init();



    {
        const Midnight = () =>
        {
            _iToday++;

            if (new Date().getDayOfWeek() === 0)
            {
                _Timetable.WeekOffset--;
            }
            else
            {
                for (let loop_eDay of _Timetable.Body.children)
                    loop_eDay.classList.remove('Today', 'Tomorrow');

                const eToday = _Timetable.DaySelector(_iToday);
                if (eToday)
                    eToday.parentElement.classList.add('Today');

                const eTomorrow = _Timetable.DaySelector(_iToday + 1);
                if (eTomorrow)
                    eTomorrow.parentElement.classList.add('Tomorrow');
            };
        }

        setTimeout
        (
            () =>
            {
                Midnight();
                setInterval(Midnight, 24 * 60 * 60 * 1000);
            },
            new Date().setHours(24, 0, 0, 0) - new Date()
        );
    }
}