_aOverlays = [];

addEventListener('keydown', (Event) =>
{
    if (Event.key === 'Tab')
        dispatchEvent(new CustomEvent('focus-change'));
});



class Overlay
{
    constructor()
    {
        _aOverlays.push(this);

        this.Esc_Listener = (Event) =>
        {
            if (_aOverlays[_aOverlays.length - 1] === this)
                if (Event.code == 'Escape')
                    this.Close();
        };
        this.Focus_Listener = () =>
        {
            if (_aOverlays[_aOverlays.length - 1] === this)
                setTimeout(() =>
                {
                    if (!this.Element.querySelector(':focus') && !document.querySelector('.DropDown:focus-within'))
                        this.Focus();
                }, 0);
        };
        this.PopState_Listener = () =>
        {
            if (_aOverlays[_aOverlays.length - 1] === this)
                this.Close();
        };

        this.Animation = true;
    }

    Open()
    {
        this.Element = document.createElement('div');
        this.Element.className = 'Overlay' + (this.Animation ? ' Animation' : '');
        this.Element.innerHTML =   `<div></div>
                                    <div tabindex=0>
                                        <div></div>
                                    </div>`;
        this.Element.children[0].addEventListener('click', () => { this.Close(); });
        
        document.body.appendChild(this.Element);
        this.Callback_Open();

        this.LastFocus = document.activeElement;
        this.Focus();

        addEventListener('keydown', this.Esc_Listener);
        addEventListener('focus-change', this.Focus_Listener);
        addEventListener('popstate', this.PopState_Listener);
    }

    Close()
    {
        this.Element.remove();
        _aOverlays.pop();

        // Listeners
        removeEventListener('keydown', this.Esc_Listener);
        removeEventListener('focus-change', this.Focus_Listener);
        removeEventListener('popstate', this.PopState_Listener);

        // Focus
        if (_aOverlays.length)
            _aOverlays[_aOverlays.length - 1].Focus();
        else
            this.LastFocus.focus();

        // Link
        let sLink = '';
        if (_aOverlays.length)
            sLink = _aOverlays[_aOverlays.length - 1].Link;

        history.pushState('', '', '/' + _sURL + sLink);
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
        this._Link = sLink;
        this.Element.setAttribute('link', sLink);
        history.pushState('', '', '/' + _sURL + sLink);
    }

    get Link()
    {
        return this._Link;
    }

    GetUIElement(sSelector)
    {
        return this.Body.querySelector(sSelector);
    }

    GetUIElements(sSelector)
    {
        return this.Body.querySelectorAll(sSelector);
    }

    Focus()
    {
        this.Container.focus();
    }
}



function Overlay_IsOpened()
{
    return document.querySelector('.Overlay');
}