Array.prototype.selectWhere = function(oObject, bSingle)
{
    if (bSingle === true)
    {
        for (let i = 0; i < this.length; i++)
        {
            let bSelect = true;
            for (let loop_sKey in oObject)
                if (this[i][loop_sKey] !== oObject[loop_sKey])
                {
                    bSelect = false;
                    break;
                };

            if (bSelect === true)
                return this[i];
        };
    }
    else
    {
        let aArray = [];

        for (let i = 0; i < this.length; i++)
        {
            let bSelect = true;
            for (let loop_sKey in oObject)
                if (this[i][loop_sKey] !== oObject[loop_sKey])
                {
                    bSelect = false;
                    break;
                };

            if (bSelect === true)
                aArray.push(this[i]);
        };

        return aArray;
    };
}