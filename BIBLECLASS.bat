@echo off
echo BIBLE STUDY CLASS MENU
echo %USERNAME%
echo %NAME%

:menu
cls
echo bible study class Menu
echo %class%
ECHO%teacher%
set p/ add_user:
cls
echo Bible Study Class
:: Calls and Phone
echo Please turn off your phones or put them on silent mode.

:: Arrivals and Music
echo Welcome! Please take a moment to greet one another.
cls
:: Request Praise and Prayer
echo Let's take a moment to praise and pray...
pause
cls
:: Offerings and Blessings
echo Let's receive our offerings and blessings...
pause
cls
:: Study
echo Today's study: [Insert topic]
pause
cls
:: Closing
echo Thank you for joining our Bible study class!
echo May God bless you and guide you.
cls
:: Bible Study vs Arrivals
echo Remember, Bible study is more important than arrivals. Let's focus on growing in faith!
cls
echo BIBLE STUDY CLASS MENU
echo %USERNAME%
echo %NAME%

echo 1. Create new folder
echo 2. Add folder to existing directory
echo 3. Edit folder name
echo 4. Display folders
echo 5. Display subfolders
echo 6. Edit subfolder name
echo 7. Remove subfolder
echo 8. Remove folder
echo 9. Copy folder
echo 10. Copy subfolder
echo 11. Copy subfolders to txt
echo 12. Display txt in folders
echo 13. Go to folder
echo 14. Write to txt
echo 15. Add txt file to folder
echo 16. Make clipboard
echo 17. Display clipboard
echo 18. Add subfolder
echo 19. Add user
echo 20. display user
echo 21. bible study class
echo 22. Exit

set /p choice=Choose an option:

if %choice%==1 goto create_folder
if %choice%==2 goto add_folder
if %choice%==3 goto edit_folder
if %choice%==4 goto display_folders
if %choice%==5 goto display_subfolders
if %choice%==6 goto edit_subfolder
if %choice%==7 goto remove_subfolder
if %choice%==8 goto remove_folder
if %choice%==9 goto copy_folder
if %choice%==10 goto copy_subfolder
if %choice%==11 goto copy_subfolders_to_txt
if %choice%==12 goto display_txt_in_folders
if %choice%==13 goto goto_folder
if %choice%==14 goto write_to_txt
if %choice%==15 goto add_txt_to_folder
if %choice%==16 goto make_clipboard
if %choice%==17 goto display_clipboard
if %choice%==18 goto add_subfolder
if %choice%==19 goto add_user
if %choice%==20 goto display user
if %choice%==21 goto bible study class
if %choice%==22 exit

:: Ask user for input
set /p DRIVE=Enter the drive letter (e.g., F): 
set /p FOLDER_NAME=Enter the folder name: 
set /p FILE_NAME=Enter the file name: 
set /p USERNAME=Enter Username:
set /p PASSWORD=Enter Password:
 
:: Set variables
set PORTABLE_DRIVE=Portable-C-Drive
set PATHS=Paths
set PRIVATE_CLOUD=Private Cloud
set PROJECTS=Projects
set START=Start
set STUFF=Stuff
set TOOLS=Tools
set WRITERS_CORNER=Writers Corner

:: Create folders
mkdir "%DRIVE%:\%FOLDER_NAME%"
mkdir
mkdir BIBLESTUDYCLASS
mkdir BIBLESTUDYCLASS/STUDENTS
mkdir BIBLESTUDYCLASS/USERS
mkdir BIBLESTUDYCLASS/LESSONS
mkdir BIBLESTUDYCLASS/BIBLE
mkdir BIBLESTUDYCLASS/TEACHER
mkdir BIBLESTUDYCLASS/CLASS
mkdir BIBLESTUDYCLASS/OFFERINGS


:: Copy files
copy /y "%drive%:\Source\%FILE_NAME%.txt" "%DRIVE%:\%FOLDER_NAME%"

:: Display messages
echo Done!
pause

:: Ask user if they want to display users
echo Do you want to display users? (yes/no)
set /p DISPLAY_USERS=

:: Check user input
if /i "%USERS%"=="yes" (
echo Users:
net user
) else (
echo No users will be displayed.
)

:: Pause to see the output
pause


:add_user
cls
set /p username=Enter username:
set /p password=Enter password:
echo Username: %username% >> %FOLDER%\ username.txt
echo Password: %password% >> %FOLDER%\ username.txt
echo User %username% added
pause
goto menu

:add_txt_to_folder
cls
set /p folder=Enter folder name:
set /p txt=Enter txt file name:
copy %txt%.txt  >> %folder%
echo %txt%.txt added to %folder%
pause
goto menu


:write_to_txt
cls
set /p txt=Enter txt file name:
set /p content=Enter content to write:
echo %content% >>%txt%.txt
echo Content written to %txt%.txt
pause
goto menu


:goto_folder
cls
set /p folder=Enter folder name:
cd  BIBLESTUDYCLASS/ %folder%
pause
goto menu

:display_txt_in_folders
cls
echo Displaying text files in folders:
for /r   BIBLESTUDYCLASS %%i in (*.txt) do (
type "%%i"
echo -----------------------------------
)
pause
goto menu

:copy_subfolders_to_txt
cls
dir /b /s /ad  >> subfolders.txt
echo Subfolders copied to subfolders.txt
pause
goto menu

:copy_folder
cls
set /p folder_name=Enter folder name to copy:
set /p destination=Enter destination path:
xcopy /s /i %folder_name% %destination%
goto menu

:copy_subfolder
cls
set /p subfolder_name=Enter subfolder name to copy:
set /p destination=Enter destination path:
xcopy /s /i %subfolder_name% %destination%
goto menu


:display_subfolders
cls
echo Subfolders in doashow%:
dir /b /s /ad 
pause
goto menu

:edit_subfolder
cls
set /p old_subfolder_name=Enter current subfolder name:
set /p new_subfolder_name=Enter new subfolder name:
ren  %old_subfolder_name% %new_subfolder_name%
goto menu

:remove_subfolder
cls
set /p subfolder_name=Enter subfolder name to remove:
rmdir /s /q  %subfolder_name%
goto menu

:remove_folder
cls
set /p folder_name=Enter folder name to remove:
rmdir /s /q  %folder_name%
goto menu
:display_folders
cls
echo Folders in BIBLESTUDYCLASS:
dir /b /ad BIBLESTUDYCLASS
pause
goto menu

:edit_folder
set /p old_folder_name=Enter current folder name:
set /p new_folder_name=Enter new folder name:
ren BIBLESTUDYCLASS\%old_folder_name% BIBLESTUDYCLASS\%new_folder_name%
goto menu

:create_folder
set /p folder_name=Enter new folder name: 
mkdir BIBLESTUDYCLASS\%folder_name%
goto menu

:add_folder
set /p dir_name=Enter directory name: 
set /p folder_name=Enter new folder name: 
mkdir BIBLESTUDYCLASS\%dir_name%\%folder_name%
goto menu

:bible study class
cls
set /p username=Enter username:
set /p password=Enter password:
echo Username: %username% >> %FOLDER%\ username.txt
echo Password: %password% >> %FOLDER%\ username.txt
echo User: %username% >> %folder%/ username.txt
echo Class: %class% >> BIBLESTUDYCLASS/CLASS/class.txt
pause
goto menu


:offering
cls
set /p username=Enter username:
set /p ammout=Enter ammount:
echo Username: %username% >> %FOLDER%\ username.txt
echo Ammount: %ammount% >> %FOLDER%\ username.txt
echo Student: %username% >> %folder%/ username.txt
echo Teacher: %username% >> %folder%/ username.txt
echo Class: %class% >> BIBLESTUDYCLASS/CLASS/class.txt
pause
goto menu

mkdir
mkdir BIBLESTUDYCLASS
mkdir BIBLESTUDYCLASS/STUDENTS
mkdir BIBLESTUDYCLASS/USERS
mkdir BIBLESTUDYCLASS/LESSONS
mkdir BIBLESTUDYCLASS/BIBLE
mkdir BIBLESTUDYCLASS/TEACHER
mkdir BIBLESTUDYCLASS/CLASS
mkdir BIBLESTUDYCLASS/OFFERINGS

