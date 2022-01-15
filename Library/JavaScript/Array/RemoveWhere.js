Array.prototype.removeWhere = function(oObject, bSingle)
{
    if (bSingle === true)
    {
        for (let i = 0; i < this.length; i++)
        {
            let bRemove = true;
            for (let loop_sKey in oObject)
                if (this[i][loop_sKey] !== oObject[loop_sKey])
                {
                    bRemove = false;
                    break;
                };

            if (bRemove === true)
            {
                this.splice(i--, 1);
                break;
            };
        };
    }
    else
    {
        for (let i = 0; i < this.length; i++)
        {
            let bRemove = true;
            for (let loop_sKey in oObject)
                if (this[i][loop_sKey] !== oObject[loop_sKey])
                {
                    bRemove = false;
                    break;
                };

            if (bRemove === true)
                this.splice(i--, 1);
        };
    };
}