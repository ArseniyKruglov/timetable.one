function SendRequest(sURL, oData, bCallback)
{
    const FD = new FormData();
    for (let loop_sField in oData)
        FD.append(loop_sField, oData[loop_sField]);

    if (bCallback === true)
        return fetch(sURL, { method: 'POST', body: FD }).then((response) => { return response.json(); });
    else
        fetch(sURL, { method: 'POST', body: FD });
}