class Router
{
    constructor()
    {
        this.URL = location.pathname.split('/')[1];
        this.History = [];

        addEventListener('popstate', () => this.Route());
    }

    Init()
    {
        this.Initial = true;
        this.Route();
        this.Initial = false;
    }

    Route()
    {
        let aPath = location.pathname + location.search;
        aPath = [aPath, aPath];

        aPath[0] = aPath[0].slice(this.URL.length + 2);

        aPath[1] = aPath[1].split('/');
        aPath[1] = aPath[1].slice(2);

        for (let i = 0; i < aPath[1].length; i++)
        {
            aPath[1][i] = aPath[1][i].split('?');

            if (aPath[1][i][1])
                aPath[1][i][1] = Object.fromEntries(new URLSearchParams(aPath[1][i][1]));
        };

        this.History.push(aPath);



        let aOldPath = this.History[this.History.length - 2] ? this.History[this.History.length - 2][1] : ['', []];
        let aNewPath = this.History[this.History.length - 1][1];

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
                    window._Lesson_UI = new Lesson_UI(parseInt(aNewPath[i][1].Date), parseInt(aNewPath[i][1].Lesson), !this.Initial);
                    if (this.Initial)
                        _Timetable.WeekOffset = _Timetable.DateToOffset(aNewPath[i][1].Date);
                    break;

                case 'Day':
                    window._Day_UI = new Day_UI(parseInt(aNewPath[i][1].Date), !this.Initial);
                    if (this.Initial)
                        _Timetable.WeekOffset = _Timetable.DateToOffset(aNewPath[i][1].Date);
                    break;

                case 'Add':
                    window._Sudden_UI = new SuddenLesson_UI(parseInt(aNewPath[i][1].Date), !this.Initial);       // TO DO
                    break;
            };



        this.Initial = false;
    }



    Forward(sURL)
    {
        history.pushState('', '', '/' + this.URL + sURL);
        this.Route();
    }
}