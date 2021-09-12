function LessonDetails(iNumber, iDate)
{
    Overlay_Open
    (
        'LessonDetails',
        () => { LessonDetails_Draw(iNumber, iDate) },
        () => {},
        LessonDetails_Close
    );
}

function LessonDetails_Draw(iNumber, iDate)
{
    let tDate = DaysSince1970ToTime(iDate);
    let iDayOfTimetable = Week_DateToDayOfTimetable(iDate);

    let sSubject = _aTimetable[iDayOfTimetable].get(iNumber)[0];
    let sReplacement = null;
    for (let loop_aReplacement of _aWeek[1])
        if (loop_aReplacement[0] === iDate && loop_aReplacement[1] === iNumber)
        {
            sReplacement = loop_aReplacement[2];
            break;
        };

    let aAlarms = _mAlarms.get(iNumber);
    let sLectureHall = _aTimetable[iDayOfTimetable].get(iNumber)[1];
    let sTeacher = _aTimetable[iDayOfTimetable].get(iNumber)[2];

    let sHometask = '';
    let aAttachments = [];
    for (let loop_aHometask of _aWeek[0])
        if (loop_aHometask[0] === (sReplacement ? sReplacement : sSubject) && loop_aHometask[1] === iDate)
        {
            sHometask = loop_aHometask[2];
            aAttachments = loop_aHometask[3];
            break;
        };

    let HTML = `<custom-textarea placeholder='${sSubject}' value='${sReplacement === null ? sSubject : sReplacement}' oninput='LessonDetails_SetReplacement(${iDate}, ${iNumber}, "${sSubject}", this.value)' id='LessonDetails_Subject'></custom-textarea>
                
                <div id='LessonDetails_Info'>
                    <div>
                        <svg ${_Icons['Calendar']}></svg>
                        <span>${tDate.toLocaleString(navigator.language, { month: 'long', day: 'numeric' })}</span>
                    </div>
                    
                    ${
                        aAlarms ? 
                       `<div>
                            <svg ${_Icons['Alarm']}></svg>
                            <span>${aAlarms[0].substr(0, 5)} – ${aAlarms[1].substr(0, 5)}</span>
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
                
                
                <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${sHometask}' oninput='LessonDetails_SetText("${sSubject}", ${iDate}, this.value)'></custom-textarea>
                
                <div id='LessonDetails_Attachments' class='EmptyHidden'>`;
    for (let loop_aAttachment of aAttachments)
        HTML +=     `<div href='/Storage/${loop_aAttachment[1]}/${loop_aAttachment[0]}' target='_blank'>${loop_aAttachment[0]}</div>`;
    HTML +=    `</div>`;

    _aOverlays['LessonDetails'][1].children[1].children[0].innerHTML = HTML;
    _aOverlays['LessonDetails'][1].children[1].className = 'Overlay_Rectangular';

    if (document.body.hasAttribute('God') === false)
        for (let loop_aTextarea of document.querySelectorAll(`#LessonDetails textarea`))
            loop_aTextarea.setAttribute('readonly', '');
}

function LessonDetails_Close()
{
    Overlay_Remove('LessonDetails');
}




function LessonDetails_SetReplacement(iDate, iNumber, sSubject, sReplacement)
{
    sReplacement = sReplacement.trim();
    
    let eLesson = document.querySelector(`[onclick="LessonDetails(${iNumber}, ${iDate});"]`);
    if (sReplacement === '')
    {
        
        eLesson.children[1].innerHTML = sSubject;
        eLesson.classList.add('Canceled');
    }
    else
    {
        eLesson.children[1].innerHTML = sReplacement;
        eLesson.classList.remove('Canceled');
    };

    if (sSubject === sReplacement)
    {
        for (let i = 0; i < _aWeek[1].length; i++)
            if (_aWeek[1][i][0] === iDate && _aWeek[1][i][1] === iNumber)
            {
                _aWeek[1].splice(i, 1);
                break;
            };

        let formData  = new FormData();
        formData.append('Date', iDate);
        formData.append('Number', iNumber);
    
        fetch('/Modules/LessonDetails/RemoveReplacement.php', { method: 'POST', body: formData });
    }
    else
    {
        let bExist = false;
        for (let loop_aReplacement of _aWeek[1])
            if (loop_aReplacement[0] === iDate && loop_aReplacement[1] === iNumber)
            {
                loop_aReplacement[2] = sReplacement;
                bExist = true;
                break;
            };
        if (bExist === false)
            _aWeek[1].push([iDate, iNumber, sReplacement]);

        let formData  = new FormData();
        formData.append('Date', iDate);
        formData.append('Number', iNumber);
        formData.append('Replacement', sReplacement);
    
        fetch('/Modules/LessonDetails/SetReplacement.php', { method: 'POST', body: formData });
    };
}

function LessonDetails_SetText(sSubject, iDate, sText)
{
    sText = sText.trim();

    let formData  = new FormData();
    formData.append('Subject', sSubject);
    formData.append('Date', iDate);
    formData.append('Text', sText);

    let bExist = false;
    for (let loop_aHometask of _aWeek[0])
        if (loop_aHometask[0] === sSubject && loop_aHometask[1] === iDate)
        {
            loop_aHometask[2] = sText;
            bExist = true;
            break;
        };
    if (bExist === false)
        _aWeek[0].push([sSubject, iDate, sText, []]);

    for (let loop_eLesson of document.querySelector(`[onclick="DayDetails(${iDate})"]`).parentElement.children[1].children)
        if (loop_eLesson.children[1].innerHTML === sSubject)
            if (sText === '')
                loop_eLesson.classList.remove('Note');
            else
                loop_eLesson.classList.add('Note');

    fetch('/Modules/LessonDetails/SetText.php', { method: 'POST', body: formData });
}