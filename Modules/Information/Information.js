function Information_Draw()
{
    // TO DO: учет замен и, конечно, оптимизация



    function Timer(tDate)
    {
        return new Date(tDate - new Date() + new Date().getTimezoneOffset() * 60 * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }



    function BeforeLessons()
    {
        HTML += `Сегодня к ${_mAlarms.get(aTodayTimetable[0][0])[0].toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} на ${aTodayTimetable[0][1][0]} (${aTodayTimetable[0][1][1]}), осталось ${Timer(_mAlarms.get(aTodayTimetable[0][0])[0])}`;
    }

    function OnLessons()
    {
        for (let i = 0; i < aTodayTimetable.length; i++)
        {
            if (i + 1 < aTodayTimetable.length)
            {
                HTML += `Затем ${aTodayTimetable[i + 1][1][0]} (${aTodayTimetable[i + 1][1][1]}) в ${_mAlarms.get(aTodayTimetable[i][0])[0].toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                
                if (_mAlarms.get(aTodayTimetable[i][0])[1] <= new Date() && new Date() <= _mAlarms.get(aTodayTimetable[i + 1][0])[0])
                {
                    HTML += 'Сейчас перемена';
                    break;
                };
            }

            if (_mAlarms.get(aTodayTimetable[i][0])[0] <= new Date() && new Date() <= _mAlarms.get(aTodayTimetable[i][0])[1])
            {
                HTML += `Сейчас ${aTodayTimetable[i][1][0]} (${aTodayTimetable[i][1][1]}), до конца ${Timer(_mAlarms.get(aTodayTimetable[i][0])[1])}`;
                break;
            };
        };
    }

    function AfterLessons()
    {
        let mTomorrowTimetable = Timetable_GetDayTimetable(new Date().getDaysSince1970() + 1);
        if (mTomorrowTimetable !== false && mTomorrowTimetable.size !== 0)
        {
            let aTomorrowTimetable = [...Timetable_GetDayTimetable(new Date().getDaysSince1970() + 1)];
            HTML += `Завтра к ${_mAlarms.get(aTomorrowTimetable[0][0])[0].toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} на ${aTomorrowTimetable[0][1][0]} (${aTomorrowTimetable[0][1][1]}), осталось ${Timer(_mAlarms.get(aTomorrowTimetable[0][0])[0])}`;
        }
        else
        {
            HTML += 'Отдых';
        };
    }



    let HTML = '';
    let aTodayTimetable = [...Timetable_GetDayTimetable(new Date().getDaysSince1970())];
    if (aTodayTimetable !== false && aTodayTimetable.size !== 0)
    {
        if (new Date() < _mAlarms.get(aTodayTimetable[0][0])[0])
            BeforeLessons();
        else if (new Date() > _mAlarms.get(aTodayTimetable[aTodayTimetable.length - 1][0])[1])
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