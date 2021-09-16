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

function LessonDetails_Draw(iDate, iLessonNumber)
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
    for (let loop_oHometask of _oWeek['Hometasks'])
        if (loop_oHometask['Subject'] === (sReplacement ? sReplacement : sSubject) && loop_oHometask['Date'] === iDate)
        {
            sHometask = loop_oHometask['Text'];
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
                
                
                <custom-textarea placeholder='${['Note', 'Заметка'][_iLanguage]}' value='${sHometask}' oninput='LessonDetails_SetText("${sSubject}", ${iDate}, this.value)'></custom-textarea>`;

    _aOverlays['LessonDetails'][1].children[1].children[0].innerHTML = HTML;
    _aOverlays['LessonDetails'][1].children[1].className = 'Overlay_Rectangular';

    if (document.body.hasAttribute('FullAccess') === false)
        for (let loop_aTextarea of document.querySelectorAll(`#LessonDetails custom-textarea`))
            loop_aTextarea.children[0].children[0].setAttribute('readonly', '');
}

function LessonDetails_Close()
{
    Overlay_Remove('LessonDetails');
}




function LessonDetails_SetReplacement(iDate, iLessonNumber, sSubject, sReplacement)
{
    sReplacement = sReplacement.trim();



    SendRequest('/Modules/LessonDetails/SetReplacement.php', {'Date' : iDate, 'LessonNumber' : iLessonNumber, 'Subject' : sSubject, 'Replacement' : sReplacement});



    let eLesson = GetLesson(iDate, iLessonNumber);
    if (sReplacement === '')
        eLesson.classList.add('Canceled');
    else
        eLesson.classList.remove('Canceled');

    if (sSubject === sReplacement)
    {
        eLesson.children[1].children[0].innerHTML = '';

        for (let i = 0; i < _oWeek['Replacements'].length; i++)
            if (_oWeek['Replacements'][i]['Date'] === iDate && _oWeek['Replacements'][i]['LessonNumber'] === iLessonNumber)
            {
                _oWeek['Replacements'].splice(i, 1);
                break;
            };
    }
    else
    {
        eLesson.children[1].children[0].innerHTML = sReplacement;

        let bExist = false;
        for (let loop_oReplacement of _oWeek['Replacements'])
            if (loop_oReplacement['Date'] === iDate && loop_oReplacement['LessonNumber'] === iLessonNumber)
            {
                loop_oReplacement['Replacement'] = sReplacement;
                bExist = true;
                break;
            };
        if (bExist === false)
            _oWeek['Replacements'].push({'Date': iDate, 'LessonNumber': iLessonNumber, 'Replacement': sReplacement});
    };

    Deadlines_Draw();
}

function LessonDetails_SetText(sSubject, iDate, sText)
{
    sText = sText.trim();



    SendRequest('/Modules/LessonDetails/SetText.php', {'Date' : iDate, 'Subject' : sSubject, 'Text' : sText});


    
    for (let loop_eLesson of GetLessons(iDate))
    {
        let loop_sReplacement = loop_eLesson.children[1].children[0].innerHTML;
        let loop_sSubject = loop_eLesson.children[1].children[1].innerHTML;

        if ((loop_sReplacement ? loop_sReplacement : loop_sSubject) === sSubject)
            if (sText === '')
                loop_eLesson.classList.remove('Note');
            else
                loop_eLesson.classList.add('Note');
    };

    if (sText === '')
    {
        for (let i = 0; i < _oWeek['Hometasks'].length; i++)
            if (_oWeek['Hometasks'][i]['Date'] === iDate && _oWeek['Hometasks'][i]['Subject'] === sSubject)
            {
                _oWeek['Hometasks'].splice(i, 1);
                break;
            };
    }
    else
    {
        let bExist = false;
        for (let loop_oHometask of _oWeek['Hometasks'])
            if (loop_oHometask['Subject'] === sSubject && loop_oHometask['Date'] === iDate)
            {
                loop_oHometask['Text'] = sText;
                bExist = true;
                break;
            };
        if (bExist === false)
            _oWeek['Hometasks'].push({'Subject': sSubject, 'Date': iDate, 'Text': sText});
    };

    Deadlines_Draw();
}