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

                let HTML = `<div class='Header'>
                                <span><custom-round-button icon='Arrow Back' scale=26></custom-round-button></span>
                                <span><custom-round-button icon='Done' scale=26 color='var(--Main)' hover-color='var(--Main)'></custom-round-button></span>
                            </div>
                
                            <custom-textarea placeholder='${['Title', 'Название'][_iLanguage]}' class='Title'></custom-textarea>
    
                            <div>
                                <div>
                                    <svg ${_Icons['Calendar']}></svg>
                                    <input type=date value='${Time_From1970(this.Date).toISOString().slice(0, 10)}' class='Calendar' required >
                                </div>
                                
                                <div>
                                    <svg ${_Icons['Alarm']}></svg>
                                    <input type=number value=${Math.max(...Timetable_GetLessonNumbers(this.Date)) + 1} min=-127 max=128 class='Number' required>
                                </div>
                            </div>`;

                _aOverlays['LessonAdder'][1].children[1].children[0].innerHTML = HTML;


                this.GetUIElement('.Title').addEventListener('input', (Event) => { this.Validation(Event.target, undefined, undefined); })
                this.GetUIElement('.Calendar').addEventListener('input', (Event) => { this.Validation(undefined, Event.target, undefined); });
                this.GetUIElement('.Number').addEventListener('input', (Event) => { this.Validation(undefined, undefined, Event.target); });
                this.GetUIElement('.Header').lastElementChild.addEventListener('click', (Event) => { this.Send(); });



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



    Validation(eTitle = this.GetUIElement('.Title'), eDate = this.GetUIElement('.Calendar'), eNumber = this.GetUIElement('.Number'))
    {
        let bNumber;
        if (eDate.value)
        {
            let mTimetable = Timetable_GetLessonNumbers(new Date(eDate.value).get1970());
            if (mTimetable)
                bNumber = (mTimetable.includes(parseInt(eNumber.value)) === false);
            else
                bNumber = true;
        }
        else
        {
            bNumber = true;
        };
        eNumber.setCustomValidity(bNumber ? '' : 'Invalid field.');

        return eTitle.value.trim() && eDate.value && bNumber;
    }

    Send()
    {
        sSubject = document.getElementById('DayDetails_AddLesson_Subject').value.trim();
        iDate = new Date(document.getElementById('DayDetails_AddLesson_Calendar').value).get1970();
        iLessonNumber = parseInt(document.getElementById('DayDetails_AddLesson_LessonNumber').value);

        if (sSubject !== '' && iDate !== NaN && iLessonNumber !== NaN)
        {
            SendRequest('/Modules/Details/Day/AddLesson/AddLesson.php', {'Date' : iDate, 'LessonNumber' : iLessonNumber, 'Subject' : sSubject});
            
            _oWeek['AddedLessons'].push({'Date' : iDate, 'LessonNumber' : iLessonNumber, 'Subject' : sSubject});
        
        
            //// Внешнее
            // Закрытие окна
            this.Close();
            
            // Обновление элемента расписания
            let aWeekPeriod = Week_GetPeriod(_iWeekOffset);
            if (aWeekPeriod[0] <= iDate && iDate <= aWeekPeriod[1])
            {
                // Week/Script.js copypaste

                let eLesson = document.createElement('div');
                eLesson.className = 'Lesson Added';
                eLesson.innerHTML =    `<span>${iLessonNumber}</span>
                                        <a ${Timetable_GetLessonLinkAttributes(iDate, iLessonNumber)}>
                                            <span></span>
                                            <span>${sSubject}</span>
                                        </a>`;

                let eAfter = null;
                let bSame = false;
                for (let loop_aLesson of Timetable_GetLessonElements(iDate))
                {
                    let loop_iLessonNumber = parseInt(loop_aLesson.children[0].innerHTML);

                    if (loop_iLessonNumber === iLessonNumber)
                    {
                        bSame = true;
                        break;
                    };

                    if (loop_iLessonNumber > iLessonNumber)
                    {
                        eAfter = loop_aLesson;
                        break;
                    };
                };
                if (bSame === false)
                    Timetable_GetDayElement(iDate).children[1].insertBefore(eLesson, eAfter);

                Timetable_FocusLesson(iDate, iLessonNumber);
            };
        };
    }
}