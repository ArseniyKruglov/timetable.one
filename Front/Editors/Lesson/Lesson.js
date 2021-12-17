class Lesson_UI
{
    constructor(iDate, iIndex, bAnimation)
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

            this.oInRecords_Change = _Records.Changes.selectWhere({ 'Date': this.Date, 'Index': this.Index }, true) || null;



            if (this.oInTimetable || this.oInRecords_Change)
            {
                this.oInRecords_Note = _Records.Notes.selectWhere({ 'Date': this.Date, 'Title': this.Title }, true) || null;

                this.Draw();

                this.Overlay.Link = `/Lesson?Date=${this.Date}&Lesson=${this.Index}`;
            }
            else
            {
                alert(['Not found', 'Не найдено'][_iLanguage]);
            };
        };
        this.Overlay.Callback_Close = () => delete window._Lesson_UI;
        this.Overlay.Animation = bAnimation;
        this.Overlay.Open();
    }



    Draw()
    {
        this.Overlay.Container.className = 'Island Overlay_Rectangular DetailsContainer';
        this.Overlay.Body.className = 'Lesson Details';

        this.GetInfoIHTML = () =>
        {
            const aAlarms = _Alarms.Get(this.Index, this.Date);

            const aFilelds =
            [
                {
                    'Icon': 'Place',
                    'Default': (this.oInTimetable ? this.oInTimetable.Fields.Place : null),
                    'Change': (this.oInRecords_Change ? this.oInRecords_Change.Place : null)
                },
                {
                    'Icon': 'Educator',
                    'Default': (this.oInTimetable ? this.oInTimetable.Fields.Educator : null),
                    'Change': (this.oInRecords_Change ? this.oInRecords_Change.Educator : null)
                }
            ];

            if (this.oInTimetable && this.oInTimetable.Fields.UserFields)
                for (let loop_aField of this.oInTimetable.Fields.UserFields)
                    aFilelds.push(
                    {
                        'FieldID': loop_aField[0],
                        'Icon': 'Circle',
                        'Default': loop_aField[1],
                        'Change': null
                    });

            if (this.oInRecords_Change && 'UserFields' in this.oInRecords_Change)
                for (let loop_aField of this.oInRecords_Change.UserFields)
                {
                    const oField = aFilelds.selectWhere({ 'FieldID': loop_aField[0] }, true);

                    if (oField)
                        oField.Change = loop_aField[1];
                    else
                        aFilelds.push(
                        {
                            'FieldID': loop_aField[0],
                            'Icon': 'Circle',
                            'Default': null,
                            'Change': loop_aField[1]
                        });
                };


            let HTML = `<div class='Calendar'>
                            <custom-icon icon='Calendar'></custom-icon>
                            <span>${Date_Format(IntToDate(this.Date))}</span>
                        </div>

                    ${
                        aAlarms ? 
                        `<div class='Alarms'>
                            <custom-icon icon='Alarm'></custom-icon>
                            <span>${Time_Format(aAlarms[0])} – ${Time_Format(aAlarms[1])}</span>
                        </div>`
                        : ''
                    }`;

            for (let loop_oField of aFilelds)
                if (loop_oField.Change || loop_oField.Default)
                    HTML += `<div class='${loop_oField.Change && !this.IsSudden ? (loop_oField.Default ? 'Change' : 'Sudden') : ''}'>
                                <custom-icon icon='${loop_oField.Icon}'></custom-icon>
                                <span>
                                    ${loop_oField.Change || loop_oField.Default}
                                </span>
                             </div>`;

            return HTML;
        }

        let HTML = `<div class='Header'>
                        <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                        <span><custom-round-button icon='More'></custom-round-button></span>
                    </div>

                    <custom-textarea class='Title ${this.IsSudden ? 'Sudden' : (this.IsChanged ? 'Change' : '')}' placeholder='${this.oInTimetable ? this.oInTimetable.Title : ''}' ${(_iAccessLevel < 2) ? 'readonly' : ''} maxlength=${_iMaxTitleLength}>${this.IsCanceled ? '' : this.Title}</custom-textarea>

                    <div class='Info'>
                        ${this.GetInfoIHTML()}
                    </div>

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
                        aActions.push(['RemoveForever', ['Remove lesson', 'Удалить занятие'][_iLanguage], () =>
                        {
                            Lesson_SetChange(this.Date, this.Index, { 'Title': null, 'Place': null, 'Educator': null, 'UserFields': new Map() }, true, true, true, true, this.oInRecords_Change, this.OriginalTitle);
                            this.Overlay.Close();
                        }]);
                    }
                    else if (this.IsChanged)
                    {
                        if (this.IsCanceled)
                            aActions.push(['Restore', ['Undo cancellation', 'Отменить отмену'][_iLanguage], () =>
                            {
                                Lesson_SetChange(this.Date, this.Index, { 'Title': this.OriginalTitle }, true, true, true, true, this.oInRecords_Change, this.OriginalTitle);
                            }]);
                        else
                            aActions.push(['Restore', ['Remove replacement', 'Убрать замену'][_iLanguage], () =>
                            {
                                Lesson_SetChange(this.Date, this.Index, { 'Title': this.OriginalTitle }, true, true, true, true, this.oInRecords_Change, this.OriginalTitle);
                            }]);
                    }
                    else
                    {
                        aActions.push(['Clear', ['Cancel lesson', 'Отменить занятие'][_iLanguage], () =>
                        {
                            Lesson_SetChange(this.Date, this.Index, { 'Title': '' }, true, true, true, true, this.oInRecords_Change, this.OriginalTitle);
                        }]);
                    };
                };

                DropDown(Event.target, aActions);
            });

            this.Overlay.GetUIElement('.Title').addEventListener('input', Event =>
            {
                Lesson_SetChange(this.Date, this.Index, { 'Title': Event.target.value.trim() }, true, true, true, false, this.oInRecords_Change, this.OriginalTitle);
            });

            this.Overlay.GetUIElement('.Note').addEventListener('input', Event =>
            {
                Lesson_SetNote(this.Date, this.Title, Event.target.value.trim(), true, true, true, false, false, this.oInRecords_Note);
           });
        }
    }



    get Title()
    {
        return (this.oInRecords_Change ? this.oInRecords_Change.Title : false) || (this.oInTimetable ? this.oInTimetable.Title : null) || null;
    }

    get Note()
    {
        return this.oInRecords_Note ? this.oInRecords_Note.Note : '';
    }

    get OriginalTitle()
    {
        return this.oInTimetable ? this.oInTimetable.Title : null;
    }

    get IsChanged()
    {
        return Boolean(this.oInRecords_Change ? ('Title' in this.oInRecords_Change) : false);
    }

    get IsCanceled()
    {
        return Boolean(this.oInRecords_Change && this.oInRecords_Change.Title === '');
    }

    get IsSudden()
    {
        return !Boolean(this.oInTimetable);
    }
}