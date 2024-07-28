@echo off

:: Check if search_terms.txt exists, create if not
if not exist search_terms.txt (
type nul > search_terms.txt
)

:: Ask user to enter the drive letter
set /p drive="Enter the drive letter to search (e.g. C, D, E): "

:: Ask user to enter the search term
set /p term="Enter the search term: "

:: Append search term to search_terms.txt
echo %term% >> search_terms.txt

:: Ask user to search subdirectories
set /p search_sub="Search subdirectories? (y/n): "

:: Ask user to select scan text name
set /p scan_name="Enter scan results file name: "

:: Search for the term in the drive
if %search_sub%==y (
    echo Searching subdirectories...
    dir /s /b /a %drive%:\ | findstr /i "%term%" > %scan_name%.txt
) else (
    echo Searching root directory...
    dir /b /a %drive%:\ | findstr /i "%term%" > %scan_name%.txt
)

:: Print previous search terms
echo Previous search terms:
type search_terms.txt

:: Print search results
echo Search results:
type %scan_name%.txt

:: Make directories and let user know
echo Creating directories...
echo Please wait...
mkdir scan_results
echo Directory "scan_results" created.
mkdir scan_results\%scan_name%
echo Directory "scan_results\%scan_name%" created.

:: Move scan results file to directory
move %scan_name%.txt scan_results\%scan_name%

echo Search complete!
```

This script will:

1. Ask for the drive letter and search term
2. Search for the term in the drive (with or without subdirectories)
3. Append the search term to `search_terms.txt`
4. Ask the user to select a name for the scan results file
5. Print the previous search terms from `search_terms.txt`
6. Print the search results from the selected file name
7. Create a directory named `scan_results` and a subdirectory with the selected scan name
8. Move the scan results file into the subdirectory
9. Let the user know that directories are being created and when they are complete.

:: Ask user to enter the drive letter
set /p drive="Enter the drive letter to search (e.g. C, D, E): "

:: Ask user to enter the search term
set /p term="Enter the search term: "

:: Append search term to search_terms.txt
echo %term% >> search_terms.txt

:: Ask user to search subdirectories
set /p search_sub="Search subdirectories? (y/n): "

:: Ask user to select scan text name
set /p scan_name="Enter scan results file name: "

:: Search for the term in the drive
if %search_sub%==y (
    echo Searching subdirectories...
    dir /s /b /a %drive%:\ | findstr /i "%term%" > %scan_name%.txt
) else (
    echo Searching root directory...
    dir /b /a %drive%:\ | findstr /i "%term%" > %scan_name%.txt
)

:: Print previous search terms
echo Previous search terms:
type search_terms.txt

:: Print search results
echo Search results:
type %scan_name%.txt

:: Make directories
mkdir scan_results
move %scan_name%.txt scan_results

echo Search complete!
```

:: Check if search_terms.txt exists, create if not
if not exist search_terms.txt (
type nul > search_terms.txt
)

:: Ask user to enter the drive letter
set /p drive="Enter the drive letter to search (e.g. C, D, E): "

:: Ask user to enter the search term
set /p term="Enter the search term: "
:: Ask user to search subdirectories
set /p search_sub="Search subdirectories? (y/n): "

:: Search for the term in the drive
if %search_sub%==y (
    echo Searching subdirectories...
    dir /s /b /a %drive%:\ | findstr /i "%term%" > scan_results.txt
) else (
    echo Searching root directory...
    dir /b /a %drive%:\ | findstr /i "%term%" > scan_results.txt
)

:: Print previous search terms
echo Previous search terms:
type search_terms.txt

echo Search complete!

:: Append search term to search_terms.txt
echo %term% >> search_terms.txt

:: Print previous search terms
echo Previous search terms:
type search_terms.txt

:: Write the search term to a .txt file
echo %term% > search_term.txt

:: Search for the term in the drive
echo Searching for "%term%" in drive %drive%...
for /r %drive%:\ %%i in (_%term%_) do (
echo Found: %%i
echo %%i >> search_results.txt
)

:: Write scan details to file
echo Scan Details: >> scan_log.txt
echo Drive: %drive% >> scan_log.txt
echo Search Term: %term% >> scan_log.txt
echo Results: >> scan_log.txt
type search_results.txt >> scan_log.txt

echo dir /s /b /a %drive%:\ >
scan_results.txt

echo Search complete!
```
:: Ask user to enter the drive letter
set /p drive="Enter the drive letter to search (e.g. C, D, E): "

:: Ask user to enter the search term
set /p term="Enter the search term: "

:: Append search term to search_terms.txt
echo %term% >> search_terms.txt

:: Print previous search terms
echo Previous search terms:
type search_terms.txt

:: Write the search term to a .txt file
echo %term% > search_term.txt

:: Search for the term in the drive
echo Searching for "%term%" in drive %drive%...
for /r %drive%:\ %%i in (_%term%_) do (
echo Found: %%i
echo %%i >> search_results.txt
)

This script writes the search term to a file named `search_term.txt` and appends the search results to a file named `search_results.txt`.

Note:

- The `>` symbol redirects output to a new file
- The `>>` symbol appends output to an existing file

You can modify the script to write to different file names or paths as needed.

:: Ask user to enter the drive letter
set /p drive="Enter the drive letter to search (e.g. C, D, E): "

:: Ask user to enter the search term
set /p term="Enter the search term: "

:: Search for the term in the drive
echo Searching for "%term%" in drive %drive%...
for /r %drive%:\ %%i in (_%term%_) do (
echo Found: %%i
)

:: Create main directory
mkdir DoaShow

:: Create subdirectories
mkdir DoaShow\.idea
mkdir DoaShow\.txt
mkdir DoaShow\Channels
mkdir DoaShow\DOASHOW
mkdir DoaShow\files
mkdir Doashow\Proxies
mkdir DoaShow\Banner
mkdir DoaShow\Video
mkdir DoaShow\Clips
mkdir DoaShow\Writers

:: Create text file
echo DoaShow Directory Structure > DoaShow\directory_structure.txt

:: Main menu
:menu
echo DoaShow Directory Menu
echo 1. Display directories
echo 2. Add directory
echo 3. Edit directory
echo 4. Write to directory_structure.txt
echo 5. Search directories
echo 6. Copy directory
echo 7. View directory details
echo 8. Search the web
echo 9. Create subdirectories
echo 10. Exit
set /p choice="Enter choice: "

if %choice%==1 goto display
if %choice%==2 goto add
if %choice%==3 goto edit
if %choice%==4 goto write
if %choice%==5 goto search
if %choice%==6 goto copy
if %choice%==7 goto details
if %choice%==8 goto websearch
if %choice%==9 goto subdirs
if %choice%==10 goto exit

:: Display directories
:display
echo Displaying directories:
cd DoaShow
dir
goto menu

:: Add directory
:add
set /p name="Enter directory name: "
mkdir %name%
echo %name% >> DoaShow\directory_structure.txt
goto menu

:: Edit directory
:edit
set /p name="Enter directory name to edit: "
set /p newname="Enter new name: "
ren %name% %newname%
goto menu

:: Write to directory_structure.txt
:write
set /p text="Enter text to write: "
echo %text% >> DoaShow\directory_structure.txt
goto menu

:: Append the search results to the .txt file
for /r %drive%:\ %%i in (_%term%_) do (
echo %%i >> search_results.txt)

:: Search directories
:search
set /p search="Enter directory name to search: "
dir %search% /s
goto menu

:: Copy directory
:copy
set /p sourcedir="Enter source directory: "
set /p targetdir="Enter target directory: "
xcopy %sourcedir% %targetdir% /s /i
goto menu

:: View directory details
:details
set /p dir="Enter directory name: "
echo Directory details:
cd %dir%
dir /q
goto menu

:: Search the web
:websearch
set topic="search_topic:"
set url="http://www.%name%.com")
 
for %%i in (
"(http://www.%name%.com")
"(http://www.%name%.com")
do 
curl -s %%i
findstr /i 
)
goto menu

:: Create subdirectories
:subdirs
set /p dir="Enter directory name: "
set /p sub1="Enter subdirectory 1 name: "
set /p sub2="Enter subdirectory 2 name: "
mkdir %dir%/%sub1%
mkdir %dir%/%sub2%
goto menu

:: Exit
:exit
exit

:The added "Create subdirectories" option allows you to create subdirectories within a specified directory. The mkdir command is used to create the subdirectories.