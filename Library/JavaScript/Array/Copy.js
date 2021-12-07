Array.prototype.copy = function()
{
    const aCopy = this.slice();

    for (let i = 0; i < aCopy.length; i++)
        if (Array.isArray(aCopy[i]))
            aCopy[i] = aCopy[i].copy();

    return aCopy;
}