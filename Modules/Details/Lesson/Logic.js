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
        _LessonDetails_oWeekElement = LessonDetails_GetDefaultWeekElement();
        for (let loop_oLessonNote of _oWeek['LessonNotes'])
            if (loop_oLessonNote['Subject'] === (_LessonDetails_sReplacement ? _LessonDetails_sReplacement : _LessonDetails_sSubject) && loop_oLessonNote['Date'] === _LessonDetails_iDate)
            {
                _LessonDetails_oWeekElement = loop_oLessonNote;
                break;
            };



        //// Внешнее
        let eLesson = Timetable_GetLessonElement(_LessonDetails_iDate, _LessonDetails_iLessonNumber);

        // Кнопка сброса
        document.getElementById('LessonDetails_Reset').hidden = (_LessonDetails_sReplacement === undefined);

        // Отображение новой заметки
        document.getElementById('LessonDetails_Text').value = _LessonDetails_oWeekElement['Note'];

        // Отображение новых файлов                         - тут что-то откуда-то скопировано и это плохо
        {
            let eAttachmentsList = document.getElementById('LessonDetails_Attachments_List');
            if (_LessonDetails_oWeekElement['Attachments'].length === 0)
            {
                if (eAttachmentsList !== null)
                {
                    eAttachmentsList.nextElementSibling.remove();
                    eAttachmentsList.remove();
                };
            }
            else
            {
                if (eAttachmentsList === null)
                {
                    eAttachmentsList = document.createElement('div');
                    eAttachmentsList.id = 'LessonDetails_Attachments_List';
        
                    eAttachments = document.getElementById('LessonDetails_Attachments');
                    eHR = document.createElement('hr');
                    eAttachments.insertBefore(eHR, eAttachments.firstChild);
                    eAttachments.insertBefore(eAttachmentsList, eHR);
                };
                let HTML = '';
                for (let loop_aAttachment of _LessonDetails_oWeekElement['Attachments'])
                    HTML +=    `<div>${Details_GetAttachmentIHTML(loop_aAttachment[0], loop_aAttachment[1])}</div>`;
                eAttachmentsList.innerHTML = HTML;
            };
        }

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
        if (eDay !== null)
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
        SendRequest('/Modules/Details/Lesson/SetSubject.php', {'Date' : _LessonDetails_iDate, 'LessonNumber' : _LessonDetails_iLessonNumber, 'Subject' : _LessonDetails_sSubject});

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
                sText = loop_oLessonNote['Note'];
                break;
            };

            
            
        //// Внешнее
            
        LessonDetails_ShowDot()
        
        // Обновление элемента расписания
        let eLesson = Timetable_GetLessonElement(_LessonDetails_iDate, _LessonDetails_iLessonNumber);
        if (eLesson !== null)
            eLesson.children[1].children[1].innerHTML = _LessonDetails_sSubject;
    };
}



function LessonDetails_SetText(sText)
{
    //// Закулисное
    sText = sText.trim();

    // Отправка на сервер
    SendRequest('/Modules/Details/Lesson/SetText.php', {'Date' : _LessonDetails_iDate, 'Subject' : LessonDetails_DisplayedSubject(_LessonDetails_sSubject, _LessonDetails_sReplacement), 'Note' : sText});
    
    // Массив недели
    if (_LessonDetails_oWeekElement === null)
    {
        _LessonDetails_oWeekElement = LessonDetails_GetDefaultWeekElement(sNote, []);
        _oWeek['LessonNotes'].push(_LessonDetails_oWeekElement);
    }
    else
    {
        _LessonDetails_oWeekElement['Note'] = sNote;
    };
    LessonDetails_ClearWeek();


    //// Внешнее
    // Обновление элемента расписания
    LessonDetails_ShowDot();
}



function LessonDetails_AddAttachment(aFiles)
{
    // Формировка формы
    Form = new FormData();
    for (let i = 0; i < aFiles.length; i++)
        Form.append(`File[${i}]`, aFiles[i]);
    Form.append('Date', _LessonDetails_iDate);
    Form.append('Subject', _LessonDetails_sSubject);
                   
    // Отправка на сервер
    let XHR = new XMLHttpRequest();
    XHR.open('POST', '/Modules/Details/Lesson/AddAttachment.php');
    XHR.send(Form);

    // Отображение прогресса
    let eProgressBar = document.getElementById('LessonDetails_Attachments').lastElementChild.children[0];
    XHR.upload.onprogress = (event) => { eProgressBar.style = `width: ${event.loaded / event.total * 100}%; opacity: 100%`; };

    XHR.onreadystatechange = () => { if (XHR.readyState === 4)
    {
        // Отображение успеха
        eProgressBar.style = `width: 100%; opacity: 0%`;
        
        // Получение или создание элемента списка файлов
        let eAttachmentsList = document.getElementById('LessonDetails_Attachments_List');
        if (eAttachmentsList === null)
        {
            // Cоздание элемента списка файлов
            eAttachmentsList = document.createElement('div');
            eAttachmentsList.id = 'LessonDetails_Attachments_List';

            // Вставка элемента списка файлов и разделителя
            eAttachments = document.getElementById('LessonDetails_Attachments');
            eAttachments.insertBefore(eAttachmentsList, eAttachments.insertBefore(document.createElement('hr'), eAttachments.firstChild));
        };

        let aAttachments = (_LessonDetails_oWeekElement !== null) ? _LessonDetails_oWeekElement['Attachments'] : [];
        let aFolders = JSON.parse(XHR.response);
        for (let i = 0; i < aFolders.length; i++)
        {
            // Создание и вставка элемента
            eAttachment = document.createElement('div');
            eAttachment.innerHTML = Details_GetAttachmentIHTML(aFolders[i], aFiles[i].name);
            eAttachmentsList.append(eAttachment);

            // Добавление в массив
            aAttachments.push([aFolders[i], aFiles[i].name]);
        };

        if (_LessonDetails_oWeekElement === null)
        {
            _LessonDetails_oWeekElement = LessonDetails_GetDefaultWeekElement('', aAttachments);
            _oWeek['LessonNotes'].push(_LessonDetails_oWeekElement);
        };

        // Обновление элемента расписания
        LessonDetails_ShowDot();
    }; };
}

function LessonDetails_RemoveAttachment(eElement, sFolder, sFilename)
{
    if (confirm(`${['Remove', 'Удалить'][_iLanguage]} ${sFilename}?`) === true)
    {
        //// Закулисное
        // Отправка на сервер
        SendRequest('/Modules/Details/Lesson/RemoveAttachment.php', {'Date' : _LessonDetails_iDate, 'Subject' : LessonDetails_DisplayedSubject(_LessonDetails_sSubject, _LessonDetails_sReplacement), 'Folder' : sFolder});
    
        let bNowEmpty = (_LessonDetails_oWeekElement['Attachments'].length === 1);

        //  Массив недели
        if (bNowEmpty === true)
        {
            _LessonDetails_oWeekElement['Attachments'] = [];
        }
        else
        {
            for (let i = 0; i < _LessonDetails_oWeekElement['Attachments'].length; i++)
                if (_LessonDetails_oWeekElement['Attachments'][i][0] === sFolder)
                {
                    _LessonDetails_oWeekElement['Attachments'].splice(i, 1);
                    break;
                };
        };
        LessonDetails_ClearWeek();
    
    
            
        //// Внешнее
        // Удаление элемента
        if (bNowEmpty === true)    // Если единственный
        {
            eElement.parentElement.parentElement.parentElement.children[1].remove();
            eElement.parentElement.parentElement.parentElement.children[0].remove();
        }
        else
        {
            eElement.parentElement.remove();
        };

        // Обновление элемента расписания
        LessonDetails_ShowDot();
    };
}