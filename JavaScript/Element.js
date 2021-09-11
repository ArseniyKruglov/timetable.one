function FocusDiv(eFocusing)   
{
    let temp_bFocus = document.createElement('button');
    eFocusing.insertBefore(temp_bFocus, eFocusing.firstChild);
    temp_bFocus.focus();
    temp_bFocus.remove();
}

function GetElementZoom(eElement)
{
    let fZoom = 1;
    let eObserved = eElement;

    while (eObserved.parentElement && eObserved.parentElement !== document.body)
    {
        fZoom *= window.getComputedStyle(eObserved)['zoom'];
        eObserved = eObserved.parentElement;
    };

    return fZoom;    
}