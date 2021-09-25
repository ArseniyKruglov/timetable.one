function Language_RussianNumberDeclension(i)
{
    if (11 <= i % 100 && i % 100 <= 15)
        return 2;

    if (i % 10 === 1)
        return 0;

    if (2 <= i % 10 && i % 10 <= 4)
        return 1;
        
    return 2;
}

function Language_Get()
{
    let sLanguage = (window.navigator.userLanguage || window.navigator.language).toUpperCase();

    if (sLanguage.includes('RU') || sLanguage.includes('UA') || sLanguage.includes('BE') || sLanguage.includes('KK'))
        return 1;
    
    return 0;
}