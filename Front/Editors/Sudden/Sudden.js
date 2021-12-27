class SuddenLesson_UI
{
    constructor(iDate, bAnimation)
    {
        this.Title = '';
        this.Date = iDate;
        const aLessons = _Timetable.DateToIndexes(this.Date);
        this.Index = ((aLessons.length) ? Math.max(...aLessons) : 0) + 1;

        this.Overlay = new Overlay();
        this.Overlay.Callback_Open = () =>
        {
            this.Draw();
            this.Overlay.Link = '/' + location.pathname.split('/')[2] + location.search + `/Add`;
        };
        this.Overlay.Callback_Close = () => delete window._Sudden_UI;
        this.Overlay.Animation = bAnimation;
        this.Overlay.Open();
    }



    Draw()
    {
        this.Overlay.Container.className = 'Island Overlay_Rectangular DetailsContainer';
        this.Overlay.Body.className = 'Details Adder';

        let HTML = `<div class='Header'>
                        <span><custom-round-button icon='Arrow Back'></custom-round-button></span>
                        <span><custom-round-button icon='Done'</custom-round-button></span>
                    </div>

                    <div>
                        <custom-textarea placeholder='${['Title', 'Название'][_iLanguage]}' class='Title' maxlength=${_iMaxTitleLength} required></custom-textarea>
                        <div class='Strict Invalid Caution Top'>
                            <span></span>
                            <span>${['Enter a lesson title', 'Укажите название занятия'][_iLanguage]}.</span>
                        </div>
                    </div>

                    <div class='Info'>
                        <div>
                            <div></div>
                            <div class='Caution Bottom'>
                                <span></span>
                                <span></span>
                            </div>
                            <custom-icon icon='Calendar'></custom-icon>
                            <input type=date min='1970-01-01' value='${IntToDate(this.Date).toISOString().slice(0, 10)}' class='Calendar' required placeholder='${['Date', 'Дата'][_iLanguage]}'>
                        </div>

                        <div>
                            <div></div>
                            <div class='Caution Bottom'>
                                <span></span>
                                <span></span>
                            </div>
                            <custom-icon icon='Alarm'></custom-icon>
                            <input type=number value=${this.Index} min=-128 max=127 class='Index' required placeholder='${['Number', 'Номер'][_iLanguage]}'>
                        </div>
                    </div>`;

        this.Overlay.Body.innerHTML = HTML;


        {
            this.Overlay.GetUIElement('.Header').children[0].addEventListener('click', () => this.Overlay.Close());
            this.Overlay.GetUIElement('.Header').children[1].addEventListener('click', () =>
            {
                if (this.Title && this.Date && this.Index)
                    this.Send();
                else
                    this.Overlay.Body.classList.add('Strict');
           });

            let SetError = (bValid, bStrict, sError) =>
            {
                if (bValid)
                {
                    event.target.previousElementSibling.previousElementSibling.classList.remove('Invalid');
                }
                else
                {
                    event.target.previousElementSibling.previousElementSibling.classList.add('Invalid');

                    if (bStrict === true)
                        event.target.previousElementSibling.previousElementSibling.classList.add('Strict');
                    else
                        event.target.previousElementSibling.previousElementSibling.classList.remove('Strict');

                    event.target.previousElementSibling.previousElementSibling.children[1].innerHTML = sError;
                };
            };
            this.Overlay.GetUIElement('.Title').addEventListener('input', event =>
            {
                this.Title = event.target.value.trim();

                if (this.Title)
                    event.target.parentElement.parentElement.nextElementSibling.classList.remove('Invalid');
                else
                    event.target.parentElement.parentElement.nextElementSibling.classList.add('Invalid');
            });
            this.Overlay.GetUIElement('.Calendar').addEventListener('input', event =>
            {
                this.Date = event.target.value;

                this.Overlay.GetUIElement('.Index').dispatchEvent(new Event('input'));

                if (this.Date)
                {
                    this.Date = DateToInt(new Date(this.Date));

                    SetError(true);
                }
                else
                {
                    SetError(false, true, event.target.validationMessage);
                };
            });
            this.Overlay.GetUIElement('.Index').addEventListener('input', event =>
            {
                this.Index = event.target.value;

                event.target.setCustomValidity('');
                if (event.target.checkValidity())
                {
                    this.Index = parseInt(this.Index);

                    if (this.Overlay.GetUIElement('.Calendar').value)
                        if (_Timetable.DateToIndexes(DateToInt(new Date(this.Overlay.GetUIElement('.Calendar').value)), true).includes(this.Index))
                        {
                            this.Index = false;
                            event.target.setCustomValidity([`There's a lesson for this time.`, 'На это время уже назначено занятие.'][_iLanguage]);
                            SetError(false, false, [`There's a lesson for this time.`, 'На это время уже назначено занятие.'][_iLanguage]);
                        };

                    if (event.target.checkValidity())
                        SetError(true);
                    else
                        SetError(false, false, event.target.validationMessage);
                };
            });
        }
    }



    Send()
    {
        Lesson_SetChange(this.Date, this.Index, { 'Title': this.Title }, true, true, true, false);

        this.Overlay.Close();
    }
}