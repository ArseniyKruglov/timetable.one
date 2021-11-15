class LessonAdder
{
    constructor(iDate)
    {

        Overlay_Open
        (
            'LessonAdder',
            () =>
            {
                this.Date = iDate;
                this.Valid = false;



                _aOverlays['LessonAdder'][1].children[1].className = 'Overlay_Rectangular';
                _aOverlays['LessonAdder'][1].children[1].children[0].className = 'Details Adder';

                let HTML = `<div class='Header'>
                                <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                                <span><custom-round-button icon='Done'</custom-round-button></span>
                            </div>
                
                            <div class='Strict Invalid'>
                                <custom-textarea placeholder='${['Title', 'Название'][_iLanguage]}' class='Title' maxlength=10 required></custom-textarea>
                                <div class='Caution Top'>
                                    <span></span>
                                    <span>${['Enter a lesson title', 'Укажите название занятия'][_iLanguage]}.</span>
                                </div>
                            </div>
    
                            <div class='Info'>
                                <div class='Moderate'>
                                    <div></div>
                                    <div class='Caution Bottom'>
                                        <span></span>
                                        <span>Lorem Ipsum</span>
                                    </div>
                                    <custom-icon icon='Calendar'></custom-icon>
                                    <input type=date value='${Time_From1970(this.Date).toISOString().slice(0, 10)}' class='Calendar' required>
                                </div>
                                
                                <div class='Moderate'>
                                    <div></div>
                                    <div class='Caution Bottom'>
                                        <span></span>
                                        <span>Lorem Ipsum</span>
                                    </div>
                                    <custom-icon icon='Alarm'></custom-icon>
                                    <input type=number value=${Math.max(...Timetable_GetLessonNumbers(this.Date)) + 1} min=-127 max=128 class='Number' required>
                                </div>
                            </div>`;

                _aOverlays['LessonAdder'][1].children[1].children[0].innerHTML = HTML;



                this.GetUIElement('.Header').firstElementChild.addEventListener('click', () => { this.Close(); });
                this.GetUIElement('.Header').lastElementChild.addEventListener('click', () =>
                {
                    if (this.Valid)
                        this.Send();
                    else
                        _aOverlays['LessonAdder'][1].children[1].children[0].classList.add('Strict');
                });
                
                let SetError = (bValid, bStrict, sError) =>
                {
                    this.Valid = bValid;

                    if (bValid)
                    {
                        event.target.parentElement.classList.remove('Invalid');
                    }
                    else
                    {
                        event.target.parentElement.className = bStrict ? 'Strict' : 'Moderate';
                        event.target.parentElement.classList.add('Invalid');
                        event.target.parentElement.children[1].children[1].innerHTML = sError;
                    };
                };
                this.GetUIElement('.Title').addEventListener('input', (event) =>
                {
                    if (event.target.value)
                    {
                        this.Valid = true;
                        event.target.parentElement.parentElement.parentElement.classList.remove('Invalid');
                    }
                    else
                    {
                        this.Valid = false;
                        event.target.parentElement.parentElement.parentElement.classList.add('Invalid');
                    }
                });
                this.GetUIElement('.Calendar').addEventListener('input', (event) =>
                {
                    if (event.target.value)
                    {
                        SetError(true);
                        this.GetUIElement('.Number').dispatchEvent(new Event('input'));
                    }
                    else
                    {
                        if (event.target.validity.badInput)
                            SetError(false, true, [`Date isn't fully entered or doesn't exist.`, 'Дата введена не полностью или не существует.'][_iLanguage]);
                        else
                            SetError(false, true, ['Enter the date.', 'Укажите дату.'][_iLanguage]);
                    };
                });
                this.GetUIElement('.Number').addEventListener('input', (event) =>
                {
                    event.target.setCustomValidity('');
                    if (event.target.checkValidity())
                    {
                        let bValid = true;
                        if (this.GetUIElement('.Calendar').value)
                        {
                            let aLeesons = Timetable_GetLessonNumbers(new Date(this.GetUIElement('.Calendar').value).get1970(), true);
                            if (aLeesons)
                                bValid = !aLeesons.includes(parseInt(event.target.value));
                        };
                        
                        if (bValid)
                        {
                            event.target.setCustomValidity('');
                            SetError(true);
                        }
                        else
                        {
                            event.target.setCustomValidity([`There's a lesson for this time.`, 'На это время уже назначено занятие.'][_iLanguage]);
                            SetError(false, false, [`There's a lesson for this time.`, 'На это время уже назначено занятие.'][_iLanguage]);
                        };
                    }
                    else
                    {
                        if (!event.target.validity.badInput && event.target.validity.valueMissing)
                        {
                            SetError(false, true, ['Enter a lesson number.', 'Укажите номер занятия.'][_iLanguage]);
                        }
                        else if (event.target.validity.stepMismatch || event.target.validity.valueMissing)
                        {
                            SetError(false, false, ['Enter an integer value.', 'Введите целое значение.'][_iLanguage]);
                        }
                        else if (event.target.validity.rangeOverflow)
                        {
                            SetError(false, false, [`The value can't be more than 128.`, 'Значение не может быть больше 128.'][_iLanguage]);
                        }
                        else if (event.target.validity.rangeUnderflow)
                        {
                            SetError(false, false, [`The value can't be less than -127.`, 'Значение не может быть меньше -127.'][_iLanguage]);
                        };
                    };
                });
            },
            () => {},
            () => { this.Close(); }
        );
    }



    GetUIElement(sSelector)
    {
        return _aOverlays['LessonAdder'][1].children[1].children[0].querySelector(sSelector);
    }

    GetUIElements(sSelector)
    {
        return _aOverlays['LessonAdder'][1].children[1].children[0].querySelectorAll(sSelector);
    }

    Close()
    {
        Overlay_Remove('LessonAdder');
    }



    Send()
    {
        let sTitle = this.GetUIElement('.Title').value.trim();
        let iDate = new Date(this.GetUIElement('.Calendar').value).get1970();
        let iNumber = parseInt(this.GetUIElement('.Number').value);

        SendRequest('/Modules/Editor/AddLesson/AddLesson.php', {'Date' : iDate, 'LessonNumber' : iNumber, 'Subject' : sTitle});
        
        _oWeek['AddedLessons'].push({'Date' : iDate, 'LessonNumber' : iNumber, 'Subject' : sTitle});
    
        this.Close();
        
        let aWeekPeriod = Week_GetPeriod(_iWeekOffset);
        if (aWeekPeriod[0] <= iDate && iDate <= aWeekPeriod[1])
        {
            let eLesson = document.createElement('div');
            eLesson.className = 'Lesson Added';
            eLesson.innerHTML =    `<span>${iNumber}</span>
                                    <a ${Timetable_GetLessonLinkAttributes(iDate, iNumber)}>
                                        <span></span>
                                        <span>${sTitle}</span>
                                    </a>`;

            let eAfter = null;
            let bSame = false;
            for (let loop_aLesson of Timetable_GetLessonElements(iDate))
            {
                let loop_iLessonNumber = parseInt(loop_aLesson.children[0].innerHTML);

                if (loop_iLessonNumber === iNumber)
                {
                    bSame = true;
                    break;
                };

                if (loop_iLessonNumber > iNumber)
                {
                    eAfter = loop_aLesson;
                    break;
                };
            };
            if (bSame === false)
                Timetable_GetDayElement(iDate).children[1].insertBefore(eLesson, eAfter);
        };
    }
}