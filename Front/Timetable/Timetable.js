class Timetable
{
    constructor(aTimetable)
    {
        for (let loop_aTimetable of aTimetable)
        {
            for (let loop_aDay of loop_aTimetable[1].Lessons)
                for (let loop_aLesson of loop_aDay)
                    loop_aLesson[1].Fields.UserFields = new Map(loop_aLesson[1].Fields.UserFields);

            loop_aTimetable[1].Lessons = loop_aTimetable[1].Lessons.map(loop_aDay => new Map(loop_aDay));
        };

        this.Timetable = new Map(aTimetable);
        this.Heights = new Map();
    }

    Init()
    {
        this.Initial = true;



        this.Body = document.getElementById('Timetable');
        this.Week = document.getElementById('Week');

        {
            const Scale = () =>
            {
                this.Heights = new Map();
                this.Body_Height();
                this.Body_Overflow();
                this.Body_Scroll();
            };

            addEventListener('resize', Scale);
            document.fonts.ready.then(Scale);

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
                if ((_Timetable.Body.scrollWidth === _Timetable.Body.clientWidth) && !Overlays_Opened())
                    this.Week.children[0].click();
            });

            addEventListener('swiped-left', () =>
            {
                if ((_Timetable.Body.scrollWidth === _Timetable.Body.clientWidth) && !Overlays_Opened())
                    this.Week.children[2].click();
            });
        }

        this.WeekOffset_Default = (() =>
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
        })();

        _Timetable.WeekOffset = _Timetable.WeekOffset_Default;

        if (_Alarms.Empty)
            _Timetable.Body.classList.add('NoAlarms');



        this.Initial = false;
    }





    //// Timetable

    //// Logic

    DateToTimetableIndex(iDate)
    {
        for (let loop_aTimetable of this.Timetable)
            if ((loop_aTimetable[1].Begin || Number.MIN_SAFE_INTEGER) <= iDate && iDate <= (loop_aTimetable[1].End || Number.MAX_SAFE_INTEGER))
                return loop_aTimetable[0];

        return null;
    }

    DateToTimetable(iDate)
    {
        const iTimetable = this.DateToTimetableIndex(iDate);

        if (iTimetable === null)
        {
            return new Map();
        }
        else
        {
            const oTimetable = this.Timetable.get(iTimetable);
            return oTimetable.Lessons[(Math.abs(iDate - oTimetable.AnchorDate) % oTimetable.Days.length + oTimetable.Days.length) % oTimetable.Days.length];
        }
    }

    DateToIndexes(iDate, bCanceled)
    {
        const aLessonIndexes = [...this.DateToTimetable(iDate).keys()];

        for (let loop_oChange of _Records.Changes)
            if (loop_oChange.Date === iDate)
            {
                if (!bCanceled && loop_oChange.Title === '')
                {
                    if (aLessonIndexes.includes(loop_oChange.Index))
                        aLessonIndexes.splice(aLessonIndexes.indexOf(loop_oChange.Index), 1);
                }
                else if (loop_oChange.Title !== null)
                {
                    if (!aLessonIndexes.includes(loop_oChange.Index))
                        aLessonIndexes.push(loop_oChange.Index);
                }
            };

        aLessonIndexes.sort((A, B) => A - B);

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

                return `${aBegin ? Time_Format(aBegin[0]) : '?'} ??? ${aEnd ? Time_Format(aEnd[1]) : '?'}`;
            }
            else
            {
                return ['Chill', '??????????'][_iLanguage];
            };
        }
        else
        {
            return '';
        };
    }

    LessonAttributes(iDate, iIndex)
    {
        return `href='${location.pathname}?Date=${iDate}&Lesson=${iIndex}' onclick="event.preventDefault(); _Router.Forward('/Lesson?Date=${iDate}&Lesson=${iIndex}');"`;
    }



    //// Draw

    Body_Draw()
    {
        let HTML = '';

        for (let iDate = this.WeekPeriod[0]; iDate <= this.WeekPeriod[1]; iDate++)
        {
            const mTodayTimetable = this.DateToTimetable(iDate);

            if (mTodayTimetable.size)
            {
                HTML += `<div class='Day ${(iDate === _iToday) ? 'Today' : ((iDate === _iToday + 1) ? 'Tomorrow' : '')}'>
                            <a href='${location.pathname}?Date=${iDate}' onclick="event.preventDefault(); _Router.Forward('/Day?Date=${iDate}');">
                                <div>${Date_Format(IntToDate(iDate))}</div>
                                <div class='EmptyHidden'>${this.DateToAlarmsPeriod(iDate)}</div>
                            </a>

                            <div>`;
                for (let loop_aLesson of mTodayTimetable)
                    HTML +=    `<div class='Lesson'>
                                    <span>${loop_aLesson[0]}</span>
                                    <a ${this.LessonAttributes(iDate, loop_aLesson[0])}>${loop_aLesson[1].Title}</a>
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
            return { Width: (eGrid.scrollWidth > eGrid.clientWidth), Height: (eGrid.parentElement.scrollHeight > eGrid.parentElement.clientHeight) };
        }

        function SetGrid(iColumns, iRows)
        {
            if (iColumns)
                eGrid.style.gridTemplateColumns = `repeat(${iColumns}, 1fr)`;
            else
                eGrid.style.gridTemplateColumns = `repeat(${Math.ceil(eGrid.children.length / iRows)}, 1fr)`;
        }



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
            else if (oOverflow.Height)
            {
                SetGrid(null, 2);

                oOverflow = GetOverflow();
                if (oOverflow.Width)
                    SetGrid(2);
                else if (oOverflow.Height)
                    SetGrid(null, 1);
            };
        };
    }

    Body_Height(bAnimation)
    {
        const eHeight = this.Body.parentElement.parentElement;

        if (document.body.clientWidth >= 600)
        {
            const iBefore_WeekOffset = this.WeekOffset;
            const iBefore_Height = eHeight.clientHeight - 10;

            eHeight.style.height = '';
            eHeight.style.transition = '';



            this.HeightSearch = true;

            for (let i = iBefore_WeekOffset - 3; i <= iBefore_WeekOffset + 3; i++)
                if (!this.Heights.has(i))
                    this.WeekOffset = i;
            this.WeekOffset = iBefore_WeekOffset;

            this.HeightSearch = false;



            if (bAnimation)
            {
                eHeight.style.height = iBefore_Height + 'px';

                setTimeout(() =>
                {
                    eHeight.style.transition = 'height 500ms';

                    setTimeout(() =>
                    {
                        eHeight.style.height = (Math.max(this.Heights.get(iBefore_WeekOffset - 3), this.Heights.get(iBefore_WeekOffset - 2), this.Heights.get(iBefore_WeekOffset - 1), this.Heights.get(iBefore_WeekOffset), this.Heights.get(iBefore_WeekOffset + 1), this.Heights.get(iBefore_WeekOffset + 2), this.Heights.get(iBefore_WeekOffset + 3)) + 150) + 'px';
                    }, 0);
                }, 0);
            }
            else
            {
                eHeight.style.height = (Math.max(this.Heights.get(iBefore_WeekOffset - 3), this.Heights.get(iBefore_WeekOffset - 2), this.Heights.get(iBefore_WeekOffset - 1), this.Heights.get(iBefore_WeekOffset), this.Heights.get(iBefore_WeekOffset + 1), this.Heights.get(iBefore_WeekOffset + 2), this.Heights.get(iBefore_WeekOffset + 3)) + 150) + 'px';
            };
        }
        else
        {
            eHeight.style.height = '100000px';
        };
    }

    Body_Scroll(bSmooth)
    {
        const bOnlyColumn = (this.Body.style.gridTemplateColumns === `repeat(1, 1fr)`);
        const bOnlyRow = (this.Body.style.gridTemplateColumns === `repeat(${this.Body.children.length}, 1fr)`);

        const ScrollToBottom = () =>
        {
            this.Body.scrollTo(this.Body.scrollWidth, this.Body.scrollHeight);
            this.Body.parentElement.scrollTo(this.Body.parentElement.scrollWidth, (bOnlyRow ? 0 : this.Body.parentElement.scrollHeight));
        }



        if (this.WeekOffset === 0)
        {
            const eToday = this.DaySelector(_iToday);
            const eTomorrow = this.DaySelector(_iToday + 1);
            const iAvalableHeight = this.Body.parentElement.clientHeight - 60;

            const ScrollToToday = () =>
            {
                if (bOnlyColumn)
                {
                    if (eTomorrow)
                        if (eToday.parentElement.clientHeight + eTomorrow.parentElement.clientHeight + 60 <= iAvalableHeight)
                        {
                            eTomorrow.parentElement.scrollIntoView
                            ({
                                block: 'end',
                                inline: 'center',
                                behavior: (bSmooth ? 'smooth' : 'auto')
                            });

                            return;
                        };

                    eToday.parentElement.scrollIntoView
                    ({
                        block: 'start',
                        inline: 'center',
                        behavior: (bSmooth ? 'smooth' : 'auto')
                    });
                }
                else
                {
                    eToday.parentElement.scrollIntoView
                    ({
                        block: 'start',
                        inline: 'center',
                        behavior: (bSmooth ? 'smooth' : 'auto')
                    });
                };
            };



            if (eTomorrow)
                if (eTomorrow.parentElement === this.Body.lastElementChild)
                    if ((eToday ? (eToday.parentElement.clientHeight + 60) : 0) + eTomorrow.parentElement.clientHeight <= iAvalableHeight)
                    {
                        ScrollToBottom();
                        return;
                    };

            if (eToday)
                if (eToday.parentElement === this.Body.lastElementChild)    // ???????? ?????????????? ?????????????????? ???????? ????????????
                {
                    if (eToday.parentElement.clientHeight <= iAvalableHeight)   // ???????????????????? ?????????????????? ??? ?????????????????? ???? ?????????? ????????????????????
                        ScrollToBottom();
                    else                                                        // ???????????????????? ???????????????? ??? ?????????????????? ???? ?????????? ??????????????
                        eToday.parentElement.scrollIntoView
                        ({
                            block: 'start',
                            inline: 'center',
                            behavior: (bSmooth ? 'smooth' : 'auto')
                        });

                    return;
                };

            if (eToday)
                ScrollToToday();
        }
        else if (this.WeekOffset < 0)   // ?? ?????????????? ??? ?????????????????? ???? ?????????? ????????????????????
        {
            ScrollToBottom();
        };
    }



    // Get

    DaySelector(iDate)
    {
        return this.Body.querySelector(`.Day [onclick="event.preventDefault(); _Router.Forward('/Day?Date=${iDate}');`);
    }

    LessonSelector(iDate, iIndex)
    {
        return this.Body.querySelector(`.Lesson [onclick="event.preventDefault(); _Router.Forward('/Lesson?Date=${iDate}&Lesson=${iIndex}');"]`);
    }



    // Do

    FocusLesson(iDate, iIndex)
    {
        const iNewWeekOffset = this.DateToOffset(iDate);
        if (this.WeekOffset !== iNewWeekOffset)
            this.WeekOffset = iNewWeekOffset;

        const eLesson = this.LessonSelector(iDate, iIndex);

        if (eLesson)
        {
            eLesson.focus({ preventScroll: true });

            setTimeout(() =>
            {
                eLesson.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
                eLesson.parentElement.classList.add('Focused');

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
        if (!this.HeightSearch)
            this.Body_Height(!this.Initial);
        this.Body_Overflow();
        this.Body_Scroll();

        this.Heights.set(WeekOffset, this.Body.parentElement.scrollHeight);

        if (!this.HeightSearch)
        {
            this.Week.className = `Island ${(WeekOffset === 0) ? 'Current' : ((WeekOffset === 1) ? 'Next' : '')}`;

            const aWeekPeriod = this.WeekPeriod.copy();
            aWeekPeriod[0] = IntToDate(aWeekPeriod[0]);
            aWeekPeriod[1] = IntToDate(aWeekPeriod[1]);

            const iCurrentYear = new Date().getFullYear();
            if (aWeekPeriod[0].getFullYear() === iCurrentYear && aWeekPeriod[1].getFullYear() === iCurrentYear)
                this.Week.children[1].innerHTML = `${Date_Format_Short(aWeekPeriod[0])} ??? ${Date_Format_Short(aWeekPeriod[1])}`;
            else
                this.Week.children[1].innerHTML = `${Date_Format_Short(aWeekPeriod[0], true)} ??? ${Date_Format_Short(aWeekPeriod[1], true)}`;
        };
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
        for (let loop_oChange of _Records.Changes)
            if (this.WeekPeriod[0] <= loop_oChange.Date && loop_oChange.Date <= this.WeekPeriod[1])
                if ('Title' in loop_oChange)
                    Lesson_SetChange(loop_oChange.Date, loop_oChange.Index, { Title: loop_oChange.Title }, true, false, false, false);

        for (let loop_oNote of _Records.Notes)
            if (this.WeekPeriod[0] <= loop_oNote.Date && loop_oNote.Date <= this.WeekPeriod[1])
                SetNote(loop_oNote.Date, loop_oNote.Title, true, true, false, false, false);
    }
}