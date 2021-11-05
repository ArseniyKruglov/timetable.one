class LessonAdder
{
    constructor(iDate)
    {
        function Enter(Event)
        {
            if (Event.which === 13)
                document.querySelector(`#DayDetails_AddLesson > button`).click();
        };

        Overlay_Open
        (
            'LessonAdder',
            () =>
            {
                this.Date = iDate || _iToday;



                _aOverlays['LessonAdder'][1].children[1].className = 'Overlay_Rectangular';
                _aOverlays['LessonAdder'][1].children[1].children[0].className = 'Details';

                let HTML = `<custom-textarea placeholder='${['Title', 'Название'][_iLanguage]}' class='Title' oninput='DayDetails_AddLesson_Validation(this, undefined, undefined)'></custom-textarea>
    
                            <div>
                                <svg ${_Icons['Calendar']}></svg>
                                <input type=date value='${Time_From1970(this.Date).toISOString().slice(0, 10)}' id='DayDetails_AddLesson_Calendar' required oninput='DayDetails_AddLesson_Validation(undefined, this, undefined)'>
                            </div>
                            
                            <div>
                                <svg ${_Icons['Alarm']}></svg>
                                <input type=number value=${Math.max(...Timetable_GetLessonNumbers(this.Date)) + 1} min=-127 max=128 id='DayDetails_AddLesson_LessonNumber' required oninput='DayDetails_AddLesson_Validation(undefined, undefined, this)'>
                            </div>
                            
                            <button onclick='DayDetails_AddLesson_AddLesson()' disabled>${['Add', 'Добавить'][_iLanguage]}</button>`;

                _aOverlays['LessonAdder'][1].children[1].children[0].innerHTML = HTML;



                addEventListener('keydown', Enter);
            },
            () => {},
            () => { this.Close(); removeEventListener('keydown', Enter); }
        );
    }



    GetUIElement(sSelector)
    {
        return _aOverlays['LessonAdder'][1].children[1].children[0].querySelector(sSelector);
    }

    Close()
    {
        Overlay_Remove('LessonAdder');
    }



    Validation(eSubject = this.GetUIElement('.Title'), eDate = document.getElementById('DayDetails_AddLesson_Calendar'), eLessonNumber = document.getElementById('DayDetails_AddLesson_LessonNumber'))
    {
        let bSubject = eSubject.value.trim() != '';

        let bDate = eDate.value !== '';

        let bLessonNumber;
        if (bDate)
        {
            let mTimetable = Timetable_GetLessonNumbers(new Date(eDate.value).get1970());
            if (mTimetable)
                bLessonNumber = (mTimetable.includes(parseInt(eLessonNumber.value)) === false);
            else
                bLessonNumber = true;
        }
        else
        {
            bLessonNumber = true;
        };
        eLessonNumber.setCustomValidity(bLessonNumber ? '' : 'Invalid field.');

        document.querySelector(`#DayDetails_AddLesson > button`).disabled = !(bSubject && bDate && bLessonNumber);
    }
}