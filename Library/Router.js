_aHistory = [[]];

addEventListener('popstate', Route);



function WriteHistory()
{
    let aPath = location.pathname + location.search;
    aPath = aPath.split('/');
    aPath = aPath.slice(2);

    for (let i = 0; i < aPath.length; i++)
    {
        aPath[i] = aPath[i].split('?');

        if (aPath[i][1])
            aPath[i][1] = Object.fromEntries(new URLSearchParams(aPath[i][1]));
    };



    _aHistory.push(aPath);
}

function Route()
{
    WriteHistory();



    let aOldPath = _aHistory[_aHistory.length - 2];
    let aNewPath = _aHistory[_aHistory.length - 1];

    let i = 0;
    for ( ; i < aOldPath.length; i++)
        if (!aNewPath[i] || aOldPath[i][0] !== aNewPath[i][0])
        {
            for (let j = i; j < _aOverlays.length; j++)
                _aOverlays[j].Remove();

            break;
        };


    for ( ; i < aNewPath.length; i++)
        switch (aNewPath[i][0])
        {
            case 'Lesson':
                new Lesson_UI(parseInt(aNewPath[i][1].Date), parseInt(aNewPath[i][1].Lesson));
                break;

            case 'Day':
                new Day_UI(parseInt(aNewPath[i][1].Date));
                break;

            case 'Add':
                new SuddenLesson_UI(_iToday);       // TO DO: _iToday
                break;
        };
}



function Route_Forward(sURL)
{
    history.pushState('', '', '/' + _sURL + sURL);
    Route();
}