function Alarm_Get(iLessonNumber, iDate = _iToday)
{
    let aAlarms = _mAlarms.get(iLessonNumber);
    if (aAlarms)
    {
        let iTimezoneOffset = new Date().getTimezoneOffset() - 3 * 60;      // To do
        return  [
                    new Date((iDate * 24 * 60 + aAlarms[0] + iTimezoneOffset) * 60 * 1000),
                    new Date((iDate * 24 * 60 + aAlarms[1] + iTimezoneOffset) * 60 * 1000)
                ];
    }
    else
    {
        return null;
    };
}