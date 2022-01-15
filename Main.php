<? ini_set('display_errors', 0); ?>

<!DOCTYPE HTML>

<html lang='<? include 'Library/PHP/Language.php'; echo Language_Get(); ?>'>
    <head>
        <title>Расписание</title>

        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
        <link rel='manifest' href='/manifest.php'>

        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Google+Sans:400,500,700'>

        <meta name='theme-color' content='#FFFFFF'>

        <?
        include 'Library/PHP/Timestamp.php';
        include 'Library/PHP/Constants.php';



        $Time = time();

        $Files_JS = [];
        $Files_CSS = [];

        function GetFiles($Path)
        {
            foreach (glob($Path . '*', GLOB_ONLYDIR) as &$Folder)
                if (!str_contains($Folder, 'vendor'))
                    GetFiles(str_replace((__DIR__ . '/'), '', $Folder) . '/');

            global $Files_JS;
            global $Main;
            foreach (glob("$Path*.js") as &$File_JS)
                array_push($Files_JS, $File_JS);

            global $Files_CSS;
            foreach (glob("$Path*.css") as &$File_CSS)
                array_push($Files_CSS, $File_CSS);
        }

        GetFiles('');

        foreach ($Files_CSS as &$File_CSS)
            echo "<link rel='stylesheet' href='/$File_CSS?$Time'>";
        ?>

        <?
        foreach ($Files_JS as &$File_JS)
            echo "<script src='/$File_JS?$Time'></script>";
        ?>
    </head>

    <body>
        <script>
            const _iAccessLevel = <? echo $AccessLevel ?>;

            <?
            foreach (array_keys($Constants) as &$Constant)
                echo "const _i$Constant = $Constants[$Constant];";
            ?>

            _Timetable = new Timetable(
            <?
                $aTimetables = [];

                foreach ($SQL->query("SELECT `TimetableID`, `Begin`, `End`, `AnchorDate`, `Days` FROM `Timetables` WHERE `UserID` = $User[0]")->fetch_all() as &$aTimetable)
                {
                    $aLessons = array_fill(0, strlen($aTimetable[4]), []);
                    foreach ($SQL->query("SELECT `DayOfTimetable`, `Index`, `Title`, `Place`, `Educator`, `UserFieldsAI` FROM `Lessons` WHERE (`UserID` = $User[0]) AND (`TimetableID` = $aTimetable[0]) ORDER BY `DayOfTimetable`, `Index`")->fetch_all() as &$aLesson)
                    {
                        $UserFields = $SQL->query("SELECT `FieldID`, `Text` FROM `Fields` WHERE (`UserID` = $User[0]) AND (`TimetableID` = $aTimetable[0]) AND (`DayOfTimetable` = $aLesson[0]) AND (`Index` = $aLesson[1])")->fetch_all();
                        foreach ($UserFields as &$UserField)
                            $UserField[0] = (int) $UserField[0];

                        array_push($aLessons[(int) $aLesson[0]], [(int) $aLesson[1], ['Title' => $aLesson[2], 'Fields' => [ 'Place' => $aLesson[3], 'Educator' => $aLesson[4], 'UserFields' => $UserFields], 'UserFieldsAI' => (int) $aLesson[5]]]);
                    };

                    array_push($aTimetables, [(int) $aTimetable[0], ['Begin' => $aTimetable[1] === NULL ? NULL : DateToInt($aTimetable[1]), 'End' => $aTimetable[2] === NULL ? NULL : DateToInt($aTimetable[2]), 'AnchorDate' => DateToInt($aTimetable[3]), 'Days' => $aTimetable[4], 'Lessons' => $aLessons]]);
                };

                echo json_encode($aTimetables, JSON_UNESCAPED_UNICODE);
            ?>);

            _Records = 
            <?
                $aChanges = [];
                $aNotes = [];

                foreach ($SQL->query("SELECT `Date`, `Index`, `Title`, `Place`, `Educator` FROM `Changes` WHERE `UserID` = $User[0]")->fetch_all() as &$aChange)
                {
                    $Change = ['Date' => DateToInt($aChange[0]), 'Index' => (int) $aChange[1]];

                    if ($aChange[2] !== null)
                        $Change['Title'] = $aChange[2];

                    if ($aChange[3] !== null)
                        $Change['Place'] = $aChange[3];

                    if ($aChange[4] !== null)
                        $Change['Educator'] = $aChange[4];



                    array_push($aChanges, $Change);
                };

                foreach ($SQL->query("SELECT `Date`, `Index`, `FieldID`, `Text` FROM `Changes_Fields` WHERE (`UserID` = $User[0])")->fetch_all() as &$Field)
                {
                    $Field[0] = DateToInt($Field[0]);
                    $Field[1] = (int) $Field[1];
                    $Field[2] = (int) $Field[2];



                    $Found = false;

                    foreach ($aChanges as &$Change)
                        if ($Change['Date'] === $Field[0] && $Change['Index'] === $Field[1])
                        {
                            if (!$Change['UserFields'])
                                $Change['UserFields'] = [];
                            array_push($Change['UserFields'], [$Field[2], $Field[3]]);

                            $Found = true;
                            break;
                        };

                    if (!$Found)
                        array_push($aChanges, ['Date' => $Field[0], 'Index' => $Field[1], 'UserFields' => [[$Field[2], $Field[3]]]]);
                };




                if ($AccessLevel > 0)
                {
                    foreach ($SQL->query("SELECT `Title`, `Date`, `Note` FROM `Notes` WHERE `UserID` = $User[0] ORDER BY Date DESC")->fetch_all() as &$aLesson)
                    {
                        $Note = ['Date' => DateToInt($aLesson[1]), 'Note' => $aLesson[2]];

                        if ($aLesson[0] !== null)
                            $Note['Title'] = $aLesson[0];



                        array_push($aNotes, $Note);
                    };

                    foreach ($SQL->query("SELECT `Date`, `Title`, `Folder`, `Filename` FROM `Files` WHERE `UserID` = $User[0] ORDER BY Date DESC")->fetch_all() as &$aFile)
                    {
                        $aFile[0] = DateToInt($aFile[0]);
                        $aFile[1] = $aFile[1] === 'NULL' ? NULL : $aFile[1];
                        $aBody = ['Folder' => $aFile[2], 'Filename' => $aFile[3]];



                        $Found = false;

                        foreach ($aNotes as &$aNote)
                            if ($aNote['Date'] === $aFile[0] && $aNote['Title'] === $aFile[1])
                            {
                                if (!array_key_exists('Files', $aNote))
                                    $aNote['Files'] = [];

                                array_push($aNote['Files'], $aBody);



                                $Found = true;
                                break;
                            };

                        if (!$Found)
                            if ($aFile[1] === NULL)
                                array_push($aNotes, ['Date' => $aFile[0], 'Files' => [$aBody]]);
                            else
                                array_push($aNotes, ['Date' => $aFile[0], 'Title' => $aFile[1], 'Files' => [$aBody]]);
                    };
                };

                echo json_encode(['Notes' => $aNotes, 'Changes' => $aChanges], JSON_UNESCAPED_UNICODE);
            ?>;
            for (let loop_oChange of _Records.Changes)
                if (loop_oChange.UserFields)
                    loop_oChange.UserFields = new Map(loop_oChange.UserFields);


            const _Alarms = new Alarms(new Map(
            <?
                $aAlarms = [];
                foreach ($SQL->query("SELECT `Index`, `Begin`, `End` FROM `Alarms` WHERE `UserID` = $User[0]")->fetch_all() as &$aAlarm)
                    array_push($aAlarms, [(int) $aAlarm[0], [TimeToInt($aAlarm[1]), TimeToInt($aAlarm[2])]]);
                echo json_encode($aAlarms, JSON_UNESCAPED_UNICODE);
            ?>));

            Main();
        </script>
    </body>
</html>