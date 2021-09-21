function Timetable_Draw()
{
    let eTimetable = document.getElementById('Timetable');
    
    eTimetable.innerHTML = Timetable_GetIHTML();

    if (_iWeekOffset === 0)
        eTimetable.className = 'Current';
    else if (_iWeekOffset === 1)
        eTimetable.className = 'Next';
    else if (_iWeekOffset < 0)
        eTimetable.className = 'Past';
    else
        eTimetable.className = '';
}

function Timetable_GetIHTML()
{
    let HTML = '';
    let iToday = new Date().getDaysSince1970();
    let iDate = iToday - new Date().getDayOfWeek() + _iWeekOffset * 7;

    for (let i = 0; i < 7; i++)
    {
        let mTodayTimetable = Timetable_GetDayTimetable(iDate);

        if (mTodayTimetable !== false && mTodayTimetable.size > 0)
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
            for (let loop_aLesson of mTodayTimetable)
                HTML +=    `<div>
                                <span>${loop_aLesson[0]}</span>
                                <a href='${location.pathname}?Date=${iDate}&LessonNumber=${loop_aLesson[0]}' onclick='event.preventDefault(); LessonDetails(${iDate}, ${loop_aLesson[0]});'>
                                    <span></span>
                                    <span>${loop_aLesson[1][0]}</span>
                                </a>
                            </div>`;
            HTML +=   `</div>
                    </div>`;
        };

        iDate++;
    };

    return HTML;
}



function Timetable_GetDayElement(iDate)
{
    let eDay = document.querySelector(`[onclick="DayDetails(${iDate})"]`);
    if (eDay)
        return eDay.parentElement;
};

function Timetable_GetLessonElement(iDate, iLessonNumber)
{
    let eLesson = document.querySelector(`[onclick="event.preventDefault(); LessonDetails(${iDate}, ${iLessonNumber});"]`);
    if (eLesson)
        return eLesson.parentElement;
};

function Timetable_GetLessonElements(iDate)
{
    let eDay = document.querySelector(`[onclick="DayDetails(${iDate})"]`);
    if (eDay)
        return Timetable_GetDayElement(iDate).children[1].children;
    else
        return [];
}