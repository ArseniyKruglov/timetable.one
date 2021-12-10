function Lesson_SetNote(iDate, sTitle, sNote, bDraw, bSend, bRecord, bInsert, oInRecords)
{
    if (bRecord)
    {
        if (sNote)
        {
            oInRecords = oInRecords || _Records.Notes.selectWhere({ 'Date': iDate, 'Title': sTitle }, true);

            if (oInRecords)
            {
                oInRecords.Note = sNote;
            }
            else
            {
                oInRecords =
                {
                    'Date': iDate,
                    'Title': sTitle,
                    'Note': sNote
                };

                _Records.Notes.push(oInRecords);
            };
        }
        else
        {
            oInRecords = null;

            _Records.Notes.removeWhere({ 'Date': iDate, 'Title': sTitle }, true);
        };
    };

    if (bDraw)
    {
        const eDay = _Timetable.DaySelector(iDate);

        if (eDay)
            for (let loop_eLesson of eDay.parentElement.children[1].children)
            {
                const loop_sChange = loop_eLesson.children[1].children[0].innerHTML;
                const loop_sTitle = loop_eLesson.children[1].children[1].innerHTML;

                if ((loop_sChange || loop_sTitle) === sTitle)
                {
                    if (sNote)
                        loop_eLesson.classList.add('Note');
                    else
                        loop_eLesson.classList.remove('Note');
                };
            };
    };

    if (bSend)
    {
        SendRequest('/PHP/Handlers/Lesson_Note.php',
        {
            'Date': iDate,
            'Title': sTitle,
            'Note': sNote
        });
    };

    if (bInsert)
    {
        if (window._Lesson_UI)
            if (_Lesson_UI.Date === iDate && _Lesson_UI.Title === sTitle)
                _Lesson_UI.Overlay.GetUIElement('.Note').value = sNote;
    };

    return oInRecords;
}