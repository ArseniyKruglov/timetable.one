_aOverlays = {};
_afOverlay_Escapes = [];

function Overlay_Open(sName, Callback_New, Callback_Unhide, Callback_Close)
{
    window._eOverlay_LastFocusedElement = document.activeElement;

    if (!_aOverlays[sName])
    {
        let HTML, e;

        HTML = `<div></div>
                <div id='${sName}Container'>
                    <div id='${sName}'></div>
                </div>`;

        e = document.createElement('div');
        e.className = 'Overlay';
        e.innerHTML = HTML;
        e.children[0].addEventListener('click', Callback_Close);
        e.style.visibility = 'hidden';
        _aOverlays[sName] = [true, e];
        document.body.appendChild(e);
        Callback_New();
        e.removeAttribute('style');
        FocusDiv(e);
        _afOverlay_Escapes.push(event =>
        {
            if (event.code == 'Escape')
                Callback_Close();
        });
        document.removeEventListener('keydown', _afOverlay_Escapes[_afOverlay_Escapes.length - 2]);
        document.addEventListener('keydown', _afOverlay_Escapes[_afOverlay_Escapes.length - 1]);
    }
    else
    {
        if (Callback_Unhide)
            Callback_Unhide();
        _aOverlays[sName][1].style.visibility = '';
        _aOverlays[sName][1].children[0].hidden = false;
        _aOverlays[sName][0] = true;
    }
}

function Overlay_Hide(sName)
{
    _aOverlays[sName][1].style.visibility = 'hidden';
    _aOverlays[sName][1].children[0].hidden = true;
    _aOverlays[sName][0] = false;
    document.removeEventListener('keydown', _afOverlay_Escapes.pop());
    document.addEventListener('keydown', _afOverlay_Escapes[_afOverlay_Escapes.length - 1]);
    if (window._eOverlay_LastFocusedElement)
        _eOverlay_LastFocusedElement.focus();
}

function Overlay_Remove(sName)
{
    _aOverlays[sName][1].remove();
    _aOverlays[sName] = undefined;
    document.removeEventListener('keydown', _afOverlay_Escapes.pop());
    document.addEventListener('keydown', _afOverlay_Escapes[_afOverlay_Escapes.length - 1]);
    if (window._eOverlay_LastFocusedElement)
        _eOverlay_LastFocusedElement.focus();
}