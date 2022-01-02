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
                alert(['Lesson not found', 'Занятие не найдено'][_iLanguage]);
                this.Overlay.Close();
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
                    aFilelds.push
                    ({
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
                        aFilelds.push
                        ({
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
                if (loop_oField.Change !== '' && (loop_oField.Change || loop_oField.Default))
                    HTML += `<div class='${loop_oField.Change && !this.IsSudden ? (loop_oField.Default ? 'Change' : 'Sudden') : ''}'>
                                <custom-icon icon='${loop_oField.Icon}'></custom-icon>
                                <span>
                                    ${loop_oField.Change || loop_oField.Default}
                                </span>
                             </div>`;

            return HTML;
        }

        this.GetAttachmentsIHTML = () =>
        {
            if (this.oInRecords_Note)
                if ('Attachments' in this.oInRecords_Note)
                {
                    let HTML = '';

                    for (let loop_oAttachment of this.oInRecords_Note.Attachments)
                        HTML += `<div>
                                    <a href='https://527010.selcdn.ru/timetable.one Dev/${loop_oAttachment.Folder}/${loop_oAttachment.Filename}' target='_blank'>
                                        <span>${loop_oAttachment.Filename}</span>
                                    </a>
                                    ${_iAccessLevel === 2 ? `<custom-round-button icon='RemoveForever' onclick='RemoveAttachments(${this.Date}, "${this.Title}", "${loop_oAttachment.Folder}", true, true, true, _Lesson_UI.oInRecords)'></custom-round-button>` : ''}
                                 </div>`;

                    return HTML;
                };

            return '';
        }

        let HTML = `<div class='Header'>
                        <span><custom-round-button icon='Arrow Back' onclick='_Lesson_UI.Overlay.Close()'></custom-round-button></span>
                        <span><custom-round-button icon='More'></custom-round-button></span>
                    </div>

                    <custom-textarea class='Title ${this.IsSudden ? 'Sudden' : (this.IsChanged ? 'Change' : '')}' placeholder='${this.oInTimetable ? this.oInTimetable.Title : ''}' ${(_iAccessLevel < 2) ? 'readonly' : ''} maxlength=${_iMaxTitleLength} oninput='Lesson_SetChange(${this.Date}, ${this.Index}, { "Title": this.value.trim() }, true, true, true, false, _Lesson_UI.oInRecords_Change, _Lesson_UI.OriginalTitle)'>${this.IsCanceled ? '' : this.Title}</custom-textarea>

                    <div class='Info'>
                        ${this.GetInfoIHTML()}
                    </div>

                    <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' class='Note' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''} maxlength=${_iMaxNoteLength} oninput='SetNote(${this.Date}, "${this.Title}", this.value.trim(), true, true, true, false, false, _Lesson_UI.oInRecords_Note);'>${this.Note}</custom-textarea>

                    <div class='Attachments EmptyHidden'>${this.GetAttachmentsIHTML()}</div>`;

        this.Overlay.Body.innerHTML = HTML;



        this.Overlay.GetUIElement('.Header').children[1].addEventListener('click', Event =>
        {
            let aActions = [];

            aActions.push
            ([
                'Timetable',
                ['Show in timetable', 'Показать в расписании'][_iLanguage],
                () =>
                {
                    this.Overlay.Close();
                    _Timetable.FocusLesson(this.Date, this.Index);
                }
            ]);

            if (_iAccessLevel === 2)
            {
                aActions.push
                ([
                    'Attach',
                    ['Attach files', 'Приложить файлы'][_iLanguage],
                    () =>
                    {
                        const eInput = document.createElement('input');
                        eInput.setAttribute('type', 'file');
                        eInput.setAttribute('multiple', '');
                        eInput.click();
                        eInput.addEventListener('change', (Event) =>
                        {
                            UploadAttachments(this.Date, this.Title, Event.target.files, this.oInRecords_Note);
                        });
                    }
                ]);

                if (this.IsSudden)
                {
                    aActions.push
                    ([
                        'RemoveForever',
                        ['Remove lesson', 'Удалить занятие'][_iLanguage],
                        () =>
                        {
                            Lesson_SetChange(this.Date, this.Index, { 'Title': null, 'Place': null, 'Educator': null, 'UserFields': null }, true, true, true, true, this.oInRecords_Change, this.OriginalTitle);
                            this.Overlay.Close();
                        }
                    ]);
                }
                else if (this.IsChanged)
                {
                    if (this.IsCanceled)
                        aActions.push
                        ([
                            'Restore',
                            ['Undo cancellation', 'Отменить отмену'][_iLanguage],
                                () =>
                            {
                                Lesson_SetChange(this.Date, this.Index, { 'Title': this.OriginalTitle }, true, true, true, true, this.oInRecords_Change, this.OriginalTitle);
                            }
                        ]);
                    else
                        aActions.push
                        ([
                            'Restore',
                            ['Remove replacement', 'Убрать замену'][_iLanguage],
                            () =>
                            {
                                Lesson_SetChange(this.Date, this.Index, { 'Title': this.OriginalTitle }, true, true, true, true, this.oInRecords_Change, this.OriginalTitle);
                            }
                        ]);
                }
                else
                {
                    aActions.push
                    ([
                        'Clear',
                        ['Cancel lesson', 'Отменить занятие'][_iLanguage],
                        () =>
                        {
                            Lesson_SetChange(this.Date, this.Index, { 'Title': '' }, true, true, true, true, this.oInRecords_Change, this.OriginalTitle);
                        }
                    ]);
                };
            };

            DropDown(Event.target, aActions);
        });
    }



    get Title()
    {
        return (this.oInRecords_Change ? this.oInRecords_Change.Title : false) || (this.oInTimetable ? this.oInTimetable.Title : null) || null;
    }

    get Note()
    {
        if (this.oInRecords_Note)
            if ('Note' in this.oInRecords_Note)
                return this.oInRecords_Note.Note;

        return '';
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