class Checkbox extends HTMLElement
{
    connectedCallback()
    {
        this.innerHTML =    `<label style='--Color: ${this.getAttribute('color') || 'var(--Main)'}'>
                                <input type='checkbox' ${ this.hasAttribute('checked') ? 'checked' : '' }>
                                <div>
                                    <span>
                                        <svg viewBox='0 0 24 24' fill='var(--Color)' hidden><path d='m19,19l-14,0m14,-16l-14,0c-1.1,0 -2,0.9 -2,2l0,14c0,1.1 0.9,2 2,2l14,0c1.1,0 2,-0.9 2,-2l0,-14c0,-1.1 -0.9,-2 -2,-2z'/></svg>
                                        <svg viewBox='0 0 24 24' fill='var(--Color)'><path d='M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/></svg>
                                        <svg viewBox='0 0 24 24' fill='var(--Color)'><path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/></svg>
                                    </span>
                                    <span hidden></span>
                                    <span class='EmptyHidden'>${this.getAttribute('name') || ''}</span>
                                </div>
                            </label>`;

        this.eiCheckbox = this.children[0].children[0];
        this.esName = this.children[0].children[1].children[2];
        this.evChecked = this.children[0].children[1].children[0].children[1];
        this.evUnchecked = this.children[0].children[1].children[0].children[2];

        this.addEventListener('change', () => 
        {
            PlayClass(this.children[0], this.eiCheckbox.checked ? 'Checked' : 'Unchecked', 500);
        });
    }

    get checked()
    {
        return this.eiCheckbox.checked;
    }

    set checked(bChecked)
    {
        if (bChecked != this.eiCheckbox.checked)
        {
            this.eiCheckbox.checked = bChecked;
            PlayClass(this.children[0], bChecked ? 'Checked' : 'Unchecked', 500);
        };
    }

    // attributeChangedCallback(sName, xOldValue, xNewValue)
    // {
    //     if (this.innerHTML)
    //         switch (sName)
    //         {
    //             case 'name':
    //                 this.esName.innerHTML = xNewValue;
    //                 break;

    //             case 'color':
    //                 this.evChecked.setAttribute('fill', xNewValue);
    //                 this.evUnchecked.setAttribute('fill', xNewValue);
    //                 break;

    //             case 'checked':
    //                 this.eiCheckbox.checked = (xNewValue != undefined);
    //                 break;
    //         }
    // }

    // static get observedAttributes() { return ['name', 'color', 'checked'] }
}

customElements.define('custom-checkbox', Checkbox);