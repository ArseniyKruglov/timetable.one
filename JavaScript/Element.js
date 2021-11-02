function FocusDiv(eFocusing)   
{
    let temp_bFocus = document.createElement('button');
    eFocusing.insertBefore(temp_bFocus, eFocusing.firstElementChild);
    temp_bFocus.focus();
    temp_bFocus.remove();
}