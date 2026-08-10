@echo off

:MENU
cls
echo Feed Menu
echo 1. Enter new feed item
echo 2. Edit existing feed item
echo 3. Remove feed item
echo 4. View feed
echo 5. View user feed list
echo 6. View user feed
echo 7. Display user feed
echo 8. Add existing user
echo 9. Exit
set /p CHOICE=Choose an option: 

if %CHOICE%==1 goto ENTER
if %CHOICE%==4 goto VIEW
if %CHOICE%==7 goto DISPLAY_USER_FEED
if %CHOICE%==9 exit /b
goto MENU

:ENTER
set /p USER_ID=Enter your ID: 
set /p FEED_ITEM=Enter your feed item: 
echo %USER_ID%: %FEED_ITEM% >> user_feed.txt
echo Added.
pause
goto MENU

:VIEW
if exist user_feed.txt (type user_feed.txt) else (echo No feed yet.)
pause
goto MENU

:DISPLAY_USER_FEED
set /p USER_ID=Enter the ID of the user: 
echo Displaying feed for user %USER_ID%
if exist user_feed_%USER_ID%.txt (type user_feed_%USER_ID%.txt) else (echo No feed for that user.)
pause
goto MENU
