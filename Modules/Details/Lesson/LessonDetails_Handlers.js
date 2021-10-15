function LessonDetails_SetReplacement(sValue)
{
    if (_LessonDetails_bAdded === false)        // Обычное занятие
    {
        //// Закулисное
        // Обновление переменной
        _LessonDetails_sReplacement = sValue.trim();
        if (_LessonDetails_sSubject === _LessonDetails_sReplacement)
            _LessonDetails_sReplacement = undefined;
    
        // Отправка на сервер
        SendRequest('/Modules/Details/Lesson/SetReplacement.php', {'Date' : _LessonDetails_iDate, 'LessonNumber' : _LessonDetails_iLessonNumber, 'Subject' : _LessonDetails_sSubject, 'Replacement' : sValue.trim()});

        // Изменение или удаление из массива недели
        if (_LessonDetails_sReplacement === undefined)
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

        // Поиск заметки к измененному предмету
        let sText = '';
        for (let loop_oLessonNote of _oWeek['LessonNotes'])
            if (loop_oLessonNote['Subject'] === (_LessonDetails_sReplacement ? _LessonDetails_sReplacement : _LessonDetails_sSubject) && loop_oLessonNote['Date'] === _LessonDetails_iDate)
            {
                sText = loop_oLessonNote['Text'];
                break;
            };



        //// Внешнее
        let eLesson = Timetable_GetLessonElement(_LessonDetails_iDate, _LessonDetails_iLessonNumber);

        // Кнопка сброса
        document.getElementById('LessonDetails_Reset').hidden = (_LessonDetails_sReplacement === undefined);

        // Отображение новой заметки
        document.getElementById('LessonDetails_Text').value = sText;
        if (eLesson !== null)
        {
            if (sText !== '')
                eLesson.classList.add('Note');
            else
                eLesson.classList.remove('Note');
        };

        // Обновление элемента расписания
        if (eLesson !== null)
        {
            if (_LessonDetails_sReplacement === '')
                eLesson.classList.add('Canceled');
            else
                eLesson.classList.remove('Canceled');
    
            eLesson.children[1].children[0].innerHTML = (_LessonDetails_sReplacement === undefined) ? '' : _LessonDetails_sReplacement;
        };

        // Обновление времени учебы
        let eDay = Timetable_GetDayElement(_LessonDetails_iDate);
        if (eDay)
            eDay.children[0].children[1].innerHTML = Timetable_GetPeriod(_LessonDetails_iDate);
    
        // Обновление информации
        Information_Draw();
    }
    else        // Добавленное занятие
    {
        //// Закулисное
        // Обновление переменной
        _LessonDetails_sSubject = sValue.trim();

        if (_LessonDetails_sSubject === '')     // Если предмет отсутствует
        {
            if (confirm(['Remove lesson?', 'Удалить занятие?'][_iLanguage]) === true)   // Удалять?
            {
                //// Закулисное
                // Отправка на сервер
                SendRequest('/Modules/Details/Lesson/SetSubject.php', {'Date' : _LessonDetails_iDate, 'LessonNumber' : _LessonDetails_iLessonNumber, 'Subject' : _LessonDetails_sSubject});
                
                // Удаление из массива недели
                for (let i = 0; i < _oWeek['AddedLessons'].length; i++)
                    if (_oWeek['AddedLessons'][i]['Date'] === _LessonDetails_iDate && _oWeek['AddedLessons'][i]['LessonNumber'] === _LessonDetails_iLessonNumber)
                    {
                        _oWeek['AddedLessons'].splice(i, 1);
                        break;
                    };


                //// Внешнее
                // Удаление элемента расписания
                let eLesson = Timetable_GetLessonElement(_LessonDetails_iDate, _LessonDetails_iLessonNumber);
                if (eLesson !== null)
                    eLesson.remove();

                // Закрывание окна
                LessonDetails_Close();

                // Костылек
                setTimeout(Week_Update, 100);       // TO DO
            }
            else
            {
                // Откат к прошлому значению
                document.getElementById('LessonDetails_Subject').value = _LessonDetails_sSubject;
            };

            // Обновление информации
            Information_Draw();

            return;
        };


        //// Закулисное
        // Отправка на сервер
        SendRequest('/Modules/LessonDetails/SetSubject.php', {'Date' : _LessonDetails_iDate, 'LessonNumber' : _LessonDetails_iLessonNumber, 'Subject' : _LessonDetails_sSubject});

        // Изменение массива недели
        for (let loop_oAddedLesson of _oWeek['AddedLessons'])
            if (loop_oAddedLesson['Date'] === _LessonDetails_iDate && loop_oAddedLesson['LessonNumber'] === _LessonDetails_iLessonNumber)
            {
                loop_oAddedLesson['Subject'] = _LessonDetails_sSubject;
                break;
            };
            
        // Поиск заметки к измененному предмету
        let sText = '';
        for (let loop_oLessonNote of _oWeek['LessonNotes'])
            if (loop_oLessonNote['Subject'] === _LessonDetails_sSubject && loop_oLessonNote['Date'] === _LessonDetails_iDate)
            {
                sText = loop_oLessonNote['Text'];
                break;
            };



        //// Внешнее
        let eLesson = Timetable_GetLessonElement(_LessonDetails_iDate, _LessonDetails_iLessonNumber);

        // Отображение новой заметки
        document.getElementById('LessonDetails_Text').value = sText;
        if (eLesson !== null)
        {
            if (sText !== '')
                eLesson.classList.add('Note');
            else
                eLesson.classList.remove('Note');
        };

        // Обновление элемента расписания
        if (eLesson !== null)
            eLesson.children[1].children[1].innerHTML = _LessonDetails_sSubject;
    };
}

function LessonDetails_Reset(eButton)
{
    LessonDetails_SetReplacement(_LessonDetails_sSubject);
    document.getElementById('LessonDetails_Subject').value = _LessonDetails_sSubject;
    eButton.hidden = true;
}

function LessonDetails_SetText(sText)
{
    //// Закулисное
    sText = sText.trim();

    // Отправка на сервер
    SendRequest('/Modules/Details/Lesson/SetText.php', {'Date' : _LessonDetails_iDate, 'Subject' : LessonDetails_DisplayedSubject(_LessonDetails_sSubject, _LessonDetails_sReplacement), 'Text' : sText});
    
    // Изменение или удаление из массива недели
    if (sText === '')
    {
        for (let i = 0; i < _oWeek['LessonNotes'].length; i++)
            if (_oWeek['LessonNotes'][i]['Date'] === _LessonDetails_iDate && _oWeek['LessonNotes'][i]['Subject'] === LessonDetails_DisplayedSubject(_LessonDetails_sSubject, _LessonDetails_sReplacement))
            {
                _oWeek['LessonNotes'].splice(i, 1);
                break;
            };
    }
    else
    {
        let bExist = false;
        for (let loop_oLessonNote of _oWeek['LessonNotes'])
            if (loop_oLessonNote['Subject'] === LessonDetails_DisplayedSubject(_LessonDetails_sSubject, _LessonDetails_sReplacement) && loop_oLessonNote['Date'] === _LessonDetails_iDate)
            {
                loop_oLessonNote['Text'] = sText;
                bExist = true;
                break;
            };
        if (bExist === false)
            _oWeek['LessonNotes'].push({'Subject': LessonDetails_DisplayedSubject(_LessonDetails_sSubject, _LessonDetails_sReplacement), 'Date': _LessonDetails_iDate, 'Text': sText});
    };


    //// Внешнее
    // Обновление элемента расписания
    for (let loop_eLesson of Timetable_GetLessonElements(_LessonDetails_iDate))
    {
        let loop_sReplacement = loop_eLesson.children[1].children[0].innerHTML;
        let loop_sSubject = loop_eLesson.children[1].children[1].innerHTML;

        if (LessonDetails_DisplayedSubject(loop_sSubject, loop_sReplacement) === LessonDetails_DisplayedSubject(_LessonDetails_sSubject, _LessonDetails_sReplacement))
            if (sText === '')
                loop_eLesson.classList.remove('Note');
            else
                loop_eLesson.classList.add('Note');
    };
}

function LessonDetails_AddAttachment(aFiles)
{
    Form = new FormData();
    for (let i = 0; i < aFiles.length; i++)
        Form.append(`File[${i}]`, aFiles[i]);
                   
    let req = new XMLHttpRequest();
    req.open('POST', '/Modules/Details/Lesson/AddAttachment.php');
    req.send(Form);
}