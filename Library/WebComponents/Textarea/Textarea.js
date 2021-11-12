class Textarea extends HTMLElement
{
    connectedCallback()
    {
        this.innerHTML =   `<div class='Underline'>
                                <textarea placeholder='${this.getAttribute('placeholder') || ''}' ${this.hasAttribute('readonly') ? 'readonly' : ''} name='${this.getAttribute('name') || ''}'>${this.getAttribute('value') || ''}</textarea>
                            </div>
                            
                            <button></button>`;

        this.etTextarea = this.children[0].children[0];
        this.ebExpand = this.children[1];

        this.iMinimized = 150;
        this.iLimit = this.iMinimized + 35;
        
        this.Resize();
        
        this.bExpanded = parseInt(this.etTextarea.style.height) < this.iLimit;
        this.ExpandHandler();
        this.etTextarea.addEventListener('input', () => { this.ExpandHandler(); });
        addEventListener('resize', () => { this.ExpandHandler(); });
        this.ebExpand.addEventListener('click', () =>
        {
            this.bExpanded = !this.bExpanded;
            this.ExpandHandler();
        });
        document.fonts.addEventListener('ready', () => { this.ExpandHandler(); });

        let iLength = (this.getAttribute('value') || '').length;
        this.etTextarea.setSelectionRange(iLength, iLength);
    }

    ExpandHandler()
    {
        this.Resize();

        if (parseInt(this.etTextarea.style.height) < this.iLimit)
        {
            this.ebExpand.hidden = true;
        }
        else
        {
            this.etTextarea.style.maxHeight = this.bExpanded ? '' : `${this.iMinimized}px`;
            this.ebExpand.hidden = false;
            this.ebExpand.innerHTML =  `<span>${(this.bExpanded ? ['Show less', 'Свернуть'] : ['Show full', 'Показать полностью'])[_iLanguage]}</span>
                                        <custom-icon icon='${this.bExpanded ? 'Expand_Less' : 'Expand_More'}''></svg>`;
        };
    }

    Resize()
    {
        this.etTextarea.style.height = 0;
        this.etTextarea.style.height = (this.etTextarea.scrollHeight - 20 + 2) + 'px';
    }

    get value()
    {
        return this.etTextarea.value;
    }

    set value(sValue)
    {
        this.etTextarea.value = sValue;
        this.ExpandHandler();
    }

    set placeholder(sValue)
    {
        this.etTextarea.setAttribute('placeholder', sValue);
    }
}

customElements.define('custom-textarea', Textarea);