<!DOCTYPE HTML>

<html>
    <head>
        <title>Расписание</title>

        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
        <link rel='manifest' href='/manifest.php?URL=<? echo $URL ?>'>

        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Google+Sans:400,500,700'>

        <link rel='apple-touch-icon' sizes='57x57' href='/Style/Icons/apple-icon-57x57.png'>
        <link rel='apple-touch-icon' sizes='60x60' href='/Style/Icons/apple-icon-60x60.png'>
        <link rel='apple-touch-icon' sizes='72x72' href='/Style/Icons/apple-icon-72x72.png'>
        <link rel='apple-touch-icon' sizes='76x76' href='/Style/Icons/apple-icon-76x76.png'>
        <link rel='apple-touch-icon' sizes='114x114' href='/Style/Icons/apple-icon-114x114.png'>
        <link rel='apple-touch-icon' sizes='120x120' href='/Style/Icons/apple-icon-120x120.png'>
        <link rel='apple-touch-icon' sizes='144x144' href='/Style/Icons/apple-icon-144x144.png'>
        <link rel='apple-touch-icon' sizes='152x152' href='/Style/Icons/apple-icon-152x152.png'>
        <link rel='apple-touch-icon' sizes='180x180' href='/Style/Icons/apple-icon-180x180.png'>
        <link rel='icon' type='image/png' sizes='192x192'  href='/Style/Icons/android-icon-192x192.png'>
        <link rel='icon' type='image/png' sizes='32x32' href='/Style/Icons/favicon-32x32.png'>
        <link rel='icon' type='image/png' sizes='96x96' href='/Style/Icons/favicon-96x96.png'>
        <link rel='icon' type='image/png' sizes='16x16' href='/Style/Icons/favicon-16x16.png'>
        <meta name='msapplication-TileColor' content='#F1F2F3'>
        <meta name='msapplication-TileImage' content='/Style/Icons/ms-icon-144x144.png'>
        <meta name='theme-color' content='#F1F2F3'>

        <? 
        $Time = time();

        $Files_JS = [];
        $Files_CSS = [];

        function GetFiles($Path)
        {
            foreach (glob($Path . '*', GLOB_ONLYDIR) as &$Folder)
                GetFiles(str_replace((__DIR__ . '/'), '', $Folder) . '/');

            global $Files_JS;
            foreach (glob("$Path*.js") as &$File_JS)
                if ($File_JS !== 'Frontend/Main.js')
                    array_push($Files_JS, $File_JS);

            global $Files_CSS;
            foreach (glob("$Path*.css") as &$File_CSS)
                array_push($Files_CSS, $File_CSS);
        };

        GetFiles('');

        foreach ($Files_CSS as &$File_CSS)
            echo "<link rel='stylesheet' href='/$File_CSS?$Time'>\r\n";
        ?>
    </head>

    <body></body>

    <?
    foreach ($Files_JS as &$File_JS)
        echo "<script src='/$File_JS?$Time'></script>\r\n";
    ?>

    <script>
        _iAccessLevel = <? echo $AccessLevel ?>;

        _aTimetable = 
        <?
            include 'PHP/Timestamp.php';

            $aTimetables = [];

            foreach ($SQL->query("SELECT `TimetableID`, `Begin`, `End`, `AnchorDate`, `Days` FROM `Timetables` WHERE `UserID` = $User[0]")->fetch_all() as &$aTimetable)
            {
                $aLessons = array_fill(0, strlen($aTimetable[4]), []);
                foreach ($SQL->query("SELECT `DayOfTimetable`, `Index`, `Title`, `Place`, `Educator`, `UserFieldsAI` FROM `Lessons` WHERE `TimetableID` = $User[0] ORDER BY `DayOfTimetable`, `Index`")->fetch_all() as &$aLesson)
                {
                    $UserFields = $SQL->query("SELECT `FieldID`, `Text` FROM `Fields` WHERE (`UserID` = $User[0]) AND (`TimetableID` = $aTimetable[0]) AND (`DayOfTimetable` = $aLesson[0]) AND (`Index` = $aLesson[1])")->fetch_all();
                    foreach ($UserFields as &$UserField)
                        $UserField[0] = (int) $UserField[0];

                    array_push($aLessons[(int) $aLesson[0]], [(int) $aLesson[1], ['Title' => $aLesson[2], 'Fields' => [ 'Place' => $aLesson[3], 'Educator' => $aLesson[4], 'UserFields' => $UserFields], 'UserFieldsAI' => (int) $aLesson[5]]]);
                }

                array_push($aTimetables, [(int) $aTimetable[0], ['Begin' => $aTimetable[1] === NULL ? NULL : To1970($aTimetable[1]), 'End' => $aTimetable[2] === NULL ? NULL : To1970($aTimetable[2]), 'AnchorDate' => To1970($aTimetable[3]), 'Days' => $aTimetable[4], 'Lessons' => $aLessons]]);
            };

            echo json_encode($aTimetables, JSON_UNESCAPED_UNICODE);
        ?>;
        for (let loop_aTimetable of _aTimetable)
        {
            for (let loop_aDay of loop_aTimetable[1].Lessons)
                for (let loop_aLesson of loop_aDay)
                    loop_aLesson[1].Fields.UserFields = new Map(loop_aLesson[1].Fields.UserFields);

            loop_aTimetable[1].Lessons = loop_aTimetable[1].Lessons.map(loop_aDay => new Map(loop_aDay));
        };
        _aTimetable = new Map(_aTimetable);

        _Records = 
        <?
            $aChanges = [];
            $aNotes = [];

            foreach ($SQL->query("SELECT `Date`, `Index`, `Title`, `Place`, `Educator` FROM `Changes` WHERE `UserID` = $User[0]")->fetch_all() as &$aChange)
                array_push($aChanges, ['Date' => To1970($aChange[0]), 'Index' => (int) $aChange[1], 'Title' => $aChange[2], 'Place' => $aChange[3], 'Educator' => $aChange[4]]);

            if ($AccessLevel > 0)
            {
                foreach ($SQL->query("SELECT `Title`, `Date`, `Note` FROM `Notes` WHERE `UserID` = $User[0] ORDER BY Date DESC")->fetch_all() as &$aLesson)
                    array_push($aNotes, ['Title' => $aLesson[0], 'Date' => To1970($aLesson[1]), 'Note' => $aLesson[2]]);
            };

            echo json_encode(['Notes' => $aNotes, 'Changes' => $aChanges], JSON_UNESCAPED_UNICODE);
        ?>;

        const _Alarms = new Alarms(new Map(
        <?
            $aAlarms = [];
            foreach ($SQL->query("SELECT `Index`, `Begin`, `End` FROM `Alarms` WHERE `UserID` = $User[0]")->fetch_all() as &$aAlarm)
                array_push($aAlarms, [(int) $aAlarm[0], [TimeToInt($aAlarm[1]), TimeToInt($aAlarm[2])]]);
            echo json_encode($aAlarms, JSON_UNESCAPED_UNICODE);
        ?>));
    </script>

    <script src='/Frontend/Main.js?<? echo $Time ?>'></script>
</html>