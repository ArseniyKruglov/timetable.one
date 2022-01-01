function SendRequest(sURL, oData, bCallback)
{
    const FD = new FormData();
    for (let loop_sField in oData)
        FD.append(loop_sField, oData[loop_sField]);


    const XHR = new XMLHttpRequest();
    XHR.open('POST', sURL);
    XHR.send(FD);

    if (bCallback === true)
    {
        return new Promise
        (
            (Resolve) =>
            {
                XHR.onreadystatechange = () =>
                {
                    Resolve
                    ({
                        'Status': XHR.status,
                        'Text': XHR.responseText
                    })
                };
            }
        )
    };
}