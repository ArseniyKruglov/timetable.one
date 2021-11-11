function DropDown(eButton, aActions)
{
    eDropDown = document.createElement('div');
    eDropDown.className = 'DropDown';
    document.body.append(eDropDown);

    for (let loop_aAction of aActions)
    {
        let loop_eButton = document.createElement('button');
        loop_eButton.innerHTML =   `<svg ${_Icons[loop_aAction[0]]}><svg>
                                    <span>${loop_aAction[1]}</span>`;
        loop_eButton.addEventListener('click', loop_aAction[2])
        eDropDown.append(loop_eButton);
    };

    function Coordinates()
    {
        eDropDown.style.top = 0;
        eDropDown.style.left = 0;

        let BoundingClientRect = eButton.getBoundingClientRect();

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
    };
    Coordinates();
    addEventListener('resize', Coordinates);

    FocusDiv(eDropDown);

    setTimeout(() =>
    {
        function Close()
        {
            document.querySelector('.DropDown').remove();
            removeEventListener('click', Close);
            removeEventListener('keydown', Escape);
            removeEventListener('resize', Coordinates);
        };

        function Escape(Event)
        {
            if (Event.which === 27)
            Close();
        }

        addEventListener('click', Close);
        addEventListener('keydown', Escape);
    }, 0);
}