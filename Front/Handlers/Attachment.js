function AddAttachments(iDate, sTitle, aAttachments, bDraw, bRecord, oInRecords)
{
    if (bRecord)
    {
        oInRecords = oInRecords || _Records.Notes.selectWhere({ 'Date': iDate, 'Title': sTitle }, true);

        if (oInRecords)
        {
            if ('Note' in oInRecords || 'Attachments' in oInRecords || aAttachments.length)
            {
                if (!('Attachments' in oInRecords))
                    oInRecords.Attachments = [];

                oInRecords.Attachments = oInRecords.Attachments.concat(aAttachments);
            }
            else
            {
                oInRecords = null;

                _Records.Notes.removeWhere({ 'Date': iDate, 'Title': sTitle }, true);       // TO DO: удаление через .indexOf
            }
        }
        else
        {
            if (aAttachments.length)
            {
                if (sTitle)
                    oInRecords =
                    {
                        'Date': iDate,
                        'Title': sTitle,
                        'Attachments': aAttachments
                    };
                else
                    oInRecords =
                    {
                        'Date': iDate,
                        'Attachments': aAttachments
                    };

                _Records.Notes.push(oInRecords);
            };
        };

        if (window._Lesson_UI)
            if (_Lesson_UI.Date === iDate && _Lesson_UI.Title === sTitle)
                _Lesson_UI.oInRecords_Note = oInRecords;
    };

    if (bDraw)
    {
        const eDay = _Timetable.DaySelector(iDate);
        const bPoint = oInRecords === undefined ? (aAttachments.length || _Records.Notes.selectWhere({ 'Date': iDate, 'Title': sTitle }, true)) : oInRecords;

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
                _Lesson_UI.Overlay.GetUIElement('.Attachments').innerHTML = _Lesson_UI.GetAttachmentsIHTML();
    };
}

function UploadAttachments(iDate, sTitle, aFiles, oInRecords)
{
    for (let loop_File of aFiles)
        SendRequest
        (
            '/Back/UploadAttachment.php',
            {
                'Date': iDate,
                'Title': sTitle,
                'File': loop_File
            },
            true
        ).then((Response) => 
        {
            if (Response.Status === 200)
                AddAttachments(iDate, sTitle, [{ 'Folder': Response.Text, 'Filename': loop_File.name }], true, true, oInRecords);
        });
}

function RemoveAttachments(iDate, sTitle, aFolderNames, bDraw, bSend, bRecord, oInRecords)
{

}