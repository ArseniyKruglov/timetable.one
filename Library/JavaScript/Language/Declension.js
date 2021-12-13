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