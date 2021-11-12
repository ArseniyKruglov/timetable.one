class RoundButton extends HTMLElement
{
    connectedCallback()
    {
        // this.setAttribute('style', `--Scale: ${this.getAttribute('scale') || 24}px; --Color: ${this.getAttribute('color') || 'var(--Text)'};--Hover: ${this.getAttribute('hover-color') || 'var(--Gray70)'}`);
        this.innerHTML =   `<button>
                                <custom-icon icon='${this.getAttribute('icon')}'></custom-icon>
                                <div></div>
                            </button>`;
        this.addEventListener('click', () =>
        {
            let eCircle = document.createElement('span');
            this.children[0].append(eCircle);
            setTimeout(() => { eCircle.remove() }, 750);
        });
    }
}

customElements.define('custom-round-button', RoundButton);