function Week_Select()
{
    Timetable_Draw();
    Week_Draw();
}



function Week_Previous()
{
    _iWeekOffset--;
    Week_Select();    
}

function Week_Current()
{
    _iWeekOffset = 0;
    Week_Select();    
}

function Week_Next()
{
    _iWeekOffset++;
    Week_Select();    
}