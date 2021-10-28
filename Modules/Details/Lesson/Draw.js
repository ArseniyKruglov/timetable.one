function LessonDetails_Draw(iDate, iLessonNumber)
{
    // try
    // {
        window._LessonDetails = new Lesson(iDate, iLessonNumber);
    
        let HTML = `<div id='LessonDetails_Header' hidden>
                        <span><custom-round-button icon='Arrow Back' scale=28></custom-round-button></span>
                        <span><custom-round-button icon='Edit' scale=28></custom-round-button></span>
                    </div>
                    
                    <custom-textarea placeholder='${_LessonDetails.sSubject}' value='${(_LessonDetails.sReplacement !== undefined) ? _LessonDetails.sReplacement : _LessonDetails.sSubject}' oninput='LessonDetails_SetReplacement(this.value)' id='LessonDetails_Subject' ${(_iAccessLevel < 2) ? 'readonly' : ''}></custom-textarea>
                    <button id='LessonDetails_Reset' ${(_LessonDetails.sReplacement === undefined || _iAccessLevel < 2) ? 'hidden' : ''} onclick='LessonDetails_Reset(this)'>Убрать замену</button>

                    <div id='LessonDetails_Info'>
                        <div>
                            <svg ${_Icons['Calendar']}></svg>
                            <span>${Time_FormatDate(Time_From1970(_LessonDetails.iDate))}</span>
                        </div>
                        
                    ${
                        _LessonDetails.aAlarms ? 
                        `<div>
                            <svg ${_Icons['Alarm']}></svg>
                            <span>${Time_FormatTime(_LessonDetails.aAlarms[0])} – ${Time_FormatTime(_LessonDetails.aAlarms[1])}</span>
                        </div>`
                        : ''
                    }

                    ${
                        _LessonDetails.sLectureHall ? 
                        `<div>
                            <svg ${_Icons['Location']}></svg>
                            <span>${_LessonDetails.sLectureHall}</span>
                        </div>`
                        : ''
                    }

                    ${
                        _LessonDetails.sEducator ? 
                        `<div>
                            <svg ${_Icons['Teacher']}></svg>
                            <span>${_LessonDetails.sEducator}</span>
                        </div>`
                        : ''
                    }
                    </div>
                    
                    
                    <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${_LessonDetails.Note}' oninput='_LessonDetails.Note = this.value' id='LessonDetails_Text' ${(_iAccessLevel < 2) ? 'readonly' : ''} ${(_iAccessLevel === 0) ? 'hidden' : ''}></custom-textarea>
                    
                    <div id='LessonDetails_Attachments' class='EmptyHidden'>`;
        if (_LessonDetails.Attachments.length)
        {
            HTML +=     `<div id='LessonDetails_Attachments_List'>`;
            for (let loop_aAttachment of _LessonDetails.Attachments)
                HTML +=    `<div>${Details_GetAttachmentIHTML(loop_aAttachment[0], loop_aAttachment[1])}</div>`;
            HTML +=     `</div>`;

            if (_iAccessLevel === 2)
                HTML += `<hr>`;
        };

        if (_iAccessLevel === 2)
            HTML +=     `<input type='file' hidden onchange='_LessonDetails.uploadFiles([...this.files])' multiple>
                         <button onclick='this.previousSibling.previousElementSibling.click()'>
                            <div></div>
                            <svg ${_Icons['Attach']}></svg>
                            <span>${['Attach file', 'Прикрепить файл'][_iLanguage]}</span>
                         </button>`;

        HTML +=    `</div>`;
    

        _aOverlays['LessonDetails'][1].children[1].children[0].innerHTML = HTML;
        _aOverlays['LessonDetails'][1].children[1].className = 'Overlay_Rectangular';

        // window._LessonDetails_bAdded = bAdded;
        // window._LessonDetails_iDate = iDate;
        // window._LessonDetails_iLessonNumber = iLessonNumber;
        // window._LessonDetails_sSubject = sSubject;
        // window._LessonDetails_sReplacement = sReplacement;
    
        history.pushState('', '', `${location.pathname}?Date=${iDate}&LessonNumber=${iLessonNumber}`);
    // }
    // catch
    // {
    //     LessonDetails_Close();
    // };
}

function Details_GetAttachmentIHTML(sFolder, sName)
{
    return `<a href='https://527010.selcdn.ru/timetable.one Dev/${sFolder}/${sName}' target='_blank'>${sName}</a>

        ${ 
            _iAccessLevel === 2 ?
           `<button onclick='_LessonDetails.removeAttachment(this, "${sFolder}", "${sName}")'>
                <svg ${_Icons['RemoveForever']}></svg>
            </button>`
            : ''
        }`;
}