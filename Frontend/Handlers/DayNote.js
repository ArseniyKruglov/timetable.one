function Day_SetNote(iDate, sNote, bDraw, bSend, bRecord, bInsert, oInRecords)
{
    if (bRecord)
    {
        if (sNote)
        {
            oInRecords = oInRecords || _Records.Notes.selectWhere({ 'Date': iDate, 'Title': null }, true);

            if (oInRecords)
            {
                oInRecords.Note = sNote;
            }
            else
            {
                oInRecords =
                {
                    'Date': iDate,
                    'Title': null,
                    'Note': sNote
                };

                _Records.Notes.push(oInRecords);
            };
        }
        else
        {
            oInRecords = null;

            _Records.Notes.removeWhere({ 'Date': iDate, 'Title': null }, true);
        };

        if (bSend)
        {
            SendRequest('/PHP/Handlers/Day_Note.php',
            {
                'Date': iDate,
                'Note': sNote
            });
        };
    };

    if (bDraw)
    {
        const eDay = _Timetable.DaySelector(iDate);

        if (eDay)
            if (sNote)
                eDay.parentElement.classList.add('Note');
            else
                eDay.parentElement.classList.remove('Note');
    };

    if (bInsert)
    {
        if (window._Day_UI)
            if (_Day_UI.Date === iDate)
                _Day_UI.Overlay.GetUIElement('.Note').value = sNote;
    };

    return oInRecords;
}