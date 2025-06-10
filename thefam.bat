Here's the updated code with additional features:


@echo off
title Facebook-Like Platform (FB-LP)
color 0a

:: Initialize database
if not exist database (
    mkdir database
)

:: Create tables
if not exist database\users.txt (
    echo id,username,password,name,email > database\users.txt
)
if not exist database\marketplace.txt (
    echo id,title,description,price,location > database\marketplace.txt
)
if not exist database\groups.txt (
    echo id,name,description,members > database\groups.txt
)
if not exist database\messenger.txt (
    echo id,from,to,message > database\messenger.txt
)
if not exist database\watch.txt (
    echo id,title,description,video > database\watch.txt
)
if not exist database\pages.txt (
    echo id,title,description,owner > database\pages.txt
)
if not exist database\events.txt (
    echo id,title,description,date > database\events.txt
)
if not exist database\posts.txt (
    echo id,title,description,author > database\posts.txt
)

:: Main Menu
:menu
cls
echo Facebook-Like Platform (FB-LP)
echo.
echo **********************************
echo - Login/Register *
echo **********************************
echo | Option | Description |
echo | ------- | ------------------- |
echo | 1 | Login |
echo | 2 | Register |
echo | 3 | Exit |
echo **********************************
echo.
choice /c 123 /n /m "Enter your choice: "
if %errorlevel% == 1 goto login
if %errorlevel% == 2 goto register
if %errorlevel% == 3 exit

:: Login
:login
cls
echo Login
echo.
set /p username=Enter username:
set /p password=Enter password:
for /f "tokens=1-5" %%a in (database\users.txt) do (
    if %%b == %username% && %%c == %password% (
        set logged_in_id=%%a
        set logged_in_username=%%b
        set logged_in_name=%%d
        goto profile
    )
)
echo Invalid credentials!
pause
goto login

:: Register
:register
cls
echo Register
echo.
set /p username=Enter username:
set /p password=Enter password:
set /p name=Enter name:
set /p email=Enter email:
set /a id+=1
echo %id%,%username%,%password%,%name%,%email% >> database\users.txt
echo Registration successful!
pause
goto menu

:: Profile
:profile
cls
echo Profile
echo.
echo Welcome, %logged_in_name%!

:: Navigation Bar
echo.
echo **********************************
echo - Navigation *
echo **********************************
echo | Option | Description |
echo | ------- | ------------------- |
echo | 1 | News Feed |
echo | 2 | Groups |
echo | 3 | Messenger |
echo | 4 | Watch |
echo | 5 | Pages |
echo | 6 | Events |
echo | 7 | Marketplace |
echo | 8 | Profile Settings |
echo | 9 | Create Post |
echo **********************************
echo.
choice /c 123456789 /n /m "Enter your choice: "
if %errorlevel% == 1 goto news_feed
if %errorlevel% == 2 goto groups
if %errorlevel% == 3 goto messenger
if %errorlevel% == 4 goto watch
if %errorlevel% == 5 goto pages
if %errorlevel% == 6 goto events
if %errorlevel% == 7 goto marketplace
if %errorlevel% == 8 goto profile_settings
if %errorlevel% == 9 goto create_post

:: Create Post
:create_post
cls
echo Create Post
echo.
set /p title=Enter post title:
set /p description=Enter post description:
echo %logged_in_id%,%title%,%description%,%logged_in_username% >> database\posts.txt
echo Post created successfully!
pause
goto profile

:: News Feed
:news_feed
cls
echo News Feed
echo.
for /f "tokens=1-4" %%a in (database\posts.txt) do (
    echo %%b - %%c by %%d
)
pause
goto profile

:: Groups
:groups
cls
echo Groups
echo.
echo **********************************
echo - Groups *
echo **********************************
echo | Option | Description |
echo | ------- | ------------------- |
echo | 1 | Create Group |
echo | 2 | Join Group |
echo | 3 | My Groups |
echo | 4 | Group Settings |
echo **********************************
echo.
choice /c 1234 /n /m "Enter your choice: "
if %errorlevel% == 1 goto create_group
if %errorlevel% == 2 goto join_group
if %errorlevel%
Write to Meta AI
