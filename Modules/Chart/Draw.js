function Chart_Draw()
{
    let aPeriod = Week_GetPeriod(_iWeekOffset);

    let HTML = '';

    for (let loop_iDate = aPeriod[0]; loop_iDate <= aPeriod[1]; loop_iDate++)
    {
        HTML += '<div>';

        for (let loop_iLesson of Timetable_GetLessonNumbers(loop_iDate))
            console.log(Alarm_Get(loop_iLesson, loop_iDate));

        HTML += '</div>';
    };


    _aOverlays['Chart'][1].children[1].children[0].innerHTML = HTML;
    _aOverlays['Chart'][1].children[1].className = 'Overlay_Rectangular';

    history.pushState('', '', `/${_sURL}/Chart?Date=${aPeriod[0]}`);
}