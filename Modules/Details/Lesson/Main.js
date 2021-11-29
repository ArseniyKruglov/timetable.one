class LessonDetails
{
    constructor(iDate, iIndex, bAnimation = true)
    {
        this.Date = iDate;
        this.Index = iIndex;



        this.Overlay = new Overlay();
        this.Overlay.Callback_Open = () =>
        {
            this.Init();

            if (this.Title || this.Added)
            {
                this.Draw();

                this.Overlay.Link = `/Lesson?Date=${this.Date}&Lesson=${this.Index}`;
            }
            else
            {
                alert(['Not found', 'Не найдено'][_iLanguage]);
                this.Overlay.Close();
            };
        };
        this.Overlay.Animation = bAnimation;
        this.Overlay.Open();
    }



    Init()
    {
        const mDayTimetable = Timetable_GetDayTimetable(this.Date);

        if (mDayTimetable)
        {
            this.oInTimetable = mDayTimetable.get(this.Index);

            if (this.oInTimetable)
                this.Title = this.oInTimetable.Title;
            else
                this.FindInWeek_Added();
        }
        else
        {
            this.FindInWeek_Added();
        };



        this.FindInWeek_Change();
        this.FindInWeek_Note();
    }

    Draw()
    {
        this.Overlay.Container.className = 'Overlay_Rectangular DetailsContainer';
        this.Overlay.Body.className = 'Lesson Details';

        let HTML = `<div class='Header'>
                        <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                        <span><custom-round-button icon='More'></custom-round-button></span>
                    </div>
                    
                    <custom-textarea class='Title' placeholder='${this.Title}' value='${this.Added || (this.Canceled ? '' : this.Change ?? this.Title)}' ${(_iAccessLevel < 2) ? 'readonly' : ''}></custom-textarea>
    
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
                        this.Fields.LectureHall || (this.oInWeek_Changes || {}).Place ? 
                        `<div>
                            <custom-icon icon='Location'></custom-icon>
                            <span>
                                <span>${(this.oInWeek_Changes || {}).Place || ''}</span>
                                <span>${this.Fields.LectureHall}</span>
                            </span>
                        </div>`
                        : ''
                    }
    
                    ${
                        this.Fields.Educator || (this.oInWeek_Changes || {}).Educator ? 
                        `<div>
                            <custom-icon icon='Educator'></custom-icon>
                            <span>
                                <span>${(this.oInWeek_Changes || {}).Educator || ''}</span>
                                <span>${this.Fields.Educator}</span>
                            </span>
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
    
        this.Overlay.Body.innerHTML = HTML;


    
        this.Overlay.GetUIElement('.Header').children[0].addEventListener('click', () => { this.Overlay.Close(); });

        this.Overlay.GetUIElement('.Header').children[1].addEventListener('click', (Event) =>
        {
            let aActions = [];
    
            aActions.push(['Timetable', ['Show in timetable', 'Показать в расписании'][_iLanguage], () =>
            {
                Timetable_FocusLesson(this.Date, this.Index);
                this.Overlay.Close();
            }]);
    
            if (_iAccessLevel === 2)
            {
                if (!this.IsAdded)
                {  
                    if (!this.Canceled)
                        aActions.push(['Clear', ['Cancel lesson', 'Отменить занятие'][_iLanguage], () =>
                        {
                            this.Overlay.GetUIElement('.Title').value = '';
                            this.Change = '';
                        }]);
                }
                else
                {
                    aActions.push(['RemoveForever', ['Remove lesson', 'Удалить занятие'][_iLanguage], () =>
                    {
                        this.Added = '';
                    }]);
                };
        
                if (this.Change)
                {
                    aActions.push(['Restore', ['Remove replacement', 'Убрать замену'][_iLanguage], () =>
                    {
                        this.Overlay.GetUIElement('.Title').value = this.Title;
                        this.Change = this.Title;
                    }]);
                }
                else if (this.Canceled)
                {
                    aActions.push(['Restore', ['Undo cancellation', 'Отменить отмену'][_iLanguage], () =>
                    {
                        this.Overlay.GetUIElement('.Title').value = this.Title;
                        this.Change = this.Title;
                    }]);
                };
            };
            
            DropDown(Event.target, aActions);
        });

        this.Overlay.GetUIElement('.Title').addEventListener('input', (Event) =>
        {
            if (this.Added)
                this.Added = Event.target.value;
            else
                this.Change = Event.target.value;
        });

        this.Overlay.GetUIElement('.Note').addEventListener('input', (Event) =>
        {
            this.Note = Event.target.value;
        });
    }

    Draw_404()
    {
        this.Overlay.Container.className = 'Overlay_Rectangular DetailsContainer';
        this.Overlay.Body.className = 'Lesson Details NotFound';

        let HTML = `<span>${['Lesson not found', 'Занятие не найдено'][_iLanguage]}</span>
                    <button>OK</button>`;

        this.Overlay.Body.innerHTML = HTML;



        this.Overlay.GetUIElement('button').addEventListener('click', (Event) =>
        {
            Event.target.addEventListener('click', () => { this.Overlay.Close(); });
        });
    }



    FindInWeek_Note()
    {
        if (this.oInWeek_Note === undefined)
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({ 'Date': this.Date, 'Title': this.TimetableTitle }, true) || null;
        }
        else
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({ 'Date': this.Date, 'Title': this.TimetableTitle }, true) || null;
            
            Timetable_SetPoint_Lesson(this.Date, this.TimetableTitle, this.oInWeek_Note);
            this.Overlay.GetUIElement('.Note').value = this.Note;
        };
    }

    FindInWeek_Change()
    {
        this.oInWeek_Changes = _oWeek.Changes.selectWhere({ 'Date': this.Date, 'Index': this.Index }, true) || null;
    }

    FindInWeek_Added()
    {
        this.oInWeek_Added = _oWeek.SuddenLessons.selectWhere({ 'Date': this.Date, 'Index': this.Index }, true) || null;
    }



    get Added()
    {
        return this.oInWeek_Added ? this.oInWeek_Added.Title : null;
    }

    get IsAdded()
    {
        return this.oInWeek_Added ? true : false;
    }

    set Added(sTitle)
    {
        sTitle = sTitle.trim();

        if (sTitle === '')
        {
            if (confirm(`${['Remove lesson', 'Удалить занятие'][_iLanguage]} "${this.Added}" (${Date_Format(Time_From1970(this.Date))})?`))
            {
                SendRequest('/PHP/Handlers/Lesson_Sudden.php', {'Date' : this.Date, 'Index' : this.Index, 'Title' : ''});

                _oWeek.SuddenLessons.removeWhere({ 'Date': this.Date, 'Index': this.Index }, true);

                if (this.Element.parentElement.children.length === 1)
                    this.DayElement.remove();
                else
                    this.Element.remove();

                this.Overlay.Close();
            }
            else
            {
                this.Overlay.GetUIElement('.Title').value = this.Added;
            };
        }
        else
        {
            this.oInWeek_Added.Title = sTitle;
            
            SendRequest('/PHP/Handlers/Lesson_Sudden.php', {'Date' : this.Date, 'Index' : this.Index, 'Title' : this.Added});

            Information_Update(this.Date);

            if (this.Element)
                this.Element.children[1].children[1].innerHTML = this.Added;

            this.FindInWeek_Note();
        };
    }



    get Change()
    {
        return (this.oInWeek_Changes && !this.Canceled) ? this.oInWeek_Changes.Change : null;
    }

    set Change(sChange)
    {
        sChange = sChange.trim();
        
        if (sChange === this.Title)
        {    
            if (this.oInWeek_Changes)
                _oWeek.Changes.removeWhere({ 'Date': this.Date, 'Index': this.Index }, true);

            this.oInWeek_Changes = null;
        }
        else
        {
            if (this.oInWeek_Changes)
            {
                this.oInWeek_Changes.Change = sChange;
            }
            else
            {
                this.oInWeek_Changes = 
                {
                    'Date': this.Date,
                    'Index': this.Index,
                    'Change': sChange,
                    'Place': null,
                    'Educator': null
                };

                _oWeek.Changes.push(this.oInWeek_Changes);
            };
        };

        SendRequest('/PHP/Handlers/Lesson_ChangeTitle.php', {'Date': this.Date, 'Index': this.Index, 'Title': this.Title, 'Change': sChange});



        Information_Update(this.Date);

        if (this.Element)
        {
            if (this.Canceled)
                this.Element.classList.add('Canceled');
            else
                this.Element.classList.remove('Canceled');
    
            this.Element.children[1].children[0].innerHTML = this.Change ?? '';
        };

        this.FindInWeek_Note();
    }

    get Canceled()
    {
        return !this.Added && this.oInWeek_Changes && this.oInWeek_Changes.Change === '';
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
                    'Title': this.TimetableTitle,
                    'Date': this.Date,
                    'Note': sNote
                };

                _oWeek.LessonNotes.push(this.oInWeek_Note);                
            };
        }
        else
        {
            if (this.oInWeek_Note)
                _oWeek.LessonNotes.removeWhere({ 'Date': this.Date, 'Title': this.TimetableTitle }, true);

            this.oInWeek_Note = null;
        };

        SendRequest('/PHP/Handlers/Lesson_Note.php', {'Date': this.Date, 'Title': this.TimetableTitle, 'Note': this.Note});

        Timetable_SetPoint_Lesson(this.Date, this.TimetableTitle, this.oInWeek_Note);
    }




    get Fields()
    {
        return this.oInTimetable ? this.oInTimetable.Fields : {};
    }



    get TimetableTitle()
    {
        return this.Added || (this.Change ?? this.Title);
    }

    get DayElement()
    {
        return Timetable_GetDayElement(this.Date);
    }

    get Element()
    {
        return Timetable_GetLessonElement(this.Date, this.Index);
    }



    get Alarms()
    {
        return _Alarms.Get(this.Index, this.Date);
    }
}