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
                        <button onclick='new Day_UI(${iDate})'>
                            <div>${Date_Format(Time_From1970(iDate))}</div>
                            <div class='EmptyHidden'>${Timetable_GetPeriod(iDate)}</div>
                        </button>

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

function Timetable_Scroll()
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
                    eDay.scrollIntoView();
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
                            eTomorrow.scrollIntoView({block: 'end'});
                        else
                            eToday.scrollIntoView();
                    }
                    else
                    {
                        if (eToday.clientHeight + 50 <= iTimetableHeight)
                            eToday.scrollIntoView({block: 'end'});
                        else
                            eToday.scrollIntoView();
                    };
                }
                else if (eTomorrow)
                {
                    if (eTomorrow.clientHeight + 50 <= iTimetableHeight)
                        eTomorrow.scrollIntoView({block: 'end'});
                    else
                        eTomorrow.scrollIntoView();
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
    eGrid.style.gridTemplateColumns = '1fr 1fr';
    eGrid.style.gridTemplateRows = '';
    eGrid.style.gridAutoFlow = '';

    let iWidth = eGrid.clientWidth;
    let iScrollWidth = eGrid.scrollWidth;
    let iHeight = eGrid.parentElement.clientHeight;
    let iScrollHeight = eGrid.parentElement.scrollHeight;

    if (iScrollWidth > iWidth)
    {
        eGrid.style.gridTemplateColumns = '1fr';
    }
    else if (iScrollHeight > iHeight)
    {
        eGrid.style.gridTemplateColumns = '';
        eGrid.style.gridTemplateRows = '1fr 1fr';
        eGrid.style.gridAutoFlow = 'column';

        iWidth = eGrid.clientWidth;
        iScrollWidth = eGrid.scrollWidth;
        Height = eGrid.parentElement.clientHeight;
        iScrollHeight = eGrid.parentElement.scrollHeight;

        if (iScrollWidth > iWidth)
        {
            eGrid.style.gridTemplateColumns = '1fr 1fr';
            eGrid.style.gridTemplateRows = '';
            eGrid.style.gridAutoFlow = '';
        };

        if (iScrollHeight > iHeight)
        {
            eGrid.style.gridTemplateRows = '1fr';

            iWidth = eGrid.clientWidth;
            iScrollWidth = eGrid.scrollWidth;

            if (iScrollWidth > iWidth)
            {
                eGrid.style.gridTemplateColumns = '';
                eGrid.style.gridTemplateRows = '1fr 1fr';
                eGrid.style.gridAutoFlow = 'column';
            };
        };
    };
}

function Timetable_Height(bAnimation)
{
    const eHeight = document.getElementById('TimetableHeight');
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
        eHeight.style.transition = 'height 500ms';
        eHeight.style.height = Math.max(iInitialHeight, (_aHeights[_iWeekOffset] + 5)) + 'px';
        setTimeout(() => { eHeight.style.height = (iMaxHeight + 75) + 'px'; }, 0);
    }
    else
    {
        eHeight.style.height = (iMaxHeight + 75) + 'px';
    };
}

_aHeights = [];