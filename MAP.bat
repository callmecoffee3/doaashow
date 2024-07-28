Here is the updated batch script with the ability to add a new location:

@echo off

:: Create local map
mkdir LocalMap

:: Create directories for locations
mkdir LocalMap\Home
mkdir LocalMap\Work
mkdir LocalMap\School
mkdir LocalMap\Park
mkdir LocalMap\Store

:: Create text files for location details
(
echo Home:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > LocalMap\Home\details.txt

(
echo Work:
echo Address: 456 Elm St
echo City: Othertown
echo State: NY
echo Zip: 67890
echo County: Othercounty
echo Country: USA
echo Phone: 555-5678
echo Website: (link unavailable)
echo Description: My office building
) > LocalMap\Work\details.txt

(
echo School:
echo Address: 789 Oak St
echo City: Smalltown
echo State: TX
echo Zip: 34567
echo County: Smallcounty
echo Country: USA
echo Phone: 555-9012
echo Website: (link unavailable)
echo Description: My alma mater
) > LocalMap\School\details.txt

(
echo Park:
echo Address: 321 Park Ave
echo City: Greentown
echo State: IL
echo Zip: 54321
echo County: Greencounty
echo Country: USA
echo Phone: 555-1111
echo Website: (link unavailable)
echo Description: A beautiful green space
) > LocalMap\Park\details.txt

(
echo Store:
echo Address: 901 Store St
echo City: Shopville
echo State: FL
echo Zip: 98765
echo County: Shopcounty
echo Country: USA
echo Phone: 555-2222
echo Website: (link unavailable)
echo Description: My favorite shopping spot
) > LocalMap\Store\details.txt

:menu
echo Local Map Menu
echo 1. Search location
echo 2. Add location
echo 3. Exit
set /p choice="Enter choice: "

if %choice%==1 goto search
if %choice%==2 goto add
if %choice%==3 goto exit

:search
set /p search="Enter location name to search: "
for /d %%a in (LocalMap\*) do (
if /i "%%~nxa"=="%search%" (
type %%a\details.txt
)
)
goto menu

:add
set /p name="Enter location name: "
set /p address="Enter address: "
set /p city="Enter city: "
set /p state="Enter state: "
set /p zip="Enter zip: "
set /p county="Enter county: "
set /p country="Enter country: "
set /p phone="Enter phone: "
set /p website="Enter website: "
set /p description="Enter description: "

mkdir LocalMap\%name%
(
echo %name%:
echo Address: %address%
echo City: %city%
echo State: %state%
echo Zip: %zip%
echo County: %county%
echo Country: %country%
echo Phone: %phone%
echo Website: %website%
echo Description: %description%
) > LocalMap\%name%\details.txt

goto menu

:exit
exit


This script adds a menu with options to search for a location, add a new location, or exit the program. When you choose to add a new location, it prompts you to enter the location details and creates a new directory and text file for the location.