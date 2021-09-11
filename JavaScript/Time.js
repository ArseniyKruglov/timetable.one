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

Date.prototype.getFormatedDate = function(bDayOfWeek)
{
    // if (this.getTime() !== this.getTime())
    //     return ['No due date', 'Без даты'][_iLanguage];



    // let iDelta = this.getDaysSince1970() - new Date().getDaysSince1970();

    // if (iDelta == -1)
    //     return ['Yesterday', 'Вчера'][_iLanguage];

    // if (iDelta == 0)
    //     return ['Today', 'Сегодня'][_iLanguage];
        
    // if (iDelta == 1)
    //     return ['Tomorrow', 'Завтра'][_iLanguage];


        
    let HTML = '';

    if (bDayOfWeek === true)
    {
        let sDayOfWeek = this.toLocaleDateString(navigator.language, { weekday: 'short' });
        sDayOfWeek = sDayOfWeek.charAt(0).toUpperCase() + sDayOfWeek.slice(1)
        HTML += sDayOfWeek + ', ';
    };
    
    if (this.getFullYear() == new Date().getFullYear())
        HTML += this.toLocaleString(navigator.language, { month: 'short', day: 'numeric' });
    else
        HTML += this.toLocaleString(navigator.language, { year: 'numeric', month: 'long', day: '2-digit' });

    return HTML;
}