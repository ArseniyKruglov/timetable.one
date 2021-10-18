function DropDown(ebButton, HTML, sID)
{
    if (window._eNotes_Details_DropDown === undefined)
    {
        window._eNotes_Details_DropDown = document.createElement('div');
        if (sID !== undefined)
            _eNotes_Details_DropDown.id = sID;
        _eNotes_Details_DropDown.className = 'DropDown';
        _eNotes_Details_DropDown.innerHTML = HTML;
        document.body.append(_eNotes_Details_DropDown);

        function DropDown_Coordinates()
        {
            _eNotes_Details_DropDown.style.top = 0;
            _eNotes_Details_DropDown.style.left = 0;

            let BoundingClientRect = ebButton.getBoundingClientRect();

            let fTop = BoundingClientRect.bottom  + 5;
            let fLeft = BoundingClientRect.right - _eNotes_Details_DropDown.clientWidth;

            if (fTop + _eNotes_Details_DropDown.clientHeight > window.innerHeight)
                fTop = window.innerHeight - _eNotes_Details_DropDown.clientHeight;
            if (fLeft < 0)
                fLeft = 0;
            if (fTop < 0)
                fTop = 0;

            _eNotes_Details_DropDown.style.top = fTop + 'px';
            _eNotes_Details_DropDown.style.left = fLeft + 'px';
        };
        DropDown_Coordinates();
        addEventListener('resize', DropDown_Coordinates);

        FocusDiv(_eNotes_Details_DropDown);
    
        setTimeout(() =>
        {
            function DropDown_Close(event)
            {
                let bClose = true;
    
                // for (loop_eElement of document.querySelectorAll('.DropDown *'))
                //     if (loop_eElement === event.target)
                //     {
                //         bClose = false;
                //         break;
                //     };
    
                if (bClose)
                {
                    document.querySelector('.DropDown').remove();
                    removeEventListener('click', DropDown_Close);
                    removeEventListener('resize', DropDown_Coordinates);
                    delete _eNotes_Details_DropDown;
                };
            };
    
            addEventListener('click', DropDown_Close);
        }, 0);
    };
}

function DropDown_GetActionsHTML(aActions)
{
    let HTML =  `<div class='DropDown_Actions'>`;
    for (let loop_aAction of aActions)
        HTML += `<button onclick='${loop_aAction[2]}'>
                    <svg ${_Icons[loop_aAction[0]]}><svg>
                    <span>${loop_aAction[1]}</span>
                 </button>`;
    HTML +=     `</div>`;

    return HTML;
}