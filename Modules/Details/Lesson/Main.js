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

    delete _LessonDetails;
}

class Lesson
{
    constructor(iDate, iLessonNumber)
    {
        this.iDate = iDate;
        this.iLessonNumber = iLessonNumber;

        let mDayTimetable = Timetable_GetDayTimetable(iDate);

        if (!mDayTimetable)
            this.bAdded = false;
        else
            this.bAdded = (mDayTimetable.get(this.iLessonNumber) === undefined);

        if (this.bAdded === false)
        {
            this.sSubject = mDayTimetable.get(this.iLessonNumber)['Subject'];
            for (let loop_oReplacement of _oWeek['Replacements'])
                if (loop_oReplacement['Date'] === iDate && loop_oReplacement['LessonNumber'] === this.iLessonNumber)
                {
                    this.sReplacement = loop_oReplacement['Replacement'];
                    break;
                };
            this.sLectureHall = mDayTimetable.get(this.iLessonNumber)['LectureHall'];
            this.sEducator = mDayTimetable.get(this.iLessonNumber)['Educator'];
        }
        else
        {
            for (let loop_oAddedLesson of _oWeek['AddedLessons'])
                if (loop_oAddedLesson['Date'] === iDate && loop_oAddedLesson['LessonNumber'] === this.iLessonNumber)
                {
                    this.sSubject = loop_oAddedLesson['Subject'];
                    break;
                };
        };



        for (let loop_oLessonNote of _oWeek['LessonNotes'])
            if (loop_oLessonNote['Subject'] === LessonDetails_DisplayedSubject(this.sSubject, this.sReplacement) && loop_oLessonNote['Date'] === this.iDate)
            {
                this.oInWeek = loop_oLessonNote;
                break;
            };
    }



    get Note()
    {
        return this.oInWeek ? this.oInWeek.Text : '';
    }

    set Note(sNote)
    {
        sNote = sNote.trim();

        if (sNote || this.Attachments.length)
        {
            if (this.oInWeek)
            {
                this.oInWeek.Text = sNote;
            }
            else
            {
                this.oInWeek = 
                {
                    'Subject': this.DefaultSubject,
                    'Date': this.iDate,
                    'Text': sNote,
                    'Attachments': []
                };

                _oWeek.LessonNotes.push(this.oInWeek);                
            };
        }
        else
        {
            this.oInWeek = null;

            if (this.oInWeek)
                for (let i = 0; i < _oWeek.LessonNotes.length; i++)
                    if (_oWeek.LessonNotes[i]['Date'] === this.iDate && _oWeek.LessonNotes[i]['Subject'] === this.DefaultSubject)
                    {
                        _oWeek.LessonNotes.splice(i, 1);
                        break;
                    };
        };


        SendRequest('/Modules/Details/Lesson/SetText.php', {'Date' : this.iDate, 'Subject' : this.DefaultSubject, 'Note' : this.Note});

        this.showPoint();
    }



    get Attachments()
    {
        return this.oInWeek ? this.oInWeek.Attachments : [];
    }

    set Attachments(aAttachments)
    {
        if (this.Text || aAttachments.length)
        {
            if (this.oInWeek)
            {
                this.oInWeek.Attachments = aAttachments;
            }
            else
            {
                this.oInWeek = 
                {
                    'Subject': this.DefaultSubject,
                    'Date': this.iDate,
                    'Text': '',
                    'Attachments': aAttachments
                };

                _oWeek.LessonNotes.push(this.oInWeek);                
            };
        }
        else
        {
            this.oInWeek = null;

            if (this.oInWeek)
                for (let i = 0; i < _oWeek.LessonNotes.length; i++)
                    if (_oWeek.LessonNotes[i]['Date'] === this.iDate && _oWeek.LessonNotes[i]['Subject'] === this.DefaultSubject)
                    {
                        _oWeek.LessonNotes.splice(i, 1);
                        break;
                    };
        };

        this.showPoint();
    }

    uploadFiles(aFiles)
    {
        let Form = new FormData();
        for (let i = 0; i < aFiles.length; i++)
            Form.append(`File[${i}]`, aFiles[i]);
        Form.append('Date', this.iDate);
        Form.append('Subject', this.DefaultSubject);
                    
        let XHR = new XMLHttpRequest();
        XHR.open('POST', '/Modules/Details/Lesson/AddAttachment.php');

        let eProgressBar = document.getElementById('LessonDetails_Attachments').lastElementChild.children[0];
        XHR.upload.onprogress = (event) => { eProgressBar.style = `width: ${event.loaded / event.total * 100}%; opacity: 100%`; };

        XHR.onreadystatechange = () => { if (XHR.readyState === 4)
        {
            if (XHR.status === 200)
            {
                eProgressBar.style = `width: 100%; opacity: 0%`;
                
                let aFolders = JSON.parse(XHR.response);
                if (aFolders.length)
                {
                    // Получение или создание элемента списка файлов
                    let eAttachmentsList = document.getElementById('LessonDetails_Attachments_List');
                    if (eAttachmentsList === null)
                    {
                        // Cоздание элемента списка файлов
                        eAttachmentsList = document.createElement('div');
                        eAttachmentsList.id = 'LessonDetails_Attachments_List';
        
                        // Вставка элемента списка файлов и разделителя
                        let eAttachments = document.getElementById('LessonDetails_Attachments');
                        eAttachments.insertBefore(eAttachmentsList, eAttachments.insertBefore(document.createElement('hr'), eAttachments.firstChild));
                    };
        
                    let aNewAttachments = [];
                    for (let i = 0; i < aFolders.length; i++)
                    {
                        // Создание и вставка элемента
                        let eAttachment = document.createElement('div');
                        eAttachment.innerHTML = Details_GetAttachmentIHTML(aFolders[i], aFiles[i].name);
                        eAttachmentsList.append(eAttachment);
        
                        // Добавление в массив
                        aNewAttachments.push([aFolders[i], aFiles[i].name]);
                    };
                    this.Attachments = this.Attachments.concat(aNewAttachments);
                };
            }
            else if (XHR.status === 403)
            {
                alert('Отказано в доступе');
            };
        }; };
        XHR.send(Form);
    }

    removeAttachment(eElement, sFolder, sFilename)
    {
        if (confirm(`${['Remove', 'Удалить'][_iLanguage]} ${sFilename}?`) === true)
        {
            SendRequest('/Modules/Details/Lesson/RemoveAttachment.php', {'Date' : this.iDate, 'Subject' : this.DefaultSubject, 'Folder' : sFolder});
        
            let bNowEmpty = (this.Attachments.length === 1);
    
            //  Массив недели
            if (bNowEmpty === true)
            {
                this.Attachments = [];
            }
            else
            {
                let aAttachments = this.Attachments;
                for (let i = 0; i < aAttachments.length; i++)
                    if (aAttachments[i][0] === sFolder)
                    {
                        aAttachments.splice(i, 1);
                        break;
                    };
                
                this.Attachments = aAttachments;
            };
        
        
            
            if (bNowEmpty === true)
            {
                eElement.parentElement.parentElement.parentElement.children[1].remove();
                eElement.parentElement.parentElement.parentElement.children[0].remove();
            }
            else
            {
                eElement.parentElement.remove();
            };
        };
    }



    get DefaultSubject()
    {
        return this.sReplcement ? this.sReplcement : this.sSubject;
    }

    showPoint()
    {
        for (let loop_eLesson of Timetable_GetLessonElements(this.iDate))
        {
            let loop_sReplacement = loop_eLesson.children[1].children[0].innerHTML;
            let loop_sSubject = loop_eLesson.children[1].children[1].innerHTML;

            if (LessonDetails_DisplayedSubject(loop_sSubject, loop_sReplacement) === this.DefaultSubject)
                if (this.oInWeek)
                    loop_eLesson.classList.add('Note');
                else
                    loop_eLesson.classList.remove('Note');
        };
    }v
}