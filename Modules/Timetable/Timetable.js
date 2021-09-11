function Timetable_Draw()
{
    document.getElementById('Timetable').innerHTML = Timetable_GetIHTML();
    setTimeout(() => { document.getElementById('Timetable').children[2].scrollIntoView({inline: 'center'}); }, 0);
}

function Timetable_GetIHTML()
{
    let HTML = '';
    let iToday = new Date().getDaysSince1970();
    let iDate = iToday - new Date().getDayOfWeek() + (_iWeekOffset - 2) * 7;

    for (let iOffset = -2; iOffset < 4; iOffset++)
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
                let sDate = '';
                let tDate = DaysSince1970ToTime(iDate);
        
                let sDayOfWeek = tDate.toLocaleDateString(navigator.language, { weekday: 'short' });
                sDayOfWeek = sDayOfWeek.charAt(0).toUpperCase() + sDayOfWeek.slice(1);
                sDate += sDayOfWeek + ', ';
                
                if (tDate.getFullYear() === new Date().getFullYear())
                    sDate += tDate.toLocaleString(navigator.language, { month: 'short', day: 'numeric' });
                else
                    sDate += tDate.toLocaleString(navigator.language, { year: 'numeric', month: 'long', day: '2-digit' });



                let sDayClass = '';
                if (iDate === iToday)
                    sDayClass = 'Today';
                else if (iDate === iToday + 1)
                    sDayClass = 'Tomorrow';



                HTML += `<div class='${sDayClass}'>
                            <button onclick='DayDetails(${iDate})'>${sDate}</button>
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