class Timer extends HTMLElement
{
    connectedCallback()
    {
        this.Time = parseInt(this.getAttribute('time'));
        this.Update();
        setInterval(() => { this.Update() }, 1000);
    }

    Update()
    {   
        const iTimeLeft = this.Time - new Date();

        if (iTimeLeft < 0)
        {
            this.innerHTML = 0;
        }
        else
        {
            const iSeconds = Math.floor((iTimeLeft / 1000) % 60);
            const iMinutes = Math.floor((iTimeLeft / (1000 * 60)) % 60);
            const iHours = Math.floor((iTimeLeft / (1000 * 60 * 60)) % 24);
            const iDays = Math.floor(iTimeLeft / (24 * 60 * 60 * 1000));


    
            let sClass = '';
            if (iDays > 0)
                sClass = 'Days';
            else if (iHours > 0)
                sClass = 'Hours';
    
            this.className = sClass;

            
    
            function DoubleDigits(i)
            {
                return ((i < 10) ? '0' : '') + i;
            }
    
            this.innerHTML = `${iDays > 0 ? `${iDays}:` : ''}${iDays > 0 || iHours > 0 ? `${DoubleDigits(iHours)}:` : ''}${DoubleDigits(iMinutes)}:${DoubleDigits(iSeconds)}`;
        };
    }
}

customElements.define('custom-timer', Timer);