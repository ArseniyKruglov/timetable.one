class Day_UI
{
    constructor(iDate, bAnimation)
    {
        this.Date = iDate;
        this.oInRecords_Note = _Records.Notes.selectWhere({ Date: this.Date, Title: undefined }, true) || null;



        this.Overlay = new Overlay();
        this.Overlay.Callback_Open = () =>
        {
            this.Draw();

            this.Overlay.Link = `/Day?Date=${this.Date}`;
        };
        this.Overlay.Callback_Close = () => delete window._Day_UI;
        this.Overlay.Animation = bAnimation;
        this.Overlay.Open();
    }



    Draw()
    {
        this.Overlay.Container.className = 'Island Overlay_Rectangular DetailsContainer';
        this.Overlay.Body.className = 'Details';

        let HTML = `<div class='Header'>
                        <span><custom-round-button icon='Arrow Back' onclick='_Day_UI.Overlay.Close()'></custom-round-button></span>
                        ${(_iAccessLevel === 2) ? `<span><custom-round-button icon='More'></custom-round-button></span>`: '' }
                    </div>

                    <div class='Date'>${Date_Format(IntToDate(this.Date), true)}</div>

                ${
                    !_Alarms.Empty ?
                    `<div class='Info'>
                        <div class='Alarms'>
                            <custom-icon icon='Alarm'></custom-icon>
                            <span>${_Timetable.DateToAlarmsPeriod(this.Date)}</span>
                        </div>
                    </div>`
                    : ''
                }

                    <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' class='Note' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''} maxlength=${_iMaxNoteLength} oninput='SetNote(${this.Date}, undefined, this.value.trim(), true, true, true, false, _Day_UI.oInRecords_Note)'>${this.Note}</custom-textarea>`;

        this.Overlay.Body.innerHTML = HTML;



        if (_iAccessLevel === 2)
            this.Overlay.GetUIElement('.Header').children[1].addEventListener('click', (Event) =>
            {
                DropDown
                (
                    Event.target,
                    [
                        [
                            'Queue',
                            ['Add lesson', 'Добавить занятие'][_iLanguage],
                            () =>
                            {
                                _Router.Forward(`/Day?Date=${this.Date}/Add?Date=${this.Date}`);
                            }
                        ],
                        // [
                        //     'Attach',
                        //     ['Attach files', 'Приложить файлы'][_iLanguage],
                        //     () =>
                        //     {
                        //         const eInput = document.createElement('input');
                        //         eInput.setAttribute('type', 'file');
                        //         eInput.setAttribute('multiple', '');
                        //         eInput.click();
                        //         eInput.addEventListener('change', (Event) =>
                        //         {
                        //             UploadFiles(this.Date, this.Title, Event.target.files, this.oInRecords_Note);
                        //         });
                        //     }
                        // ]
                    ]
                );
            });
    }



    get Note()
    {
        if (this.oInRecords_Note)
            if ('Note' in this.oInRecords_Note)
                return this.oInRecords_Note.Note;

        return '';
    }
}