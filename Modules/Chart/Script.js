function Chart(iDate)
{
    Overlay_Open
    (
        'Chart',
        () => { Chart_Draw(iDate) },
        () => {},
        Chart_Close
    );    
}

function Chart_Close()
{
    Overlay_Remove('Chart');
}