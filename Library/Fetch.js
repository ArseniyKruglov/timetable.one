function SendRequest(sURL, oData, bCallback)
{
    const formData  = new FormData();
    for (let loop_sField in oData)
        formData.append(loop_sField, oData[loop_sField]);

    if (bCallback === true)
        return fetch(sURL, { method: 'POST', body: formData }).then((response) => { return response.json(); });
    else
        fetch(sURL, { method: 'POST', body: formData });
}