function Tab_Select(iTabIndex)
{
    let aTabs = document.querySelector('main').children;
    for (let i = 0; i < aTabs.length; i++)
        aTabs[i].hidden = (i !== iTabIndex);

    let aButtons = document.querySelector('nav').children;
    for (let i = 0; i < aButtons.length; i++)
        if (i === iTabIndex)
            aButtons[i].classList.add('Selected');
        else
            aButtons[i].classList.remove('Selected');
}