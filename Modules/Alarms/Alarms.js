function Alarms_MinutesToTime(iMinutes)
{
    let tTime = new Date();
    tTime.setHours(0, iMinutes + tTime.getTimezoneOffset(), 0, 0);
    return tTime; 
}

function Alarms_Draw()
{
    let aTodayTimetable = [...Timetable_GetDayTimetable(new Date().getDaysSince1970())];

    if (aTodayTimetable.length !== 0)
    {
        console.log('Начало занятий: ' + _mAlarms.get(aTodayTimetable[0][0])[0]);
        
        for (let i = 0; i < aTodayTimetable.length; i++)
        {
            if (_mAlarms.get(aTodayTimetable[i][0])[0] <= new Date() && new Date() <= _mAlarms.get(aTodayTimetable[i][0])[1])
            {
                console.log('Сейчас урок');
            };
        };

        console.log('Конец занятий: ' + _mAlarms.get(aTodayTimetable[aTodayTimetable.length - 1][0])[1]);
    }
    else
    {
        console.log('Отдых')
    };
}

setInterval(Alarms_Draw, 1000);