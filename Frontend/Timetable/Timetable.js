class Timetable
{
    constructor(aTimetable)
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

        this.Timetable = aTimetable;

        this.Body = document.getElementById('Timetable');
        this.Week = document.getElementById('Week');
        this.Heights = new Map();

        this.Initial = true;

        this.WeekOffset_Default = 0;

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

            this.Week.children[0].addEventListener('click', () =>
            {
                this.WeekOffset--;
            });

            this.Week.children[1].addEventListener('click', () =>
            {
                this.WeekOffset = this.WeekOffset_Default;
            });

            this.Week.children[2].addEventListener('click', () =>
            {
                this.WeekOffset++;
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
                if ((_Timetable.Body.scrollWidth === _Timetable.Body.clientWidth) && !Overlays_Opened())
                    this.Week.children[0].click();
            });

            addEventListener('swiped-left', () =>
            {
                if ((_Timetable.Body.scrollWidth === _Timetable.Body.clientWidth) && !Overlays_Opened())
                    this.Week.children[2].click();
            });
        }
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
                                <div>${Date_Format(Time_From1970(iDate))}</div>
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
            return {'Width': (eGrid.scrollWidth > eGrid.clientWidth), 'Body_Height': (eGrid.parentElement.scrollHeight > eGrid.parentElement.clientHeight)};
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
        if (this.WeekOffset === 0)
        {
            if (document.body.clientWidth >= 600)
            {
                const iWeekBeginDate = this.OffsetToPeriod(0)[0];
                for (let i = new Date().getDayOfWeek(); i < 7; i++)
                {
                    const eDay = this.DaySelector(i + iWeekBeginDate);
                    if (eDay)
                    {
                        eDay.scrollIntoView({ inline: 'center', behavior: (bSmooth ? 'smooth' : 'auto') });
                        break;
                    };
                };
            }
            else
            {
                const eToday = this.DaySelector(_iToday);
                const eTomorrow = this.DaySelector(_iToday + 1);
                const iTimetableHeight = this.Body.parentElement.clientHeight;



                if (eToday === this.Body.firstElementChild)
                {
                    this.Body.parentElement.scrollTo({ top: 0, behavior: (bSmooth ? 'smooth' : 'auto') });
                }
                else if (eToday === this.Body.lastElementChild)
                {
                    this.Body.parentElement.scrollTo({ top: this.Body.scrollHeight, behavior: (bSmooth ? 'smooth' : 'auto') });
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
                        const iWeekBeginDate = this.OffsetToPeriod(0)[0];
                        let bBreak = false;
                        for (let i = new Date().getDayOfWeek() + 2; i < 7; i++)
                        {
                            const eDay = this.DaySelector(i + iWeekBeginDate);
                            if (eDay)
                            {
                                if (eDay.clientHeight + 50 <= iTimetableHeight)
                                    eDay.scrollIntoView({ block: 'end', behavior: (bSmooth ? 'smooth' : 'auto') });
                                else
                                    eDay.scrollIntoView({ behavior: (bSmooth ? 'smooth' : 'auto') });

                                bBreak = true;
                                break;
                            };
                        };

                        if (bBreak === false)
                            this.Body.parentElement.scrollTo({ top: this.Body.scrollHeight, behavior: (bSmooth ? 'smooth' : 'auto') });
                    };
                };
            };
        }
        else if (this.WeekOffset > 0)
        {
            this.Body.parentElement.scrollTo({ top: 0, behavior: (bSmooth ? 'smooth' : 'auto') });
        }
        else if (this.WeekOffset < 0)
        {
            this.Body.parentElement.scrollTo({ top: this.Body.scrollHeight, behavior: (bSmooth ? 'smooth' : 'auto') });
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
        if (!this.HeightSearch)
            this.Body_Height(!this.Initial);
        this.Body_Overflow();
        this.Body_Scroll();

        this.Heights.set(WeekOffset, this.Body.parentElement.scrollHeight);

        if (!this.HeightSearch)
        {
            this.Week.className = `Island ${(WeekOffset === 0) ? 'Current' : ((WeekOffset === 1) ? 'Next' : '')}`;

            const aWeekPeriod = this.WeekPeriod.copy();
            aWeekPeriod[0] = Time_From1970(aWeekPeriod[0]);
            aWeekPeriod[1] = Time_From1970(aWeekPeriod[1]);

            const iCurrentYear = new Date().getFullYear();
            if (aWeekPeriod[0].getFullYear() === iCurrentYear && aWeekPeriod[1].getFullYear() === iCurrentYear)
                this.Week.children[1].innerHTML = `${Date_Format_Short(aWeekPeriod[0])} – ${Date_Format_Short(aWeekPeriod[1])}`;
            else
                this.Week.children[1].innerHTML = `${Date_Format_Short(aWeekPeriod[0], true)} – ${Date_Format_Short(aWeekPeriod[1], true)}`;
        };



        this.Initial = false;
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
                    Lesson_SetChange(loop_oChange.Date, loop_oChange.Index, { 'Title': loop_oChange.Title }, true, false, false, false);

        for (let loop_oNote of _Records.Notes)
            if (this.WeekPeriod[0] <= loop_oNote.Date && loop_oNote.Date <= this.WeekPeriod[1])
                if ('Title' in loop_oNote)
                    Lesson_SetNote(loop_oNote.Date, loop_oNote.Title, true, true, false, false, false);
                else
                    Day_SetNote(loop_oNote.Date, true, true, false, false, false);
    }
}