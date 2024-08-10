Here's an updated version of the script that scans a text file for token directories, asks the user for options, and then creates those directories on a specified drive:

@echo off
setlocal enabledelayedexpansion

:: Display options for text file
echo Select a text file:
echo 1. Use existing file (path\to\your\file.txt)
echo 2. Enter a new file path
echo 3. Exit

:: Ask user to select an option for text file
set /p file_option=Enter your choice (1-3):

:: Perform action based on user's choice for text file
if %file_option%==1 (
set "file=path\to\your\file.txt"
) else if %file_option%==2 (
set /p file=Enter the path to the text file:
) else if %file_option%==3 (
echo Exiting...
exit
) else (
echo Invalid option. Please try again.
pause
goto start
)

:: Display options for drive
echo Select an option:
echo 1. Create directories on C: drive
echo 2. Create directories on D: drive
echo 3. Choose a different drive
echo 4. Exit

:: Ask user to select an option for drive
set /p drive_option=Enter your choice (1-4):

:: Perform action based on user's choice for drive
if %drive_option%==1 (
set "drive=C:"
) else if %drive_option%==2 (
set "drive=D:"
) else if %drive_option%==3 (
set /p drive=Enter the drive letter:
) else if %drive_option%==4 (
echo Exiting...
exit
) else (
echo Invalid option. Please try again.
pause
goto start
)

:: Loop through each line in the text file
for /f "tokens=*" %%a in (%file%) do (
:: Check if the line contains the token "dir:"
echo %%a | findstr /c:"dir:" > nul
if not errorlevel 1 (
:: Extract the directory name
set "dir=%%a"
set "dir=!dir:dir:=!"

:: Create the directory
mkdir "%drive%\!dir!"

)

)

pause

This script will ask the user to select a text file and a drive, then scan the text file for lines containing the token "dir:", extract the directory name, and create those directories on the specified drive.