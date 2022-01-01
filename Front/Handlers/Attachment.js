function SetAttachments(iDate, sTitle, aAttachments, bDraw, bSend, bRecord, oInRecords)
{
    if (bRecord)
    {
        oInRecords = oInRecords || _Records.Notes.selectWhere({ 'Date': iDate, 'Title': sTitle }, true);

        if (oInRecords)
        {

        }
        else
        {

        };

        if (bSend)
        {

        };
    };

    if (bDraw)
    {

    };
}

function RemoveAttachments(iDate, sTitle, aAttachments, bDraw, bSend, bRecord, oInRecords)
{

}