function LessonDetails_Draw(iDate, iLessonNumber)
{
    try
    {
        let tDate = DaysSince1970ToTime(iDate);
        let mDayTimetable = Timetable_GetDayTimetable(iDate);
    
        let sSubject = mDayTimetable.get(iLessonNumber)[0];
        let sReplacement = null;
        for (let loop_oReplacement of _oWeek['Replacements'])
            if (loop_oReplacement['Date'] === iDate && loop_oReplacement['LessonNumber'] === iLessonNumber)
            {
                sReplacement = loop_oReplacement['Replacement'];
                break;
            };
    
        let aAlarms = _mAlarms.get(iLessonNumber);
        let sLectureHall = mDayTimetable.get(iLessonNumber)[1];
        let sTeacher = mDayTimetable.get(iLessonNumber)[2];
    
        let sHometask = '';
        for (let loop_oHometask of _oWeek['Hometasks'])
            if (loop_oHometask['Subject'] === (sReplacement ? sReplacement : sSubject) && loop_oHometask['Date'] === iDate)
            {
                sHometask = loop_oHometask['Text'];
                break;
            };
    
        let HTML = `<div id='LessonDetails_Header' hidden>
                        <span><custom-round-button icon='Arrow Back' scale=28></custom-round-button></span>
                        <span><custom-round-button icon='Edit' scale=28></custom-round-button></span>
                    </div>
                    
                    <custom-textarea placeholder='${sSubject}' value='${(sReplacement === null) ? sSubject : sReplacement}' oninput='LessonDetails_SetReplacement(this.value)' id='LessonDetails_Subject'></custom-textarea>
                    
                    <div id='LessonDetails_Info'>
                        <div>
                            <svg ${_Icons['Calendar']}></svg>
                            <span>${tDate.toLocaleString(navigator.language, { month: 'long', day: 'numeric' })}</span>
                        </div>
                        
                        ${
                            aAlarms ? 
                           `<div>
                                <svg ${_Icons['Alarm']}></svg>
                                <span>${aAlarms[0].toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} – ${aAlarms[1].toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>`
                            : ''
                        }
    
                        ${
                            sLectureHall ? 
                           `<div>
                                <svg ${_Icons['Location']}></svg>
                                <span>${sLectureHall}</span>
                            </div>`
                            : ''
                        }
    
                        ${
                            sTeacher ? 
                           `<div>
                                <svg ${_Icons['Teacher']}></svg>
                                <span>${sTeacher}</span>
                            </div>`
                            : ''
                        }
                    </div>
                    
                    
                    <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${sHometask}' oninput='LessonDetails_SetText(this.value)' id='LessonDetails_Text'></custom-textarea>`;
    
        _aOverlays['LessonDetails'][1].children[1].children[0].innerHTML = HTML;
        _aOverlays['LessonDetails'][1].children[1].className = 'Overlay_Rectangular';
    
        if (document.body.hasAttribute('FullAccess') === false)
            for (let loop_aTextarea of document.querySelectorAll(`#LessonDetails custom-textarea`))
                loop_aTextarea.children[0].children[0].setAttribute('readonly', '');

        window._LessonDetails_iDate = iDate;
        window._LessonDetails_iLessonNumber = iLessonNumber;
        window._LessonDetails_sSubject = sSubject;
        window._LessonDetails_sReplacement = sReplacement;
    
        history.pushState('', '', `${location.pathname}?Date=${iDate}&LessonNumber=${iLessonNumber}`);
    }
    catch
    {
        LessonDetails_Close();
        history.pushState('', '', location.pathname);
        alert('Сайт окочурился?');
    };
}