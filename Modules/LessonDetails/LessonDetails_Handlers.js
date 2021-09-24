function LessonDetails_SetReplacement(sValue)
{
    _LessonDetails_sReplacement = sValue.trim();

    SendRequest('/Modules/LessonDetails/SetReplacement.php', {'Date' : _LessonDetails_iDate, 'LessonNumber' : _LessonDetails_iLessonNumber, 'Subject' : _LessonDetails_sSubject, 'Replacement' : _LessonDetails_sReplacement});

    let sText = '';
    for (let loop_oHometask of _oWeek['Hometasks'])
        if (loop_oHometask['Subject'] === (_LessonDetails_sReplacement ? _LessonDetails_sReplacement : _LessonDetails_sSubject) && loop_oHometask['Date'] === _LessonDetails_iDate)
        {
            sText = loop_oHometask['Text'];
            break;
        };
    document.getElementById('LessonDetails_Text').value = sText;

    {
        let eLesson = Timetable_GetLessonElement(_LessonDetails_iDate, _LessonDetails_iLessonNumber);
        if (eLesson !== null)
        {
            if (_LessonDetails_sReplacement === '')
                eLesson.classList.add('Canceled');
            else
                eLesson.classList.remove('Canceled');
    
            if (sText !== '')
                eLesson.classList.add('Note');
            else
                eLesson.classList.remove('Note');

            if (_LessonDetails_sSubject === _LessonDetails_sReplacement)
                eLesson.children[1].children[0].innerHTML = '';
            else
                eLesson.children[1].children[0].innerHTML = _LessonDetails_sReplacement;      
        };
    }

    if (_LessonDetails_sSubject === _LessonDetails_sReplacement)
    {
        for (let i = 0; i < _oWeek['Replacements'].length; i++)
            if (_oWeek['Replacements'][i]['Date'] === _LessonDetails_iDate && _oWeek['Replacements'][i]['LessonNumber'] === _LessonDetails_iLessonNumber)
            {
                _oWeek['Replacements'].splice(i, 1);
                break;
            };
    }
    else
    {
        let bExist = false;
        for (let loop_oReplacement of _oWeek['Replacements'])
            if (loop_oReplacement['Date'] === _LessonDetails_iDate && loop_oReplacement['LessonNumber'] === _LessonDetails_iLessonNumber)
            {
                loop_oReplacement['Replacement'] = _LessonDetails_sReplacement;
                bExist = true;
                break;
            };
        if (bExist === false)
            _oWeek['Replacements'].push({'Date': _LessonDetails_iDate, 'LessonNumber': _LessonDetails_iLessonNumber, 'Replacement': _LessonDetails_sReplacement});
    };

    let eDay = Timetable_GetDayElement(_LessonDetails_iDate);
    if (eDay)
        eDay.children[0].children[1].innerHTML = Timetable_GetPeriod(_LessonDetails_iDate);

    Information_Draw();
}

function LessonDetails_SetText(sText)
{
    sText = sText.trim();
    let sSubject = _LessonDetails_sReplacement ? _LessonDetails_sReplacement : _LessonDetails_sSubject;

    SendRequest('/Modules/LessonDetails/SetText.php', {'Date' : _LessonDetails_iDate, 'Subject' : sSubject, 'Text' : sText});
    
    for (let loop_eLesson of Timetable_GetLessonElements(_LessonDetails_iDate))
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
            if (_oWeek['Hometasks'][i]['Date'] === _LessonDetails_iDate && _oWeek['Hometasks'][i]['Subject'] === sSubject)
            {
                _oWeek['Hometasks'].splice(i, 1);
                break;
            };
    }
    else
    {
        let bExist = false;
        for (let loop_oHometask of _oWeek['Hometasks'])
            if (loop_oHometask['Subject'] === sSubject && loop_oHometask['Date'] === _LessonDetails_iDate)
            {
                loop_oHometask['Text'] = sText;
                bExist = true;
                break;
            };
        if (bExist === false)
            _oWeek['Hometasks'].push({'Subject': sSubject, 'Date': _LessonDetails_iDate, 'Text': sText});
    };
}