Date.prototype.getDayOfWeek = function()
{
    return (this.getDay() + 6) % 7;
}



function DateToInt(tDate)
{
    return Math.ceil(new Date(tDate).setHours(0, 0, 0, 0) / 1000 / 60 / 60 / 24);
}

function IntToDate(iDaysSince1970)
{
    return new Date(iDaysSince1970 * 24 * 60 * 60 * 1000);
}

function Date_ToWeek(iDate)
{
    return Math.floor(((DateToInt(new Date(0)) + 3) + iDate) / 7);
}



function Date_Format(tDate, bLong)
{
    let HTML = '';

    let sDayOfWeek = tDate.toLocaleDateString(navigator.language, { weekday: (bLong ? 'long' : 'short') });
    sDayOfWeek = sDayOfWeek.charAt(0).toUpperCase() + sDayOfWeek.slice(1);
    HTML += sDayOfWeek + ', ';

    if (tDate.getFullYear() === new Date().getFullYear())
        HTML += tDate.toLocaleString(navigator.language, { month: 'long', day: 'numeric' });
    else
        HTML += tDate.toLocaleString(navigator.language, { year: 'numeric', month: 'short', day: '2-digit' });

    return HTML;
}

function Date_Format_Short(tDate, bForceYear)
{
    if (bForceYear === true)
        return tDate.toLocaleString([], { year: '2-digit', month: 'numeric', day: 'numeric' });
    else
        return tDate.toLocaleString([], { month: 'numeric', day: 'numeric' });
}

function Time_Format(tDate)
{
    return tDate.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
}