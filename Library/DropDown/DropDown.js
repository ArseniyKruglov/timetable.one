function DropDown(eButton, aActions)
{
    const eDropDown = document.createElement('div');
    eDropDown.className = 'DropDown';
    document.body.append(eDropDown);

    for (let loop_aAction of aActions)
    {
        const loop_eButton = document.createElement('button');
        loop_eButton.innerHTML =   `<custom-icon icon=${loop_aAction[0]}></custom-icon>
                                    <span>${loop_aAction[1]}</span>`;
        loop_eButton.addEventListener('click', loop_aAction[2])
        eDropDown.append(loop_eButton);
    };
    eDropDown.firstElementChild.focus();

    function Coordinates()
    {
        eDropDown.style.top = 0;
        eDropDown.style.left = 0;

        const BoundingClientRect = eButton.getBoundingClientRect();

        let fTop = BoundingClientRect.bottom  + 5;
        let fLeft = BoundingClientRect.right - eDropDown.clientWidth;

        if (fTop + eDropDown.clientHeight > window.innerHeight)
            fTop = window.innerHeight - eDropDown.clientHeight;
        if (fLeft + eDropDown.clientWidth > window.innerWidth)
            fLeft = window.innerWidth - eDropDown.clientWidth;
        if (fTop < 0)
            fTop = 0;
        if (fLeft < 0)
            fLeft = 0;

        eDropDown.style.top = fTop + 'px';
        eDropDown.style.left = fLeft + 'px';
    }
    Coordinates();
    addEventListener('resize', Coordinates);

    setTimeout(() =>
    {
        function Close()
        {
            eButton.focus();
            eDropDown.remove();
            removeEventListener('click', Close);
            removeEventListener('popstate', Close);
            removeEventListener('keydown', Escape);
            removeEventListener('resize', Coordinates);
        };

        function Escape(Event)
        {
            if (Event.key === 'Escape')
                Close();
        };

        addEventListener('click', Close);
        addEventListener('popstate', Close);
        addEventListener('keydown', Escape);
    }, 0);
}