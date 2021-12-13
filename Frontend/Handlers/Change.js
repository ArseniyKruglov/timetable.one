function Lesson_SetChange(iDate, iIndex, oChange, bDraw, bSend, bRecord, bInsert, oInRecords_Change, sOriginalTitle)
{
    oInRecords_Change = oInRecords_Change || _Records.Changes.selectWhere({ 'Date': iDate, 'Index': iIndex }, true);

    if (sOriginalTitle === undefined)
    {
        const mDayTimetable = _Timetable.DateToTimetable(this.Date);
        const oInTimetable = mDayTimetable.get(this.Index)
        if (oInTimetable)
            sOriginalTitle = oInTimetable.Title;
        else
            sOriginalTitle = null;
    };

    let oInRecords_Note;
    if (oChange.hasOwnProperty('Title'))
        oInRecords_Note = _Records.Notes.selectWhere({'Date': iDate, 'Title': (oChange.Title || sOriginalTitle) }, true) || null;



    if (bRecord)
    {
        if (oInRecords_Change)
        {
            for (let loop_sProperty in oChange)
                oInRecords_Change[loop_sProperty] = oChange[loop_sProperty];



            if (((sOriginalTitle === null) ? (oInRecords_Change.Title === '') : (oInRecords_Change.Title === sOriginalTitle)) && oInRecords_Change.Place === null && oInRecords_Change.Educator === null)
            {
                oInRecords_Change = null;

                _Records.Changes.removeWhere({ 'Date': iDate, 'Index': iIndex }, true);

                if (bSend)
                    SendRequest('/PHP/Handlers/Lesson_Remove.php',
                    {
                        'Date': iDate,
                        'Index': iIndex
                    });
            }
            else
            {
                if (bSend)
                {
                    const oSend =
                    {
                        'Date': iDate,
                        'Index': iIndex
                    };

                    for (let loop_sProperty in oChange)
                        oSend[loop_sProperty] = oChange[loop_sProperty];

                    SendRequest('/PHP/Handlers/Lesson_Change.php', oSend);
                };
            };
        }
        else
        {
            oInRecords_Change =
            {
                'Date': iDate,
                'Index': iIndex,
                'Title': oChange.Title || null,
                'Place': oChange.Place || null,
                'Educator': oChange.Educator || null
            };

            _Records.Changes.push(oInRecords_Change);



            if (bSend)
            {
                const oSend =
                {
                    'Date': iDate,
                    'Index': iIndex
                };

                for (let loop_sProperty in oChange)
                    oSend[loop_sProperty] = oChange[loop_sProperty];

                SendRequest('/PHP/Handlers/Lesson_Change.php', oSend);
            };
        };

        if (window._Lesson_UI)
            if (_Lesson_UI.Date === iDate && _Lesson_UI.Index === iIndex)
                _Lesson_UI.oInRecords_Change = oInRecords_Change;



        if (oChange.hasOwnProperty('Title'))
        {
            const eDay = _Timetable.DaySelector(iDate);

            if (eDay)
                eDay.children[1].innerHTML = _Timetable.DateToAlarmsPeriod(iDate);



            const eLesson = _Timetable.LessonSelector(iDate, iIndex);

            if (eLesson)
                if (oInRecords_Note)
                    eLesson.parentElement.classList.add('Note');
                else
                    eLesson.parentElement.classList.remove('Note');



            if (window._Day_UI)
                if (_Day_UI.Date === iDate)
                    _Day_UI.Overlay.GetUIElement('.Alarms').children[1].innerHTML = _Timetable.DateToAlarmsPeriod(iDate);



            if (window._Lesson_UI)
                if (_Lesson_UI.Date === iDate && _Lesson_UI.Index === iIndex)
                {
                    _Lesson_UI.oInRecords_Note = oInRecords_Note;
                    _Lesson_UI.Overlay.GetUIElement('.Note').value = _Lesson_UI.Note;
                };



            if (window._Sudden_UI)
            {

            };



            if (oChange.hasOwnProperty('Place'))
                _Information.Update(iDate);
        };

        if (oChange.hasOwnProperty('Place') || oChange.hasOwnProperty('Educator'))
            if (window._Lesson_UI)
                if (_Lesson_UI.Date === iDate && _Lesson_UI.Index === iIndex)
                    _Lesson_UI.Overlay.GetUIElement('.Info').innerHTML = _Lesson_UI.GetInfoIHTML();
    };

    if (bDraw)
    {
        if (oChange.hasOwnProperty('Title'))
        {
            const eLesson = _Timetable.LessonSelector(iDate, iIndex);

            if (eLesson)
            {
                if (eLesson.parentElement.classList.contains('Added'))
                {
                    if (!oInRecords_Change)
                    {
                        if (eLesson.parentElement.parentElement.parentElement.children[1].children.length === 1)
                            eLesson.parentElement.parentElement.parentElement.remove();
                        else
                            eLesson.parentElement.remove();
                    }
                    else
                    {
                        eLesson.children[1].innerHTML = oChange.Title;
                    };
                }
                else
                {
                    if (oInRecords_Change ? (oInRecords_Change.Title  === '') : false)
                        eLesson.parentElement.classList.add('Canceled');
                    else
                        eLesson.parentElement.classList.remove('Canceled');

                    if (oInRecords_Change && 'Title' in oInRecords_Change ? (oInRecords_Change.Title === sOriginalTitle) : true)
                        eLesson.children[0].innerHTML = '';
                    else
                        eLesson.children[0].innerHTML = oInRecords_Change.Title;
                };
            }
            else if (oInRecords_Change && oInRecords_Change.Title !== '' && oInRecords_Change.Title !== null)
            {
                if (_Timetable.WeekPeriod[0] <= iDate && iDate <= _Timetable.WeekPeriod[1])
                {
                    const HTML = `<span>${iIndex}</span>
                                  <a ${_Timetable.LessonAttributes(iDate, iIndex)}>
                                    <span></span>
                                    <span>${oInRecords_Change.Title}</span>
                                  </a>
                                  <span></span>`;

                    let eDay = _Timetable.DaySelector(iDate);
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
                        eDay.className = `Day ${ (iDate === _iToday) ? 'Today' : ((iDate === _iToday + 1) ? 'Tomorrow' : '') } ${ oInRecords_Note ? 'Note' : '' }`;
                        eDay.innerHTML = `<a href='${location.pathname}?Date=${iDate}' onclick="event.preventDefault(); _Router.Forward('/Day?Date=${iDate}');">
                                            <div>${Date_Format(Time_From1970(iDate))}</div>
                                            <div class='EmptyHidden'>${_Timetable.DateToAlarmsPeriod(iDate)}</div>
                                          </a>

                                          <div>
                                            <div class='Lesson Added'>${HTML}</div>
                                          </div>`;

                        let eAfter = null;
                        for (let loop_eDay of _Timetable.Body.children)
                        {
                            const loop_iDate = parseInt(loop_eDay.children[0].getAttribute('onclick').replace(/\D/g, ''));

                            if (loop_iDate > iDate)
                            {
                                eAfter = loop_eDay;
                                break;
                            };
                        };
                        _Timetable.Body.insertBefore(eDay, eAfter);
                    };
                };
            };
        };
    };

    if (bInsert)
    {
        if (oChange.hasOwnProperty('Title'))
            if (window._Lesson_UI)
                if (_Lesson_UI.Date === iDate && _Lesson_UI.Index === iIndex)
                    _Lesson_UI.Overlay.GetUIElement('.Title').value = oChange.Title;
    };
}