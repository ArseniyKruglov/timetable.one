function SendRequest(sURL, oData)
{
    const FD = new FormData();
    for (let loop_sField in oData)
        FD.append(loop_sField, oData[loop_sField]);


    const XHR = new XMLHttpRequest();
    XHR.open('POST', sURL);
    XHR.send(FD);
}