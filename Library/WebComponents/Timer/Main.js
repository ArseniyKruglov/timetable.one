class Timer extends HTMLElement
{
    connectedCallback()
    {
        this.Update();
        setInterval(() => { this.Update(); }, 1000);
    }

    Update()
    {
        let tDate = new Date(parseInt(this.getAttribute('time')));
        
        let iTimeLeft = tDate - new Date();

        let iSeconds = Math.floor((iTimeLeft / 1000) % 60);
        let iMinutes = Math.floor((iTimeLeft / (1000 * 60)) % 60);
        let iHours = Math.floor((iTimeLeft / (1000 * 60 * 60)) % 24);
        let iDays = Math.floor(iTimeLeft / (24 * 60 * 60 * 1000));

        let sClass = '';
        if (iDays > 0)
            sClass = 'Days';
        else if (iHours > 0)
            sClass = 'Hours';

        this.className = sClass;

        function DoubleDigits(i)
        {
            if (i < 10)
                return `0${i}`;
            else
                return i;
        }

        this.innerHTML = `${iDays > 0 ? `${iDays}:` : ''}${iDays > 0 || iHours > 0 ? `${DoubleDigits(iHours)}:` : ''}${DoubleDigits(iMinutes)}:${DoubleDigits(iSeconds)}`;
    }
}

customElements.define('custom-timer', Timer);