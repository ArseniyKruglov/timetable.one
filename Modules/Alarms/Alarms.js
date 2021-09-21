function Alarms_MinutesToTime(iMinutes)
{
    let tTime = new Date();
    tTime.setHours(0, iMinutes + tTime.getTimezoneOffset(), 0, 0);
    return tTime; 
}