function Timetable_Draw()
{
    let eTimetable = document.getElementById('Timetable');
    
    eTimetable.innerHTML = Timetable_GetIHTML(_iWeekOffset);

    eTimetable.classList.remove('Current', 'Next', 'Past');
    if (_iWeekOffset === 0)
        eTimetable.classList.add('Current');
    else if (_iWeekOffset === 1)
        eTimetable.classList.add('Next');
    else if (_iWeekOffset < 0)
        eTimetable.classList.add('Past');
}

function Timetable_GetIHTML(iWeekOffset)
{
    let HTML = '';

    let aWeekPeriod = Week_GetPeriod(iWeekOffset);
    for (let iDate = aWeekPeriod[0]; iDate <= aWeekPeriod[1]; iDate++)
    {
        let mTodayTimetable = Timetable_GetDayTimetable(iDate);

        if (mTodayTimetable !== false && mTodayTimetable.size > 0)
        {
            let sDayClass;
            if (iDate === _iToday)
                sDayClass = 'Today';
            else if (iDate === _iToday + 1)
                sDayClass = 'Tomorrow';

            HTML += `<div class='Day ${sDayClass || ''}'>
                        <button onclick='DayDetails(${iDate})'>
                            <div>${Time_FormatDate(Time_From1970(iDate))}</div>
                            <div>${Timetable_GetPeriod(iDate)}</div>
                        </button>

                        <div>`;
            for (let loop_aLesson of mTodayTimetable)
                HTML +=    `<div class='Lesson'>
                                <span>${loop_aLesson[0]}</span>
                                <a ${Timetable_GetLessonLinkAttributes(iDate, loop_aLesson[0])}>
                                    <span></span>
                                    <span>${loop_aLesson[1][0]}</span>
                                </a>
                            </div>`;
            HTML +=   `</div>
                    </div>`;
        };
    };

    return HTML;
}