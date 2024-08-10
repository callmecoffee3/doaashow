
:: Save database to file
echo Saving database to file...
sqlite3 predictions.db

:: Menu
echo.
echo Menu: 
echo 1. View List 1 (Usual/80-100%)
echo 2. View List 2 (Rarely/15-80%)
echo 3. View List 3 (Extremely Rare/1%)
echo 4. View List 4 (Never/0%)
echo 5. Exit

:: Get user selection
set /p selection=Enter your selection:

:: Handle user selection
if %selection%==1 goto list1
if %selection%==2 goto list2
if %selection%==3 goto list3
if %selection%==4 goto list4
if %selection%==5 goto exit

:list1
echo.
echo List 1 (Usual/80-100%):
sqlite3 predictions.db "SELECT * FROM Tokens WHERE Dataset_ID=1;"
goto menu

:list2
echo.
echo List 2 (Rarely/15-80%):
sqlite3 predictions.db "SELECT * FROM Tokens WHERE Dataset_ID=2;"
goto menu

:list3
echo.
echo List 3 (Extremely Rare/1%):
sqlite3 predictions.db "SELECT * FROM Tokens WHERE Dataset_ID=3;"
goto menu

:list4
echo.
echo List 4 (Never/0%):
sqlite3 predictions.db "SELECT * FROM Tokens WHERE Dataset_ID=4;"
goto menu

:exit
echo.
echo Exiting...
exit


:: Display menu
echo Options:
echo 1. View Lists
echo 2. View Cases
echo 3. View Assumptions
echo 4. Add New Item to List
echo 5. Save Lists to Files
echo 6. Load Lists from Files
echo 7. Add Computer Learning Machine to List
echo 8. View Computer Learning Machine List
echo 9. Delete Item from List
echo 10. Exit

:: Get user choice
set /p choice=Enter choice (default: 1):

:: Process choice
if "%choice%"=="" (
set choice=1
)
if %choice%==1 (
echo List 1: Usual (80-100%)
echo %list1%
echo CLM List 1:
echo %clmList1%
echo List 2: Rarely (15-80%)
echo %list2%
echo CLM List 2:
echo %clmList2%
echo List 3: Extremely Rare (1%)
echo %list3%
echo CLM List 3:
echo %clmList3%
echo List 4: Never (0%)
echo %list4%
echo CLM List 4:
echo %clmList4%
) else if %choice%==2 (
for /f "tokens=" %%a in (Cases.txt) do (
echo %%a
)
) else if %choice%==3 (
for /f "tokens=" %%a in (Assumptions.txt) do (
echo %%a
)
) else if %choice%==4 (
set /p newitem=Enter new item:
set /p listnumber=Enter list number (1-4):
if %listnumber%==1 (
set "list1=%list1%, %newitem%"
) else if %listnumber%==2 (
set "list2=%list2%, %newitem%"
) else if %listnumber%==3 (
set "list3=%list3%, %newitem%"
) else if %listnumber%==4 (
set "list4=%list4%, %newitem%"
) else (
echo Invalid list number
)
) else if %choice%==5 (
echo %list1% > List1.txt
echo %list2% > List2.txt
echo %list3% > List3.txt
echo %list4% > List4.txt
echo %clmList1% > CLMList1.txt
echo %clmList2% > CLMList2.txt
echo %clmList3% > CLMList3.txt
echo %clmList4% > CLMList4.txt
echo Lists saved to files
) else if %choice%==6 (
if exist List1.txt (
set /p list1=<List1.txt
) else (
set "list1="
)
if exist List2.txt (
set /p list2=<List2.txt
) else (
set "list2="
)
if exist List3.txt (
set /p list3=<List3.txt
) else (
set "list3="
)
if exist List4.txt (
set /p list4=<List4.txt
) else (
set "list4="
)
if exist CLMList1.txt (
set /p clmList1=<CLMList1.txt
) else (
set "clmList1="
)
if exist CLMList2.txt (
set /p clmList2=<CLMList2.txt
) else (
set "clmList2="
)
if exist CLMList3.txt (
set /p clmList3=<CLMList3.txt
@echo off

:: Read lists from Main.txt
set "list1=Being around a hillside, Being around a body of water, Being outside, Being inside, Being on the internet, Watching YouTube, Being active on Facebook, Having smart devices, Listening to the radio, Watching TV, Renting, Riding in a car with someone, Being in a noticeably hilly area, Playing, Moving, Being around the same looking type of people, Hooking up, Knowing people, Having a little wealth, Male, Caucasian or non-Hispanic White, Non-denominational, Values individual freedom and autonomy, Prioritizes personal comfort and happiness"
set "list2=Hanging out with friends, Me time, Shopping for stuff to buy, Hosting parties, Going to restaurants, Talking about yourself"
set "list3=Picking up girls, Going to events, Going to venues, Parties, Starting a business, Investing, Making friends, Having pets, Messaging, Making associations, Making yourself known, Being with someone, Having an attitude, Making connections"
set "list4=Having money, Having credit, Having a job, Dating, Going on outings, Obtaining a driver's license/Driving, Interacting with people, Owning something, Having a car/Using a car, Dealing with luggage, Traveling long distances, Going to the airport, Taking a taxi, Being married, Having children"

:: Display menu
echo Options:
echo 1. View Lists
echo 2. View Cases
echo 3. View Assumptions
echo 4. Add New Item to List
echo 5. Exit

:: Get user choice
set /p choice=Enter choice:

:: Process choice
if %choice%==1 (
echo List 1: Usual (80-100%)
echo %list1%
echo List 2: Rarely (15-80%)
echo %list2%
echo List 3: Extremely Rare (1%)
echo %list3%
echo List 4: Never (0%)
echo %list4%
) else if %choice%==2 (
for /f "tokens=" %%a in (Cases.txt) do (
echo %%a
)
) else if %choice%==3 (
for /f "tokens=" %%a in (Assumptions.txt) do (
echo %%a
)
) else if %choice%==4 (
set /p newitem=Enter new item:
set /p listnumber=Enter list number (1-4):
if %listnumber%==1 set "list1=%list1%, %newitem%"
if %listnumber%==2 set "list2=%list2%, %newitem%"
if %listnumber%==3 set "list3=%list3%, %newitem%"
if %listnumber%==4 set "list4=%list4%, %newitem%"
) else if %choice%==5 (
exit /b
) else (
echo Invalid choice
)

@echo off

:: Read from list files
echo Reading from List 1.txt...
for /f "tokens=*" %%a in (List1.txt) do (
echo %%a
)

echo.
echo Reading from List 2.txt...
for /f "tokens=*" %%a in (List2.txt) do (
echo %%a
)

echo.
echo Reading from List 3.txt...
for /f "tokens=*" %%a in (List3.txt) do (
echo %%a
)

echo.
echo Reading from List 4.txt...
for /f "tokens=*" %%a in (List4.txt) do (
echo %%a
)
:: Write to batch file
echo Writing to batch file...
set "newText=Read lists from Main.txt - Updated"
set "line=5"  :: Change this to the line number you want to write to

:: Read and write lines to Output file
for /f "tokens=" %%a in ('type "%~f0" ^| find /v /n ""') do (
set "Output=%%a"
set "Output= ::=!"
if !Output! equ %Output% (
echo %newText% >> Temp.bat
) else (
type "%~f0" | find "!Output!" >> Temp.bat
)
)

:: Replace original batch file with temp file
move /y Temp.bat "%~f0"
pause

Output:

Reading from List 1.txt...
Being around a hillside
Being around a body of water
Being outside
Being inside
Being on the internet
Watching YouTube
Being active on Facebook
Having smart devices
Listening to the radio
Watching TV
Renting
Riding in a car with someone
Being in a noticeably hilly area
Playing
Moving
Being around the same looking type of people
Hooking up
Knowing people
Having a little wealth
Male
Caucasian or non-Hispanic White
Non-denominational
Values individual freedom and autonomy
Prioritizes personal comfort and happiness

Reading from List 2.txt...
Hanging out with friends
Me time
Shopping for stuff to buy
Hosting parties
Going to restaurants
Talking about yourself

Reading from List 3.txt...
Picking up girls
Going to events
Going to venues
Parties
Starting a business
Investing
Making friends
Having pets
Messaging
Making associations
Making yourself known
Being with someone
Having an attitude
Making connections

Reading from List 4.txt...
Having money
Having credit
Having a job
Dating
Going on outings
Obtaining a driver's license/Driving
Interacting with people
Owning something
Having a car/Using a car
Dealing with luggage
Traveling long distances
Going to the airport
Taking a taxi
Being married
Having children

Press any key to continue...
