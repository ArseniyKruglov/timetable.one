function FocusDiv(eFocusing)   
{
    let temp_bFocus = document.createElement('button');
    eFocusing.insertBefore(temp_bFocus, eFocusing.firstElementChild);
    temp_bFocus.focus();
    temp_bFocus.remove();
}



Array.prototype.selectWhere = function(oObject, bSingle)
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
        {
            if (bSingle === true)
                return this[i];
            else
                aArray.push(this[i]);
        };
    };

    if (bSingle === true)
        return;
    else
        return aArray;
}

Array.prototype.removeWhere = function(oObject, bSingle)
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
            this.splice(i, 1);

            if (bSingle === true)
                break;
        };
    };
}