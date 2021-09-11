class Expand extends HTMLElement
{
    connectedCallback()
    {
        this.bExpanded = this.hasAttribute('expanded');
        this.ebExpand = document.createElement('button');
        this.ebExpand.innerHTML =  `<span></span>
                                    <svg width=18px height=18px ${_Icons['Expand_Less']}></svg>`;
        this.insertBefore(this.ebExpand, this.children[1]);
        
        this.ExpandHandler();
        this.ebExpand.addEventListener('click', () => { this.Toggle(); });
    }

    ExpandHandler()
    {
        this.children[2].hidden = !this.bExpanded;
        this.ebExpand.className = this.bExpanded ? 'InnerGray Text Less' : 'InnerGray Text More';
        this.children[1].children[0].innerHTML = (this.bExpanded ? ['Show less', 'Свернуть'] : ['Show full', 'Показать полностью'])[_iLanguage];
    }

    Toggle()
    {
        this.bExpanded = !this.bExpanded;
        this.ExpandHandler();
    }
}

customElements.define('custom-expand', Expand);