function SetNote(iDate, sTitle, sNote, bDraw, bSend, bRecord, bInsert, oInRecords)
{
    if (bRecord)
    {
        oInRecords = oInRecords || _Records.Notes.selectWhere({ 'Date': iDate, 'Title': sTitle }, true);

        if (oInRecords)
        {
            if (sNote || 'Attachments' in oInRecords)
            {
                if (sNote)
                    oInRecords.Note = sNote;
                else
                    delete oInRecords.Note;
            }
            else
            {
                oInRecords = null;

                _Records.Notes.removeWhere({ 'Date': iDate, 'Title': sTitle }, true);       // TO DO: удаление через .indexOf
            };
        }
        else
        {
            if (sNote)
            {
                if (sTitle)
                    oInRecords =
                    {
                        'Date': iDate,
                        'Title': sTitle,
                        'Note': sNote
                    };
                else
                    oInRecords =
                    {
                        'Date': iDate,
                        'Note': sNote
                    };

                _Records.Notes.push(oInRecords);
            };
        };

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

        if (bSend)
        {
            if (sTitle)
                SendRequest
                (
                    '/Back/Lesson_Note.php',
                    {
                        'Date': iDate,
                        'Title': sTitle,
                        'Note': sNote
                    }
                );
            else
                SendRequest
                (
                    '/Back/Day_Note.php',
                    {
                        'Date': iDate,
                        'Note': sNote
                    }
                );
        };
    };

    if (bDraw)
    {
        const eDay = _Timetable.DaySelector(iDate);
        const bPoint = oInRecords === undefined ? (sNote || _Records.Notes.selectWhere({ 'Date': iDate, 'Title': sTitle }, true)) : oInRecords;

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
    };

    if (bInsert)
    {
        if (sTitle)
        {
            if (window._Lesson_UI)
                if (_Lesson_UI.Date === iDate && _Lesson_UI.Title === sTitle)
                    _Lesson_UI.Overlay.GetUIElement('.Note').value = _Lesson_UI.Note;
        }
        else
        {
            if (window._Day_UI)
                if (_Day_UI.Date === iDate)
                    _Day_UI.Overlay.GetUIElement('.Note').value = _Day_UI.Note;
        };
    };
}