function Timetable_Draw()
{   
    let HTML = '';

    const aWeekPeriod = Week_GetPeriod(_iWeekOffset);
    for (let iDate = aWeekPeriod[0]; iDate <= aWeekPeriod[1]; iDate++)
    {
        const mTodayTimetable = Timetable_GetDayTimetable(iDate);

        if (mTodayTimetable !== false && mTodayTimetable.size > 0)
        {
            let sDayClass;
            if (iDate === _iToday)
                sDayClass = 'Today';
            else if (iDate === _iToday + 1)
                sDayClass = 'Tomorrow';

            HTML += `<div class='Day ${sDayClass || ''}'>
                        <a href='${location.pathname}?Date=${iDate}' onclick='event.preventDefault(); new Day_UI(${iDate});'>
                            <div>${Date_Format(Time_From1970(iDate))}</div>
                            <div class='EmptyHidden'>${Timetable_GetPeriod(iDate)}</div>
                        </a>

                        <div>`;
            for (let loop_aLesson of mTodayTimetable)
                HTML +=    `<div class='Lesson'>
                                <span>${loop_aLesson[0]}</span>
                                <a ${Timetable_GetLessonLinkAttributes(iDate, loop_aLesson[0])}>
                                    <span></span>
                                    <span>${loop_aLesson[1]['Title']}</span>
                                </a>
                                <span></span>
                            </div>`;
            HTML +=   `</div>
                    </div>`;
        };
    };

    document.getElementById('Timetable').innerHTML = HTML;
}

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
                    eDay.scrollIntoView({ behavior: (bSmooth ? 'smooth' : 'auto') });
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
                eTimetableScroll.scrollTop = 0;
            }
            else if (eToday === eTimetable.lastElementChild)
            {
                eTimetableScroll.scrollTop = eTimetable.scrollHeight;
            }
            else
            {
                if (eToday)
                {
                    if (eTomorrow)
                    {
                        if (eToday.clientHeight + eTomorrow.clientHeight + 50 <= iTimetableHeight)
                            eTomorrow.scrollIntoView({ block: 'end', behavior: (bSmooth ? 'smooth' : 'auto') });
                        else
                            eToday.scrollIntoView({ behavior: (bSmooth ? 'smooth' : 'auto') });
                    }
                    else
                    {
                        if (eToday.clientHeight + 50 <= iTimetableHeight)
                            eToday.scrollIntoView({ block: 'end', behavior: (bSmooth ? 'smooth' : 'auto') });
                        else
                            eToday.scrollIntoView({ behavior: (bSmooth ? 'smooth' : 'auto') });
                    };
                }
                else if (eTomorrow)
                {
                    if (eTomorrow.clientHeight + 50 <= iTimetableHeight)
                        eTomorrow.scrollIntoView({ block: 'end', behavior: (bSmooth ? 'smooth' : 'auto') });
                    else
                        eTomorrow.scrollIntoView({ behavior: (bSmooth ? 'smooth' : 'auto') });
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
                                eDay.scrollIntoView({block: 'end'});
                            else
                                eDay.scrollIntoView();
                                
                            bBreak = true;
                            break;
                        };
                    };
    
                    if (bBreak === false)
                        eTimetable.scrollTop = eTimetable.scrollHeight;
                };
            };
        };
    }
    else if (_iWeekOffset > 0)
    {
        eTimetableScroll.scrollTop = 0;
    }
    else if (_iWeekOffset < 0)
    {
        eTimetableScroll.scrollTop = eTimetable.scrollHeight;
    };
}

function Timetable_Overflow(eGrid)
{
    function GetOverflow()
    {
        return {'Width': (eGrid.scrollWidth > eGrid.clientWidth), 'Height': (eGrid.parentElement.scrollHeight > eGrid.parentElement.clientHeight)};
    };

    function SetGrid(iColumns, iRows)
    {
        if (iColumns)
            eGrid.style.gridTemplateColumns = `repeat(${iColumns}, auto)`;
        else
            eGrid.style.gridTemplateColumns = `repeat(${Math.ceil(eGrid.children.length / iRows)}, auto)`;
    }



    SetGrid(2);

    let oOverflow = GetOverflow();
    if (oOverflow.Width)
    {
        SetGrid(1);
    }
    else if (oOverflow.Height)
    {
        SetGrid(null, 2);

        let oOverflow = GetOverflow();
        if (oOverflow.Width)
        {
            SetGrid(2);
        }
        else if (oOverflow.Height)
        {
            SetGrid(null, 1);

            let oOverflow = GetOverflow();
            if (oOverflow.Width)
                SetGrid(null, 2);
        };
    };
}

function Timetable_Height(bAnimation)
{
    const eHeight = document.getElementById('TimetableHeight');

    if (document.body.clientWidth >= 600)
    {
        const eTimetable = document.getElementById('Timetable');
        const eScroll = document.getElementById('TimetableScroll');
        
        const temp_eTimetable = eTimetable.cloneNode(true);
    
        const iInitialHeight = bAnimation ? eHeight.clientHeight - 10 : null;
        const iInitialWeekOffset = _iWeekOffset;
        const sInitialGridStyle = eTimetable.style.gridTemplateColumns;
    
    
    
        eHeight.style.height = '';
        eHeight.style.transition = '';
        eTimetable.style.gridTemplateColumns = '1fr 1fr';
        temp_eTimetable.style.gridTemplateColumns = '1fr 1fr';
    
        _mHeights.set(_iWeekOffset, eScroll.scrollHeight);
    
        eScroll.insertBefore(temp_eTimetable, eScroll.firstChild);
        eTimetable.hidden = true;
    
        for (let i = -3; i < 3; i++)
            if (i !== 0 && !_mHeights.has(iInitialWeekOffset + i))
            {
                _iWeekOffset = iInitialWeekOffset + i;
                Timetable_Draw();
                Week_Fill(Week_GetPeriod(_iWeekOffset));
                Timetable_Overflow(eTimetable);
    
                _mHeights.set(_iWeekOffset, eScroll.scrollHeight);
            };
        _iWeekOffset = iInitialWeekOffset;
    
        temp_eTimetable.remove();
        eTimetable.hidden = false;
        eTimetable.style.gridTemplateColumns = sInitialGridStyle;
    
    
    
        const iMaxHeight = Math.max(_mHeights.get(_iWeekOffset - 3), _mHeights.get(_iWeekOffset - 2), _mHeights.get(_iWeekOffset - 1), _mHeights.get(_iWeekOffset), _mHeights.get(_iWeekOffset + 1), _mHeights.get(_iWeekOffset + 2));
    
        if (bAnimation === true)
        {
            eHeight.style.height = Math.max(iInitialHeight, (_mHeights.get(_iWeekOffset) + 5)) + 'px';
            setTimeout(() =>
            {
                eHeight.style.transition = 'height 500ms';

                setTimeout(() =>
                {
                    eHeight.style.height = (iMaxHeight + 75) + 'px';
                });
            }, 0);
        }
        else
        {
            eHeight.style.height = (iMaxHeight + 75) + 'px';
        };
    }
    else
    {
        eHeight.style.height = '1000000px';
        eHeight.style.transition = '';
    };
}