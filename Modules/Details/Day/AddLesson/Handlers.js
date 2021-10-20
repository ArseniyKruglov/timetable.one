function DayDetails_AddLesson_Validation(eSubject = document.getElementById('DayDetails_AddLesson_Subject'), eDate = document.getElementById('DayDetails_AddLesson_Calendar'), eLessonNumber = document.getElementById('DayDetails_AddLesson_LessonNumber'))
{
    let bSubject = eSubject.value.trim() != '';

    let bDate = eDate.value !== '';

    let bLessonNumber = _aDayDetails_AddLesson_LessonNumbers.includes(parseInt(eLessonNumber.value)) === false;
    eLessonNumber.setCustomValidity(bLessonNumber ? '' : 'Invalid field.');

    document.querySelector(`#DayDetails_AddLesson > button`).disabled = !(bSubject && bDate && bLessonNumber);
}



function DayDetails_AddLesson_AddLesson()
{
    //// Закулисное
    sSubject = document.getElementById('DayDetails_AddLesson_Subject').value.trim();
    iDate = new Date(document.getElementById('DayDetails_AddLesson_Calendar').value).get1970();
    iLessonNumber = parseInt(document.getElementById('DayDetails_AddLesson_LessonNumber').value);

    if (sSubject !== '' && iDate !== NaN && iLessonNumber !== NaN)
    {
        // Отправка на сервер
        SendRequest('/Modules/Details/Day/AddLesson/AddLesson.php', {'Date' : iDate, 'LessonNumber' : iLessonNumber, 'Subject' : sSubject});
        
        // Добавление в массив недели
        _oWeek['AddedLessons'].push({'Date' : iDate, 'LessonNumber' : iLessonNumber, 'Subject' : sSubject});
    
    
        //// Внешнее
        // Закрытие окна
        DayDetails_AddLesson_Close();
        
        // Обновление элемента расписания
        let aWeekPeriod = Week_GetPeriod(_iWeekOffset);
        if (aWeekPeriod[0] <= iDate && iDate <= aWeekPeriod[1])
        {
            // Week/Script.js copypaste

            let eLesson = document.createElement('div');
            eLesson.className = 'Lesson Added';
            eLesson.innerHTML =    `<span>${iLessonNumber}</span>
                                    <a ${Timetable_GetLessonLinkAttributes(iDate, iLessonNumber)}>
                                        <span></span>
                                        <span>${sSubject}</span>
                                    </a>`;

            let eAfter = null;
            let bSame = false;
            for (let loop_aLesson of Timetable_GetLessonElements(iDate))
            {
                let loop_iLessonNumber = parseInt(loop_aLesson.children[0].innerHTML);

                if (loop_iLessonNumber === iLessonNumber)
                {
                    bSame = true;
                    break;
                };

                if (loop_iLessonNumber > iLessonNumber)
                {
                    eAfter = loop_aLesson;
                    break;
                };
            };
            if (bSame === false)
                Timetable_GetDayElement(iDate).children[1].insertBefore(eLesson, eAfter);
        }
    };
}