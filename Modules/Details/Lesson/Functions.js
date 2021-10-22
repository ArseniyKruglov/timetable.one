function LessonDetails_DisplayedSubject(sSubject, sReplcement)
{
    return sReplcement ? sReplcement : sSubject;    
}

function LessonDetails_ClearWeek()
{
    if (_LessonDetails_oWeekElement !== null || (_LessonDetails_oWeekElement['Text'] === '' && _LessonDetails_oWeekElement['Attachments'].length === 0))
    {
        _LessonDetails_oWeekElement = null;
        
        for (let i = 0; i < _oWeek['LessonNotes'].length; i++)
            if (_oWeek['LessonNotes'][i]['Date'] === _LessonDetails_iDate && _oWeek['LessonNotes'][i]['Subject'] === LessonDetails_DisplayedSubject(_LessonDetails_sSubject, _LessonDetails_sReplacement))
            {
                _oWeek['LessonNotes'].splice(i, 1);
                break;
            };
    };
}

function LessonDetails_GetDefaultWeekElement(sNote = '', aAttachments = [])
{
    return {'Subject': LessonDetails_DisplayedSubject(_LessonDetails_sSubject, _LessonDetails_sReplacement), 'Date': _LessonDetails_iDate, 'Text': sNote, 'Attachments' : aAttachments}; 
}