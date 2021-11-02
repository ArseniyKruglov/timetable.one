function DayDetails_AddLesson_Draw()
{
    let HTML = `<custom-textarea placeholder='${['Subject', 'Предмет'][_iLanguage]}' id='DayDetails_AddLesson_Subject' oninput='DayDetails_AddLesson_Validation(this, undefined, undefined)'></custom-textarea>
    
                <div>
                    <svg ${_Icons['Calendar']}></svg>
                    <input type=date value='${Time_From1970(_DayDetails_iDate).toISOString().slice(0, 10)}' id='DayDetails_AddLesson_Calendar' required oninput='DayDetails_AddLesson_Validation(undefined, this, undefined)'>
                </div>
                
                <div>
                    <svg ${_Icons['Alarm']}></svg>
                    <input type=number value=${Math.max(...Timetable_GetLessonNumbers(_DayDetails_iDate)) + 1} min=-127 max=128 id='DayDetails_AddLesson_LessonNumber' required oninput='DayDetails_AddLesson_Validation(undefined, undefined, this)'>
                </div>
                
                <button onclick='DayDetails_AddLesson_AddLesson()' disabled>${['Add', 'Добавить'][_iLanguage]}</button>`;

    _aOverlays['DayDetails_AddLesson'][1].children[1].children[0].innerHTML = HTML;
    _aOverlays['DayDetails_AddLesson'][1].children[1].className = 'Overlay_Rectangular';
}