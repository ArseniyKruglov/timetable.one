function Deadlines_Draw()
{
    let HTML = '';

    HTML +=    `<div>`;
    for (let loop_oHometask of _oWeek['Hometasks'])
        HTML +=    `<div>
                        <div>
                            <hr>
                            <span>${DaysSince1970ToTime(loop_oHometask['Date']).toLocaleString(navigator.language, { month: 'long', day: 'numeric' })}</span>
                            <hr>
                        </div>
                        <div>
                            <span>${loop_oHometask['Subject']}</span>
                            <div>${loop_oHometask['Text']}</div>
                        </div>
                    </div>`;
    HTML +=    `</div>`;

    document.getElementById('Deadlines').innerHTML = HTML;
}