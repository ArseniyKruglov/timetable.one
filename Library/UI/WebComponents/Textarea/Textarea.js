class Textarea extends HTMLElement
{
    connectedCallback()
    {
        let sAttributes = '';
        for (let loop_sAttribute of this.attributes)
            if (loop_sAttribute.nodeName !== 'class')
            {
                sAttributes += `${loop_sAttribute.nodeName}='${loop_sAttribute.nodeValue}' `;
                this.removeAttribute(loop_sAttribute.nodeName);
            };

        this.innerHTML =   `<div class='Underline'>
                                <textarea ${sAttributes}>${this.innerHTML}</textarea>
                            </div>

                            <button></button>`;

        this.eTextarea = this.children[0].children[0];
        this.eExpand = this.children[1];

        this.iMinimized = 150;
        this.iLimit = this.iMinimized + 55;

        this.Scale();

        this.bExpanded = parseInt(this.eTextarea.style.height) < this.iLimit;
        this.ExpandHandler();
        this.eTextarea.addEventListener('input', () => this.ExpandHandler());
        addEventListener('resize', () => this.ExpandHandler());
        this.eExpand.addEventListener('click', () =>
        {
            this.bExpanded = !this.bExpanded;
            this.ExpandHandler();
        });
        document.fonts.ready.then(() => this.ExpandHandler());

        const iLength = (this.getAttribute('value') || '').length;
        this.eTextarea.setSelectionRange(iLength, iLength);
    }

    ExpandHandler()
    {
        this.Scale();

        if (parseInt(this.eTextarea.style.height) < this.iLimit)
        {
            this.eExpand.hidden = true;
        }
        else
        {
            this.eTextarea.style.maxHeight = this.bExpanded ? '' : `${this.iMinimized}px`;
            this.eExpand.hidden = false;
            this.eExpand.innerHTML =  `<span>${(this.bExpanded ? ['Show less', 'Свернуть'] : ['Show full', 'Показать полностью'])[_iLanguage]}</span>
                                        <custom-icon icon='${this.bExpanded ? 'Expand_Less' : 'Expand_More'}''></svg>`;
        };
    }

    Scale()
    {
        this.eTextarea.style.overflow = 'hidden';
        this.eTextarea.style.height = 0;
        this.eTextarea.style.height = (this.eTextarea.scrollHeight - 20 + 2) + 'px';
        this.eTextarea.style.overflow = '';
    }

    get value()
    {
        return this.eTextarea.value;
    }

    set value(sValue)
    {
        this.eTextarea.value = sValue;
        this.ExpandHandler();
    }

    set placeholder(sValue)
    {
        this.eTextarea.setAttribute('placeholder', sValue);
    }
}

customElements.define('custom-textarea', Textarea);