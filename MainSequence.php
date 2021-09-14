<!DOCTYPE html>

<html>
    <head>
        <title>Расписание</title>

        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
        <link rel='manifest' href='/manifest.webmanifest'>

        <link rel='preconnect' href='https://fonts.googleapis.com'>
        <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
        <link href='https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,600&display=swap' rel='stylesheet'>

        <link rel='stylesheet' href='/Style/Main.css?2'>
        <link rel='stylesheet' href='/Style/Colors.css?2'>
        <link rel='stylesheet' href='/Style/Fonts.css?2'>
        <link rel='stylesheet' href='/Style/Buttons.css?2'>
        <link rel='stylesheet' href='/Style/LargeScaleStructures.css?2'>

        <link rel='stylesheet' href='/Style/WebComponents/Underline.css?2'>
        <link rel='stylesheet' href='/Style/WebComponents/Textarea/Textarea.css?2'>

        <link rel='stylesheet' href='/Modules/Overlay/Overlay.css?2'>
        <link rel='stylesheet' href='/Modules/LessonDetails/LessonDetails.css?2'>
        <link rel='stylesheet' href='/Modules/Week/Week.css?2'>
        <link rel='stylesheet' href='/Modules/Timetable/Timetable.css?2'>
    </head>

    <body <? if ($FullAcess === true) echo 'God'; ?>></body>

    <script>
        _aTimetable = 
        <?
        $aLessons = array_fill(0, 14, []);
        foreach ($SQL->query("SELECT DayOfTimetable, LessonNumber, Subject, LectureHall, Educator FROM lessons_timetable WHERE TimetableID = $TimetableID ORDER BY DayOfTimetable, LessonNumber")->fetch_all() as &$aLesson)
            array_push($aLessons[(int) $aLesson[0]], [(int) $aLesson[1], [$aLesson[2], $aLesson[3], $aLesson[4]]]);
        echo json_encode($aLessons, JSON_UNESCAPED_UNICODE);
        ?>.map(x => new Map(x));

        _mAlarms = new Map(
        <?
            $aAlarms = [];
            foreach ($SQL->query("SELECT LessonNumber, Begin, End FROM alarms WHERE TimetableID = $TimetableID")->fetch_all() as &$aAlarm)
                array_push($aAlarms, [(int) $aAlarm[0], [$aAlarm[1], $aAlarm[2]]]);
            echo json_encode($aAlarms);
        ?>);
    </script>

    <script src='/JavaScript/Time.js?2'></script>
    <script src='/JavaScript/Element.js?2'></script>
    <script src='/JavaScript/focus-visible.js'></script>
    <script src='/JavaScript/XHR.js'></script>

    <script src='/Style/Icons.js?2'></script>
    <script src='/Style/WebComponents/Textarea/Textarea.js?2'></script>

    <script src='/Modules/Week/Week.js?2'></script>
    <script src='/Modules/Overlay/Overlay.js?2'></script>
    <script src='/Modules/LessonDetails/LessonDetails.js?2'></script>
    <script src='/Modules/Timetable/Timetable.js?2'></script>

    <script src='/JavaScript/Main.js?2'></script>
</html>