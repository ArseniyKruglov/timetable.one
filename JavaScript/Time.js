Date.prototype.getDayOfWeek = function()
{
    return (this.getDay() + 6) % 7;
}

Date.prototype.get1970 = function()
{
    return Math.floor((this.getTime() - this.getTimezoneOffset() * 60 * 1000) / 1000 / 60 / 60 / 24);
}

function Time_From1970(iDaysSince1970)
{
    return new Date(iDaysSince1970 * 24 * 60 * 60 * 1000);
}

function Date_Format(tDate, bLong)
{
    let HTML = '';

    let sDayOfWeek = tDate.toLocaleDateString(navigator.language, { weekday: (bLong ? 'long' : 'short') });
    sDayOfWeek = sDayOfWeek.charAt(0).toUpperCase() + sDayOfWeek.slice(1);
    HTML += sDayOfWeek + ', ';
    
    if (tDate.getFullYear() === new Date().getFullYear())
        HTML += tDate.toLocaleString(navigator.language, {month: 'long', day: 'numeric'});
    else
        HTML += tDate.toLocaleString(navigator.language, {year: 'numeric', month: 'short', day: '2-digit'});

    return HTML;
}

function Date_Format_Short(tDate)
{
    return tDate.toLocaleString([], {month: 'numeric', day: 'numeric'});
}

function Time_Format(tDate)
{
    return tDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}