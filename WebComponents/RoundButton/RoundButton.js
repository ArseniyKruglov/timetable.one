class RoundButton extends HTMLElement
{
    connectedCallback()
    {
        this.setAttribute('style', `--Scale: ${this.getAttribute('scale') || 24}px; --Hover: ${this.getAttribute('hover-color') || 'var(--Gray00)'}`);
        this.innerHTML =   `<button ${this.hasAttribute('aria-label') ? `title='${this.getAttribute('aria-label')}'` : ''}>
                                <svg ${_Icons[this.getAttribute('icon')]}></svg>
                                <div></div>
                            </button>`;
        this.addEventListener('click', () =>
        {
            let esCircle = document.createElement('span');
            this.children[0].append(esCircle);
            setTimeout(() => { esCircle.remove() }, 750);
        });
    }
}

customElements.define('custom-round-button', RoundButton);