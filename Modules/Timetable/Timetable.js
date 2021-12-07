class Timetable
{
    constructor()
    {
        /*
        function GetDefaultWeekOffset()
        {
            if (this.DateToIndexes(_iToday).length !== 0)
                return 0;
                
            let iDayOfWeek = new Date().getDayOfWeek();
            let iLastStudyDay;
            for (let i = _iToday - iDayOfWeek + 6; i >= _iToday - iDayOfWeek; i--)
                if (this.DateToIndexes(i).length !== 0)
                {
                    iLastStudyDay = i;
                    break;
                };

            if (iLastStudyDay !== undefined)
            {
                if (iLastStudyDay < _iToday)
                    return 1;
                else    
                    return 0;
            }
            else
            {
                for (let i = _iToday - iDayOfWeek + 6 + 7; i >= _iToday - iDayOfWeek + 7; i--)
                    if (this.DateToIndexes(i).length !== 0)
                        return 1;

                return 0;
            };
        };
        */

        this.Timetable = _aTimetable;

        this.Body = document.getElementById('Timetable');
        this.Week = document.getElementById('Week');
        this.Heights = new Map();

        this.WeekOffset_Default = 0;
        this.WeekOffset = this.WeekOffset_Default;

        {
            const Scale = () =>
            {
                this.Body_Overflow();
                this.Body_Height();
                this.Body_Scroll();    
            };

            addEventListener('resize', Scale);
            document.fonts.ready.then(Scale);

            this.Week.children[0].addEventListener('click', () =>
            {
                if (this.WeekOffset > -Math.floor(_iToday / 7))
                    this.WeekOffset = this.WeekOffset - 1;
            });

            this.Week.children[1].addEventListener('click', () =>
            {
                this.WeekOffset = this.WeekOffset_Default;
            });

            this.Week.children[2].addEventListener('click', () =>
            {
                if (this.WeekOffset > -Math.floor(_iToday / 7))
                    this.WeekOffset = this.WeekOffset + 1;
            });

            addEventListener('keydown', Event =>
            {
                if (!Overlays_Opened())
                    switch(Event.key) 
                    {
                        case 'ArrowLeft':
                            this.Week.children[0].click();
                            break;

                        case 'ArrowRight':
                            this.Week.children[2].click();
                            break;
                    };
            });

            addEventListener('swiped-right', () =>
            {
                if (!Overlays_Opened())
                    this.Week.children[0].click();
            });

            addEventListener('swiped-left', () =>
            {
                if (!Overlays_Opened())
                    this.Week.children[2].click();
            });
        }
    }





    //// Timetable

    //// Logic

    DateToTimetable(iDate)
    {
        const iTimetable = this.DateToTimetableIndex(iDate);

        if (iTimetable === null)
        {
            return new Map();
        }
        else
        {
            const oTimetable = _aTimetable.get(iTimetable);
            return oTimetable.Lessons[(iDate - oTimetable.AnchorDate % oTimetable.Days.length + oTimetable.Days.length) % oTimetable.Days.length];
        }
    }

    DateToTimetableIndex(iDate)
    {
        for (let loop_aTimetable of this.Timetable)
            if ((loop_aTimetable[1]['Begin'] || Number.MIN_SAFE_INTEGER) <= iDate && iDate <= (loop_aTimetable[1]['End'] || Number.MAX_SAFE_INTEGER))
                return loop_aTimetable[0];

        return null;
    }

    DateToIndexes(iDate, bCanceled)
    {
        let aLessonIndexes = [];

        for (let loop_aLesson of this.DateToTimetable(iDate))
            aLessonIndexes.push(loop_aLesson[0]);

        for (let loop_oChange of _oWeek.Changes)
            if (loop_oChange.Date === iDate)
            {
                if (!bCanceled && loop_oChange.Title === '')
                {
                    const iIndex = aLessonIndexes.indexOf(loop_oChange.Index);

                    if (iIndex !== -1)
                        aLessonIndexes.splice(iIndex, 1);
                }
                else if (loop_oChange.Title !== null)
                {
                    const iIndex = aLessonIndexes.indexOf(loop_oChange.Index);

                    if (iIndex === -1)
                        aLessonIndexes.push(loop_oChange.Index);
                }
            };

        aLessonIndexes.sort((a, b) => a - b);

        return aLessonIndexes;
    }

    DateToAlarmsPeriod(iDate)
    {
        if (!_Alarms.Empty)
        {
            const aLessonIndexes = this.DateToIndexes(iDate);

            if (aLessonIndexes.length)
            {
                const aBegin = _Alarms.Get(Math.min(...aLessonIndexes), iDate);
                const aEnd = _Alarms.Get(Math.max(...aLessonIndexes), iDate);
                
                return `${aBegin ? Time_Format(aBegin[0]) : '?'} – ${aEnd ? Time_Format(aEnd[1]) : '?'}`;
            }
            else
            {
                return ['Chill', 'Отдых'][_iLanguage];
            };
        }
        else
        {
            return '';
        };
    }



    //// Draw

    Body_Draw()
    {
        let HTML = '';

        for (let iDate = this.WeekPeriod[0]; iDate <= this.WeekPeriod[1]; iDate++)
        {
            const mTodayTimetable = this.DateToTimetable(iDate);

            if (mTodayTimetable.size > 0)
            {
                HTML += `<div class='Day ${(iDate === _iToday) ? 'Today' : ((iDate === _iToday + 1) ? 'Tomorrow' : '')}'>
                            <a href='${location.pathname}?Date=${iDate}' onclick="event.preventDefault(); _Router.Forward('/Day?Date=${iDate}');">
                                <div>${Date_Format(Time_From1970(iDate))}</div>
                                <div class='EmptyHidden'>${this.DateToAlarmsPeriod(iDate)}</div>
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
    
        this.Body.innerHTML = HTML;
    }

    Body_Overflow()
    {
        function GetOverflow()
        {
            return {'Width': (eGrid.scrollWidth > eGrid.clientWidth), 'Body_Height': (eGrid.parentElement.scrollHeight > eGrid.parentElement.clientHeight)};
        };

        function SetGrid(iColumns, iRows)
        {
            if (iColumns)
                eGrid.style.gridTemplateColumns = `repeat(${iColumns}, 1fr)`;
            else
                eGrid.style.gridTemplateColumns = `repeat(${Math.ceil(eGrid.children.length / iRows)}, 1fr)`;
        };



        const eGrid = document.getElementById('Timetable');

        if (eGrid.children.length === 1)
        {
            SetGrid(1);
        }
        else
        {
            SetGrid(2);
    
            let oOverflow = GetOverflow();
            if (oOverflow.Width)
            {
                SetGrid(1);
            }
            else if (oOverflow.Body_Height)
            {
                SetGrid(null, 2);
    
                oOverflow = GetOverflow();
                if (oOverflow.Width)
                    SetGrid(2);
                else if (oOverflow.Body_Height)
                    SetGrid(null, 1);
            };
        };
    }

    Body_Height(bAnimation)      // TO DO
    {
        const eHeight = this.Body.parentElement.parentElement;

        if (document.body.clientWidth >= 600)
        {
            const eScroll = this.Body.parentElement;
    
            eHeight.style.height = '800px';

        }
        else
        {
            eHeight.style.height = '100000px';
        };
    }

    Body_Scroll()    // TO DO
    {

    }



    // Get

    DaySelector(iDate)
    {
        return document.querySelector(`.Day [onclick="event.preventDefault(); _Router.Forward('/Day?Date=${iDate}');`);
    }

    LessonSelector(iDate, iIndex)
    {
        return document.querySelector(`.Lesson [onclick="event.preventDefault(); _Router.Forward('/Lesson?Date=${iDate}&Lesson=${iIndex}');"]`);
    }

    DateToElement(iDate)
    {
        const eDay = this.DaySelector(iDate);

        if (eDay)
            return eDay.parentElement;
        else
            return null;
    };

    GetLessonElement(iDate, iIndex)
    {
        const eLesson = this.LessonSelector(iDate, iIndex);

        if (eLesson)
            return eLesson.parentElement;
        else
            return null;
    };

    DateToElements(iDate)
    {
        const eDay = this.DaySelector(iDate);

        if (eDay)
            return eDay.parentElement.children[1].children;
        else
            return [];
    }



    // Do

    UpdateAlarmsPeriod(iDate)
    {
        const eDay = this.DaySelector(iDate);

        if (eDay)
            eDay.children[1].innerHTML = this.DateToAlarmsPeriod(iDate);
    }

    FocusLesson(iDate, iIndex)
    {
        this.WeekOffset = this.DateToOffset(iDate);

        const eLesson = this.LessonSelector(iDate, iIndex);

        if (eLesson)
        {
            eLesson.scrollIntoView({block: 'center', inline: 'center', behavior: 'smooth'});
            eLesson.focus({preventScroll: true});
            eLesson.parentElement.classList.add('Focused');
            setTimeout(() =>
            {
                addEventListener('click', () =>
                {
                    eLesson.parentElement.classList.remove('Focused');
                },
                {
                    once: true
                });
            }, 0);
        };
    }





    ////// Week

    //// Logic

    set WeekOffset(WeekOffset)
    {
        this._WeekOffset = WeekOffset;
        this.WeekPeriod = this.OffsetToPeriod(WeekOffset);

        this.Body_Draw();
        this.Fill();
        this.Body_Overflow();
        this.Body_Height();
        this.Body_Scroll();



        this.Week.className = `Island ${(WeekOffset === 0) ? 'Current' : ((WeekOffset === 1) ? 'Next' : '')}`;

        const aWeekPeriod = this.WeekPeriod.copy();
        aWeekPeriod[0] = Time_From1970(aWeekPeriod[0]);
        aWeekPeriod[1] = Time_From1970(aWeekPeriod[1]);
    
        const iCurrentYear = new Date().getFullYear();
        if (aWeekPeriod[0].getFullYear() === iCurrentYear && aWeekPeriod[1].getFullYear() === iCurrentYear)
            this.Week.children[1].innerHTML = `${Date_Format_Short(aWeekPeriod[0])} – ${Date_Format_Short(aWeekPeriod[1])}`;
        else
            this.Week.children[1].innerHTML = `${Date_Format_Short(aWeekPeriod[0], true)} – ${Date_Format_Short(aWeekPeriod[1], true)}`;
    }

    get WeekOffset()
    {
        return this._WeekOffset;
    }

    OffsetToPeriod(iWeekOffset)
    {
        const iWeekBeginDate = _iToday - new Date().getDayOfWeek() + iWeekOffset * 7;
        return [iWeekBeginDate, iWeekBeginDate + 6];
    }

    DateToOffset(iDate)
    {
        return Math.floor((iDate - this.OffsetToPeriod(0)[0]) / 7);
    }



    //// Draw

    Fill()
    {
        for (let loop_oChange of _oWeek.Changes)
            if (this.WeekPeriod[0] <= loop_oChange.Date && loop_oChange.Date <= this.WeekPeriod[1])
                this.SetChange(loop_oChange.Date, loop_oChange.Index, loop_oChange.Title);

        for (let loop_oLessonNote of _oWeek.LessonNotes)
            if (this.WeekPeriod[0] <= loop_oLessonNote.Date && loop_oLessonNote.Date <= this.WeekPeriod[1])
                this.SetPoint_Lesson(loop_oLessonNote.Date, loop_oLessonNote.Title, true);

        for (let loop_oDayNote of _oWeek.DayNotes)
            if (this.WeekPeriod[0] <= loop_oDayNote.Date && loop_oDayNote.Date <= this.WeekPeriod[1])
                this.SetPoint_Day(loop_oDayNote.Date, true);
    }

    SetPoint_Day(iDate, bPoint)
    {
        const eDay = this.DaySelector(iDate);

        if (eDay)
        {
            if (bPoint)
                eDay.parentElement.classList.add('Note');
            else
                eDay.parentElement.classList.remove('Note');
        };
    }

    SetPoint_Lesson(iDate, sTitle, bPoint)
    {
        for (let loop_eLesson of this.DateToElements(iDate))
        {
            const loop_sChange = loop_eLesson.children[1].children[0].innerHTML;
            const loop_sTitle = loop_eLesson.children[1].children[1].innerHTML;

            if ((loop_sChange || loop_sTitle) === sTitle)
            {
                if (bPoint)
                    loop_eLesson.classList.add('Note');
                else
                    loop_eLesson.classList.remove('Note');
            };
        };
    }

    SetChange(iDate, iIndex, sTitle)
    {
        const eLesson = this.LessonSelector(iDate, iIndex);

        if (eLesson)
        {
            if (eLesson.parentElement.classList.contains('Added'))
            {
                if (sTitle === '')
                {
                    if (eLesson.parentElement.parentElement.parentElement.children[1].children.length === 1)
                        eLesson.parentElement.parentElement.parentElement.remove();
                    else
                        eLesson.parentElement.remove();
                }
                else
                    eLesson.children[1].innerHTML = sTitle;
            }
            else
            {
                if (sTitle === '')
                    eLesson.parentElement.classList.add('Canceled');
                else
                    eLesson.parentElement.classList.remove('Canceled');

                if (sTitle === eLesson.children[1].innerHTML)
                    eLesson.children[0].innerHTML = '';
                else
                    eLesson.children[0].innerHTML = sTitle;
            };
        }
        else if (sTitle !== '' && sTitle !== null)
        {
            if (this.WeekPeriod[0] <= iDate && iDate <= this.WeekPeriod[1])
            {
                const HTML = `<span>${iIndex}</span>
                              <a ${Timetable_GetLessonLinkAttributes(iDate, iIndex)}>
                                <span></span>
                                <span>${sTitle}</span>
                              </a>
                              <span></span>`;
    
                let eDay = this.DaySelector(iDate);
                if (eDay)
                {
                    const eLesson = document.createElement('div');
                    eLesson.className = 'Lesson Added';
                    eLesson.innerHTML = HTML;
    
                    let eAfter = null;
                    for (let loop_eLesson of eDay.parentElement.children[1].children)
                    {
                        const loop_iIndex = parseInt(loop_eLesson.children[0].innerHTML);
    
                        if (loop_iIndex > iIndex)
                        {
                            eAfter = loop_eLesson;
                            break;
                        };
                    };
                    eDay.parentElement.children[1].insertBefore(eLesson, eAfter);
                }
                else
                {
                    eDay = document.createElement('div');
                    eDay.className = `Day ${(iDate === _iToday) ? 'Today' : ((iDate === _iToday + 1) ? 'Tomorrow' : '')} ${_oWeek.DayNotes.selectWhere({'Date': iDate }, true) ? 'Note' : ''}`;
                    eDay.innerHTML = `<a href='${location.pathname}?Date=${iDate}' onclick="event.preventDefault(); _Router.Forward('/Day?Date=${iDate}');">
                                        <div>${Date_Format(Time_From1970(iDate))}</div>
                                        <div class='EmptyHidden'>${this.DateToAlarmsPeriod(iDate)}</div>
                                      </a>
    
                                      <div>
                                        <div class='Lesson Added'>${HTML}</div>
                                      </div>`;
    
                    let eAfter = null;
                    for (let loop_eDay of this.Body.children)
                    {
                        const loop_iDate = parseInt(loop_eDay.children[0].getAttribute('onclick').replace(/\D/g, ''));
    
                        if (loop_iDate > iDate)
                        {
                            eAfter = loop_eDay;
                            break;
                        };
                    };
                    this.Body.insertBefore(eDay, eAfter);
                };
            };
        };
    }
}