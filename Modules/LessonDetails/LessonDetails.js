function LessonDetails(iLessonNumber, iDate)
{
    Overlay_Open
    (
        'LessonDetails',
        () => { LessonDetails_Draw(iLessonNumber, iDate) },
        () => {},
        LessonDetails_Close
    );
}

function LessonDetails_Draw(iLessonNumber, iDate)
{
    let tDate = DaysSince1970ToTime(iDate);
    let iDayOfTimetable = Week_DateToDayOfTimetable(iDate);

    let sSubject = _aTimetable[iDayOfTimetable].get(iLessonNumber)[0];
    let sReplacement = null;
    for (let loop_oReplacement of _oWeek['Replacements'])
        if (loop_oReplacement['Date'] === iDate && loop_oReplacement['LessonNumber'] === iLessonNumber)
        {
            sReplacement = loop_oReplacement['Replacement'];
            break;
        };

    let aAlarms = _mAlarms.get(iLessonNumber);
    let sLectureHall = _aTimetable[iDayOfTimetable].get(iLessonNumber)[1];
    let sTeacher = _aTimetable[iDayOfTimetable].get(iLessonNumber)[2];

    let sHometask = '';
    let aAttachments = [];
    for (let loop_oHometask of _oWeek['Hometasks'])
        if (loop_oHometask['Subject'] === (sReplacement ? sReplacement : sSubject) && loop_oHometask['Date'] === iDate)
        {
            sHometask = loop_oHometask['Text'];
            aAttachments = loop_oHometask['Attachments'];
            break;
        };

    let HTML = `<custom-textarea placeholder='${sSubject}' value='${sReplacement === null ? sSubject : sReplacement}' oninput='LessonDetails_SetReplacement(${iDate}, ${iLessonNumber}, "${sSubject}", this.value)' id='LessonDetails_Subject'></custom-textarea>
                
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
        for (let loop_aTextarea of document.querySelectorAll(`#LessonDetails custom-textarea`))
        {
            loop_aTextarea.onfocus = () => { this.blur(); };
            loop_aTextarea.children[0].children[0].setAttribute('readonly', '');
        };
}

function LessonDetails_Close()
{
    Overlay_Remove('LessonDetails');
}




function LessonDetails_SetReplacement(iDate, iLessonNumber, sSubject, sReplacement)
{
    sReplacement = sReplacement.trim();

    let eLesson = document.querySelector(`[onclick="LessonDetails(${iLessonNumber}, ${iDate});"]`);
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
        for (let i = 0; i < _oWeek['Replacements'].length; i++)
            if (_oWeek['Replacements'][i]['Date'] === iDate && _oWeek['Replacements'][i]['LessonNumber'] === iLessonNumber)
            {
                _oWeek['Replacements'].splice(i, 1);
                break;
            };
    }
    else
    {
        let bExist = false;
        for (let loop_oReplacement of _oWeek['Replacements'])
            if (loop_oReplacement['Date'] === iDate && loop_oReplacement['LessonNumber'] === iLessonNumber)
            {
                loop_oReplacement['Replacement'] = sReplacement;
                bExist = true;
                break;
            };
        if (bExist === false)
            _oWeek['Replacements'].push({'Date' : iDate, 'LessonNumber' : iLessonNumber, 'Replacement' : sReplacement});
    };

    SendRequest('/Modules/LessonDetails/SetReplacement.php', {'Date' : iDate, 'LessonNumber' : iLessonNumber, 'Subject' : sSubject, 'Replacement' : sReplacement});
}

function LessonDetails_SetText(sSubject, iDate, sText)
{
    sText = sText.trim();

    for (let loop_eLesson of document.querySelector(`[onclick="DayDetails(${iDate})"]`).parentElement.children[1].children)
        if (loop_eLesson.children[1].innerHTML === sSubject)
            if (sText === '')
                loop_eLesson.classList.remove('Note');
            else
                loop_eLesson.classList.add('Note');

    let bExist = false;
    for (let loop_oHometask of _oWeek['Hometasks'])
        if (loop_oHometask['Subject'] === sSubject && loop_oHometask['Date'] === iDate)
        {
            loop_oHometask['Text'] = sText;
            bExist = true;
            break;
        };
    if (bExist === false)
        _oWeek['Hometasks'].push({'Subject' : sSubject, 'Date' : iDate, 'Text' : sText, 'Attachments' : []});

    SendRequest('/Modules/LessonDetails/SetText.php', {'Date' : iDate, 'Subject' : sSubject, 'Text' : sText});
}