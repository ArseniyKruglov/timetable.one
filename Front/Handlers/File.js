function AddFiles(iDate, sTitle, aFiles, bDraw, bRecord, oInRecords)
{
    if (bRecord)
    {
        oInRecords = oInRecords === undefined ? _Records.Notes.selectWhere({ Date: iDate, Title: sTitle }, true) : oInRecords;

        if (oInRecords)
        {
            if ('Note' in oInRecords || 'Files' in oInRecords || aFiles.length)
            {
                if (!('Files' in oInRecords))
                    oInRecords.Files = [];

                oInRecords.Files = oInRecords.Files.concat(aFiles);
            }
            else
            {
                oInRecords = null;

                _Records.Notes.removeWhere({ Date: iDate, Title: sTitle }, true);       // TO DO: удаление через .indexOf

                if (sTitle)
                {
                    if (window._Lesson_UI)
                        if (_Lesson_UI.Date === iDate && _Lesson_UI.Title === sTitle)
                            _Lesson_UI.oInRecords_Note = oInRecords;
                }
                else
                {
                    if (window._Day_UI)
                        if (_Day_UI.Date === iDate)
                            _Day_UI.oInRecords_Note = oInRecords;
                };
            }
        }
        else
        {
            if (aFiles.length)
            {
                if (sTitle)
                    oInRecords =
                    {
                        'Date': iDate,
                        'Title': sTitle,
                        'Files': aFiles
                    };
                else
                    oInRecords =
                    {
                        'Date': iDate,
                        'Files': aFiles
                    };

                _Records.Notes.push(oInRecords);

                if (sTitle)
                {
                    if (window._Lesson_UI)
                        if (_Lesson_UI.Date === iDate && _Lesson_UI.Title === sTitle)
                            _Lesson_UI.oInRecords_Note = oInRecords;
                }
                else
                {
                    if (window._Day_UI)
                        if (_Day_UI.Date === iDate)
                            _Day_UI.oInRecords_Note = oInRecords;
                };
            };
        };
    };

    if (bDraw)
    {
        const eDay = _Timetable.DaySelector(iDate);
        const bPoint = oInRecords === undefined ? (aFiles.length || _Records.Notes.selectWhere({ Date: iDate, Title: sTitle }, true)) : oInRecords;

        if (eDay)
            if (sTitle)
            {
                for (let loop_eLesson of eDay.parentElement.children[1].children)
                    if (loop_eLesson.children[1].innerHTML === sTitle)
                        if (bPoint)
                            loop_eLesson.classList.add('Note');
                        else
                            loop_eLesson.classList.remove('Note');
            }
            else
            {
                if (bPoint)
                    eDay.parentElement.classList.add('Note');
                else
                    eDay.parentElement.classList.remove('Note');
            };

        if (aFiles.length)
            if (window._Lesson_UI)
                if (_Lesson_UI.Date === iDate && _Lesson_UI.Title === sTitle)
                {
                    const eFiles = _Lesson_UI.Overlay.GetUIElement('.Files');

                    for (let loop_oFile of aFiles)
                    {
                        const eFile = document.createElement('div');
                        eFile.innerHTML =  `<a href='https://527010.selcdn.ru/timetable.one Dev/${loop_oFile.Folder}/${loop_oFile.Filename}' target='_blank'>
                                                <span>${loop_oFile.Filename}</span>
                                            </a>
                                            ${_iAccessLevel === 2 ? `<custom-round-button icon='RemoveForever' onclick='if (confirm("${['Remove', 'Удалить'][_iLanguage]} ${loop_oFile.Filename}?")) RemoveFiles(${_Lesson_UI.Date}, "${_Lesson_UI.Title}", "${loop_oFile.Folder}", true, true, true, _Lesson_UI.oInRecords)'></custom-round-button>` : ''}`;

                        eFiles.append(eFile);
                    };
                };
    };
}

function RemoveFiles(iDate, sTitle, sFolder, bDraw, bSend, bRecord, oInRecords)
{
    if (bRecord)
    {
        oInRecords = oInRecords === undefined ? _Records.Notes.selectWhere({ Date: iDate, Title: sTitle }, true) : oInRecords;



        let bEmpty = false;

        if ('Files' in oInRecords)
        {
            oInRecords.Files.removeWhere({ Folder: sFolder });

            if (oInRecords.Files.length === 0)
                delete oInRecords.Files;

            bEmpty = (!oInRecords.Note && !oInRecords.Files);
        }
        else
        {
            bEmpty = !oInRecords.Note;
        };

        if (bEmpty)
        {
            oInRecords = null;

            _Records.Notes.removeWhere({ Date: iDate, Title: sTitle }, true);

            if (sTitle)
            {
                if (window._Lesson_UI)
                    if (_Lesson_UI.Date === iDate && _Lesson_UI.Title === sTitle)
                        _Lesson_UI.oInRecords_Note = oInRecords;
            }
            else
            {
                if (window._Day_UI)
                    if (_Day_UI.Date === iDate)
                        _Day_UI.oInRecords_Note = oInRecords;
            };
        };
    };

    if (bDraw)
    {
        oInRecords = oInRecords === undefined ? _Records.Notes.selectWhere({ Date: iDate, Title: sTitle }, true) : oInRecords;



        const eDay = _Timetable.DaySelector(iDate);
        const bPoint = Boolean(oInRecords);

        if (eDay)
            if (sTitle)
            {
                for (let loop_eLesson of eDay.parentElement.children[1].children)
                    if (loop_eLesson.children[1].innerHTML === sTitle)
                        if (bPoint)
                            loop_eLesson.classList.add('Note');
                        else
                            loop_eLesson.classList.remove('Note');
            }
            else
            {
                if (bPoint)
                    eDay.parentElement.classList.add('Note');
                else
                    eDay.parentElement.classList.remove('Note');
            };

        if (window._Lesson_UI)
            if (_Lesson_UI.Date === iDate && _Lesson_UI.Title === sTitle)
                for (let loop_eFile of _Lesson_UI.Overlay.GetUIElement('.Files').children)
                    if (loop_eFile.children[0].getAttribute('href').includes(sFolder))
                        loop_eFile.remove();
    };

    if (bSend)
    {
        SendRequest
        (
            '/Back/RemoveFile.php',
            {
                'Date': iDate,
                'Title': sTitle,
                'Folder': sFolder
            }
        );
    };
}



function UploadFiles(iDate, sTitle, aFiles, oInRecords)
{
    for (let loop_File of aFiles)
    {
        const FD = new FormData();
        FD.append('Date', iDate);
        FD.append('Title', sTitle);
        FD.append('File', loop_File);



        const eFile = document.createElement('div');
        eFile.classList.add('Uploading');
        eFile.setAttribute('style', '--Progress: 0%');
        eFile.innerHTML = `<a>${loop_File.name}</a>
                           <custom-round-button icon='Clear'></custom-round-button>`;
        eFile.children[1].addEventListener('click', () =>
        {
            XHR.abort();
            eFile.remove();
            _Uploads.splice(_Uploads.indexOf(oInUploads), 1);
        });

        if (window._Lesson_UI)
            if (_Lesson_UI.Date === iDate && _Lesson_UI.Title === sTitle)
                _Lesson_UI.Overlay.GetUIElement('.Files').append(eFile);

        if (!('_Uploads' in window))
            window._Uploads = [];

        const oInUploads = { 'Date': iDate, 'Title': sTitle, 'Element': eFile };

        _Uploads.push(oInUploads);



        const XHR = new XMLHttpRequest();

        XHR.upload.onprogress = (Event) =>
        {
            eFile.setAttribute('style', `--Progress: ${Event.loaded / Event.total * 100}%`);
        };

        XHR.onload = () =>
        {
            if (XHR.status === 200)
            {
                eFile.remove();
                _Uploads.splice(_Uploads.indexOf(oInUploads), 1);

                AddFiles(iDate, sTitle, [{ Folder: XHR.responseText, Filename: loop_File.name }], true, true, oInRecords);
            };
        };

        XHR.open('POST', '/Back/UploadFile.php');
        XHR.send(FD);
    };
}