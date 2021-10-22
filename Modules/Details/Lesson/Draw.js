function LessonDetails_Draw(iDate, iLessonNumber)
{
    try
    {
        let mDayTimetable = Timetable_GetDayTimetable(iDate),
            bAdded = (mDayTimetable.get(iLessonNumber) === undefined),
            sSubject,
            sReplacement, 
            aAlarms = Alarm_Get(iLessonNumber, iDate),
            sLectureHall,
            sEducator,
            sNote = '',
            aAttachments = [];

        if (bAdded === false)
        {
            sSubject = mDayTimetable.get(iLessonNumber)['Subject'];
            for (let loop_oReplacement of _oWeek['Replacements'])
                if (loop_oReplacement['Date'] === iDate && loop_oReplacement['LessonNumber'] === iLessonNumber)
                {
                    sReplacement = loop_oReplacement['Replacement'];
                    break;
                };
            sLectureHall = mDayTimetable.get(iLessonNumber)['LectureHall'];
            sEducator = mDayTimetable.get(iLessonNumber)['Educator'];
        }
        else
        {
            for (let loop_oAddedLesson of _oWeek['AddedLessons'])
                if (loop_oAddedLesson['Date'] === iDate && loop_oAddedLesson['LessonNumber'] === iLessonNumber)
                {
                    sSubject = loop_oAddedLesson['Subject'];
                    break;
                };
        };
        
        window._LessonDetails_oWeekElement = null;
        for (let loop_oLessonNote of _oWeek['LessonNotes'])
            if (loop_oLessonNote['Subject'] === LessonDetails_DisplayedSubject(sSubject, sReplacement) && loop_oLessonNote['Date'] === iDate)
            {
                sNote = loop_oLessonNote['Text'];
                aAttachments = loop_oLessonNote['Attachments'];
                _LessonDetails_oWeekElement = loop_oLessonNote;
                break;
            };
    
        let HTML = `<div id='LessonDetails_Header' hidden>
                        <span><custom-round-button icon='Arrow Back' scale=28></custom-round-button></span>
                        <span><custom-round-button icon='Edit' scale=28></custom-round-button></span>
                    </div>
                    
                    <custom-textarea placeholder='${sSubject}' value='${(sReplacement !== undefined) ? sReplacement : sSubject}' oninput='LessonDetails_SetReplacement(this.value)' id='LessonDetails_Subject' ${(_iAccessLevel < 2) ? 'readonly' : ''}></custom-textarea>
                    <button id='LessonDetails_Reset' ${(sReplacement === undefined || _iAccessLevel < 2) ? 'hidden' : ''} onclick='LessonDetails_Reset(this)'>Убрать замену</button>

                    <div id='LessonDetails_Info'>
                        <div>
                            <svg ${_Icons['Calendar']}></svg>
                            <span>${Time_FormatDate(Time_From1970(iDate))}</span>
                        </div>
                        
                    ${
                        aAlarms ? 
                        `<div>
                            <svg ${_Icons['Alarm']}></svg>
                            <span>${Time_FormatTime(aAlarms[0])} – ${Time_FormatTime(aAlarms[1])}</span>
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
                        sEducator ? 
                        `<div>
                            <svg ${_Icons['Teacher']}></svg>
                            <span>${sEducator}</span>
                        </div>`
                        : ''
                    }
                    </div>
                    
                    
                    <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${sNote || ''}' oninput='LessonDetails_SetText(this.value)' id='LessonDetails_Text' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''}></custom-textarea>
                    
                    <div id='LessonDetails_Attachments' class='EmptyHidden'>`;
        if (aAttachments.length !== 0)
        {
            HTML +=     `<div id='LessonDetails_Attachments_List'>`;
            for (let loop_aAttachment of aAttachments)
                HTML +=    `<div>${Details_GetAttachmentIHTML(loop_aAttachment[0], loop_aAttachment[1])}</div>`;
            HTML +=     `</div>`;

            if (_iAccessLevel === 2)
                HTML += `<hr>`;
        };

        if (_iAccessLevel === 2)
            HTML +=     `<input type='file' hidden onchange='LessonDetails_AddAttachment([...this.files])' multiple>
                         <button onclick='this.previousSibling.previousElementSibling.click()'>
                            <div></div>
                            <svg ${_Icons['Attach']}></svg>
                            <span>${['Attach file', 'Прикрепить файл'][_iLanguage]}</span>
                         </button>`;

        HTML +=    `</div>`;
    

        _aOverlays['LessonDetails'][1].children[1].children[0].innerHTML = HTML;
        _aOverlays['LessonDetails'][1].children[1].className = 'Overlay_Rectangular';

        window._LessonDetails_bAdded = bAdded;
        window._LessonDetails_iDate = iDate;
        window._LessonDetails_iLessonNumber = iLessonNumber;
        window._LessonDetails_sSubject = sSubject;
        window._LessonDetails_sReplacement = sReplacement;
    
        history.pushState('', '', `${location.pathname}?Date=${iDate}&LessonNumber=${iLessonNumber}`);
    }
    catch
    {
        LessonDetails_Close();
    };
}

function Details_GetAttachmentIHTML(sFolder, sName)
{
    return `<a href='https://527010.selcdn.ru/timetable.one Dev/${sFolder}/${sName}' target='_blank'>${sName}</a>

        ${ 
            _iAccessLevel === 2 ?
           `<button onclick='LessonDetails_RemoveAttachment(this, "${sFolder}", "${sName}")'>
                <svg ${_Icons['RemoveForever']}></svg>
            </button>`
            : ''
        }`;
}