function Alarm_Get(iLessonNumber, iDate = _iToday)
{
    let aAlarms = _mAlarms.get(iLessonNumber);
    if (aAlarms !== undefined)
    {
        let iTimezoneOffset = new Date().getTimezoneOffset();
        return  [
                    new Date((iDate * 24 * 60 + aAlarms[0] + iTimezoneOffset * 2) * 60 * 1000),
                    new Date((iDate * 24 * 60 + aAlarms[1] + iTimezoneOffset * 2) * 60 * 1000)
                ];
    };
}