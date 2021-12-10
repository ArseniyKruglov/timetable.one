class Alarms
{
    constructor (mAlarms)
    {
        this.Alarms = mAlarms;
    }

    Get(iIndex, iDate = _iToday)
    {
        if (this.Empty)
        {
            return null;
        }
        else
        {
            const aAlarms = this.Alarms.get(iIndex);
            if (aAlarms)
            {
                const iTimezoneOffset = -180;       // Будет храниться в базе данных

                return  [
                            new Date((iDate * 24 * 60 + aAlarms[0] + iTimezoneOffset) * 60 * 1000),
                            new Date((iDate * 24 * 60 + aAlarms[1] + iTimezoneOffset) * 60 * 1000)
                        ];
            }
            else
            {
                return null;
            };
        };
    }

    get Empty()
    {
        return this.Alarms.size === 0;
    }
}