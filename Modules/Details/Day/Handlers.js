function DayDetails_SetNote(sNote)
{
    //// Закулисное
    sNote = sNote.trim();

    // Отправка на сервер
    SendRequest('/Modules/Details/Day/SetNote.php', {'Date' : _DayDetails_iDate, 'Note' : sNote});
    
    // Изменение или удаление из массива недели
    if (sNote === '')
    {
        for (let i = 0; i < _oWeek['DayNotes'].length; i++)
            if (_oWeek['DayNotes'][i]['Date'] === _DayDetails_iDate)
            {
                _oWeek['DayNotes'].splice(i, 1);
                break;
            };
    }
    else
    {
        let bExist = false;
        
        for (let loop_oDayNote of _oWeek['DayNotes'])
            if (loop_oDayNote['Date'] === _DayDetails_iDate)
            {
                loop_oDayNote['Text'] = sNote;
                bExist = true;
                break;
            };

        if (bExist === false)
            _oWeek['DayNotes'].push({'Date': _DayDetails_iDate, 'Text': sNote});
    };


    //// Внешнее
    // Обновление элемента расписания
    let eDay = Timetable_GetDayElement(_DayDetails_iDate);
    if (eDay !== null)
        if (sNote === '')
            eDay.classList.remove('Note');
        else
            eDay.classList.add('Note');
}