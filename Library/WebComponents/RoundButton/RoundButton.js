class RoundButton extends HTMLElement
{
    connectedCallback()
    {
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