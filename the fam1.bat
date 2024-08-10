Here is the updated batch script with the ability to add a new location:

@echo off

:: Create local dirctory thefam
mkdir thefam

:: Create directories for locations
mkdir thefam\Home
mkdir thefam\Work
mkdir thefam\School
mkdir thefam\Park
mkdir thefam\Store
mkdir thefam\Park
mkdir thefam\Pages
mkdir thefam\Groups
mkdir thefam\Watched
mkdir thefam\Internet
mkdir thefam\Facebook
mkdir thefam\Instagram
mkdir thefam\Threads
mkdir thefam\Youtube

:: Create text files for location details
(
echo Home:
echo Name:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > thefam\Home\details.txt

(
echo Work:
echo Name:
echo Address: 456 Elm St
echo City: Othertown
echo State: NY
echo Zip: 67890
echo County: Othercounty
echo Country: USA
echo Phone: 555-5678
echo Website: (link unavailable)
echo Description: My office building
) > thefam\Work\details.txt

(
echo School:
echo Name:
echo Address: 789 Oak St
echo City: Smalltown
echo State: TX
echo Zip: 34567
echo County: Smallcounty
echo Country: USA
echo Phone: 555-9012
echo Website: (link unavailable)
echo Description: My alma mater
) > thefam\School\details.txt

(
echo Park:
echo Name:
echo Address: 321 Park Ave
echo City: Greentown
echo State: IL
echo Zip: 54321
echo County: Greencounty
echo Country: USA
echo Phone: 555-1111
echo Website: (link unavailable)
echo Description: A beautiful green space
) > thefam\Park\details.txt

(
echo Store:
echo Name:
echo Address: 901 Store St
echo City: Shopville
echo State: FL
echo Zip: 98765
echo County: Shopcounty
echo Country: USA
echo Phone: 555-2222
echo Website: (link unavailable)
echo Description: My favorite shopping spot
) > thefam\Store\details.txt

(
echo People:
echo Name:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > thefam\People\details.txt

(
echo Pages:
echo Name:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > thefam\Pages\details.txt

(
echo Groups:
echo Name:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > thefam\Groups\details.txt

(
echo Watched:
echo Name:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > thefam\Watched\details.txt

(
echo Internet:
echo Name:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: google.com
echo Description: My cozy home
) > thefam\Internet\details.txt

(
echo Facebook:
echo Name:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > thefam\Facebook\details.txt

(
echo Instagram:
echo Name:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > thefam\Instagram\details.txt

(
echo Threads:
echo Name:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > thefam\Threads\details.txt
(
echo Youtube:
echo Name:
echo Channel:
echo Address: 123 Main St
echo City: Anytown
echo State: CA
echo Zip: 12345
echo County: Anycounty
echo Country: USA
echo Phone: 555-1234
echo Website: (link unavailable)
echo Description: My cozy home
) > thefam\Youtube\details.txt

:choices
echo Home
echo Work
echo School
echo Store
echo Park
echo Pages
echo Groups
echo Watched
echo Facebook
echo Instagram
echo Threads
echo Youtube

::menu
echo TheFam Menu
echo 1. Search location
echo 2. Add location
echo 3. Exit
set /p choice="Enter choice: "

if %choice%==1 goto search
if %choice%==2 goto add
if %choice%==3 goto exit

:search
set /p search="Enter location name to search: "
for /d %%a in (thefam\*) do (
if /i "%%~nxa"=="%search%" (
type %%a\details.txt
)
)
goto menu

:add
set /p name="Enter location name: "
set/p  name="User name:"
set /p address="Enter address: "
set /p city="Enter city: "
set /p state="Enter state: "
set /p zip="Enter zip: "
set /p county="Enter county: "
set /p country="Enter country: "
set /p phone="Enter phone: "
set /p website="Enter website: "
set /p description="Enter description: "

mkdir thefam\%name%
(
echo %name%
echo User Name: %user name%
echo Address: %address%
echo Phone: %phone%
) > thefam\%name%\details.txt

goto menu

:exit
exit


thefam
