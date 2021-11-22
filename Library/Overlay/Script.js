_aOverlay_Escapes = [];
_aOverlay_Backs = [];


class Overlay
{
    constructor() {}

    Open()
    {
        this.eLastFocused = document.activeElement;

        this.Element = document.createElement('div');
        this.Element.className = 'Overlay';
        this.Element.innerHTML =   `<div></div>
                                    <div>
                                        <div></div>
                                    </div>`;
        this.Element.style.visibility = 'hidden';
        
        document.body.appendChild(this.Element);
        this.Callback_Open();
        this.Element.style.visibility = '';
        FocusDiv(this.Element);



        const Esc = this.Callback_Close || (() => { history.back(); });

        this.Element.children[0].addEventListener('click', Esc);

        _aOverlay_Escapes.push(event =>
        {
            if (event.code == 'Escape')
                Esc();
        });
        removeEventListener('keydown', _aOverlay_Escapes[_aOverlay_Escapes.length - 2]);
        addEventListener('keydown',  _aOverlay_Escapes[_aOverlay_Escapes.length - 1]);

        _aOverlay_Backs.push(() => { this.Close(); });

        window.onpopstate = _aOverlay_Backs[_aOverlay_Backs.length - 1];
    }

    Close()
    {
        this.Element.remove();

        removeEventListener('keydown', _aOverlay_Escapes.pop());

        _aOverlay_Backs.pop();
        window.onpopstate = _aOverlay_Backs[_aOverlay_Backs.length - 1];

        this.eLastFocused.focus();
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