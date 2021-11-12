function FocusDiv(eTarget)   
{
    let temp_bFocus = document.createElement('button');
    eTarget.insertBefore(temp_bFocus, eTarget.firstElementChild);
    temp_bFocus.focus();
    temp_bFocus.remove();
}