function Week_Update()
{
    SendRequest('/PHP/Week/Get.php', {}, true).then((aJSON) =>
    {
        _oWeek = aJSON;

        if (window._LessonDetails_iDate !== undefined && window._LessonDetails_iLessonNumber !== undefined)
        {
            if (window._LessonDetails_bAdded === true)
            {
                let sLessonDetails_Subject;

                for (let loop_aAddedLesson of _oWeek['AddedLessons'])
                    if (window._LessonDetails_iDate === loop_aAddedLesson['Date'] && window._LessonDetails_iLessonNumber === loop_aAddedLesson['LessonNumber'])
                        sLessonDetails_Subject = loop_aAddedLesson['Subject'];

                if (sLessonDetails_Subject === undefined)
                {
                    LessonDetails_Close();
                }
                else
                {
                    document.getElementById('LessonDetails_Subject').value = sLessonDetails_Subject;
                    _LessonDetails_sSubject = sLessonDetails_Subject;
                };
            }
            else
            {
                let sLessonDetails_Subject;

                for (let loop_oReplacement of _oWeek['Replacements'])
                    if (window._LessonDetails_iDate === loop_oReplacement['Date'] && window._LessonDetails_iLessonNumber === loop_oReplacement['LessonNumber'])
                        sLessonDetails_Subject = loop_oReplacement['Replacement'];

                _LessonDetails_sReplacement = sLessonDetails_Subject;
                document.getElementById('LessonDetails_Subject').value = (_LessonDetails_sReplacement !== undefined) ? _LessonDetails_sReplacement : _LessonDetails_sSubject;
                document.getElementById('LessonDetails_Reset').hidden = (_LessonDetails_sReplacement === undefined || _iAccessLevel < 2);
            };

            if (window._LessonDetails_iDate !== undefined && window._LessonDetails_iLessonNumber !== undefined)
            {
                let sLessonDetails_Text;

                for (let loop_oLessonNote of _oWeek['LessonNotes'])
                    if (window._LessonDetails_iDate === loop_oLessonNote['Date'] && (_LessonDetails_sReplacement ? _LessonDetails_sReplacement : _LessonDetails_sSubject) === loop_oLessonNote['Subject'])
                        sLessonDetails_Text = loop_oLessonNote['Note'];

                document.getElementById('LessonDetails_Text').value = sLessonDetails_Text || '';
            };
        };

        if (window._DayDetails_iDate !== undefined)
        {
            let sNote;

            for (let loop_oDayNote of _oWeek['DayNotes'])
                if (loop_oDayNote['Date'] === _DayDetails_iDate)
                {
                    sNote = loop_oDayNote['Note'];
                    break;
                };

            document.getElementById('DayDetails_Text').value = sNote || '';
        };



        let aWeekPeriod = Week_GetPeriod(_iWeekOffset);

        for (let loop_eDay of document.querySelectorAll('.Day.Note'))
            loop_eDay.classList.remove('Note');

        for (let iDate = aWeekPeriod[0]; iDate <= aWeekPeriod[1]; iDate++)
        {
            let eDay = Timetable_GetDayElement(iDate);
            if (eDay !== null)
                eDay.children[0].children[1] = Week_GetPeriod(iDate);
        };

        for (let loop_eLesson of document.querySelectorAll('.Lesson'))
            loop_eLesson.children[1].children[0].innerHTML = '';

        for (let loop_eLesson of document.querySelectorAll('.Lesson.Note'))
            loop_eLesson.classList.remove('Note');

        for (let loop_eLesson of document.querySelectorAll('.Lesson.Added'))
            loop_eLesson.remove();

        Week_Fill(aWeekPeriod);
        Information_Draw();
    });
}

function Week_Fill(aWeekPeriod)
{
    for (let loop_oReplacement of _oWeek['Replacements'])
        if (aWeekPeriod[0] <= loop_oReplacement['Date'] && loop_oReplacement['Date'] <= aWeekPeriod[1])
        {
            let eLesson = Timetable_GetLessonElement(loop_oReplacement['Date'], loop_oReplacement['LessonNumber']);
            if (eLesson)
            {
                if (loop_oReplacement['Replacement'] === '')
                    eLesson.classList.add('Canceled');
                else
                    eLesson.children[1].children[0].innerHTML = loop_oReplacement['Replacement'];
            };
        };

    for (let loop_oAddedLesson of _oWeek['AddedLessons'])
        if (aWeekPeriod[0] <= loop_oAddedLesson['Date'] && loop_oAddedLesson['Date'] <= aWeekPeriod[1])
        {
            let eLesson = document.createElement('div');
            eLesson.className = 'Lesson Added';
            eLesson.innerHTML =    `<span>${loop_oAddedLesson['LessonNumber']}</span>
                                    <a ${Timetable_GetLessonLinkAttributes(loop_oAddedLesson['Date'], loop_oAddedLesson['LessonNumber'])}>
                                        <span></span>
                                        <span>${loop_oAddedLesson['Subject']}</span>
                                    </a>`;

            let eAfter = null;
            let bSame = false;
            for (let loop_aLesson of Timetable_GetLessonElements(loop_oAddedLesson['Date']))
            {
                let iLessonNumber = parseInt(loop_aLesson.children[0].innerHTML);

                if (iLessonNumber === loop_oAddedLesson['LessonNumber'])
                {
                    bSame = true;
                    break;
                };

                if (iLessonNumber > loop_oAddedLesson['LessonNumber'])
                {
                    eAfter = loop_aLesson;
                    break;
                };
            };
            if (bSame === false)
                Timetable_GetDayElement(loop_oAddedLesson['Date']).children[1].insertBefore(eLesson, eAfter);
        };

    for (let loop_oLessonNote of _oWeek['LessonNotes'])
        if (aWeekPeriod[0] <= loop_oLessonNote['Date'] && loop_oLessonNote['Date'] <= aWeekPeriod[1])
            for (let loop_eLesson of Timetable_GetLessonElements(loop_oLessonNote['Date']))
            {
                let sReplacement = loop_eLesson.children[1].children[0].innerHTML;
                let sSubject = loop_eLesson.children[1].children[1].innerHTML;
                if ((sReplacement ? sReplacement : sSubject) === loop_oLessonNote['Subject'])
                    loop_eLesson.classList.add('Note');
            };

    for (let loop_oDayNote of _oWeek['DayNotes'])
        if (aWeekPeriod[0] <= loop_oDayNote['Date'] && loop_oDayNote['Date'] <= aWeekPeriod[1])
        {
            let eDay = Timetable_GetDayElement(loop_oDayNote['Date']);
            if (eDay !== null)
                eDay.classList.add('Note');
        };
}

function Week_Select()
{
    Timetable_Draw();
    Timetable_Overflow(document.getElementById('Timetable'));
    document.fonts.ready.then(Timetable_Scroll);

    let sWeekClass;
    if (_iWeekOffset === 0)
        sWeekClass = 'Current';
    else if (_iWeekOffset === 1)
        sWeekClass = 'Next';
    else if (_iWeekOffset < 0)
        sWeekClass = 'Past';
    document.getElementById('Week').className = `Island ${sWeekClass}`;

    let aWeekPeriod = Week_GetPeriod(_iWeekOffset);
    Week_Fill(aWeekPeriod);
    document.getElementById('Week_Period').innerHTML = `${Date_Format_Short(Time_From1970(aWeekPeriod[0]))} – ${Date_Format_Short(Time_From1970(aWeekPeriod[1]))}`;
}

function Week_CallTimetableChange(iDate)
{
    dispatchEvent(new CustomEvent('TimetableChange', { detail: {'Date': iDate}}));

    let eDay = Timetable_GetDayElement(iDate);
    if (eDay)
        eDay.children[0].children[1].innerHTML = Timetable_GetPeriod(iDate);

    Information_Draw();
}