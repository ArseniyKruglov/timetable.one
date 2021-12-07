Element.prototype.playClass = function (sClassName, iDuration)
{
    this.classList.add(sClassName);
    setTimeout(() => {this.classList.remove(sClassName) }, iDuration);
}

Element.prototype.playAnimation = function (sAnimation, iDuration)
{
    this.style.animation = `${sAnimation} ${iDuration}ms`;
    if (!_mAnimation.get(this))
        _mAnimation.set(this, setTimeout(() => {this.style.animation = ''; _mAnimation.delete(this); }, iDuration));
}

_mAnimation = new Map();