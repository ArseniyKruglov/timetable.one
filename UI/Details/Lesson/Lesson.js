class Lesson_UI
{
    constructor(iDate, iIndex, bAnimation = true)
    {
        this.Date = iDate;
        this.Index = iIndex;



        this.Overlay = new Overlay();
        this.Overlay.Callback_Open = () =>
        {
            this.Init();

            if (this.oInTimetable || this.oInWeek_Added)
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

            if (!mDayTimetable.get(this.Index))
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
        this.Overlay.Container.className = 'Island Overlay_Rectangular DetailsContainer';
        this.Overlay.Body.className = 'Lesson Details';

        let HTML = `<div class='Header'>
                        <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                        <span><custom-round-button icon='More'></custom-round-button></span>
                    </div>
                    
                    <custom-textarea class='Title' placeholder='${this.oInTimetable ? this.oInTimetable.Title : ''}' ${(_iAccessLevel < 2) ? 'readonly' : ''} maxlength=${_iMaxTitleLength}>${this.Title}</custom-textarea>
    
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
                        this.Fields.Place || (this.oInWeek_Changes ? this.oInWeek_Changes.Place : false) ? 
                        `<div>
                            <custom-icon icon='Location'></custom-icon>
                            <span>
                                <span>${this.oInWeek_Changes ? (this.oInWeek_Changes.Place || '') : ''}</span>
                                <span>${this.Fields.Place}</span>
                            </span>
                        </div>`
                        : ''
                    }
    
                    ${
                        this.Fields.Educator || (this.oInWeek_Changes ? this.oInWeek_Changes.Educator : false) ? 
                        `<div>
                            <custom-icon icon='Educator'></custom-icon>
                            <span>
                                <span>${this.oInWeek_Changes ? (this.oInWeek_Changes.Educator || '') : ''}</span>
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
                    
                    <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' class='Note' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''} maxlength=${_iMaxNoteLength}>${this.Note}</custom-textarea>`;
    
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
                if (!this.Added)
                {  
                    if (!this.Canceled)
                        aActions.push(['Clear', ['Cancel lesson', 'Отменить занятие'][_iLanguage], () =>
                        {
                            this.Overlay.GetUIElement('.Title').value = '';
                            this.ChangedTitle = '';
                        }]);
                }
                else
                {
                    aActions.push(['RemoveForever', ['Remove lesson', 'Удалить занятие'][_iLanguage], () =>
                    {
                        this.Added = '';
                    }]);
                };
        
                if (this.ChangedTitle)
                {
                    aActions.push(['Restore', ['Remove replacement', 'Убрать замену'][_iLanguage], () =>
                    {
                        this.Overlay.GetUIElement('.Title').value = this.oInTimetable.Title;
                        this.ChangedTitle = this.oInTimetable.Title;
                    }]);
                }
                else if (this.Canceled)
                {
                    aActions.push(['Restore', ['Undo cancellation', 'Отменить отмену'][_iLanguage], () =>
                    {
                        this.Overlay.GetUIElement('.Title').value = this.oInTimetable.Title;
                        this.ChangedTitle = this.oInTimetable.Title;
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
                this.ChangedTitle = Event.target.value;
        });

        this.Overlay.GetUIElement('.Note').addEventListener('input', (Event) =>
        {
            this.Note = Event.target.value;
        });
    }



    FindInWeek_Note()
    {
        if (this.oInWeek_Note === undefined)
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({ 'Date': this.Date, 'Title': this.Title }, true) || null;
        }
        else
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({ 'Date': this.Date, 'Title': this.Title }, true) || null;
            
            Timetable_SetPoint_Lesson(this.Date, this.Title, this.oInWeek_Note);
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
        return Boolean(this.oInWeek_Added);
    }

    set Added(sTitle)
    {
        sTitle = sTitle.trim();

        if (sTitle)
        {
            this.oInWeek_Added.Title = sTitle;
            
            SendRequest('/PHP/Handlers/Lesson_Sudden.php', { 'Date' : this.Date, 'Index' : this.Index, 'Title' : sTitle });

            if (this.Element)
                this.Element.children[1].children[1].innerHTML = sTitle;

            Timetable_UpdatePeriod(this.Date);
            _Information.Update(this.Date);

            this.FindInWeek_Note();
        }
        else
        {
            if (confirm(`${['Remove lesson', 'Удалить занятие'][_iLanguage]} "${this.Title}" (${Date_Format(Time_From1970(this.Date))})?`))
            {
                SendRequest('/PHP/Handlers/Lesson_Sudden.php', {'Date' : this.Date, 'Index' : this.Index, 'Title' : ''});
    
                _oWeek.SuddenLessons.removeWhere({ 'Date': this.Date, 'Index': this.Index }, true);
    
                if (this.Element)
                {
                    if (this.Element.parentElement.children.length === 1)
                        this.DayElement.remove();
                    else
                        this.Element.remove();
                };

                Timetable_UpdatePeriod(this.Date);
                _Information.Update(this.Date);
    
                this.Overlay.Close();
            }
            else
            {
                this.Overlay.GetUIElement('.Title').value = this.Title;
            };
        };
    }



    get ChangedTitle()
    {
        return Boolean(this.oInWeek_Changes && this.oInWeek_Changes.Title !== null);
    }

    get Canceled()
    {
        return Boolean(this.oInWeek_Changes && this.oInWeek_Changes.ChangedTitle === '');
    }

    set ChangedTitle(sChange)
    {
        sChange = sChange.trim();
        
        if (sChange === this.oInTimetable.Title)
        {    
            if (this.oInWeek_Changes)
                _oWeek.Changes.removeWhere({ 'Date': this.Date, 'Index': this.Index }, true);

            this.oInWeek_Changes = null;
        }
        else
        {
            if (this.oInWeek_Changes)
            {
                this.oInWeek_Changes.ChangedTitle = sChange;
            }
            else
            {
                this.oInWeek_Changes = 
                {
                    'Date': this.Date,
                    'Index': this.Index,
                    'ChangedTitle': sChange,
                    'Place': null,
                    'Educator': null
                };

                _oWeek.Changes.push(this.oInWeek_Changes);
            };
        };

        SendRequest('/PHP/Handlers/Lesson_ChangeTitle.php', { 'Date': this.Date, 'Index': this.Index, 'Title': this.oInTimetable.Title, 'Change': sChange });



        _Information.Update(this.Date);

        if (this.Element)
        {
            if (this.Canceled)
                this.Element.classList.add('Canceled');
            else
                this.Element.classList.remove('Canceled');
    
            this.Element.children[1].children[0].innerHTML = this.ChangedTitle ? this.Title : '';
        };

        Timetable_UpdatePeriod(this.Date);



        this.FindInWeek_Note();
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
                    'Title': this.Title,
                    'Date': this.Date,
                    'Note': sNote
                };

                _oWeek.LessonNotes.push(this.oInWeek_Note);
            };
        }
        else
        {
            if (this.oInWeek_Note)
                _oWeek.LessonNotes.removeWhere({ 'Date': this.Date, 'Title': this.Title }, true);

            this.oInWeek_Note = null;
        };

        SendRequest('/PHP/Handlers/Lesson_Note.php', { 'Date': this.Date, 'Title': this.Title, 'Note': sNote });

        Timetable_SetPoint_Lesson(this.Date, this.Title, Boolean(this.oInWeek_Note));
    }



    get Title()
    {
        return (this.oInWeek_Added ? this.oInWeek_Added.Title : false) || ((this.oInWeek_Changes ? this.oInWeek_Changes.Title : false) || this.oInTimetable.Title);
    }

    get Fields()
    {
        return this.oInTimetable ? this.oInTimetable.Fields : {};
    }

    get Alarms()
    {
        return _Alarms.Get(this.Index, this.Date);
    }



    get DayElement()
    {
        return Timetable_GetDayElement(this.Date);
    }

    get Element()
    {
        return Timetable_GetLessonElement(this.Date, this.Index);
    }
}