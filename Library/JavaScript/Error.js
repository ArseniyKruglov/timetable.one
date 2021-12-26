window.onerror = (sMessage, sURL, iLine) =>
{
    SendRequest('/Back/Error.php', { 'Message': sMessage, 'URL': sURL, 'Line': iLine });
};