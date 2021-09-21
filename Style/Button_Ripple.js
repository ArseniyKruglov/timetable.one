function Ripple_AddListener(ebButton)
{
    ebButton.addEventListener('click', Ripple);
}

function Ripple(event)
{
    let ebButton = event.currentTarget;
    let iDiameter = Math.max(ebButton.clientWidth, ebButton.clientHeight);

    let esCircle = document.createElement('span');
    esCircle.style.width = esCircle.style.height = `${iDiameter}px`;
    esCircle.style.left = `${event.clientX - ebButton.getBoundingClientRect().x - document.documentElement.getBoundingClientRect().x - iDiameter / 2}px`;
    esCircle.style.top = `${event.clientY - ebButton.getBoundingClientRect().y - document.documentElement.getBoundingClientRect().y - iDiameter / 2}px`;
    esCircle.classList.add('Ripple');

    ebButton.appendChild(esCircle)
    setTimeout(() => { esCircle.remove() }, 750);
}