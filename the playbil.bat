Here's the updated code that prints the playbill information to a text file and reads from it:

@echo off
Title: Playbill

:menu
echo Bat Playbill
echo =============
echo 1. View Playbill
echo 2. Edit Playbill
echo 3. Exit

set /p choice=Enter your selection:

if %choice%==1 goto viewplaybill
if %choice%==2 goto editplaybill
if %choice%==3 goto exit

:viewplaybill
type playbill.txt
pause
goto menu

:editplaybill
echo Edit Playbill
echo =============
echo 1. Show Title
echo 2. Tagline
echo 3. Director
echo 4. Playwright
echo 5. Producers
echo 6. Cast
echo 7. Crew
echo 8. Save Changes

set /p choice=Enter your selection:

if %choice%==1 set /p showtitle=Enter new show title:
if %choice%==2 set /p tagline=Enter new tagline:
if %choice%==3 set /p director=Enter new director:
if %choice%==4 set /p playwright=Enter new playwright:
if %choice%==5 set /p producers=Enter new producers:
if %choice%==6 set /p cast=Enter new cast:
if %choice%==7 set /p crew=Enter new crew:
if %choice%==8 goto savechanges

goto editplaybill

:savechanges
echo Show Title: %showtitle% > playbill.txt
echo Tagline: %tagline% >> playbill.txt
echo Director: %director% >> playbill.txt
echo Playwright: %playwright% >> playbill.txt
echo Producers: %producers% >> playbill.txt
echo Cast: %cast% >> playbill.txt
echo Crew: %crew% >> playbill.txt
echo Changes saved!
pause
goto menu

:exit
exit