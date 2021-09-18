function Timetable_Draw()
{
    document.getElementById('Timetable').innerHTML = Timetable_GetIHTML();
}

function Timetable_Focus()
{
    if (window.innerWidth <= 600)
    {
        let iToday = new Date().getDaysSince1970();

        if (_aTimetable[Week_DateToDayOfTimetable(iToday)].size !== 0)
            document.querySelector(`[onclick="DayDetails(${iToday})"]`).scrollIntoView({block: 'start'});
        else
            document.getElementById('Timetable').children[0].scrollIntoView({block: 'center'});
    }
    else
    {
        document.getElementById('Timetable').children[0].scrollIntoView({inline: 'center'});
    };
}

function Timetable_GetIHTML()
{
    let HTML = '';
    let iToday = new Date().getDaysSince1970();
    let iDate = iToday - new Date().getDayOfWeek() + _iWeekOffset * 7;

    for (let i = 0; i < 7; i++)
    {
        if (iDate >= _iBeginDate &&_aTimetable[Week_DateToDayOfTimetable(iDate)].size > 0)
        {
            let sDate = '';
            let tDate = DaysSince1970ToTime(iDate);
    
            let sDayOfWeek = tDate.toLocaleDateString(navigator.language, { weekday: 'short' });
            sDayOfWeek = sDayOfWeek.charAt(0).toUpperCase() + sDayOfWeek.slice(1);
            sDate += sDayOfWeek + ', ';
            
            if (tDate.getFullYear() === new Date().getFullYear())
                sDate += tDate.toLocaleString(navigator.language, { month: 'long', day: 'numeric' });
            else
                sDate += tDate.toLocaleString(navigator.language, { year: 'numeric', month: 'short', day: '2-digit' });



            let sDayClass = '';
            if (iDate === iToday)
                sDayClass = 'Today';
            else if (iDate === iToday + 1)
                sDayClass = 'Tomorrow';



            HTML += `<div class='${sDayClass}'>
                        <button onclick='DayDetails(${iDate})'>${sDate}</button>
                        <div>`;
            for (let loop_aLesson of _aTimetable[Week_DateToDayOfTimetable(iDate)])
                HTML +=    `<div>
                                <span>${loop_aLesson[0]}</span>
                                <button onclick='LessonDetails(${iDate}, ${loop_aLesson[0]});'>
                                    <span></span>
                                    <span>${loop_aLesson[1][0]}</span>
                                </button>
                            </div>`;
            HTML +=   `</div>
                    </div>`;
        };

        iDate++;
    };

    return HTML;
}