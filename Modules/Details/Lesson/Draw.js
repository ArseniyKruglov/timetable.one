function LessonDetails_Draw(iDate, iLessonNumber)
{
    window.cLesson = new Lesson(iDate, iLessonNumber);

    let HTML = `<div id='LessonDetails_Header'>
                    <span><custom-round-button icon='Arrow Back' scale=28></custom-round-button></span>
                    <span><custom-round-button icon='More' scale=28></custom-round-button></span>
                </div>
                
                <custom-textarea id='LessonDetails_Subject' placeholder='${cLesson.Subject}' value='${cLesson.Added || (cLesson.Canceled ? '' : cLesson.Replacement ?? cLesson.Subject)}' ${(_iAccessLevel < 2) ? 'readonly' : ''}></custom-textarea>

                <div id='LessonDetails_Info'>
                    <div>
                        <svg ${_Icons['Calendar']}></svg>
                        <span>${Time_FormatDate(Time_From1970(cLesson.Date))}</span>
                    </div>
                    
                ${
                    cLesson.Alarms ? 
                    `<div>
                        <svg ${_Icons['Alarm']}></svg>
                        <span>${Time_FormatTime(cLesson.Alarms[0])} – ${Time_FormatTime(cLesson.Alarms[1])}</span>
                    </div>`
                    : ''
                }

                ${
                    cLesson.Filelds.LectureHall ? 
                    `<div>
                        <svg ${_Icons['Location']}></svg>
                        <span>${cLesson.Filelds.LectureHall}</span>
                    </div>`
                    : ''
                }

                ${
                    cLesson.Filelds.Educator ? 
                    `<div>
                        <svg ${_Icons['Teacher']}></svg>
                        <span>${cLesson.Filelds.Educator}</span>
                    </div>`
                    : ''
                }
                </div>
                
                
                <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${cLesson.Note}' id='LessonDetails_Text' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''}></custom-textarea>`;

    _aOverlays['LessonDetails'][1].children[1].children[0].innerHTML = HTML;
    _aOverlays['LessonDetails'][1].children[1].className = 'Overlay_Rectangular';

    document.getElementById('LessonDetails_Header').firstElementChild.addEventListener('click', LessonDetails_Close);
    document.getElementById('LessonDetails_Header').lastElementChild.addEventListener('click', (Event) =>
    {
        let aActions = [];

        aActions.push(['Timetable', ['Show in timetable', 'Показать в расписании'][_iLanguage], () => { Timetable_FocusLesson(cLesson.Date, cLesson.LessonNumber); LessonDetails_Close(); }]);

        if (!cLesson.Added)
        {
            if (!cLesson.Canceled)
                aActions.push(['Clear', ['Cancel lesson', 'Отменить занятие'][_iLanguage], () => { document.getElementById('LessonDetails_Subject').value = ''; cLesson.Replacement = ''; }]);
        }
        else
        {
            aActions.push(['RemoveForever', ['Remove lesson', 'Удалить занятие'][_iLanguage], () => { cLesson.Added = ''; }]);
        };

        if (cLesson.Replacement)
            aActions.push(['Restore', ['Remove replacement', 'Убрать замену'][_iLanguage], () =>  { cLesson.restoreReplacement(); }]);
        else if (cLesson.Canceled)
            aActions.push(['Restore', ['Undo cancellation', 'Отменить отмену'][_iLanguage], () => { cLesson.restoreReplacement(); }]);
        
        DropDown(Event.target, aActions);
    });
    document.getElementById('LessonDetails_Subject').addEventListener('input', (Event) => { if (cLesson.Added) cLesson.Added = Event.target.value; else cLesson.Replacement = Event.target.value; });
    document.getElementById('LessonDetails_Text').addEventListener('input', (Event) => { cLesson.Note = Event.target.value; });


    history.pushState('', '', `${location.pathname}?Date=${cLesson.Date}&LessonNumber=${cLesson.LessonNumber}`);
}