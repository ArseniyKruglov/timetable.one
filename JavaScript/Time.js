Date.prototype.getDayOfWeek = function()
{
    return (this.getDay() + 6) % 7;
}

Date.prototype.getDaysSince1970 = function()
{
    return Math.floor((this.getTime() - this.getTimezoneOffset() * 60 * 1000) / 1000 / 60 / 60 / 24);
}

function DaysSince1970ToTime(iDaysSince1970)
{
    return new Date(iDaysSince1970 * 24 * 60 * 60 * 1000 + new Date().getTimezoneOffset());    
}