<!DOCTYPE html>

<html>
    <head>
        <title>Расписание</title>

        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
        <link rel='manifest' href='/manifest.webmanifest'>

        <link rel='preconnect' href='https://fonts.googleapis.com'>
        <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
        <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' rel='stylesheet'>

        <link rel='stylesheet' href='/Style/Main.css'>
        <link rel='stylesheet' href='/Style/Colors.css'>
        <link rel='stylesheet' href='/Style/Fonts.css'>
        <link rel='stylesheet' href='/Style/Buttons.css'>
        <link rel='stylesheet' href='/Style/LargeScaleStructures.css'>

        <link rel='stylesheet' href='/Style/WebComponents/Underline.css'>
        <link rel='stylesheet' href='/Style/WebComponents/Textarea/Textarea.css'>

        <link rel='stylesheet' href='/Modules/Overlay/Overlay.css'>
        <link rel='stylesheet' href='/Modules/LessonDetails/LessonDetails.css'>
        <link rel='stylesheet' href='/Modules/Week/Week.css'>
        <link rel='stylesheet' href='/Modules/Timetable/Timetable.css'>
    </head>

    <body <? echo ['TimetableOnly', 'ReadOnly', 'FullAccess'][$AccessLevel]; ?> class='Unloaded'></body>

    <script>
        _iBeginDate = <? echo $User[1]; ?>;

        _aTimetable = 
        <?
        $aLessons = array_fill(0, strlen($User[2]), []);
        foreach ($SQL->query("SELECT DayOfTimetable, LessonNumber, Subject, LectureHall, Educator FROM lessons_timetable WHERE TimetableID = $User[0] ORDER BY DayOfTimetable, LessonNumber")->fetch_all() as &$aLesson)
            array_push($aLessons[(int) $aLesson[0]], [(int) $aLesson[1], [$aLesson[2], $aLesson[3], $aLesson[4]]]);
        echo json_encode($aLessons, JSON_UNESCAPED_UNICODE);
        ?>.map(x => new Map(x));

        _mAlarms = new Map(
        <?
            $aAlarms = [];
            foreach ($SQL->query("SELECT LessonNumber, Begin, End FROM alarms WHERE TimetableID = $User[0]")->fetch_all() as &$aAlarm)
                array_push($aAlarms, [(int) $aAlarm[0], [$aAlarm[1], $aAlarm[2]]]);
            echo json_encode($aAlarms);
        ?>);
    </script>

    <script src='/JavaScript/Time.js'></script>
    <script src='/JavaScript/Element.js'></script>
    <script src='/JavaScript/focus-visible.js'></script>
    <script src='/JavaScript/XHR.js'></script>
    <script src='/JavaScript/swiped-events.js'></script>

    <script src='/Style/Icons.js'></script>
    <script src='/Style/WebComponents/Textarea/Textarea.js'></script>

    <script src='/Modules/Week/Week.js'></script>
    <script src='/Modules/Overlay/Overlay.js'></script>
    <script src='/Modules/LessonDetails/LessonDetails.js'></script>
    <script src='/Modules/Timetable/Timetable.js'></script>

    <script src='/JavaScript/Main.js'></script>
</html>