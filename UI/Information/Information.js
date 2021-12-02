class Information
{
    constructor()
    {
        this.eTimetable = document.getElementById('Information');

        this.Draw();

        window.addEventListener('focus', () => { this.Draw() });
    }

    Draw()
    {
        if (!_Alarms.Empty)
        {
            const GetTimetable = (iDate) =>
            {
                const mTimetable = Timetable_GetDayTimetable(iDate) || [];
        
                let aTimetable = [];
                for (let loop_aLesson of mTimetable)
                    if (_Alarms.Get(loop_aLesson[0]))
                    {
                        let sChanagedPlace = _oWeek.Changes.selectWhere({ 'Date': iDate, 'Index': loop_aLesson[0] }, true);
                        if (sChanagedPlace)
                            sChanagedPlace = sChanagedPlace.Place;

                        aTimetable.push([loop_aLesson[0], loop_aLesson[1].Title, (sChanagedPlace ?? loop_aLesson[1].Fields.Place)])
                    }
                    else
                    {
                        this.Warning = true;
                    };
        
                for (let loop_aSuddenLesson of _oWeek.SuddenLessons)
                    if (loop_aSuddenLesson.Date === iDate)
                        aTimetable.push([loop_aSuddenLesson.Index, loop_aSuddenLesson.Title]);

                for (let loop_oChange of _oWeek.Changes.selectWhere({ 'Date': iDate }))
                    for (let i = 0; i < aTimetable.length; i++)
                        if (aTimetable[i][0] === loop_oChange.Index)
                        {
                            if (loop_oChange.Change === '')
                                aTimetable.splice(i, 1);
                            else if (loop_oChange.Change)
                                aTimetable[i][1] = loop_oChange.Change;
                                
                            break;
                        };
    
                aTimetable.sort((a, b) => { return a[0] - b[0]; });
    
                return aTimetable;
            };
        
            
        
            const Timer = (tDate) =>
            {
                return `<custom-timer time=${tDate.getTime()}></custom-timer>`;
            }
        
            const Difference = (tDate00, tDate01) =>
            {
                const iTimeLeft = tDate01 - tDate00;
        
                const iHours = Math.floor((iTimeLeft / (1000 * 60 * 60)) % 24);
                const iMinutes = Math.floor((iTimeLeft / (1000 * 60)) % 60);
        
                return `<span>${iHours > 0 ? `${iHours} ${[(iHours === 1 ? 'hour' : 'hours'), ['час', 'часа', 'часов'][Language_RussianNumberDeclension(iHours)]][_iLanguage]}` : ''} ${iMinutes} ${[(iMinutes === 1 ? 'minute' : 'minutes'), ['минута', 'минуты', 'минут'][Language_RussianNumberDeclension(iMinutes)]][_iLanguage]}</span>`
            }
        
            const SetTimeout = (tDate) =>
            {
                if (this.Timeout)
                    clearTimeout(this.Timeout);

                this.Timeout = setTimeout(() => { this.Draw() }, tDate - new Date().getTime());
            }
        
        
        
            const BeforeLessons = () =>
            {
                HTML +=    `<div>
                                Сегодня к ${Time_Format(_Alarms.Get(aTodayTimetable[0][0])[0])} на <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[0][0])}>${aTodayTimetable[0][1]}</a>${aTodayTimetable[0][2] ? ` (${aTodayTimetable[0][2]})` : ''}, осталось ${Timer(_Alarms.Get(aTodayTimetable[0][0])[0])}
                            </div>`;
        
                SetTimeout(_Alarms.Get(aTodayTimetable[0][0])[0]);
            }
        
            const OnLessons = () =>
            {
                for (let i = 0; i < aTodayTimetable.length; i++)
                {
                    if (_Alarms.Get(aTodayTimetable[i][0])[0] <= new Date() && new Date() <= _Alarms.Get(aTodayTimetable[i][0])[1])
                    {
                        HTML +=    `<div>
                                        Сейчас <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[i][0])}>${aTodayTimetable[i][1]}</a>${aTodayTimetable[i][2] ? ` (${aTodayTimetable[i][2]})` : ''}, до конца ${Timer(_Alarms.Get(aTodayTimetable[i][0])[1])}
                                    </div>`;
        
                        if (i + 1 < aTodayTimetable.length)
                            HTML +=    `<div>
                                            Затем перерыв ${Difference(_Alarms.Get(aTodayTimetable[i][0])[1], _Alarms.Get(aTodayTimetable[i + 1][0])[0])} и <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[i + 1][0])}>${aTodayTimetable[i + 1][1]}</a>${aTodayTimetable[i + 1][2] ? ` (${aTodayTimetable[i + 1][2]})` : ''}
                                        </div>`;
                        else
                            HTML += `<div>Затем свобода</div>`;
        
                        SetTimeout(_Alarms.Get(aTodayTimetable[i][0])[1]);
        
                        break;
                    };
        
                    if (i + 1 < aTodayTimetable.length && _Alarms.Get(aTodayTimetable[i][0])[1] <= new Date() && new Date() <= _Alarms.Get(aTodayTimetable[i + 1][0])[0])
                    {
                        HTML +=    `<div>
                                        Сейчас перерыв, до конца ${Timer(_Alarms.Get(aTodayTimetable[i + 1][0])[0])}
                                    </div>
        
                                    <div>
                                        Затем <a ${Timetable_GetLessonLinkAttributes(_iToday, aTodayTimetable[i + 1][0])}>${aTodayTimetable[i + 1][1]}</a>${aTodayTimetable[i + 1][2] ? ` (${aTodayTimetable[i + 1][2]})` : ''} в ${Time_Format(_Alarms.Get(aTodayTimetable[i + 1][0])[0])}
                                    </div>`;
        
                        SetTimeout(_Alarms.Get(aTodayTimetable[i + 1][0])[0]);
        
                        break;
                    };
                };
            }
        
            const AfterLessons = () =>
            {
                const aTomorrowTimetable = GetTimetable(_iToday + 1);
    
                if (aTomorrowTimetable.length > 0)
                    HTML +=    `<div>
                                    Завтра к 
                                    ${Time_Format(_Alarms.Get(aTomorrowTimetable[0][0], _iToday + 1)[0])}
                                    на
                                    <a ${Timetable_GetLessonLinkAttributes(_iToday + 1, aTomorrowTimetable[0][0])}>${aTomorrowTimetable[0][1]}</a>,
                                    осталось
                                    ${Timer(_Alarms.Get(aTomorrowTimetable[0][0], _iToday + 1)[0])}
                                </div>`;
                else
                    HTML +=    `<div>Отдых</div>`;
        
                SetTimeout(new Date().setHours(24, 0, 0, 0));
            }
        
        
        
            let HTML = '';
        
            const aTodayTimetable = GetTimetable(_iToday);
            if (aTodayTimetable.length > 0)
            {
                if (new Date() < _Alarms.Get(aTodayTimetable[0][0])[0])
                    BeforeLessons();
                else if (new Date() > _Alarms.Get(aTodayTimetable[aTodayTimetable.length - 1][0])[1])
                    AfterLessons();
                else
                    OnLessons();
            }
            else
            {
                AfterLessons();
            };
            if (this.Warning)
                HTML +=    `<div class='Caution'>
                                Занятия без звонков не учитываются
                            </div>`
        
            this.eTimetable.innerHTML = HTML;
        };
    }

    Update(iDate)
    {
        if (_iToday === iDate || _iToday + 1 === iDate)
            this.Draw();    
    }
}