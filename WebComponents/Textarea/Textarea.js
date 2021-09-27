class Textarea extends HTMLElement
{
    connectedCallback()
    {
        this.innerHTML =   `<div class='Underline'>
                                <textarea placeholder='${this.getAttribute('placeholder')}' ${this.hasAttribute('readonly') ? 'readonly' : ''}>${this.getAttribute('value') || ''}</textarea>
                            </div>
                            
                            <button>
                                <span></span>
                                <svg width=18px height=18px ${_Icons['Expand_Less']}></svg>
                            </button>`;

        this.etTextarea = this.children[0].children[0];
        this.ebExpand = this.children[1];
        
        this.Resize();
        
        this.bExpanded = parseInt(this.etTextarea.style.height) < 65;
        this.ExpandHandler();
        this.etTextarea.addEventListener('input', () => { this.ExpandHandler(); });
        addEventListener('resize', () => { this.ExpandHandler(); });
        this.ebExpand.addEventListener('click', () =>
        {
            this.bExpanded = !this.bExpanded;
            this.ExpandHandler();
        });
    }

    ExpandHandler()
    {
        this.Resize();

        if (parseInt(this.etTextarea.style.height) < 65)
        {
            this.ebExpand.hidden = true;
        }
        else
        {
            this.etTextarea.style.maxHeight = this.bExpanded ? '' : '65px';
            this.ebExpand.hidden = false;
            this.ebExpand.className = this.bExpanded ? 'InnerGray Text Less' : 'InnerGray Text More';
            this.ebExpand.children[0].innerHTML = (this.bExpanded ? ['Show less', 'Свернуть'] : ['Show full', 'Показать полностью'])[_iLanguage];
        };
    }

    Resize()
    {
        this.etTextarea.style.height = 0;
        this.etTextarea.style.height = (this.etTextarea.scrollHeight + 2) + 'px';
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

    // attributeChangedCallback(sName, xOldValue, xNewValue)
    // {
    //     if (this.innerHTML)
    //         this.etTextarea.setAttribute('placeholder', xNewValue || '');
    // }

    // static get observedAttributes() { return ['placeholder'] }
}

customElements.define('custom-textarea', Textarea);