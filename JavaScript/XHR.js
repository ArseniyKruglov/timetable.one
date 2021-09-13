function SendRequest(sURL, oData, bCallback)
{
    let formData  = new FormData();

    formData.append('URL', window.location.pathname.slice(1));
    for (let loop_sField in oData)
        formData.append(loop_sField, oData[loop_sField]);

    if (bCallback === true)
        return fetch(sURL, { method: 'POST', body: formData }).then((response) => { return response.json(); });
    else
        fetch(sURL, { method: 'POST', body: formData });
}