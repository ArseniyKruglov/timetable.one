class SuddenLesson_ConstructorUI
{
    constructor(iDate)
    {
        Overlay_Open
        (
            'SuddenLesson_ConstructorUI',
            () =>
            {
                this.Title = '';
                this.Date = iDate;
                let aLessons = Timetable_GetLessonNumbers(this.Date);
                this.Index = ((aLessons.length) ? Math.max(...aLessons) : 0) + 1;



                _aOverlays['SuddenLesson_ConstructorUI'][1].children[1].className = 'Overlay_Rectangular';
                _aOverlays['SuddenLesson_ConstructorUI'][1].children[1].children[0].className = 'Details Adder';

                let HTML = `<div class='Header'>
                                <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                                <span><custom-round-button icon='Done'</custom-round-button></span>
                            </div>
                
                            <div>
                                <custom-textarea placeholder='${['Title', 'Название'][_iLanguage]}' class='Title' maxlength=10 required></custom-textarea>
                                <div class='Strict Invalid Caution Top'>
                                    <span></span>
                                    <span>${['Enter a lesson title', 'Укажите название занятия'][_iLanguage]}.</span>
                                </div>
                            </div>
    
                            <div class='Info'>
                                <div>
                                    <div></div>
                                    <div class='Caution Bottom'>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <custom-icon icon='Calendar'></custom-icon>
                                    <input type=date value='${Time_From1970(this.Date).toISOString().slice(0, 10)}' class='Calendar' required placeholder='${['Date', 'Дата'][_iLanguage]}'>
                                </div>
                                
                                <div>
                                    <div></div>
                                    <div class='Caution Bottom'>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <custom-icon icon='Alarm'></custom-icon>
                                    <input type=number value=${this.Index} min=-128 max=127 class='Index' required placeholder='${['Number', 'Номер'][_iLanguage]}'>
                                </div>
                            </div>`;

                _aOverlays['SuddenLesson_ConstructorUI'][1].children[1].children[0].innerHTML = HTML;



                this.GetUIElement('.Header').children[0].addEventListener('click', () => { this.Close(); });
                this.GetUIElement('.Header').children[1].addEventListener('click', () =>
                {
                    if (this.Title && this.Date && this.Index)
                        this.Send();
                    else
                        _aOverlays['SuddenLesson_ConstructorUI'][1].children[1].children[0].classList.add('Strict');
                });
                
                let SetError = (bValid, bStrict, sError) =>
                {
                    if (bValid)
                    {
                        event.target.previousElementSibling.previousElementSibling.classList.remove('Invalid');
                    }
                    else
                    {
                        event.target.previousElementSibling.previousElementSibling.classList.add('Invalid');

                        if (bStrict === true)
                            event.target.previousElementSibling.previousElementSibling.classList.add('Strict');
                        else
                            event.target.previousElementSibling.previousElementSibling.classList.remove('Strict');
                    
                        event.target.previousElementSibling.previousElementSibling.children[1].innerHTML = sError;
                    };
                };
                this.GetUIElement('.Title').addEventListener('input', (event) =>
                {
                    this.Title = event.target.value.trim();

                    if (this.Title)
                        event.target.parentElement.parentElement.nextElementSibling.classList.remove('Invalid');
                    else
                        event.target.parentElement.parentElement.nextElementSibling.classList.add('Invalid');
                });
                this.GetUIElement('.Calendar').addEventListener('input', (event) =>
                {
                    this.Date = event.target.value;

                    this.GetUIElement('.Index').dispatchEvent(new Event('input'));

                    if (this.Date)
                    {
                        this.Date = new Date(this.Date).to1970();

                        SetError(true);
                    }
                    else
                    {
                        if (event.target.validity.badInput)
                            SetError(false, true, [`Date isn't fully entered or doesn't exist.`, 'Дата введена не полностью или не существует.'][_iLanguage]);
                        else
                            SetError(false, true, ['Enter the date.', 'Укажите дату.'][_iLanguage]);
                    };
                });
                this.GetUIElement('.Index').addEventListener('input', (event) =>
                {
                    this.Index = event.target.value;

                    event.target.setCustomValidity('');
                    if (event.target.checkValidity())
                    {
                        if (this.GetUIElement('.Calendar').value)
                        {                            
                            let aLessons = Timetable_GetLessonNumbers(new Date(this.GetUIElement('.Calendar').value).to1970(), true);
                            if (aLessons)
                            {
                                this.Index = parseInt(this.Index);

                                if (aLessons.includes(this.Index))
                                {
                                    this.Index = false;
                                    event.target.setCustomValidity([`There's a lesson for this time.`, 'На это время уже назначено занятие.'][_iLanguage]);
                                    SetError(false, false, [`There's a lesson for this time.`, 'На это время уже назначено занятие.'][_iLanguage]);
                                };
                            };
                        };

                        if (event.target.checkValidity())
                            SetError(true);
                    }
                    else
                    {
                        if (!event.target.validity.badInput && event.target.validity.valueMissing)
                            SetError(false, true, ['Enter a lesson number.', 'Укажите номер занятия.'][_iLanguage]);
                        else if (event.target.validity.stepMismatch || event.target.validity.valueMissing)
                            SetError(false, false, ['Enter an integer value.', 'Введите целое значение.'][_iLanguage]);
                        else if (event.target.validity.rangeOverflow)
                            SetError(false, false, [`The value can't be more than 127.`, 'Значение не может быть больше 127.'][_iLanguage]);
                        else if (event.target.validity.rangeUnderflow)
                            SetError(false, false, [`The value can't be less than -128.`, 'Значение не может быть меньше -128.'][_iLanguage]);
                    };
                });
            },
            () => {},
            () => { this.Close(); }
        );
    }



    GetUIElement(sSelector)
    {
        return _aOverlays['SuddenLesson_ConstructorUI'][1].children[1].children[0].querySelector(sSelector);
    }

    Close()
    {
        Overlay_Remove('SuddenLesson_ConstructorUI');
    }



    Send()
    {
        SuddenLesson_Constructor(this.Date, this.Index, this.Title, true, true, true);
        this.Close();
    }
}


function SuddenLesson_Constructor(iDate, iIndex, sTitle, bDraw, bPush, bSend)
{
    if (bSend)
        SendRequest('/PHP/AddLesson/AddLesson.php', {'Date': iDate, 'Index': iIndex, 'Title': sTitle});

    if (bPush)
    {
        _oWeek.AddedLessons.push({'Date': iDate, 'LessonNumber': iIndex, 'Subject': sTitle});

        let eDay = Timetable_GetDayElement(iDate);
        if (eDay)
            eDay.children[0].children[1].innerHTML = Timetable_GetPeriod(iDate);

        if (_iToday <= iDate && iDate <= _iToday + 1)
            Information_Draw();
    };

    if (bDraw)
    {
        const aWeekPeriod = Week_GetPeriod(_iWeekOffset);
        if (aWeekPeriod[0] <= iDate && iDate <= aWeekPeriod[1])
        {
            const eLesson = document.createElement('div');
            eLesson.className = 'Lesson Added';
            eLesson.innerHTML = `<span>${iIndex}</span>
                                 <a ${Timetable_GetLessonLinkAttributes(iDate, iIndex)}>
                                    <span></span>
                                    <span>${sTitle}</span>
                                 </a>`;

            let eAfter = null;
            for (let loop_eLesson of Timetable_GetLessonElements(iDate))
            {
                const loop_iIndex = parseInt(loop_eLesson.children[0].innerHTML);

                if (loop_iIndex > iIndex)
                {
                    eAfter = loop_eLesson;
                    break;
                };
            };
            Timetable_GetDayElement(iDate).children[1].insertBefore(eLesson, eAfter);
        };
    };
}