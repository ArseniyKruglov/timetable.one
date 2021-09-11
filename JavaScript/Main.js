_iWeekOffset = 1;
_iBeginDate = 18869;
_iLanguage = 1;

document.body.innerHTML =  `<main>
                                <div id='Timetable'></div>
                            </main>`;

Timetable_Draw();
Week_Get();
setTimeout
(
    () => { Midnight(); setInterval(Mdinight, 24 * 60 * 60 * 1000); },
    new Date().setHours(24, 0, 0, 0) - new Date()
);

document.body.hidden = false;