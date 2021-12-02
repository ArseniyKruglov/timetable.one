function SuddenLesson_Constructor(iDate, iIndex, sTitle, bDraw, bPush, bSend)
{
    if (bSend)
        SendRequest('/PHP/Handlers/SuddenLesson_Constructor.php', {'Date': iDate, 'Index': iIndex, 'Title': sTitle});

    let eDay = Timetable_GetDayElement(iDate);

    if (bPush)
    {
        _oWeek.SuddenLessons.push({'Date': iDate, 'Index': iIndex, 'Title': sTitle});

        if (eDay)
            eDay.children[0].children[1].innerHTML = Timetable_GetPeriod(iDate);

        _Information.Update(iDate);
    };

    if (bDraw)
    {
        const aWeekPeriod = Week_GetPeriod(_iWeekOffset);
        if (aWeekPeriod[0] <= iDate && iDate <= aWeekPeriod[1])
        {
            const HTML = `<span>${iIndex}</span>
                          <a ${Timetable_GetLessonLinkAttributes(iDate, iIndex)}>
                            <span></span>
                            <span>${sTitle}</span>
                          </a>
                          <span></span>`;

            if (eDay)
            {
                const eLesson = document.createElement('div');
                eLesson.className = 'Lesson Added';
                eLesson.innerHTML = HTML;

                let eAfter = null;
                for (let loop_eLesson of Timetable_GetLessonElements(iDate))
                {
                    const loop_iIndex = parseInt(loop_eLesson.children[0].innerHTML);
    
                    if (loop_iIndex > iIndex)
                    {
                        eAfter = loop_eLesson;
                        break;
                    };
                };
                eDay.children[1].insertBefore(eLesson, eAfter);
            }
            else
            {
                let sDayClass;
                if (iDate === _iToday)
                    sDayClass = 'Today';
                else if (iDate === _iToday + 1)
                    sDayClass = 'Tomorrow';
    
                eDay = document.createElement('div');
                eDay.className = `Day ${sDayClass || ''} ${_oWeek.DayNotes.selectWhere({ 'Date': iDate }, true) ? 'Note' : ''}`;
                eDay.innerHTML = `<a href='${location.pathname}?Date=${iDate}' onclick="event.preventDefault(); Route_Forward('/Day?Date=${iDate}');">
                                    <div>${Date_Format(Time_From1970(iDate))}</div>
                                    <div class='EmptyHidden'>${Timetable_GetPeriod(iDate)}</div>
                                  </a>
        
                                  <div>
                                    <div class='Lesson Added'>${HTML}</div>
                                  </div>`;

                let eAfter = null;
                const eTimetable = document.getElementById('Timetable');
                for (let loop_eDay of eTimetable.children)
                {
                    const loop_iDate = parseInt(loop_eDay.children[0].getAttribute('onclick').replace(/\D/g, ''));
    
                    if (loop_iDate > iDate)
                    {
                        eAfter = loop_eDay;
                        break;
                    };
                };
                eTimetable.insertBefore(eDay, eAfter);
            };
        };
    };
}