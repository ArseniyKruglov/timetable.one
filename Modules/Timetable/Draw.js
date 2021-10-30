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
                                    <span>${loop_aLesson[1]['Subject']}</span>
                                </a>
                            </div>`;
            HTML +=   `</div>
                    </div>`;
        };
    };

    return HTML;
}

function Timetable_Scroll()
{
    if (_iWeekOffset === 0)
    {
        if (document.body.clientWidth >= 600)
        {
            const iWeekBeginDate = Week_GetPeriod(0)[0];
            for (let i = new Date().getDayOfWeek(); i < 7; i++)
            {
                const eDay = Timetable_GetDayElement(i + iWeekBeginDate);
                if (eDay)
                {
                    eDay.scrollIntoView();
                    break;
                };
            };
        }
        else
        {
            const eToday = Timetable_GetDayElement(_iToday);
            const eTomorrow = Timetable_GetDayElement(_iToday + 1);
            const iTimetableHeight = document.getElementById('Timetable').clientHeight;

            if (eToday)
            {
                if (eTomorrow)
                {
                    if (eToday.clientHeight + eTomorrow.clientHeight + 50 <= iTimetableHeight)
                        eTomorrow.scrollIntoView({block: 'end'});
                    else
                        eToday.scrollIntoView();
                }
                else
                {
                    if (eToday.clientHeight + 50 <= iTimetableHeight)
                        eToday.scrollIntoView({block: 'end'});
                    else
                        eToday.scrollIntoView();
                };
            }
            else if (eTomorrow)
            {
                if (eTomorrow.clientHeight + 50 <= iTimetableHeight)
                    eTomorrow.scrollIntoView({block: 'end'});
                else
                    eTomorrow.scrollIntoView();
            }
            else
            {
                const iWeekBeginDate = Week_GetPeriod(0)[0];
                let bBreak = false;
                for (let i = new Date().getDayOfWeek() + 2; i < 7; i++)
                {
                    const eDay = Timetable_GetDayElement(i + iWeekBeginDate);
                    if (eDay)
                    {
                        if (eDay.clientHeight + 50 <= iTimetableHeight)
                            eDay.scrollIntoView({block: 'end'});
                        else
                            eDay.scrollIntoView();
                            
                        bBreak = true;
                        break;
                    };
                };

                if (bBreak === false)
                {
                    eTimetable = document.getElementById('Timetable');
                    eTimetable.scrollTop = eTimetable.scrollHeight;
                };
            };
        };
    }
    else if (_iWeekOffset > 0)
    {
        document.getElementById('Timetable').scrollTop = 0;
    }
    else if (_iWeekOffset < 0)
    {
        eTimetable = document.getElementById('Timetable');
        eTimetable.scrollTop = eTimetable.scrollHeight;
    };
}