_aOverlay_Escapes = [];
_aOverlay_Backs = [];


class Overlay
{
    constructor()
    {
        this.Animation = true;
    }

    Open()
    {
        for (let loop_eElement of document.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex], [contentEditable=true]'))
            loop_eElement.setAttribute('tabindex', '-1');

        this.eLastFocused = document.activeElement;

        this.Element = document.createElement('div');
        this.Element.className = 'Overlay' + (this.Animation ? ' Animation' : '');
        this.Element.innerHTML =   `<div></div>
                                    <div>
                                        <div></div>
                                    </div>`;
        
        document.body.appendChild(this.Element);
        this.Callback_Open();
        FocusDiv(this.Element);



        this.Element.children[0].addEventListener('click', () => { this.Close(); });

        _aOverlay_Escapes.push(event =>
        {
            if (event.code == 'Escape')
                this.Close();
        });
        removeEventListener('keydown', _aOverlay_Escapes[_aOverlay_Escapes.length - 2]);
        addEventListener('keydown',  _aOverlay_Escapes[_aOverlay_Escapes.length - 1]);

        _aOverlay_Backs.push(() => { this.Close(true); });
        window.onpopstate = _aOverlay_Backs[_aOverlay_Backs.length - 1];

        _aHistory.push(location.pathname.replace('/' + _sURL, '') + location.search);
    }

    Close(bFromPopState)
    {
        this.Element.remove();
        this.eLastFocused.focus();
        removeEventListener('keydown', _aOverlay_Escapes.pop());
        for (let loop_eElement of document.querySelectorAll('body > :not(.Overlay:last-of-type) *'))
            loop_eElement.removeAttribute('tabindex');



        if (!bFromPopState)
        {
            const eOverlay = document.querySelector('.Overlay');
            let sLink = '';
            if (eOverlay)
                sLink = eOverlay.getAttribute('link');
    
            if (sLink === _aHistory[_aHistory.length - 2])
                history.back();
            else
                history.pushState('', '', '/' + _sURL + sLink);
        };

        _aOverlay_Backs.pop();
        setTimeout(() =>
        {
            window.onpopstate = _aOverlay_Backs[_aOverlay_Backs.length - 1];
            _aHistory.push(location.pathname.replace('/' + _sURL, '') + location.search);
        }, 0);
    }



    get Container()
    {
        return this.Element.children[1];
    }

    get Body()
    {
        return this.Element.children[1].children[0];
    }

    set Link(sLink)
    {
        this.Element.setAttribute('link', sLink);
        history.pushState('', '', '/' + _sURL + sLink);
    }

    GetUIElement(sSelector)
    {
        return this.Body.querySelector(sSelector);
    }

    GetUIElements(sSelector)
    {
        return this.Body.querySelectorAll(sSelector);
    }
}



function Overlay_IsOpened()
{
    return document.querySelector('.Overlay');
}