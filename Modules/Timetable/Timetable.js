function Timetable_Draw()
{
    document.getElementById('Timetable').innerHTML = Timetable_GetIHTML();
    document.getElementById('Timetable').children[2].scrollIntoView({inline: 'center'});
    document.fonts.ready.then(() => {
        document.getElementById('Timetable').children[2].scrollIntoView({inline: 'center'});
    });
}

function Timetable_GetIHTML()
{
    let HTML = '';
    let iToday = new Date().getDaysSince1970();
    let iDate = iToday - new Date().getDayOfWeek() + (_iWeekOffset - 3) * 7;

    for (let iOffset = -3; iOffset < 2; iOffset++)
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
            if (iDate >= _iBeginDate &&_aTimetable[Week_DateToDayOfTimetable(iDate)].size > 0)
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
                for (let loop_aLesson of _aTimetable[Week_DateToDayOfTimetable(iDate)])
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