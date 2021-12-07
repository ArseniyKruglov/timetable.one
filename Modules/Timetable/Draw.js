function Timetable_Scroll(bSmooth)
{
    const eTimetable = document.getElementById('Timetable');
    const eTimetableScroll = document.getElementById('TimetableScroll');


    
    if (_iWeekOffset === 0)
    {
        if (document.body.clientWidth >= 600)
        {
            const iWeekBeginDate = Week_GetPeriod(0)[0];
            for (let i = new Date().getDayOfWeek(); i < 7; i++)
            {
                const eDay = Timetable_GetDayElement(i + iWeekBeginDate);
                if (eDay)
                {
                    eDay.scrollIntoView({inline: 'center', behavior: (bSmooth ? 'smooth' : 'auto')});
                    break;
                };
            };
        }
        else
        {
            const eToday = Timetable_GetDayElement(_iToday);
            const eTomorrow = Timetable_GetDayElement(_iToday + 1);
            const iTimetableHeight = eTimetableScroll.clientHeight;



            if (eToday === eTimetable.firstElementChild)
            {
                eTimetableScroll.scrollTo({top: 0, behavior: (bSmooth ? 'smooth' : 'auto')});
            }
            else if (eToday === eTimetable.lastElementChild)
            {
                eTimetableScroll.scrollTo({top: eTimetable.scrollHeight, behavior: (bSmooth ? 'smooth' : 'auto')});
            }
            else
            {
                if (eToday)
                {
                    if (eTomorrow)
                    {
                        if (eToday.clientHeight + eTomorrow.clientHeight + 50 <= iTimetableHeight)
                            eTomorrow.scrollIntoView({block: 'end', behavior: (bSmooth ? 'smooth' : 'auto')});
                        else
                            eToday.scrollIntoView({behavior: (bSmooth ? 'smooth' : 'auto')});
                    }
                    else
                    {
                        if (eToday.clientHeight + 50 <= iTimetableHeight)
                            eToday.scrollIntoView({block: 'end', behavior: (bSmooth ? 'smooth' : 'auto')});
                        else
                            eToday.scrollIntoView({behavior: (bSmooth ? 'smooth' : 'auto')});
                    };
                }
                else if (eTomorrow)
                {
                    if (eTomorrow.clientHeight + 50 <= iTimetableHeight)
                        eTomorrow.scrollIntoView({block: 'end', behavior: (bSmooth ? 'smooth' : 'auto')});
                    else
                        eTomorrow.scrollIntoView({behavior: (bSmooth ? 'smooth' : 'auto')});
                }
                else
                {
                    const iWeekBeginDate = Week_GetPeriod(0)[0];
                    let bBreak = false;
                    for (let i = new Date().getDayOfWeek() + 2; i < 7; i++)
                    {
                        const eDay = Timetable_GetDayElement(i + iWeekBeginDate);
                        if (eDay)
                        {
                            if (eDay.clientHeight + 50 <= iTimetableHeight)
                                eDay.scrollIntoView({block: 'end', behavior: (bSmooth ? 'smooth' : 'auto')});
                            else
                                eDay.scrollIntoView({behavior: (bSmooth ? 'smooth' : 'auto')});
                                
                            bBreak = true;
                            break;
                        };
                    };
    
                    if (bBreak === false)
                        eTimetableScroll.scrollTo({top: eTimetable.scrollHeight, behavior: (bSmooth ? 'smooth' : 'auto')});
                };
            };
        };
    }
    else if (_iWeekOffset > 0)
    {
        eTimetableScroll.scrollTo({top: 0, behavior: (bSmooth ? 'smooth' : 'auto')});
    }
    else if (_iWeekOffset < 0)
    {
        eTimetableScroll.scrollTo({top: eTimetable.scrollHeight, behavior: (bSmooth ? 'smooth' : 'auto')});
    };
}

function Timetable_Height(bAnimation)
{
    const eHeight = document.getElementById('TimetableHeight');

    if (document.body.clientWidth >= 600)
    {
        const eScroll = document.getElementById('TimetableScroll');
    
        if (!_aHeights[_iWeekOffset])
            _aHeights[_iWeekOffset] = eScroll.scrollHeight;
        const iInitialHeight = bAnimation ? document.getElementById('TimetableHeight').clientHeight - 10 : null;
        const iInitialWeekOffset = _iWeekOffset;
    
    
        eHeight.style.height = '';
        eHeight.style.transition = '';
    
        for (let i = -3; i < 3; i++)
            if (i !== 0 && !_aHeights[iInitialWeekOffset + i])
            {
                _iWeekOffset = iInitialWeekOffset + i;
                Week_Select();
    
                _aHeights[_iWeekOffset] = eScroll.scrollHeight;
            };
    
        _iWeekOffset = iInitialWeekOffset;
        Week_Select();
    
        let iMaxHeight = Math.max(_aHeights[_iWeekOffset - 3], _aHeights[_iWeekOffset - 2], _aHeights[_iWeekOffset - 1], _aHeights[_iWeekOffset], _aHeights[_iWeekOffset + 1], _aHeights[_iWeekOffset + 2]);
    
        if (bAnimation === true)
        {
            eHeight.style.height = Math.max(iInitialHeight, (_aHeights[_iWeekOffset] + 5)) + 'px';
    
            setTimeout(() =>
            {
                eHeight.style.transition = 'height 500ms';
                
                setTimeout(() =>
                {
                    eHeight.style.height = (iMaxHeight + 75) + 'px';
                }, 0);
            }, 0);
        }
        else
        {
            eHeight.style.height = (iMaxHeight + 75) + 'px';
        };
    }
    else
    {
        eHeight.style.height = '100000px';
    };
}