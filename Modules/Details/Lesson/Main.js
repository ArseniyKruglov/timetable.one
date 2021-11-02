function LessonDetails(iDate, iLessonNumber)
{    
    Overlay_Open
    (
        'LessonDetails',
        () => { LessonDetails_Draw(iDate, iLessonNumber) },
        () => {},
        LessonDetails_Close
    );
}

function LessonDetails_Close()
{
    Overlay_Remove('LessonDetails');

    delete _cLesson;
}

class Lesson
{
    constructor(iDate, iLessonNumber)
    {
        this.Date = iDate;
        this.LessonNumber = iLessonNumber;



        let mDayTimetable = Timetable_GetDayTimetable(this.Date);

        if (mDayTimetable)
        {
            let oLesson = mDayTimetable.get(this.LessonNumber);

            if (oLesson)
            {
                this.Subject = oLesson.Subject;
                this.Filelds = { 'LectureHall': oLesson.LectureHall, 'Educator': oLesson.Educator };
            }
            else
            {
                this.findInWeek_Added();
                this.Filelds = {};
            };
        }
        else
        {
            this.findInWeek_Added();
            this.Filelds = {};
        };



        this.findInWeek_Replacement();
        this.findInWeek_Note();
    }





    findInWeek_Note()
    {
        if (this.oInWeek_Note)
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({ 'Date': this.Date, 'Subject': this.TimetableSubject }, true) || null;
            
            Timetable_SetPoint(this.Date, this.TimetableSubject, this.oInWeek_Note);
            document.getElementById('LessonDetails_Text').value = this.Note;
        }
        else
        {
            this.oInWeek_Note = _oWeek.LessonNotes.selectWhere({ 'Date': this.Date, 'Subject': this.TimetableSubject }, true) || null;
        };
    }

    findInWeek_Replacement()
    {
        this.oInWeek_Replacement = _oWeek.Replacements.selectWhere({ 'Date': this.Date, 'LessonNumber': this.LessonNumber }, true) || null;
    }

    findInWeek_Added()
    {
        this.oInWeek_Added = _oWeek.AddedLessons.selectWhere({ 'Date': this.Date, 'LessonNumber': this.LessonNumber }, true) || null;
    }



    get Added()
    {
        return this.oInWeek_Added ? this.oInWeek_Added.Subject : null;
    }

    set Added(sSubject)
    {
        sSubject = sSubject.trim();

        if (sSubject === '')
        {
            if (confirm(`${['Remove lesson', 'Удалить занятие'][_iLanguage]} "${this.Added}" (${Time_FormatDate(Time_From1970(this.Date))})?`))
            {
                SendRequest('/Modules/Details/Lesson/SetSubject.php', {'Date' : this.Date, 'LessonNumber' : this.LessonNumber, 'Subject' : ''});

                _oWeek.AddedLessons.removeWhere({ 'Date': this.Date, 'LessonNumber': this.LessonNumber }, true);

                if (this.Element.parentElement.children.length === 1)
                    this.DayElement.remove();
                else
                    this.Element.remove();

                LessonDetails_Close();
            }
            else
            {
                document.getElementById('LessonDetails_Subject').value = this.Added;
            };
        }
        else
        {
            this.oInWeek_Added.Subject = sSubject;
            
            SendRequest('/Modules/Details/Lesson/SetSubject.php', {'Date' : this.Date, 'LessonNumber' : this.LessonNumber, 'Subject' : this.Added});

            Information_Draw();
            if (this.Element)
                this.Element.children[1].children[1].innerHTML = this.Added;

            this.findInWeek_Note();
        };
    }



    get Replacement()
    {
        return (this.oInWeek_Replacement && !this.Canceled) ? this.oInWeek_Replacement.Replacement : null;
    }

    set Replacement(sReplacement)
    {
        sReplacement = sReplacement.trim();

        let bWasCanceled = this.Canceled;
        
        if (sReplacement === this.Subject)
        {    
            if (this.oInWeek_Replacement)
                _oWeek.Replacements.removeWhere({ 'Date': this.Date, 'LessonNumber': this.LessonNumber }, true);

            this.oInWeek_Replacement = null;
        }
        else
        {
            if (this.oInWeek_Replacement)
            {
                this.oInWeek_Replacement.Replacement = sReplacement;
            }
            else
            {
                this.oInWeek_Replacement = 
                {
                    'Date': this.Date,
                    'LessonNumber': this.LessonNumber,
                    'Replacement': sReplacement
                };

                _oWeek.Replacements.push(this.oInWeek_Replacement);                
            };
        };

        SendRequest('/Modules/Details/Lesson/SetReplacement.php', {'Date': this.Date, 'LessonNumber': this.LessonNumber, 'Subject': this.Subject, 'Replacement': sReplacement});

        Information_Draw();
        if (this.Canceled !== bWasCanceled)
        {
            if (this.DayElement)
                this.DayElement.children[0].children[1].innerHTML = Timetable_GetPeriod(this.Date);
        };

        if (this.Element)
        {
            if (this.Canceled)
                this.Element.classList.add('Canceled');
            else
                this.Element.classList.remove('Canceled');
    
            this.Element.children[1].children[0].innerHTML = this.Replacement ?? '';
        };

        this.findInWeek_Note();
    }

    get Canceled()
    {
        if (this.oInWeek_Replacement)
            if (this.oInWeek_Replacement.Replacement === '')
                return true;

        return false;
    }
    
    restoreReplacement()
    {
        document.getElementById('LessonDetails_Subject').value = this.Subject;

        this.Replacement = this.Subject;
    }



    get Note()
    {
        return this.oInWeek_Note ? this.oInWeek_Note.Note : '';
    }

    set Note(sNote)
    {
        sNote = sNote.trim();

        if (sNote)
        {
            if (this.oInWeek_Note)
            {
                this.oInWeek_Note.Note = sNote;
            }
            else
            {
                this.oInWeek_Note = 
                {
                    'Subject': this.TimetableSubject,
                    'Date': this.Date,
                    'Note': sNote
                };

                _oWeek.LessonNotes.push(this.oInWeek_Note);                
            };
        }
        else
        {
            if (this.oInWeek_Note)
                _oWeek.LessonNotes.removeWhere({ 'Date': this.Date, 'Subject': this.TimetableSubject }, true);

            this.oInWeek_Note = null;
        };

        SendRequest('/Modules/Details/Lesson/SetText.php', {'Date': this.Date, 'Subject': this.TimetableSubject, 'Note': this.Note});

        Timetable_SetPoint(this.Date, this.TimetableSubject, this.oInWeek_Note);
    }



    get TimetableSubject()
    {
        return this.Added || (this.Replacement ?? this.Subject);
    }

    get DayElement()
    {
        return Timetable_GetDayElement(this.Date);
    }

    get Element()
    {
        return Timetable_GetLessonElement(this.Date, this.LessonNumber);
    }



    get Alarms()
    {
        return Alarm_Get(this.LessonNumber, this.Date);
    }
}