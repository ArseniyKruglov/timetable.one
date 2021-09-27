function Information_Draw()
{
    function GetTimetable(iDate)
    {
        let mTimetable = Timetable_GetDayTimetable(iDate);
        if (mTimetable === false)
            return false;

        let aTimetable = [];
        for (let loop_aLesson of mTimetable)
            if (_mAlarms.has(loop_aLesson[0]) === true)
                aTimetable.push([loop_aLesson[0], loop_aLesson[1][0], loop_aLesson[1][1]])
            else
                bLessonsWithoutAlarms = true;

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

        for (let loop_aAddedLesson of _oWeek['AddedLessons'])
            if (loop_aAddedLesson['Date'] === iDate)
                aTimetable.push([loop_aAddedLesson['LessonNumber'], loop_aAddedLesson['Subject']]);

        return aTimetable.sort((a, b) => { return a[0] > b[0]; });
    };


    function DoubleDigits(i)
    {
        if (i < 10)
            return `0${i}`;
        else
            return i;
    }

    function Timer(tDate)
    {
        return `<custom-timer time=${tDate.getTime()}></custom-timer>`;
    }

    function Difference(tDate00, tDate01)
    {
        let iTimeLeft = tDate01 - tDate00;

        let iHours = Math.floor((iTimeLeft / (1000 * 60 * 60)) % 24);
        let iMinutes = Math.floor((iTimeLeft / (1000 * 60)) % 60);

        return `<span>${iHours > 0 ? `${iHours} ${[(iHours === 1 ? 'hour' : 'hours'), ['час', 'часа', 'часов'][Language_RussianNumberDeclension(iHours)]]}` : ''} ${iMinutes} ${[(iMinutes === 1 ? 'minute' : 'minutes'), ['минута', 'минуты', 'минут'][Language_RussianNumberDeclension(iMinutes)]][_iLanguage]}</span>`
    }

    function Timeout(tDate)
    {
        setTimeout(Information_Draw, tDate - new Date().getTime());    
    }



    function BeforeLessons()
    {
        HTML +=    `<div>
                        Сегодня к ${Time_FormatTime(Alarm_Get(aTodayTimetable[0][0])[0])} на <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[0][0])}>${aTodayTimetable[0][1]}</a>${aTodayTimetable[0][2] ? ` (${aTodayTimetable[0][2]})` : ''}, осталось ${Timer(Alarm_Get(aTodayTimetable[0][0])[0])}
                    </div>`;

        Timeout(Alarm_Get(aTodayTimetable[0][0])[0]);
    }

    function OnLessons()
    {
        for (let i = 0; i < aTodayTimetable.length; i++)
        {
            if (Alarm_Get(aTodayTimetable[i][0])[0] <= new Date() && new Date() <= Alarm_Get(aTodayTimetable[i][0])[1])
            {
                HTML +=    `<div>
                                Сейчас <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[i][0])}>${aTodayTimetable[i][1]}</a>${aTodayTimetable[i][2] ? ` (${aTodayTimetable[i][2]})` : ''}, до конца ${Timer(Alarm_Get(aTodayTimetable[i][0])[1])}
                            </div>`;

                if (i + 1 < aTodayTimetable.length)
                    HTML +=    `<div>
                                    Затем перерыв ${Difference(Alarm_Get(aTodayTimetable[i][0])[1], Alarm_Get(aTodayTimetable[i + 1][0])[0])} и <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[i + 1][0])}>${aTodayTimetable[i + 1][1]}</a>${aTodayTimetable[i + 1][2] ? ` (${aTodayTimetable[i + 1][2]})` : ''} в ${Time_FormatTime(Alarm_Get(aTodayTimetable[i + 1][0])[0])}
                                </div>`;
                else
                    HTML += `<div>Затем свобода</div>`;

                Timeout(Alarm_Get(aTodayTimetable[i][0])[1]);

                break;
            };

            if (i + 1 < aTodayTimetable.length && Alarm_Get(aTodayTimetable[i][0])[1] <= new Date() && new Date() <= Alarm_Get(aTodayTimetable[i + 1][0])[0])
            {
                HTML +=    `<div>
                                Сейчас перерыв, до конца ${Timer(Alarm_Get(aTodayTimetable[i + 1][0])[0])}
                            </div>

                            <div>
                                Затем <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[i + 1][0])}>${aTodayTimetable[i + 1][1]}</a>${aTodayTimetable[i + 1][2] ? ` (${aTodayTimetable[i + 1][2]})` : ''} в ${Time_FormatTime(Alarm_Get(aTodayTimetable[i + 1][0])[0])}
                            </div>`;

                Timeout(Alarm_Get(aTodayTimetable[i + 1][0])[0]);

                break;
            };
        };
    }

    function AfterLessons()
    {
        let aTomorrowTimetable = GetTimetable(_iToday + 1);
        if (aTomorrowTimetable !== false && aTomorrowTimetable.length !== 0)
            HTML +=    `<div>
                            Завтра к 
                            ${Time_FormatTime(Alarm_Get(aTomorrowTimetable[0][0], _iToday + 1)[0])}
                            на
                            <a ${Timetable_GetLessonLinkAttributes(_iToday + 1, aTomorrowTimetable[0][0])}>${aTomorrowTimetable[0][1]}</a>,
                            осталось
                            ${Timer(Alarm_Get(aTomorrowTimetable[0][0], _iToday + 1)[0])}
                        </div>`;
        else
            HTML +=    `<div>Отдых</div>`;

        let tTomorrow = new Date();
        tTomorrow.setHours(24, 0, 0, 0);
        Timeout(tTomorrow);
    }



    let HTML = '';

    let bLessonsWithoutAlarms = false;
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
    if (bLessonsWithoutAlarms === true)
        HTML +=    `<div class='Caution'>
                        Занятия без звонков не учитываются
                    </div>`

    document.getElementById('Information').innerHTML = HTML;
}