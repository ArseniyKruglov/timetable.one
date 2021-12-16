function Language_Get()
{
    return (document.body.parentElement.getAttribute('lang') === 'RU') ? 1 : 0;
}