class Timetable
{
    constructor()
    {
        function GetInitialWeekOffset()
        {
            if (Timetable_GetLessonIndexes(_iToday).length !== 0)
                return 0;
                
            let iDayOfWeek = new Date().getDayOfWeek();
            let iLastStudyDay;
            for (let i = _iToday - iDayOfWeek + 6; i >= _iToday - iDayOfWeek; i--)
                if (Timetable_GetLessonIndexes(i).length !== 0)
                {
                    iLastStudyDay = i;
                    break;
                };

            if (iLastStudyDay !== undefined)
            {
                if (iLastStudyDay < _iToday)
                    return 1;
                else    
                    return 0;
            }
            else
            {
                for (let i = _iToday - iDayOfWeek + 6 + 7; i >= _iToday - iDayOfWeek + 7; i--)
                    if (Timetable_GetLessonIndexes(i).length !== 0)
                        return 1;

                return 0;
            };
        }

        this.WeekOffset_Initial = GetInitialWeekOffset();
        this.WeekOffset = this.WeekOffset_Initial;

        this.Body = document.getElementById('Timetable');
    }

    DrawBody()
    {
        let HTML = '';

        const aWeekPeriod = this.GetWeekPeriod(this.WeekOffset);
        for (let iDate = aWeekPeriod[0]; iDate <= aWeekPeriod[1]; iDate++)
        {
            const mTodayTimetable = this.GetDayTimetable(iDate);
    
            if (mTodayTimetable !== false && mTodayTimetable.size > 0)
            {
                let sDayClass;
                if (iDate === _iToday)
                    sDayClass = 'Today';
                else if (iDate === _iToday + 1)
                    sDayClass = 'Tomorrow';
    
                HTML += `<div class='Day ${sDayClass || ''}'>
                            <a href='${location.pathname}?Date=${iDate}' onclick="event.preventDefault(); Route_Forward('/Day?Date=${iDate}');">
                                <div>${Date_Format(Time_From1970(iDate))}</div>
                                <div class='EmptyHidden'>${Timetable_GetPeriod(iDate)}</div>
                            </a>
    
                            <div>`;
                for (let loop_aLesson of mTodayTimetable)
                    HTML +=    `<div class='Lesson'>
                                    <span>${loop_aLesson[0]}</span>
                                    <a ${Timetable_GetLessonLinkAttributes(iDate, loop_aLesson[0])}>
                                        <span></span>
                                        <span>${loop_aLesson[1]['Title']}</span>
                                    </a>
                                    <span></span>
                                </div>`;
                HTML +=   `</div>
                        </div>`;
            };
        };
    
        this.Body.innerHTML = HTML;
    }



    GetWeekPeriod(iWeekOffset)
    {
        const iWeekBeginDate = _iToday - new Date().getDayOfWeek() + iWeekOffset * 7;
        return [iWeekBeginDate, iWeekBeginDate + 6];
    }

    GetDayTimetable(iDate)
    {
        for (let loop_aTimetable of _aTimetable)
            if ((loop_aTimetable[1]['Begin'] || Number.MIN_SAFE_INTEGER) <= iDate && iDate <= (loop_aTimetable[1]['End'] || Number.MAX_SAFE_INTEGER))
                return loop_aTimetable[1]['Lessons'][(iDate - loop_aTimetable[1]['AnchorDate'] % loop_aTimetable[1]['Days'].length + loop_aTimetable[1]['Days'].length) % loop_aTimetable[1]['Days'].length];   

        return false;
    }
}