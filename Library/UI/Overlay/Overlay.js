_aOverlays = [];

addEventListener('keydown', Event =>
{
    if (Event.key === 'Tab')
        dispatchEvent(new CustomEvent('focus-change'));
});



class Overlay
{
    constructor()
    {
        _aOverlays.push(this);

        this.Esc_Listener = Event =>
        {
            if (Event.code == 'Escape')
                this.Close();
        };
        this.Focus_Listener = () =>
        {
            setTimeout(() =>
            {
                if (!this.Element.querySelector(':focus') && !document.querySelector('.DropDown:focus-within'))
                    this.Focus();
            }, 0);
        };
        this.PopState_Listener = () => this.Close();

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
        this.Element.children[0].addEventListener('click', () => this.Close());

        document.body.appendChild(this.Element);
        this.Callback_Open();

        // Focus
        this.LastFocus = document.activeElement;
        this.Focus();

        // Listeners
        if (_aOverlays.length >= 2)
        {
            removeEventListener('keydown', _aOverlays[_aOverlays.length - 2].Esc_Listener);
            removeEventListener('focus-change', _aOverlays[_aOverlays.length - 2].Focus_Listener);
            removeEventListener('popstate', _aOverlays[_aOverlays.length - 2].PopState_Listener);
        };
        addEventListener('keydown', this.Esc_Listener);
        addEventListener('focus-change', this.Focus_Listener);
        addEventListener('popstate', this.PopState_Listener);
    }

    Remove()
    {
        if (this.Callback_Close)
            this.Callback_Close();

        this.Element.remove();
        _aOverlays.pop();

        // Listeners
        removeEventListener('keydown', this.Esc_Listener);
        removeEventListener('focus-change', this.Focus_Listener);
        removeEventListener('popstate', this.PopState_Listener);
        if (_aOverlays.length)
        {
            addEventListener('keydown', _aOverlays[_aOverlays.length - 1].Esc_Listener);
            addEventListener('focus-change', _aOverlays[_aOverlays.length - 1].Focus_Listener);
            addEventListener('popstate', _aOverlays[_aOverlays.length - 1].PopState_Listener);
        };

        // Focus
        if (_aOverlays.length)
            _aOverlays[_aOverlays.length - 1].Focus();
        else
            this.LastFocus.focus();
    }



    Close()
    {
        const sLowerLevel = _aOverlays[_aOverlays.length - 2] ? _aOverlays[_aOverlays.length - 2].Link : '';
        const sPrevious = _Router.History[_Router.History.length - 2] ? _Router.History[_Router.History.length - 2][0] : null;

        if (sPrevious === sLowerLevel)
            history.back();
        else
            _Router.Forward(sLowerLevel);
    }



    get Container()
    {
        return this.Element.children[1];
    }

    get Body()
    {
        return this.Element.children[1].children[0];
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



function Overlays_Opened()
{
    return document.querySelector('.Overlay');
}