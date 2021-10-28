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

    history.pushState('', '', location.pathname);
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
                this.Filelds = {};
            };
        }
        else
        {
            this.Filelds = {};
        };

        this.findInWeek_Replacement();
        this.findInWeek_Note();
    }





    findInWeek_Note()
    {
        for (let loop_oNote of _oWeek.LessonNotes)
            if (loop_oNote.Subject === this.DefaultSubject && loop_oNote.Date === this.Date)
            {
                this.oInWeek_Note = loop_oNote;
                return;
            };

        this.oInWeek_Note = null;
    }

    findInWeek_Replacement()
    {
        for (let loop_oReplacement of _oWeek.Replacements)
            if (loop_oReplacement.Date === this.Date && loop_oReplacement.LessonNumber === this.LessonNumber)
            {
                this.oInWeek_Replacement = loop_oReplacement;
                return;
            };

        this.oInWeek_Replacement = null;
    }




    get Alarms()
    {
        return Alarm_Get(this.LessonNumber, this.Date);
    }



    get Replacement()
    {
        return (this.oInWeek_Replacement && !this.Canceled) ? this.oInWeek_Replacement.Replacement : null;
    }

    set Replacement(sReplacement)
    {
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

        SendRequest('/Modules/Details/Lesson/SetReplacement.php', {'Date' : this.Date, 'LessonNumber' : this.LessonNumber, 'Subject' : this.Subject, 'Replacement' : this.DefaultSubject});

        if (this.Element)
        {
            if (this.Canceled)
                this.Element.classList.add('Canceled');
            else
                this.Element.classList.remove('Canceled');
    
            this.Element.children[1].children[0].innerHTML = this.Replacement ?? '';
        };

        Information_Draw();
        if (this.Canceled !== bWasCanceled)
        {
            let eDay = Timetable_GetDayElement(this.Date);
            if (eDay)
                eDay.children[0].children[1].innerHTML = Timetable_GetPeriod(this.Date);
        };

        this.findInWeek_Note();
        this.showPoint();
        document.getElementById('LessonDetails_Text').value = this.Note;
    }

    get Canceled()
    {
        if (this.oInWeek_Replacement)
            if (this.oInWeek_Replacement.Replacement === '')
                return true

        return false;
    }



    get Note()
    {
        return this.oInWeek_Note ? this.oInWeek_Note.Text : '';
    }

    set Note(sNote)
    {
        sNote = sNote.trim();

        if (sNote || this.Attachments.length)
        {
            if (this.oInWeek_Note)
            {
                this.oInWeek_Note.Text = sNote;
            }
            else
            {
                this.oInWeek_Note = 
                {
                    'Subject': this.DefaultSubject,
                    'Date': this.Date,
                    'Text': sNote,
                    'Attachments': []
                };

                _oWeek.LessonNotes.push(this.oInWeek_Note);                
            };
        }
        else
        {
            if (this.oInWeek_Note)
                _oWeek.LessonNotes.removeWhere({ 'Date': this.Date, 'Subject': this.DefaultSubject }, true);

            this.oInWeek_Note = null;
        };

        SendRequest('/Modules/Details/Lesson/SetText.php', {'Date' : this.Date, 'Subject' : this.DefaultSubject, 'Note' : this.Note});

        this.showPoint();
    }



    get Element()
    {
        return Timetable_GetLessonElement(this.Date, this.LessonNumber);
    }



    get Attachments()
    {
        return [];
    }



    get DefaultSubject()
    {
        return this.Added || (this.Replacement ?? this.Subject);
    }

    showPoint()
    {
        for (let loop_eLesson of Timetable_GetLessonElements(this.Date))
        {
            let loop_sReplacement = loop_eLesson.children[1].children[0].innerHTML;
            let loop_sSubject = loop_eLesson.children[1].children[1].innerHTML;

            if ((loop_sReplacement || loop_sSubject) === this.DefaultSubject)
                if (this.oInWeek_Note)
                    loop_eLesson.classList.add('Note');
                else
                    loop_eLesson.classList.remove('Note');
        };
    }
}