class DayDetails
{
    constructor(iDate)
    {
        Overlay_Open
        (
            'DayDetails',
            () =>
            {
                this.Date = iDate;

                this.oInWeek_Note = _oWeek.DayNotes.selectWhere({ 'Date': this.Date }, true) || null;



                _aOverlays['DayDetails'][1].children[1].className = 'Overlay_Rectangular';
                _aOverlays['DayDetails'][1].children[1].children[0].className = 'Details';

                const aAlarms = Timetable_GetPeriod(this.Date);
                
                let HTML = `<div class='Header'>
                                <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                                ${ (_bBeta && _iAccessLevel === 2) ? `<span><custom-round-button icon='More'></custom-round-button></span>`: '' }
                            </div>
            
                            <div class='Date'>${Date_Format(Time_From1970(iDate), true)}</div>
            
                            <div class='Info EmptyHidden'>${
                                _mAlarms.size ? 
                                `<div class='Alarms'>
                                    <svg ${_Icons['Alarm']}></svg>
                                    <span>${Timetable_GetPeriod(this.Date)}</span>
                                </div>`
                                : ''
                            }</div>
            
                            <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${this.Note}' class='Note' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''}></custom-textarea>`;
            
                _aOverlays['DayDetails'][1].children[1].children[0].innerHTML = HTML;



                this.GetUIElement('.Header').children[0].addEventListener('click', () => { this.Close(); });
                if (_bBeta && _iAccessLevel === 2)
                    this.GetUIElement('.Header').children[1].addEventListener('click', (Event) => { DropDown(Event.target, [['Queue', ['Add lesson', 'Добавить занятие'][_iLanguage], () => { new LessonAdder(this.Date); }]]); });
                this.GetUIElement('.Note').addEventListener('input', (Event) => { this.Note = Event.target.value; });


            
                history.pushState('', '', `${_sURL}?Date=${this.Date}`);
            },
            () => {},
            () => { this.Close(); }
        );
    }



    GetUIElement(sSelector)
    {
        return _aOverlays['DayDetails'][1].children[1].children[0].querySelector(sSelector);
    }

    Close()
    {
        Overlay_Remove('DayDetails');
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

        SendRequest('/Modules/Details/Day/Note.php', {'Date': this.Date, 'Note': this.Note});

        Timetable_SetPoint_Day(this.Date, this.oInWeek_Note);
    }
}