function Lesson_SetChange(iDate, iIndex, oChange, bDraw, bSend, bRecord, bInsert, oInRecords_Change, sOriginalTitle)
{
    oInRecords_Change = oInRecords_Change || _Records.Changes.selectWhere({ 'Date': iDate, 'Index': iIndex }, true);

    if (sOriginalTitle === undefined)
    {
        const mDayTimetable = _Timetable.DateToTimetable(iDate);
        const oInTimetable = mDayTimetable.get(iIndex)
        if (oInTimetable)
            sOriginalTitle = oInTimetable.Title;
        else
            sOriginalTitle = null;
    };

    let oInRecords_Note;
    if (oChange.hasOwnProperty('Title'))
        oInRecords_Note = _Records.Notes.selectWhere({ 'Date': iDate, 'Title': (oChange.Title || sOriginalTitle) }, true) || null;



    if (bRecord)
    {
        function CleanUp(oChange)
        {
            if (('Title' in oChange) && ((sOriginalTitle === null) ? (!oChange.Title) : (oChange.Title === sOriginalTitle)))
                delete oChange.Title;

            for (let loop_sProperty in oChange)
                if (oChange[loop_sProperty] === null)
                    delete oChange[loop_sProperty];

            if (Object.keys(oInRecords_Change).length === 2)
                return null;
            else
                return oChange;
        }



        if (oInRecords_Change)
        {
            for (let loop_sProperty in oChange)
                if (loop_sProperty === 'UserFields')
                {
                    if (oChange.UserFields === null)
                        delete oInRecords_Change.UserFields;
                    else
                        for (let loop_aField of oChange.UserFields)
                            if (loop_aField[1] === null)
                            {
                                if ('UserFields' in oInRecords_Change)
                                    oInRecords_Change.UserFields.delete(loop_aField[0])
                            }
                            else
                            {
                                if (!('UserFields' in oInRecords_Change))
                                    oInRecords_Change.UserFields = new Map();

                                oInRecords_Change.UserFields.set(loop_aField[0], loop_aField[1]);
                            };
                }
                else
                {
                    oInRecords_Change[loop_sProperty] = oChange[loop_sProperty];
                };

            oInRecords_Change = CleanUp(oInRecords_Change);

            if (!oInRecords_Change)
                _Records.Changes.removeWhere({ 'Date': iDate, 'Index': iIndex }, true);
        }
        else
        {
            oInRecords_Change =
            {
                'Date': iDate,
                'Index': iIndex
            };

            for (let loop_sProperty in oChange)
                oInRecords_Change[loop_sProperty] = oChange[loop_sProperty];

            oInRecords_Change = CleanUp(oInRecords_Change);

            if (oInRecords_Change)
                _Records.Changes.push(oInRecords_Change);
        };

        if (bSend)
        {
            const oSend =
            {
                'Date': iDate,
                'Index': iIndex,
                'OriginalTitle': sOriginalTitle
            };

            for (let loop_sProperty in oChange)
                if (loop_sProperty === 'UserFields')
                    if (oChange.UserFields === null)
                        oSend.UserFields = null;
                    else
                        for (let loop_aField of oChange.UserFields)
                            oSend[`UserFields[${loop_aField[0]}]`] = loop_aField[1];
                else
                    oSend[loop_sProperty] = oChange[loop_sProperty];

            SendRequest('/Back/Lesson_Change.php', oSend);
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
                    _Lesson_UI.Overlay.GetUIElement('.Title').className = `Title ${_Lesson_UI.IsSudden ? 'Sudden' : (_Lesson_UI.IsChanged ? 'Change' : '')}`;
                    _Lesson_UI.Overlay.GetUIElement('.Note').value = _Lesson_UI.Note;
                    _Lesson_UI.Overlay.GetUIElement('.Attachments').innerHTML = _Lesson_UI.GetAttachmentsIHTML();
                };



            if (window._Sudden_UI)
                _Sudden_UI.Overlay.GetUIElement('.Index').dispatchEvent(new Event('input'));
        };

        if (oChange.hasOwnProperty('Title') || oChange.hasOwnProperty('Place'))
            _Information.Update(iDate);

        if (oChange.hasOwnProperty('Place') || oChange.hasOwnProperty('Educator') || oChange.hasOwnProperty('UserFields'))
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
                eLesson.parentElement.classList.remove('Canceled', 'Change', 'Note');

                if (eLesson.parentElement.classList.contains('Sudden'))
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
                        eLesson.innerHTML = oChange.Title;
                    };
                }
                else
                {
                    if (oInRecords_Change && 'Title' in oInRecords_Change)
                    {
                        if (oInRecords_Change.Title === '')
                        {
                            eLesson.innerHTML = sOriginalTitle;
                            eLesson.parentElement.classList.add('Canceled');
                        }
                        else
                        {
                            eLesson.innerHTML = oInRecords_Change.Title;
                            eLesson.parentElement.classList.add('Change');
                        };
                    }
                    else
                    {
                        eLesson.innerHTML = sOriginalTitle;
                    };
                };

                if (oInRecords_Note)
                    eLesson.parentElement.classList.add('Note');    // Нужно?
            }
            else if (oInRecords_Change && 'Title' in oInRecords_Change && oInRecords_Change.Title !== '')
            {
                if (_Timetable.WeekPeriod[0] <= iDate && iDate <= _Timetable.WeekPeriod[1])
                {
                    const HTML = `<span>${iIndex}</span>
                                  <a ${_Timetable.LessonAttributes(iDate, iIndex)}>${oInRecords_Change.Title}</a>`;

                    let eDay = _Timetable.DaySelector(iDate);
                    if (eDay)
                    {
                        const eLesson = document.createElement('div');
                        eLesson.className = `Lesson Sudden ${oInRecords_Note ? 'Note' : ''}`;
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
                        eDay.className = `Day ${ (iDate === _iToday) ? 'Today' : ((iDate === _iToday + 1) ? 'Tomorrow' : '') } ${ _Records.Notes.selectWhere({ 'Date': iDate, 'Title': undefined }, true) ? 'Note' : '' }`;
                        eDay.innerHTML = `<a href='${location.pathname}?Date=${iDate}' onclick="event.preventDefault(); _Router.Forward('/Day?Date=${iDate}');">
                                            <div>${Date_Format(IntToDate(iDate))}</div>
                                            <div class='EmptyHidden'>${_Timetable.DateToAlarmsPeriod(iDate)}</div>
                                          </a>

                                          <div>
                                            <div class='Lesson Sudden ${oInRecords_Note ? 'Note' : ''}'>${HTML}</div>
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
                    _Lesson_UI.Overlay.GetUIElement('.Title').value = _Lesson_UI.IsCanceled ? '' : _Lesson_UI.Title;
    };
}