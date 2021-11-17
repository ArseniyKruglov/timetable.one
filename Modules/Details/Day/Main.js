class Day_UI
{
    constructor(iDate)
    {
        this.Date = iDate;
        this.oInWeek_Note = _oWeek.DayNotes.selectWhere({ 'Date': this.Date }, true) || null;



        this.Overlay = new Overlay();
        this.Overlay.Callback_Open = () =>
        {
            this.Draw();

            this.UpdateAlarms_Listener = () => { this.UpdateAlarms(); };
            addEventListener('TimetableChange', this.UpdateAlarms_Listener);

            this.Overlay.Link = `?Date=${this.Date}`;
        };
        this.Overlay.Open();
    }



    Draw()
    {
        this.Overlay.Container.className = 'Overlay_Rectangular DetailsContainer';
        this.Overlay.Body.className = 'Details';
        
        let HTML = `<div class='Header'>
                        <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                        ${ (_iAccessLevel === 2) ? `<span><custom-round-button icon='More'></custom-round-button></span>`: '' }
                    </div>
    
                    <div class='Date'>${Date_Format(Time_From1970(this.Date), true)}</div>
    
                    <div class='Info EmptyHidden'>${
                        (_mAlarms.size !== 0) ? 
                       `<div class='Alarms'>
                            <custom-icon icon='Alarm'></custom-icon>
                            <span>${Timetable_GetPeriod(this.Date)}</span>
                        </div>`
                        : ''
                    }</div>
    
                    <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${this.Note}' class='Note' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''}></custom-textarea>`;
    
        this.Overlay.Body.innerHTML = HTML;



        this.Overlay.GetUIElement('.Header').children[0].addEventListener('click', () => { this.Overlay.Close(); });
        if (_iAccessLevel === 2)
            this.Overlay.GetUIElement('.Header').children[1].addEventListener('click', (Event) => { DropDown(Event.target, [['Queue', ['Add lesson', 'Добавить занятие'][_iLanguage], () => { new SuddenLesson_ConstructorUI(this.Date); }]]); });
        this.Overlay.GetUIElement('.Note').addEventListener('input', (Event) => { this.Note = Event.target.value; });
    }

    UpdateAlarms()
    {
        this.Overlay.GetUIElement('.Info').innerHTML =  (_mAlarms.size !== 0) ? 
                                                `<div class='Alarms'>
                                                    <custom-icon icon='Alarm'></custom-icon>
                                                    <span>${Timetable_GetPeriod(this.Date)}</span>
                                                </div>`
                                                : '';
    }

    Close()
    {
        removeEventListener('TimetableChange', this.UpdateAlarms_Listener);
        Overlay_Remove('Day_UI');
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
                    'Date': this.Date,
                    'Note': sNote
                };

                _oWeek.DayNotes.push(this.oInWeek_Note);                
            };
        }
        else
        {
            if (this.oInWeek_Note)
                _oWeek.DayNotes.removeWhere({ 'Date': this.Date }, true);

            this.oInWeek_Note = null;
        };

        SendRequest('/PHP/Details/Day/Note.php', {'Date': this.Date, 'Note': this.Note});

        Timetable_SetPoint_Day(this.Date, this.oInWeek_Note);
    }
}