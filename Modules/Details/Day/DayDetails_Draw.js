function DayDetails_Draw(iDate)
{
    try
    {
        let HTML = '';

        let sNote;
        for (let loop_oDayNote of _oWeek['DayNotes'])
            if (loop_oDayNote['Date'] === iDate)
            {
                sNote = loop_oDayNote['Note'];
                break;
            };
    
        HTML +=    `<div id='DayDetails_Date'>${Time_FormatDate(Time_From1970(iDate))}</div>
    
                    <div id='DayDetails_Info'>
                        <div>
                            <svg ${_Icons['Alarm']}></svg>
                            <span>${Timetable_GetPeriod(iDate)}</span>
                        </div>
                    </div>
    
                    <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${sNote || ''}' oninput='DayDetails_SetNote(this.value)' id='DayDetails_Text' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''}></custom-textarea>`;
    
        _aOverlays['DayDetails'][1].children[1].children[0].innerHTML = HTML;
        _aOverlays['DayDetails'][1].children[1].className = 'Overlay_Rectangular';

        window._DayDetails_iDate = iDate;
    
        history.pushState('', '', `${location.pathname}?Date=${iDate}`);
    }
    catch
    {
        DayDetails_Close();
    };
}