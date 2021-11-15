class LessonDetails
{
    constructor(iDate, iLessonNumber)
    {
        Overlay_Open
        (
            'LessonDetails',
            () =>
            {
                this.Date = iDate;
                this.LessonNumber = iLessonNumber;



                let mDayTimetable = Timetable_GetDayTimetable(this.Date);

                if (mDayTimetable)
                {
                    this.oInTimetable = mDayTimetable.get(this.LessonNumber);

                    if (this.oInTimetable)
                        this.Subject = this.oInTimetable.Subject;
                    else
                        this.FindInWeek_Added();
                }
                else
                {
                    this.FindInWeek_Added();
                };



                this.FindInWeek_Replacement();
                this.FindInWeek_Note();



                _aOverlays['LessonDetails'][1].children[1].className = 'Overlay_Rectangular';
                _aOverlays['LessonDetails'][1].children[1].children[0].className = 'Details';

                let HTML = `<div class='Header'>
                                <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                                <span><custom-round-button icon='More'></custom-round-button></span>
                            </div>
                            
                            <custom-textarea class='Title' placeholder='${this.Subject}' value='${this.Added || (this.Canceled ? '' : this.Replacement ?? this.Subject)}' ${(_iAccessLevel < 2) ? 'readonly' : ''}></custom-textarea>
            
                            <div class='Info'>
                                <div class='Calendar'>
                                    <custom-icon icon='Calendar'></custom-icon>
                                    <span>${Date_Format(Time_From1970(this.Date))}</span>
                                </div>
                                
                            ${
                                this.Alarms ? 
                                `<div class='Alarms'>
                                    <custom-icon icon='Alarm'></custom-icon>
                                    <span>${Time_Format(this.Alarms[0])} – ${Time_Format(this.Alarms[1])}</span>
                                </div>`
                                : ''
                            }
            
                            ${
                                this.Fields.LectureHall ? 
                                `<div>
                                    <custom-icon icon='Location'></custom-icon>
                                    <span>${this.Fields.LectureHall}</span>
                                </div>`
                                : ''
                            }
            
                            ${
                                this.Fields.Educator ? 
                                `<div>
                                    <custom-icon icon='Educator'></custom-icon>
                                    <span>${this.Fields.Educator}</span>
                                </div>`
                                : ''
                            }`;

                if (this.Fields.UserFields)
                    for (let loop_sUserField of this.Fields.UserFields)
                        HTML += `<div>
                                    <custom-icon icon='Circle'></custom-icon>
                                    <span>${loop_sUserField[1]}</span>
                                </div>`;

                HTML +=     `</div>
                            
                            <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${this.Note}' class='Note' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''}></custom-textarea>`;
            
                _aOverlays['LessonDetails'][1].children[1].children[0].innerHTML = HTML;


            
                this.GetUIElement('.Header').children[0].addEventListener('click', () => { this.Close(); });

                this.GetUIElement('.Header').children[1].addEventListener('click', (Event) =>
                {
                    let aActions = [];
            
                    aActions.push(['Timetable', ['Show in timetable', 'Показать в расписании'][_iLanguage], () =>
                    {
                        Timetable_FocusLesson(this.Date, this.LessonNumber);
                        this.Close();
                    }]);
            
                    if (_iAccessLevel === 2)
                    {
                        if (!this.Added)
                        {  
                            if (!this.Canceled)
                                aActions.push(['Clear', ['Cancel lesson', 'Отменить занятие'][_iLanguage], () =>
                                {
                                    this.GetUIElement('.Title').value = '';
                                    this.Replacement = '';
                                }]);
                        }
                        else
                        {
                            aActions.push(['RemoveForever', ['Remove lesson', 'Удалить занятие'][_iLanguage], () =>
                            {
                                this.Added = '';
                            }]);
                        };
                
                        if (this.Replacement)
                        {
                            aActions.push(['Restore', ['Remove replacement', 'Убрать замену'][_iLanguage], () =>
                            {
                                this.GetUIElement('.Title').value = this.Subject;
                                this.Replacement = this.Subject;
                            }]);
                        }
                        else if (this.Canceled)
                        {
                            aActions.push(['Restore', ['Undo cancellation', 'Отменить отмену'][_iLanguage], () =>
                            {
                                this.GetUIElement('.Title').value = this.Subject;
                                this.Replacement = this.Subject;
                            }]);
                        };
                    };
                    
                    DropDown(Event.target, aActions);
                });

                this.GetUIElement('.Title').addEventListener('input', (Event) =>
                {
                    if (this.Added)
                        this.Added = Event.target.value;
                    else
                        this.Replacement = Event.target.value;
                });

                this.GetUIElement('.Note').addEventListener('input', (Event) =>
                {
                    this.Note = Event.target.value;
                });

                history.pushState('', '', `${location.pathname}?Date=${this.Date}&LessonNumber=${this.LessonNumber}`);
            },
            () => {},
            () => { this.Close(); }
        );
    }



    GetUIElement(sSelector)
    {
        return _aOverlays['LessonDetails'][1].children[1].children[0].querySelector(sSelector);
    }

    GetUIElements(sSelector)
    {
        return _aOverlays['LessonDetails'][1].children[1].children[0].querySelectorAll(sSelector);
    }

    Close()
    {
        Overlay_Remove('LessonDetails');
    }



    FindInWeek_Note()
    {
        if (this.oInWeek_Note === undefined)
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({ 'Date': this.Date, 'Subject': this.TimetableSubject }, true) || null;
        }
        else
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({ 'Date': this.Date, 'Subject': this.TimetableSubject }, true) || null;
            
            Timetable_SetPoint_Lesson(this.Date, this.TimetableSubject, this.oInWeek_Note);
            this.GetUIElement('.Note').value = this.Note;
        };
    }

    FindInWeek_Replacement()
    {
        this.oInWeek_Replacement = _oWeek.Replacements.selectWhere({ 'Date': this.Date, 'LessonNumber': this.LessonNumber }, true) || null;
    }

    FindInWeek_Added()
    {
        this.oInWeek_Added = _oWeek.AddedLessons.selectWhere({ 'Date': this.Date, 'LessonNumber': this.LessonNumber }, true) || null;
    }



    get Added()
    {
        return this.oInWeek_Added ? this.oInWeek_Added.Subject : null;
    }

    set Added(sSubject)
    {
        sSubject = sSubject.trim();

        if (sSubject === '')
        {
            if (confirm(`${['Remove lesson', 'Удалить занятие'][_iLanguage]} "${this.Added}" (${Date_Format(Time_From1970(this.Date))})?`))
            {
                SendRequest('/Modules/Details/Lesson/PHP/Added.php', {'Date' : this.Date, 'LessonNumber' : this.LessonNumber, 'Subject' : ''});

                _oWeek.AddedLessons.removeWhere({ 'Date': this.Date, 'LessonNumber': this.LessonNumber }, true);

                if (this.Element.parentElement.children.length === 1)
                    this.DayElement.remove();
                else
                    this.Element.remove();

                this.Close();
            }
            else
            {
                this.GetUIElement('.Title').value = this.Added;
            };
        }
        else
        {
            this.oInWeek_Added.Subject = sSubject;
            
            SendRequest('/Modules/Details/Lesson/PHP/Added.php', {'Date' : this.Date, 'LessonNumber' : this.LessonNumber, 'Subject' : this.Added});

            Information_Draw();
            if (this.Element)
                this.Element.children[1].children[1].innerHTML = this.Added;

            this.FindInWeek_Note();
        };
    }



    get Replacement()
    {
        return (this.oInWeek_Replacement && !this.Canceled) ? this.oInWeek_Replacement.Replacement : null;
    }

    set Replacement(sReplacement)
    {
        sReplacement = sReplacement.trim();

        let bWasCanceled = this.Canceled;
        
        if (sReplacement === this.Subject)
        {    
            if (this.oInWeek_Replacement)
                _oWeek.Replacements.removeWhere({ 'Date': this.Date, 'LessonNumber': this.LessonNumber }, true);

            this.oInWeek_Replacement = null;
        }
        else
        {
            if (this.oInWeek_Replacement)
            {
                this.oInWeek_Replacement.Replacement = sReplacement;
            }
            else
            {
                this.oInWeek_Replacement = 
                {
                    'Date': this.Date,
                    'LessonNumber': this.LessonNumber,
                    'Replacement': sReplacement
                };

                _oWeek.Replacements.push(this.oInWeek_Replacement);                
            };
        };

        SendRequest('/Modules/Details/Lesson/PHP/Replacement.php', {'Date': this.Date, 'LessonNumber': this.LessonNumber, 'Subject': this.Subject, 'Replacement': sReplacement});

        Information_Draw();
        if (this.Canceled !== bWasCanceled)
        {
            if (this.DayElement)
                this.DayElement.children[0].children[1].innerHTML = Timetable_GetPeriod(this.Date);
        };

        if (this.Element)
        {
            if (this.Canceled)
                this.Element.classList.add('Canceled');
            else
                this.Element.classList.remove('Canceled');
    
            this.Element.children[1].children[0].innerHTML = this.Replacement ?? '';
        };

        this.FindInWeek_Note();
    }

    get Canceled()
    {
        return this.oInWeek_Replacement && this.oInWeek_Replacement.Replacement === '';
    }



    get Note()
    {
        return this.oInWeek_Note ? this.oInWeek_Note.Note : '';
    }

    set Note(sNote)
    {
        sNote = sNote.trim();

        if (sNote)
        {
            if (this.oInWeek_Note)
            {
                this.oInWeek_Note.Note = sNote;
            }
            else
            {
                this.oInWeek_Note = 
                {
                    'Subject': this.TimetableSubject,
                    'Date': this.Date,
                    'Note': sNote
                };

                _oWeek.LessonNotes.push(this.oInWeek_Note);                
            };
        }
        else
        {
            if (this.oInWeek_Note)
                _oWeek.LessonNotes.removeWhere({ 'Date': this.Date, 'Subject': this.TimetableSubject }, true);

            this.oInWeek_Note = null;
        };

        SendRequest('/Modules/Details/Lesson/PHP/Note.php', {'Date': this.Date, 'Subject': this.TimetableSubject, 'Note': this.Note});

        Timetable_SetPoint_Lesson(this.Date, this.TimetableSubject, this.oInWeek_Note);
    }




    get Fields()
    {
        return this.oInTimetable ? this.oInTimetable.Fields : {};
    }



    get TimetableSubject()
    {
        return this.Added || (this.Replacement ?? this.Subject);
    }

    get DayElement()
    {
        return Timetable_GetDayElement(this.Date);
    }

    get Element()
    {
        return Timetable_GetLessonElement(this.Date, this.LessonNumber);
    }



    get Alarms()
    {
        return Alarm_Get(this.LessonNumber, this.Date);
    }
}