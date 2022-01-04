class Information
{
    constructor()
    {
        this.Element = document.getElementById('Information');

        this.Draw();

        window.addEventListener('focus', () => this.Draw());
    }

    Draw()
    {
        if (!_Alarms.Empty)
        {
            const GetTimetable = (iDate) =>
            {
                const aTimetable = [];
                for (let loop_aLesson of _Timetable.DateToTimetable(iDate))
                    if (_Alarms.Get(loop_aLesson[0]))
                        aTimetable.push(
                        {
                            'Index': loop_aLesson[0],
                            'Title': loop_aLesson[1].Title,
                            'Place': loop_aLesson[1].Fields.Place
                        })
                    else
                        this.Warning = true;

                for (let loop_oChange of _Records.Changes.selectWhere({ Date: iDate }))
                    if (loop_oChange.Title === '')
                    {
                        aTimetable.removeWhere({ Index: loop_oChange.Index }, true);
                    }
                    else
                    {
                        const oInTimetable = aTimetable.selectWhere({ Index: loop_oChange.Index }, true);

                        if (oInTimetable)
                        {
                            if (loop_oChange.Title)
                                oInTimetable.Title = loop_oChange.Title;

                            if (loop_oChange.Place)
                                oInTimetable.Place = loop_oChange.Place;
                        }
                        else
                        {
                            aTimetable.push(
                            {
                                'Index': loop_oChange.Index,
                                'Title': loop_oChange.Title
                            })

                            if (loop_oChange.Place)
                                aTimetable[aTimetable.length - 1].Place = loop_oChange.Place;
                        };
                    };

                aTimetable.sort((A, B) => A.Index - B.Index);

                return aTimetable;
            };



            const Timer = (tDate) =>
            {
                return `<custom-timer time=${tDate.getTime()}></custom-timer>`;
            };

            const Difference = (tDate00, tDate01) =>
            {
                const iTimeLeft = tDate01 - tDate00;

                const iHours = Math.floor((iTimeLeft / (1000 * 60 * 60)) % 24);
                const iMinutes = Math.floor((iTimeLeft / (1000 * 60)) % 60);

                return `<span>
                            ${iHours > 0 ? `${iHours} 
                            ${[(iHours === 1 ? 'hour' : 'hours'), ['час', 'часа', 'часов'][Language_RussianNumberDeclension(iHours)]][_iLanguage]}` : ''}

                        ${
                            iMinutes > 0 ?
                           `${iMinutes}
                            ${[(iMinutes === 1 ? 'minute' : 'minutes'), ['минута', 'минуты', 'минут'][Language_RussianNumberDeclension(iMinutes)]][_iLanguage]}`
                            : ''
                        }
                        </span>`
            };

            const SetTimeout = (tDate) =>
            {
                if (this.Timeout)
                    clearTimeout(this.Timeout);

                this.Timeout = setTimeout(() => this.Draw(), (tDate - new Date() + 1));
            };



            const BeforeLessons = () =>
            {
                HTML +=    `<div>
                                Сегодня к
                                ${Time_Format(_Alarms.Get(aTodayTimetable[0].Index)[0])}
                                на
                                <a ${_Timetable.LessonAttributes(_iToday, aTodayTimetable[0].Index)}>${aTodayTimetable[0].Title}</a>
                                ${aTodayTimetable[0].Place ? ` (${aTodayTimetable[0].Place})` : ''},
                                осталось
                                ${Timer(_Alarms.Get(aTodayTimetable[0].Index)[0])}
                            </div>`;

                SetTimeout(_Alarms.Get(aTodayTimetable[0].Index)[0]);
            };

            const OnLessons = () =>
            {
                for (let i = 0; i < aTodayTimetable.length; i++)
                {
                    if (_Alarms.Get(aTodayTimetable[i].Index)[0] <= new Date() && new Date() <= _Alarms.Get(aTodayTimetable[i].Index)[1])
                    {
                        HTML +=    `<div>
                                        Сейчас
                                        <a ${_Timetable.LessonAttributes(_iToday, aTodayTimetable[i].Index)}>${aTodayTimetable[i].Title}</a>${aTodayTimetable[i].Place ? ` (${aTodayTimetable[i].Place})` : ''}, 
                                        до конца
                                        ${Timer(_Alarms.Get(aTodayTimetable[i].Index)[1])}
                                    </div>`;

                        if (i + 1 < aTodayTimetable.length)
                            HTML +=    `<div>
                                            Затем перерыв
                                            ${Difference(_Alarms.Get(aTodayTimetable[i].Index)[1], _Alarms.Get(aTodayTimetable[i + 1].Index)[0])}
                                            и
                                            <a ${_Timetable.LessonAttributes(_iToday, aTodayTimetable[i + 1].Index)}>${aTodayTimetable[i + 1].Title}</a>${aTodayTimetable[i + 1].Place ? ` (${aTodayTimetable[i + 1].Place})` : ''}
                                        </div>`;
                        else
                            HTML += `<div>
                                        Затем свобода
                                     </div>`;

                        SetTimeout(_Alarms.Get(aTodayTimetable[i].Index)[1]);

                        break;
                    };

                    if (i + 1 < aTodayTimetable.length && _Alarms.Get(aTodayTimetable[i].Index)[1] <= new Date() && new Date() <= _Alarms.Get(aTodayTimetable[i + 1].Index)[0])
                    {
                        HTML +=    `<div>
                                        Сейчас перерыв, до конца ${Timer(_Alarms.Get(aTodayTimetable[i + 1].Index)[0])}
                                    </div>

                                    <div>
                                        Затем
                                        <a ${_Timetable.LessonAttributes(_iToday, aTodayTimetable[i + 1].Index)}>${aTodayTimetable[i + 1].Title}</a>${aTodayTimetable[i + 1].Place ? ` (${aTodayTimetable[i + 1].Place})` : ''}
                                        в
                                        ${Time_Format(_Alarms.Get(aTodayTimetable[i + 1].Index)[0])}
                                    </div>`;

                        SetTimeout(_Alarms.Get(aTodayTimetable[i + 1].Index)[0]);

                        break;
                    };
                };
            };

            const AfterLessons = () =>
            {
                const aTomorrowTimetable = GetTimetable(_iToday + 1);

                if (aTomorrowTimetable.length > 0)
                    HTML +=    `<div>
                                    Завтра к 
                                    ${Time_Format(_Alarms.Get(aTomorrowTimetable[0].Index, _iToday + 1)[0])}
                                    на
                                    <a ${_Timetable.LessonAttributes(_iToday + 1, aTomorrowTimetable[0].Index)}>${aTomorrowTimetable[0].Title}</a>,
                                    осталось
                                    ${Timer(_Alarms.Get(aTomorrowTimetable[0].Index, _iToday + 1)[0])}
                                </div>`;
                else
                    HTML +=    `<div>Отдых</div>`;

                SetTimeout(new Date().setHours(24, 0, 0, 0));
            };



            let HTML = '';

            const aTodayTimetable = GetTimetable(_iToday);
            if (aTodayTimetable.length > 0)
            {
                if (new Date() < _Alarms.Get(aTodayTimetable[0].Index)[0])
                    BeforeLessons();
                else if (new Date() > _Alarms.Get(aTodayTimetable[aTodayTimetable.length - 1].Index)[1])
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

            this.Element.innerHTML = HTML;
        };
    }

    Update(iDate)
    {
        if (_iToday === iDate || _iToday + 1 === iDate)
            this.Draw();
    }
}