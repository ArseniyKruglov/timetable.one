function Timetable_Draw()
{
    document.getElementById('Timetable').innerHTML = Timetable_GetIHTML();
    setTimeout(() => { document.getElementById('Timetable').children[2].scrollIntoView({inline: 'start'}); }, 0);
}

function Timetable_GetIHTML()
{
    let HTML = '';
    let iDate = new Date().getDaysSince1970() - new Date().getDayOfWeek() + (_iWeekOffset - 3) * 7;

    for (let iOffset = -3; iOffset < 4; iOffset++)
    {
        let sWeekClass = '';
        if (iOffset + _iWeekOffset < 0)
            sWeekClass = 'PastWeeks'
        else if (iOffset + _iWeekOffset === 0)
            sWeekClass = 'CurrentWeek';
        else if (iOffset + _iWeekOffset === 1)
            sWeekClass = 'NextWeek';

        HTML += `<div class='${sWeekClass}'>`;
        for (let i = -7; i < 0; i++)
        {
            if (iDate >= _iBeginDate &&_aTimetable[Time_DateToDayOfTimetable(iDate)].size > 0)
            {
                let sDayClass = '';
                if (iDate === new Date().getDaysSince1970())
                    sDayClass = 'Today';
                else if (iDate === new Date().getDaysSince1970() + 1)
                    sDayClass = 'Tomorrow';

                HTML += `<div class='${sDayClass}'>
                            <button onclick='DayDetails(${iDate})'>${DaysSince1970ToTime(iDate).getFormatedDate(true)}</button>
                            <div>`;
        
                for (let loop_aLesson of _aTimetable[Time_DateToDayOfTimetable(iDate)])
                    HTML +=    `<div onclick='LessonDetails(${loop_aLesson[0]}, ${iDate});'>
                                    <span>${loop_aLesson[0]}</span>
                                    <button>${loop_aLesson[1][0]}</button>
                                </div>`;
    
                HTML +=   `</div>
                        </div>`;
            };
    
            iDate++;
        };
        HTML += `</div>`;
    };

    return HTML;
}

function Time_DateToDayOfTimetable(iDate)
{
    return (iDate - _iBeginDate) % _aTimetable.length;
}

function Midnight()
{

}