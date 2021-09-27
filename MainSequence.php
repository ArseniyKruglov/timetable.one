<!DOCTYPE html>

<html>
    <head>
        <title>Расписание</title>

        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
        <link rel='manifest' href='/manifest.php?URL=<? echo $URL ?>'>

        <link rel='preconnect' href='https://fonts.googleapis.com'>
        <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
        <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' rel='stylesheet'>

        <link rel='stylesheet' href='/Style/Main.css'>
        <link rel='stylesheet' href='/Style/Colors.css'>
        <link rel='stylesheet' href='/Style/Fonts.css'>
        <link rel='stylesheet' href='/Style/Buttons.css'>
        <link rel='stylesheet' href='/Style/LargeScaleStructures.css'>

        <link rel='stylesheet' href='/Style/Button_Ripple.css'>
        <link rel='stylesheet' href='/WebComponents/Underline.css'>
        <link rel='stylesheet' href='/WebComponents/Textarea/Textarea.css'>
        <link rel='stylesheet' href='/WebComponents/Timer/Timer.css'>
        <link rel='stylesheet' href='/WebComponents/DropDown/DropDown.css'>
        <link rel='stylesheet' href='/WebComponents/RoundButton/RoundButton.css'>

        <link rel='stylesheet' href='/Modules/Overlay/Overlay.css'>
        <link rel='stylesheet' href='/Modules/LessonDetails/LessonDetails.css'>
        <link rel='stylesheet' href='/Modules/Information/Information.css'>
        <link rel='stylesheet' href='/Modules/Week/Week.css'>
        <link rel='stylesheet' href='/Modules/Timetable/Timetable.css'>
    </head>

    <body <? echo ['TimetableOnly', 'ReadOnly', 'FullAccess'][$AccessLevel]; ?>></body>

    <script src='/JavaScript/Time.js'></script>
    <script src='/JavaScript/Element.js'></script>
    <script src='/JavaScript/focus-visible.js'></script>
    <script src='/JavaScript/XHR.js'></script>
    <script src='/JavaScript/swiped-events.js'></script>
    <script src='/JavaScript/Language.js'></script>

    <script src='/Style/Icons.js'></script>
    <script src='/Style/Button_Ripple.js'></script>
    <script src='/WebComponents/Textarea/Textarea.js'></script>
    <script src='/WebComponents/Timer/Timer.js'></script>
    <script src='/WebComponents/DropDown/DropDown.js'></script>
    <script src='/WebComponents/RoundButton/RoundButton.js'></script>

    <script src='/Modules/Alarms/Alarms_Get.js'></script>
    <script src='/Modules/Information/Information.js'></script>
    <script src='/Modules/Week/Week.js'></script>
    <script src='/Modules/Week/Week_Logic.js'></script>
    <script src='/Modules/Week/Week_Handlers.js'></script>
    <script src='/Modules/Overlay/Overlay.js'></script>
    <script src='/Modules/LessonDetails/LessonDetails.js'></script>
    <script src='/Modules/LessonDetails/LessonDetails_Draw.js'></script>
    <script src='/Modules/LessonDetails/LessonDetails_Handlers.js'></script>
    <script src='/Modules/Timetable/Timetable_Logic.js'></script>
    <script src='/Modules/Timetable/Timetable_Get.js'></script>
    <script src='/Modules/Timetable/Timetable_Draw.js'></script>

    <script>
        _aTimetable = 
        <?
            $aTimetables = [];
            
            foreach ($SQL->query("SELECT TimetableID, Begin, End, AnchorDate, Days FROM timetables WHERE UserID = $User[0]")->fetch_all() as &$aTimetable)
            {
                $aLessons = array_fill(0, strlen($aTimetable[4]), []);
                foreach ($SQL->query("SELECT DayOfTimetable, LessonNumber, Subject, LectureHall, Educator FROM lessons_timetable WHERE TimetableID = $User[0] ORDER BY DayOfTimetable, LessonNumber")->fetch_all() as &$aLesson)
                    array_push($aLessons[(int) $aLesson[0]], [(int) $aLesson[1], [$aLesson[2], $aLesson[3], $aLesson[4]]]);

                array_push($aTimetables, [(int) $aTimetable[0], ['Begin' => $aTimetable[1] === NULL ? NULL : (int) $aTimetable[1], 'End' => $aTimetable[2] === NULL ? NULL : (int) $aTimetable[2], 'AnchorDate' => (int) $aTimetable[3], 'Days' => $aTimetable[4], 'Lessons' => $aLessons]]);
            };

            echo json_encode($aTimetables, JSON_UNESCAPED_UNICODE);
        ?>;
        _aTimetable.forEach(ArrayElement00 => ArrayElement00[1]['Lessons'] = ArrayElement00[1]['Lessons'].map(ArrayElement01 => new Map(ArrayElement01)));
        _aTimetable = new Map(_aTimetable);

        _oWeek = 
        <?
            $aReplacements = [];
            $aAddedLessons = [];
            $aHometasks = [];
        
            foreach ($SQL->query("SELECT Date, LessonNumber, Replacement FROM replacements WHERE UserID = $User[0]")->fetch_all() as &$aReplacement)
                array_push($aReplacements, ['Date' => (int) $aReplacement[0], 'LessonNumber' => (int) $aReplacement[1], 'Replacement' => $aReplacement[2]]);
        
            foreach ($SQL->query("SELECT Date, LessonNumber, Subject FROM added_lessons WHERE UserID = $User[0]")->fetch_all() as &$aAddedLesson)
                array_push($aAddedLessons, ['Date' => (int) $aAddedLesson[0], 'LessonNumber' => (int) $aAddedLesson[1], 'Subject' => $aAddedLesson[2]]);

            if ($AccessLevel > 0)
                foreach ($SQL->query("SELECT Subject, Date, Text FROM hometasks WHERE UserID = $User[0] ORDER BY Date DESC")->fetch_all() as &$aLesson)
                    array_push($aHometasks, ['Subject' => $aLesson[0], 'Date' => (int) $aLesson[1], 'Text' => $aLesson[2]]);
        
            echo json_encode(['Hometasks' => $aHometasks, 'AddedLessons' => $aAddedLessons, 'Replacements' => $aReplacements], JSON_UNESCAPED_UNICODE);
        ?>;

        _mAlarms = new Map(
        <?
            $aAlarms = [];
            foreach ($SQL->query("SELECT LessonNumber, Begin, End FROM alarms WHERE UserID = $User[0]")->fetch_all() as &$aAlarm)
                array_push($aAlarms, [(int) $aAlarm[0], [(int) $aAlarm[1], (int) $aAlarm[2]]]);
            echo json_encode($aAlarms, JSON_UNESCAPED_UNICODE);
        ?>);
    </script>

    <script src='/JavaScript/Main.js'></script>
</html>