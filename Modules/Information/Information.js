function GetTimetable(iDate)
{
    let mTimetable = Timetable_GetDayTimetable(iDate);
    if (mTimetable === false)
        return false;

    let aTimetable = [];
    for (let loop_aLesson of mTimetable)
        aTimetable.push([loop_aLesson[0], loop_aLesson[1][0], loop_aLesson[1][1]]);

    for (let loop_oReplacement of _oWeek['Replacements'])
        if (loop_oReplacement['Date'] === iDate)
            for (let i = 0; i < aTimetable.length; i++)
                if (aTimetable[i][0] === loop_oReplacement['LessonNumber'])
                {
                    if (loop_oReplacement['Replacement'] === '')
                        aTimetable.splice(i, 1);
                    else
                        aTimetable[i][1] = loop_oReplacement['Replacement'];
                        
                    break;
                };

    return aTimetable;
};

function Format(tDate)
{
    return tDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}



function Information_Draw()
{
    function Timer(tDate)
    {
        function DoubleDigits(i)
        {
            if (i < 10)
                return `0${i}`;
            else
                return i;
        }

        let iTimeLeft = tDate - new Date();

        let iSeconds = Math.floor((iTimeLeft / 1000) % 60);
        let iHours = Math.floor((iTimeLeft / (1000 * 60 * 60)) % 24);
        let iMinutes = Math.floor((iTimeLeft / (1000 * 60)) % 60);

        return `<span class='Timer ${iHours > 0 ? 'Hours' : ''}'>${iHours > 0 ? `${DoubleDigits(iHours)}:` : ''}${DoubleDigits(iMinutes)}:${DoubleDigits(iSeconds)}</span>`
    }



    function BeforeLessons()
    {
        HTML += `<div>
                    Сегодня к
                    ${Format(Alarm_Get(aTodayTimetable[0][0])[0])}
                    на
                    <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[0][0])}>${aTodayTimetable[0][1]}</a>
                    (${aTodayTimetable[0][2]}),
                    осталось
                    ${Timer(Alarm_Get(aTodayTimetable[0][0])[0])}
                 </div>`;
    }

    function OnLessons()
    {
        for (let i = 0; i < aTodayTimetable.length; i++)
        {
            if (Alarm_Get(aTodayTimetable[i][0])[0] <= new Date() && new Date() <= Alarm_Get(aTodayTimetable[i][0])[1])
            {
                HTML += `<div>
                            Сейчас
                            <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[i][0])}>${aTodayTimetable[i][1]}</a>
                            (${aTodayTimetable[i][2]}),
                            до конца
                            ${Timer(Alarm_Get(aTodayTimetable[i][0])[1])}
                         </div>`;

                if (i + 1 < aTodayTimetable.length)
                    HTML += `<div>
                                Затем
                                <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[i + 1][0])}>${aTodayTimetable[i + 1][1]}</a>
                                (${aTodayTimetable[i + 1][2]})
                                в
                                ${Format(Alarm_Get(aTodayTimetable[i + 1][0])[0])}
                             </div>`;
                else
                    HTML += `<div>Затем свобода</div>`;

                break;
            };

            if (i + 1 < aTodayTimetable.length && Alarm_Get(aTodayTimetable[i][0])[1] <= new Date() && new Date() <= Alarm_Get(aTodayTimetable[i + 1][0])[0])
            {
                HTML += `<div>
                            Сейчас перемена, до конца
                            ${Timer(Alarm_Get(aTodayTimetable[i + 1][0])[0])}
                         </div>

                         <div>
                            Затем
                            <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[i + 1][0])}>${aTodayTimetable[i + 1][1]}</a>
                            (${aTodayTimetable[i + 1][2]})
                            в
                            ${Format(Alarm_Get(aTodayTimetable[i + 1][0])[0])}
                         <div>`;

                break;
            };
        };
    }

    function AfterLessons()
    {
        let aTomorrowTimetable = GetTimetable(_iToday + 1);
        if (aTomorrowTimetable !== false && aTomorrowTimetable.length !== 0)
            HTML += `<div>
                        Завтра к 
                        ${Format(Alarm_Get(aTomorrowTimetable[0][0], _iToday + 1)[0])}
                        на
                        <a ${Timetable_GetLessonLinkAttributes(_iToday + 1, aTomorrowTimetable[0][0])}>${aTomorrowTimetable[0][1]}</a>,
                        осталось
                        ${Timer(Alarm_Get(aTomorrowTimetable[0][0], _iToday + 1)[0])}
                     </div>`;
        else
            HTML += `<div>Отдых</div>`;
    }



    let HTML = '';
    let aTodayTimetable = GetTimetable(_iToday);
    if (aTodayTimetable !== false && aTodayTimetable.length !== 0)
    {
        if (new Date() < Alarm_Get(aTodayTimetable[0][0])[0])
            BeforeLessons();
        else if (new Date() > Alarm_Get(aTodayTimetable[aTodayTimetable.length - 1][0])[1])
            AfterLessons();
        else
            OnLessons();
    }
    else
    {
        AfterLessons();
    };
    document.getElementById('Information').innerHTML = HTML;
}