function Lesson_SetNote(iDate, sTitle, sNote, bSend, bPush, bDraw, oInWeek)
{
    sNote = sNote.trim();

    if (bPush)
        if (sNote)
        {
            if (oInWeek)
            {
                oInWeek.Note = sNote;
            }
            else
            {
                sNote = 
                {
                    'Title': sTitle,
                    'Date': iDate,
                    'Note': sNote
                };

                _oWeek.LessonNotes.push(sNote);                
            };
        }
        else
        {
            if (sNote)
                _oWeek.LessonNotes.removeWhere({ 'Date': iDate, 'Title': sTitle }, true);

            sNote = null;
        };

    if (bSend)
        SendRequest('/PHP/Handlers/Lesson_Note.php', {'Date': iDate, 'Title': sTitle, 'Note': sNote});

    if (bDraw)
        Timetable_SetPoint_Lesson(iDate, sTitle, sNote);
}