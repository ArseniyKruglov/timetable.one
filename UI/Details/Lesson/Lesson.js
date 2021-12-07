class Lesson_UI
{
    constructor(iDate, iIndex, bAnimation = true)
    {
        this.Date = iDate;
        this.Index = iIndex;



        this.Overlay = new Overlay();
        this.Overlay.Callback_Open = () =>
        {
            const mDayTimetable = _Timetable.DateToTimetable(this.Date);
            const oInTimetable = mDayTimetable.get(this.Index)
            if (oInTimetable)
                this.oInTimetable = oInTimetable;

            this.FindInWeek_Change();


            if (this.oInTimetable || this.oInWeek_Changes)
            {
                this.FindInWeek_Note();

                this.Draw();

                this.Overlay.Link = `/Lesson?Date=${this.Date}&Lesson=${this.Index}`;
            }
            else
            {
                alert('Не найдено');
            };
        };
        this.Overlay.Animation = bAnimation;
        this.Overlay.Open();
    }



    Draw()
    {
        this.Overlay.Container.className = 'Island Overlay_Rectangular DetailsContainer';
        this.Overlay.Body.className = 'Lesson Details';

        const aAlarms = _Alarms.Get(this.Index, this.Date);



        let HTML = `<div class='Header'>
                        <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                        <span><custom-round-button icon='More'></custom-round-button></span>
                    </div>

                    <custom-textarea class='Title' placeholder='${this.oInTimetable ? this.oInTimetable.Title : ''}' ${(_iAccessLevel < 2) ? 'readonly' : ''} maxlength=${_iMaxTitleLength}>${this.IsCanceled ? '' : this.Title}</custom-textarea>

                    <div class='Info'>
                        <div class='Calendar'>
                            <custom-icon icon='Calendar'></custom-icon>
                            <span>${Date_Format(Time_From1970(this.Date))}</span>
                        </div>

                    ${
                        aAlarms ? 
                        `<div class='Alarms'>
                            <custom-icon icon='Alarm'></custom-icon>
                            <span>${Time_Format(aAlarms[0])} – ${Time_Format(aAlarms[1])}</span>
                        </div>`
                        : ''
                    }

                    ${
                        (this.oInTimetable ? this.oInTimetable.Fields.Place : false) || (this.oInWeek_Changes ? this.oInWeek_Changes.Place : false) ? 
                        `<div>
                            <custom-icon icon='Location'></custom-icon>
                            <span>
                                <span>${this.oInWeek_Changes ? (this.oInWeek_Changes.Place || '') : ''}</span>
                                <span>${this.oInTimetable ? (this.oInTimetable.Fields.Place || '') : ''}</span>
                            </span>
                        </div>`
                        : ''
                    }
    
                    ${
                        (this.oInTimetable ? this.oInTimetable.Fields.Educator : false) || (this.oInWeek_Changes ? this.oInWeek_Changes.Educator : false) ? 
                        `<div>
                            <custom-icon icon='Educator'></custom-icon>
                            <span>
                                <span>${this.oInWeek_Changes ? (this.oInWeek_Changes.Educator || '') : ''}</span>
                                <span>${this.oInTimetable ? (this.oInTimetable.Fields.Educator || '') : ''}</span>
                            </span>
                        </div>`
                        : ''
                    }`;

        if (this.oInTimetable && this.oInTimetable.UserFields)
            for (let loop_sUserField of this.oInTimetable.UserFields)
                HTML += `<div>
                            <custom-icon icon='Circle'></custom-icon>
                            <span>${loop_sUserField[1]}</span>
                        </div>`;

        HTML +=     `</div>

                    <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' class='Note' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''} maxlength=${_iMaxNoteLength}>${this.Note}</custom-textarea>`;

        this.Overlay.Body.innerHTML = HTML;



        {
            this.Overlay.GetUIElement('.Header').children[0].addEventListener('click', () => this.Overlay.Close() );
    
            this.Overlay.GetUIElement('.Header').children[1].addEventListener('click', Event =>
            {
                let aActions = [];
    
                aActions.push(['Timetable', ['Show in timetable', 'Показать в расписании'][_iLanguage], () =>
                {
                    _Timetable.FocusLesson(this.Date, this.Index);
                    this.Overlay.Close();
                }]);
    
                if (_iAccessLevel === 2)
                {
                    if (this.IsSudden)
                    {
                        aActions.push(['RemoveForever', ['Remove lesson', 'Удалить занятие'][_iLanguage], () => this.Title = '' ]);
                    }
                    else if (this.IsChanged)
                    {
                        if (this.IsCanceled)
                            aActions.push(['Restore', ['Undo cancellation', 'Отменить отмену'][_iLanguage], () =>
                            {
                                this.Overlay.GetUIElement('.Title').value = this.OriginalTitle;
                                this.Title = this.OriginalTitle;
                            }]);
                        else
                            aActions.push(['Restore', ['Remove replacement', 'Убрать замену'][_iLanguage], () =>
                            {
                                this.Overlay.GetUIElement('.Title').value = this.OriginalTitle;
                                this.Title = this.OriginalTitle;
                            }]);
                    }
                    else
                    {
                        aActions.push(['Clear', ['Cancel lesson', 'Отменить занятие'][_iLanguage], () =>
                        {
                            this.Overlay.GetUIElement('.Title').value = '';
                            this.Title = '';
                        }]);
                    };
                };
    
                DropDown(Event.target, aActions);
            });
    
            this.Overlay.GetUIElement('.Title').addEventListener('input', Event =>
            {
                this.Title = Event.target.value;
            });
    
            this.Overlay.GetUIElement('.Note').addEventListener('input', Event =>
            {
                this.Note = Event.target.value;
           });
        }
    }



    FindInWeek_Note()
    {
        if (this.oInWeek_Note === undefined)
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({'Date': this.Date, 'Title': this.Title }, true) || null;
        }
        else
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({'Date': this.Date, 'Title': this.Title }, true) || null;
            
            _Timetable.SetPoint_Lesson(this.Date, this.Title, this.oInWeek_Note);
            this.Overlay.GetUIElement('.Note').value = this.Note;
        };
    }

    FindInWeek_Change()
    {
        this.oInWeek_Changes = _oWeek.Changes.selectWhere({'Date': this.Date, 'Index': this.Index }, true) || null;
    }



    set Title(sChange)
    {
        sChange = sChange.trim();

        if (this.IsSudden ? (!sChange) : (sChange === this.OriginalTitle))
        {
            if (this.IsSudden && !confirm(`${['Remove lesson', 'Удалить занятие'][_iLanguage]} "${this.Title}" (${Date_Format(Time_From1970(this.Date))})?`))
            {
                this.Overlay.GetUIElement('.Title').value = this.Title;
                return;
            };



            if (this.oInWeek_Changes)
                _oWeek.Changes.removeWhere({'Date': this.Date, 'Index': this.Index }, true);

            this.oInWeek_Changes = null;

            SendRequest('/PHP/Handlers/Lesson_Remove.php',
            {
                'Date': this.Date,
                'Index': this.Index
            });



            if (this.IsSudden)
                this.Overlay.Close();
        }
        else
        {
            if (this.oInWeek_Changes)
            {
                this.oInWeek_Changes.Title = sChange;
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

            SendRequest('/PHP/Handlers/Lesson_Change.php',
            {
                'Date': this.Date,
                'Index': this.Index,
                'Change': sChange
            });
        };



        _Information.Update(this.Date);

        _Timetable.SetChange(this.Date, this.Index, sChange);

        _Timetable.UpdateAlarmsPeriod(this.Date);



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
                _oWeek.LessonNotes.removeWhere({'Date': this.Date, 'Title': this.Title }, true);

            this.oInWeek_Note = null;
        };

        SendRequest('/PHP/Handlers/Lesson_Note.php',
        {
            'Date': this.Date,
            'Title': this.Title,
            'Note': sNote
        });

        _Timetable.SetPoint_Lesson(this.Date, this.Title, Boolean(sNote));
    }

    

    get Title()
    {
        return (this.oInWeek_Changes ? this.oInWeek_Changes.Title : false) || (this.oInTimetable ? this.oInTimetable.Title : null) || null;
    }

    get OriginalTitle()
    {
        return this.oInTimetable ? this.oInTimetable.Title : null;
    }

    get IsChanged()
    {
        return Boolean(this.oInWeek_Changes ? (this.oInWeek_Changes.Title !== null) : false);
    }

    get IsCanceled()
    {
        return Boolean(this.oInWeek_Changes && this.oInWeek_Changes.Title === '');
    }

    get IsSudden()
    {
        return !Boolean(this.oInTimetable);
    }
}