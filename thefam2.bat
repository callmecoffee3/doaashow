@echo off
setlocal

:StartDashboard
cls
echo.
echo =========================================
echo   FamSocialNetwork - User Dashboard
echo =========================================
echo.

set "username_input="
set /p "username_input=Enter Username (or type 'new' to create / 'feed' for network / 'discover' users): "

if /i "%username_input%"=="new" (
    echo.
    echo Launching profile creation...
    set "called_from_dashboard=true"
    call create_profile.bat
    set "called_from_dashboard="
    goto :StartDashboard
)

if /i "%username_input%"=="feed" (
    echo.
    echo Loading network feed...
    set "called_from_dashboard=true"
    call main_feed.bat
    set "called_from_dashboard="
    goto :StartDashboard
)

if /i "%username_input%"=="discover" (
    echo.
    echo Discovering users...
    set "called_from_dashboard=true"
    call user_discover.bat
    set "called_from_dashboard="
    goto :StartDashboard
)


set "user_dir=FamSocialNetwork\%username_input%"

if not exist "%user_dir%" (
    echo.
    echo Error: Profile for "%username_input%" not found.
    echo Please try again, or type 'new' to create, 'feed' for network posts, or 'discover' to see all users.
    echo.
    pause
    goto :StartDashboard
)

:DashboardMenu
cls
echo.
echo =========================================
echo   Dashboard for: %username_input%
echo =========================================
echo.
echo What would you like to do?
echo   1. View / Edit Profile
echo   2. Create a New Profile
echo   3. View Network Feed (Posts & All Profiles)
echo   4. Discover Users on Network
echo   5. Post to Network Feed
echo   6. Manage Relationships (Follow/Friends)
echo   7. View Friend Feed
echo   8. View Follow Feed
echo   9. Manage Communities (Create/Join/Post)
echo   10. View Clubs Feed
echo   11. View Groups Feed
echo   12. View Pages Feed
echo   13. View Marketplace Feed
echo   14. List Item for Sale
echo   15. View Join & Signup Log
echo   16. Send Message
echo   17. View Messages
echo   18. Exit Dashboard
echo.
set /p "choice=Enter your choice (1-18): "

if "%choice%"=="1" (
    echo.
    echo Loading %username_input%'s profile...
    set "called_from_dashboard=true"
    call view_profile.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="2" (
    echo.
    echo Launching profile creation...
    set "called_from_dashboard=true"
    call create_profile.bat
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="3" (
    echo.
    echo Loading network feed...
    set "called_from_dashboard=true"
    call main_feed.bat
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="4" (
    echo.
    echo Discovering users...
    set "called_from_dashboard=true"
    call user_discover.bat
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="5" (
    echo.
    echo --- Create a New Post ---
    set /p "post_message=Enter your post (max 200 chars, no special characters like < > |): "
    if not exist "FamSocialNetwork\posts.txt" (
        echo. > FamSocialNetwork\posts.txt
    )
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
        set "yyyy=%%d"
        set "mm=%%b"
        set "dd=%%c"
        if not "%mm:~0,1%"=="0" if "%mm%"=="1" set "mm=01"
        if not "%mm:~0,1%"=="0" if "%mm%"=="2" set "mm=02"
        if not "%mm:~0,1%"=="0" if "%mm%"=="3" set "mm=03"
        if not "%mm:~0,1%"=="0" if "%mm%"=="4" set "mm=04"
        if not "%mm:~0,1%"=="0" if "%mm%"=="5" set "mm=05"
        if not "%mm:~0,1%"=="0" if "%mm%"=="6" set "mm=06"
        if not "%mm:~0,1%"=="0" if "%mm%"=="7" set "mm=07"
        if not "%mm:~0,1%"=="0" if "%mm%"=="8" set "mm=08"
        if not "%mm:~0,1%"=="0" if "%mm%"=="9" set "mm=09"
        set "current_date=%yyyy%-%mm%-%dd%"
    )
    for /f "tokens=1-2 delims=:" %%a in ('time /t') do (set current_time=%%a:%%b)
    echo [%current_date% %current_time%] %username_input%: %post_message%>> FamSocialNetwork\posts.txt
    echo.
    echo Your post has been added to the network feed!
    pause
    goto :DashboardMenu
) else if "%choice%"=="6" (
    echo.
    echo Managing relationships...
    set "called_from_dashboard=true"
    call manage_relationships.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="7" (
    echo.
    echo Loading friend feed...
    set "called_from_dashboard=true"
    call friend_feed.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="8" (
    echo.
    echo Loading follow feed...
    set "called_from_dashboard=true"
    call follow_feed.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="9" (
    echo.
    echo Managing communities...
    set "called_from_dashboard=true"
    call manage_communities.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="10" (
    echo.
    echo Loading clubs feed...
    set "called_from_dashboard=true"
    call clubs_feed.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="11" (
    echo.
    echo Loading groups feed...
    set "called_from_dashboard=true"
    call groups_feed.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="12" (
    echo.
    echo Loading pages feed...
    set "called_from_dashboard=true"
    call pages_feed.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="13" (
    echo.
    echo Loading marketplace feed...
    set "called_from_dashboard=true"
    call marketplace_feed.bat
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="14" (
    echo.
    echo --- List Item for Sale ---
    set /p "item_name=Enter item name: "
    set /p "item_price=Enter price: "
    set /p "item_desc=Enter short description: "
    if not exist "FamSocialNetwork\marketplace_posts.txt" (
        echo. > FamSocialNetwork\marketplace_posts.txt
    )
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
        set "yyyy=%%d"
        set "mm=%%b"
        set "dd=%%c"
        if not "%mm:~0,1%"=="0" if "%mm%"=="1" set "mm=01"
        if not "%mm:~0,1%"=="0" if "%mm%"=="2" set "mm=02"
        if not "%mm:~0,1%"=="0" if "%mm%"=="3" set "mm=03"
        if not "%mm:~0,1%"=="0" if "%mm%"=="4" set "mm=04"
        if not "%mm:~0,1%"=="0" if "%mm%"=="5" set "mm=05"
        if not "%mm:~0,1%"=="0" if "%mm%"=="6" set "mm=06"
        if not "%mm:~0,1%"=="0" if "%mm%"=="7" set "mm=07"
        if not "%mm:~0,1%"=="0" if "%mm%"=="8" set "mm=08"
        if not "%mm:~0,1%"=="0" if "%mm%"=="9" set "mm=09"
        set "current_date=%yyyy%-%mm%-%dd%"
    )
    for /f "tokens=1-2 delims=:" %%a in ('time /t') do (set current_time=%%a:%%b)
    echo [%current_date% %current_time%] LISTING by %username_input%: %item_name% - Price: %item_price% - Desc: %item_desc%>> FamSocialNetwork\marketplace_posts.txt
    echo.
    echo Your item has been listed!
    pause
    goto :DashboardMenu
) else if "%choice%"=="15" (
    echo.
    echo Loading join and signup log...
    set "called_from_dashboard=true"
    call signup_join_feed.bat
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="16" (
    echo.
    echo Sending a message...
    set "called_from_dashboard=true"
    call send_message.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="17" (
    echo.
    echo Viewing messages...
    set "called_from_dashboard=true"
    call view_messages.bat "%username_input%"
    set "called_from_dashboard="
    goto :DashboardMenu
) else if "%choice%"=="18" (
    echo.
    echo Exiting FamSocialNetwork. Goodbye!
    goto :eof
) else (
    echo.
    echo Invalid choice. Please enter 1-18.
    pause
    goto :DashboardMenu
)

endlocal
@echo off
setlocal

:: Create main directory for social network if it doesn't exist
if not exist "FamSocialNetwork" mkdir FamSocialNetwork

echo.
echo ====================================
echo   FamSocialNetwork - New Profile
echo ====================================
echo.

:: Set profile information
set /p name="Enter a unique name for the profile: "

:: Basic validation for name
if "%name%"=="" (
    echo Error: Name cannot be empty.
    pause
    goto :eof
)

:: Check if profile already exists
if exist "FamSocialNetwork\%name%" (
    echo.
    echo A profile for "%name%" already exists.
    echo Please choose a different name or view the existing profile.
    echo.
    pause
    goto :eof
)


set /p date="Enter current date (e.g.,YYYY-MM-DD): "
set /p bio="Enter a short bio: "
set /p websites="Enter websites (comma-separated, optional): "
set /p birthdate="Enter birthdate (e.g.,YYYY-MM-DD): "

echo.
echo --- Interests and Preferences ---
echo.

:: Set interests and preferences
set /p food="Enter favorite food: "
set /p drinks="Enter favorite drinks: "
set /p snacks="Enter favorite snacks: "
set /p rooms="Enter favorite rooms: "
set /p bed="Enter favorite bed type: "
set /p restroom="Enter favorite restroom type: "
set /p sink="Enter favorite sink type: "
set /p furniture="Enter favorite furniture: "
set /p follows="Enter what you follow (e.g., topics, people): "
set /p interest="Enter general interests (comma-separated): "

:: Create folders for profile, interests, and preferences
mkdir FamSocialNetwork\%name%\Profile
mkdir FamSocialNetwork\%name%\Interests
mkdir FamSocialNetwork\%name%\Preferences
mkdir FamSocialNetwork\%name%\Friends
mkdir FamSocialNetwork\%name%\Following
mkdir FamSocialNetwork\%name%\Followers
mkdir FamSocialNetwork\%name%\JoinedClubs
mkdir FamSocialNetwork\%name%\JoinedGroups
mkdir FamSocialNetwork\%name%\FollowedPages
mkdir FamSocialNetwork\%name%\Messages

:: Write profile information to file
(
echo PROFILE:
echo Name: %name%
echo Date: %date%
echo Bio: %bio%
echo Websites: %websites%
echo Birthdate: %birthdate%
) > FamSocialNetwork\%name%\Profile\profile.txt

:: Write interests to file
(
echo INTERESTS:
echo Follows: %follows%
echo Interests: %interest%
) > FamSocialNetwork\%name%\Interests\interests.txt

:: Write preferences to file
(
echo PREFERENCES:
echo Food: %food%
echo Drinks: %drinks%
echo Snacks: %snacks%
echo Rooms: %rooms%
echo Bed: %bed%
echo Restroom: %restroom%
echo Sink: %sink%
echo Furniture: %furniture%
) > FamSocialNetwork\%name%\Preferences\preferences.txt

echo.
echo ====================================
echo Your New Social Network Profile:
echo ====================================
echo.
type FamSocialNetwork\%name%\Profile\profile.txt
type FamSocialNetwork\%name%\Interests\interests.txt
type FamSocialNetwork\%name%\Preferences\preferences.txt
echo.
echo ====================================

:: Log the new signup
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
    set "yyyy=%%d"
    set "mm=%%b"
    set "dd=%%c"
    if not "%mm:~0,1%"=="0" if "%mm%"=="1" set "mm=01"
    if not "%mm:~0,1%"=="0" if "%mm%"=="2" set "mm=02"
    if not "%mm:~0,1%"=="0" if "%mm%"=="3" set "mm=03"
    if not "%mm:~0,1%"=="0" if "%mm%"=="4" set "mm=04"
    if not "%mm:~0,1%"=="0" if "%mm%"=="5" set "mm=05"
    if not "%mm:~0,1%"=="0" if "%mm%"=="6" set "mm=06"
    if not "%mm:~0,1%"=="0" if "%mm%"=="7" set "mm=07"
    if not "%mm:~0,1%"=="0" if "%mm%"=="8" set "mm=08"
    if not "%mm:~0,1%"=="0" if "%mm%"=="9" set "mm=09"
    set "current_date=%yyyy%-%mm%-%dd%"
)
for /f "tokens=1-2 delims=:" %%a in ('time /t') do (set current_time=%%a:%%b)
echo [%current_date% %current_time%] New User Signup: %name% >> FamSocialNetwork\signup_join_log.txt

echo.
echo Profile for "%name%" created successfully!
echo To view this profile or any other profile, use the dashboard: user_dashboard.bat
echo.

:: Only pause if run directly, otherwise return to caller
if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof
@echo off
setlocal

echo.
echo ====================================
echo   FamSocialNetwork - Profile Viewer
echo ====================================
echo.

:: Check if a username is provided
if "%~1"=="" (
    echo Usage: %~n0 ^<username^>
    echo.
    echo Example: %~n0 John
    echo.
    :: Only pause if run directly, otherwise return to caller
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "username=%~1"
set "user_dir=FamSocialNetwork\%username%"

:: Check if the user directory exists
if not exist "%user_dir%" (
    echo Error: Profile for "%username%" not found.
    echo.
    :: Only pause if run directly, otherwise return to caller
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo.
echo Displaying Profile for: %username%
echo.

if exist "%user_dir%\Profile\profile.txt" (
    echo --- PROFILE ---
    type "%user_dir%\Profile\profile.txt"
    echo.
) else (
    echo No profile information found for %username%.
)

if exist "%user_dir%\Interests\interests.txt" (
    echo --- INTERESTS ---
    type "%user_dir%\Interests\interests.txt"
    echo.
) else (
    echo No interests information found for %username%.
)

if exist "%user_dir%\Preferences\preferences.txt" (
    echo --- PREFERENCES ---
    type "%user_dir%\Preferences\preferences.txt"
    echo.
) else (
    echo No preferences information found for %username%.
)

echo ====================================
echo End of Profile for %username%
echo ====================================
echo.

:EditPrompt
set /p "choice=Would you like to edit the Interests and Preferences for %username%? (Y/N): "

if /i "%choice%"=="Y" (
    goto :EditProfileSection
) else if /i "%choice%"=="N" (
    echo Exiting profile viewer.
    :: Only pause if run directly, otherwise return to caller
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
) else (
    echo Invalid choice. Please enter Y or N.
    goto :EditPrompt
)

:EditProfileSection
echo.
echo --- Currently editing: %username%'s Interests and Preferences ---
echo.
echo Please enter the NEW interests and preferences.
echo (Existing data will be overwritten.)
echo.

:: Set new interests and preferences
set /p follows="Enter NEW what you follow (e.g., topics, people): "
set /p interest="Enter NEW general interests (comma-separated): "
echo.
set /p food="Enter NEW favorite food: "
set /p drinks="NEW favorite drinks: "
set /p snacks="Enter NEW favorite snacks: "
set /p rooms="Enter NEW favorite rooms: "
set /p bed="Enter NEW favorite bed type: "
set /p restroom="Enter NEW favorite restroom type: "
set /p sink="Enter NEW favorite sink type: "
set /p furniture="Enter NEW favorite furniture: "


:: Write new interests to file (overwriting existing)
(
echo INTERESTS:
echo Follows: %follows%
echo Interests: %interest%
) > "%user_dir%\Interests\interests.txt"

:: Write new preferences to file (overwriting existing)
(
echo PREFERENCES:
echo Food: %food%
echo Drinks: %drinks%
echo Snacks: %snacks%
echo Rooms: %rooms%
echo Bed: %bed%
echo Restroom: %restroom%
echo Sink: %sink%
echo Furniture: %furniture%
) > "%user_dir%\Preferences\preferences.txt"

echo.
echo ====================================
echo Interests and Preferences for "%username%" updated successfully!
echo.
echo You can view the updated profile by running: view_profile "%username%" again (or use the dashboard).
echo.

:: Only pause if run directly, otherwise return to caller
if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof


@echo off
setlocal

cls
echo.
echo =========================================
echo   FamSocialNetwork - Network Feed
echo =========================================
echo.

set "social_dir=FamSocialNetwork"
set "posts_file=%social_dir%\posts.txt"

if not exist "%social_dir%" (
    echo No content available yet. Create a profile and post!
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo.
echo --- RECENT NETWORK POSTS ---
echo.

if exist "%posts_file%" (
    type "%posts_file%"
) else (
    echo No posts yet. Be the first to post!
)

echo.
echo =========================================
echo.
echo --- PROFILES ON THE NETWORK ---
echo.

:: Loop through each subdirectory in FamSocialNetwork
for /d %%d in ("%social_dir%\*") do (
    :: Extract just the directory name (which is the username)
    echo - %%~nxd
)

echo.
echo =========================================
echo.
echo To view a profile or make a post, return to the dashboard.
echo.

if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof
@echo off
setlocal

cls
echo.
echo =========================================
echo   FamSocialNetwork - Discover Users
echo =========================================
echo.

set "social_dir=FamSocialNetwork"

if not exist "%social_dir%" (
    echo No profiles exist yet. Be the first to create one!
    echo.
    :: Only pause if run directly, otherwise return to caller
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo Users currently on FamSocialNetwork:
echo -------------------------------------

:: Loop through each subdirectory in FamSocialNetwork
for /d %%d in ("%social_dir%\*") do (
    :: Extract just the directory name (which is the username)
    echo - %%~nxd
)

echo -------------------------------------
echo.
echo Use the dashboard to view a specific profile or create a new one.
echo.

if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof

@echo off
setlocal

:: This script requires the current username as an argument
if "%~1"=="" (
    echo Error: Username not provided to manage_relationships.bat.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "current_user=%~1"
set "current_user_dir=FamSocialNetwork\%current_user%"

:RelationshipsMenu
cls
echo.
echo =========================================
echo   %current_user%'s Relationship Manager
echo =========================================
echo.
echo What would you like to do?
echo   1. Follow a User
echo   2. Add a Friend (Mutual)
echo   3. View Who %current_user% Follows
echo   4. View %current_user%'s Followers
echo   5. View %current_user%'s Friends
echo   6. Back to Dashboard
echo.
set /p "choice=Enter your choice (1-6): "

if "%choice%"=="1" (
    echo.
    set /p "target_user=Enter username to FOLLOW: "
    call :PerformFollow "%target_user%"
    pause
    goto :RelationshipsMenu
) else if "%choice%"=="2" (
    echo.
    set /p "target_user=Enter username to ADD AS FRIEND: "
    call :PerformAddFriend "%target_user%"
    pause
    goto :RelationshipsMenu
) else if "%choice%"=="3" (
    echo.
    echo --- Users %current_user% Follows ---
    if exist "%current_user_dir%\Following\following.txt" (
        type "%current_user_dir%\Following\following.txt"
    ) else (
        echo %current_user% is not following anyone yet.
    )
    echo.
    pause
    goto :RelationshipsMenu
) else if "%choice%"=="4" (
    echo.
    echo --- Users Following %current_user% ---
    if exist "%current_user_dir%\Followers\followers.txt" (
        type "%current_user_dir%\Followers\followers.txt"
    ) else (
        echo %current_user% has no followers yet.
    )
    echo.
    pause
    goto :RelationshipsMenu
) else if "%choice%"=="5" (
    echo.
    echo --- %current_user%'s Friends ---
    if exist "%current_user_dir%\Friends\friends.txt" (
        type "%current_user_dir%\Friends\friends.txt"
    ) else (
        echo %current_user% has no friends yet.
    )
    echo.
    pause
    goto :RelationshipsMenu
) else if "%choice%"=="6" (
    echo.
    echo Returning to dashboard...
    goto :eof
) else (
    echo.
    echo Invalid choice. Please enter 1-6.
    pause
    goto :RelationshipsMenu
)

:: Subroutines
:PerformFollow
set "target_user=%~1"
set "target_user_dir=FamSocialNetwork\%target_user%"

if "%target_user%"=="" (
    echo Error: Target username cannot be empty.
    goto :eof
)
if /i "%target_user%"=="%current_user%" (
    echo You cannot follow yourself.
    goto :eof
)
if not exist "%target_user_dir%" (
    echo Error: User '%target_user%' does not exist.
    goto :eof
)

:: Check if already following
findstr /i /l /c:"%target_user%" "%current_user_dir%\Following\following.txt" >nul 2>&1
if not errorlevel 1 (
    echo You are already following %target_user%.
    goto :eof
)

echo %target_user%>> "%current_user_dir%\Following\following.txt"
echo %current_user%>> "%target_user_dir%\Followers\followers.txt"
echo Successfully followed %target_user%!
goto :eof

:PerformAddFriend
set "target_user=%~1"
set "target_user_dir=FamSocialNetwork\%target_user%"

if "%target_user%"=="" (
    echo Error: Target username cannot be empty.
    goto :eof
)
if /i "%target_user%"=="%current_user%" (
    echo You cannot be friends with yourself.
    goto :eof
)
if not exist "%target_user_dir%" (
    echo Error: User '%target_user%' does not exist.
    goto :eof
)

:: Check if already friends with target user
findstr /i /l /c:"%target_user%" "%current_user_dir%\Friends\friends.txt" >nul 2>&1
if not errorlevel 1 (
    echo You are already friends with %target_user%.
    goto :eof
)

echo %target_user%>> "%current_user_dir%\Friends\friends.txt"
echo %current_user%>> "%target_user_dir%\Friends\friends.txt"
echo Successfully added %target_user% as a mutual friend!
goto :eof

endlocal

@echo off
setlocal

if "%~1"=="" (
    echo Error: Username not provided to friend_feed.bat.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "current_user=%~1"
set "friends_file=FamSocialNetwork\%current_user%\Friends\friends.txt"
set "posts_file=FamSocialNetwork\posts.txt"

cls
echo.
echo =========================================
echo   %current_user%'s Friend Feed
echo =========================================
echo.

if not exist "%friends_file%" (
    echo You don't have any friends yet. Add some to see their posts!
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

if not exist "%posts_file%" (
    echo No posts on the network yet.
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo --- Posts from your Friends ---
echo.

set "found_posts=false"
for /f "tokens=*" %%f in ('type "%friends_file%"') do (
    :: %%f contains a friend's username
    :: Use findstr to get posts from that friend
    findstr /i /l /c:"%%f:" "%posts_file%"
    if not errorlevel 1 set "found_posts=true"
)

if "%found_posts%"=="false" (
    echo No recent posts from your friends.
)

echo.
echo =========================================
echo.
if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof

@echo off
setlocal

if "%~1"=="" (
    echo Error: Username not provided to follow_feed.bat.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "current_user=%~1"
set "following_file=FamSocialNetwork\%current_user%\Following\following.txt"
set "posts_file=FamSocialNetwork\posts.txt"

cls
echo.
echo =========================================
echo   %current_user%'s Follow Feed
echo =========================================
echo.

if not exist "%following_file%" (
    echo You are not following anyone yet. Follow some users to see their posts!
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

if not exist "%posts_file%" (
    echo No posts on the network yet.
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo --- Posts from Users You Follow ---
echo.

set "found_posts=false"
for /f "tokens=*" %%f in ('type "%following_file%"') do (
    :: %%f contains a followed user's username
    :: Use findstr to get posts from that user
    findstr /i /l /c:"%%f:" "%posts_file%"
    if not errorlevel 1 set "found_posts=true"
)

if "%found_posts%"=="false" (
    echo No recent posts from users you follow.
)

echo.
echo =========================================
echo.
if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof

@echo off
setlocal

if "%~1"=="" (
    echo Error: Username not provided to manage_communities.bat.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "current_user=%~1"
set "social_dir=FamSocialNetwork"
set "community_posts_file=%social_dir%\community_posts.txt"
set "signup_join_log_file=%social_dir%\signup_join_log.txt"

:CommunitiesMenu
cls
echo.
echo =========================================
echo   %current_user%'s Community Manager
echo =========================================
echo.
echo What would you like to do?
echo   1. Create a New Club
echo   2. Create a New Group
echo   3. Create a New Page
echo   4. Join a Club
echo   5. Join a Group
echo   6. Follow a Page
echo   7. Post to a Club (if joined)
echo   8. Post to a Group (if joined)
echo   9. Post to a Page (if followed)
echo   10. Back to Dashboard
echo.
set /p "choice=Enter your choice (1-10): "

if "%choice%"=="1" (
    call :CreateCommunity "Club"
    pause
    goto :CommunitiesMenu
) else if "%choice%"=="2" (
    call :CreateCommunity "Group"
    pause
    goto :CommunitiesMenu
) else if "%choice%"=="3" (
    call :CreateCommunity "Page"
    pause
    goto :CommunitiesMenu
) else if "%choice%"=="4" (
    call :JoinCommunity "Club" "JoinedClubs"
    pause
    goto :CommunitiesMenu
) else if "%choice%"=="5" (
    call :JoinCommunity "Group" "JoinedGroups"
    pause
    goto :CommunitiesMenu
) else if "%choice%"=="6" (
    call :JoinCommunity "Page" "FollowedPages"
    pause
    goto :CommunitiesMenu
) else if "%choice%"=="7" (
    call :PostToCommunity "Club" "JoinedClubs"
    pause
    goto :CommunitiesMenu
) else if "%choice%"=="8" (
    call :PostToCommunity "Group" "JoinedGroups"
    pause
    goto :CommunitiesMenu
) else if "%choice%"=="9" (
    call :PostToCommunity "Page" "FollowedPages"
    pause
    goto :CommunitiesMenu
) else if "%choice%"=="10" (
    echo.
    echo Returning to dashboard...
    goto :eof
) else (
    echo.
    echo Invalid choice. Please enter 1-10.
    pause
    goto :CommunitiesMenu
)

:: Subroutines
:GetTimestamp
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
        set "yyyy=%%d"
        set "mm=%%b"
        set "dd=%%c"
        if not "%mm:~0,1%"=="0" if "%mm%"=="1" set "mm=01"
        if not "%mm:~0,1%"=="0" if "%mm%"=="2" set "mm=02"
        if not "%mm:~0,1%"=="0" if "%mm%"=="3" set "mm=03"
        if not "%mm:~0,1%"=="0" if "%mm%"=="4" set "mm=04"
        if not "%mm:~0,1%"=="0" if "%mm%"=="5" set "mm=05"
        if not "%mm:~0,1%"=="0" if "%mm%"=="6" set "mm=06"
        if not "%mm:~0,1%"=="0" if "%mm%"=="7" set "mm=07"
        if not "%mm:~0,1%"=="0" if "%mm%"=="8" set "mm=08"
        if not "%mm:~0,1%"=="0" if "%mm%"=="9" set "mm=09"
        set "current_date_ts=%yyyy%-%mm%-%dd%"
    )
    for /f "tokens=1-2 delims=:" %%a in ('time /t') do (set current_time_ts=%%a:%%b)
    set "timestamp=[%current_date_ts% %current_time_ts%]"
goto :eof

:CreateCommunity
    set "community_type=%~1"
    set /p "community_name=Enter name for new %community_type%: "
    if "%community_name%"=="" (
        echo Name cannot be empty.
        goto :eof
    )

    set "community_dir=%social_dir%\%community_type%s\%community_name%"
    if exist "%community_dir%" (
        echo %community_type% "%community_name%" already exists.
        goto :eof
    )

    mkdir "%community_dir%"
    echo %community_type% "%community_name%" created by %current_user%.
    call :GetTimestamp
    echo %timestamp% New %community_type% Created: %community_name% by %current_user% >> "%signup_join_log_file%"
goto :eof

:JoinCommunity
    set "community_type=%~1"
    set "user_membership_folder=%~2"
    set /p "target_community=Enter name of %community_type% to join/follow: "
    if "%target_community%"=="" (
        echo Community name cannot be empty.
        goto :eof
    )

    set "community_path=%social_dir%\%community_type%s\%target_community%"
    if not exist "%community_path%" (
        echo %community_type% "%target_community%" does not exist.
        goto :eof
    )

    set "user_membership_file=FamSocialNetwork\%current_user%\%user_membership_folder%\%community_type%s.txt"
    findstr /i /l /c:"%target_community%" "%user_membership_file%" >nul 2>&1
    if not errorlevel 1 (
        echo You are already a member/follower of "%target_community%".
        goto :eof
    )

    echo %target_community% >> "%user_membership_file%"
    echo Successfully joined/followed %community_type% "%target_community%"!
    call :GetTimestamp
    echo %timestamp% %current_user% joined/followed %community_type%: %target_community% >> "%signup_join_log_file%"
goto :eof

:PostToCommunity
    set "community_type=%~1"
    set "user_membership_folder=%~2"
    set /p "target_community=Enter name of %community_type% to post to: "
    if "%target_community%"=="" (
        echo Community name cannot be empty.
        goto :eof
    )

    set "community_path=%social_dir%\%community_type%s\%target_community%"
    if not exist "%community_path%" (
        echo %community_type% "%target_community%" does not exist.
        goto :eof
    )

    :: Check if user is a member/follower
    set "user_membership_file=FamSocialNetwork\%current_user%\%user_membership_folder%\%community_type%s.txt"
    findstr /i /l /c:"%target_community%" "%user_membership_file%" >nul 2>&1
    if errorlevel 1 (
        echo You are not a member/follower of "%target_community%". Join/Follow it first.
        goto :eof
    )

    set /p "post_message=Enter your post for %target_community%: "
    if "%post_message%"=="" (
        echo Post cannot be empty.
        goto :eof
    )

    call :GetTimestamp
    echo [%community_type%:%target_community%] %timestamp% %current_user%: %post_message% >> "%community_posts_file%"
    echo Post successfully made to %community_type% "%target_community%"!
goto :eof

endlocal

@echo off
setlocal

set "marketplace_posts_file=FamSocialNetwork\marketplace_posts.txt"

cls
echo.
echo =========================================
echo   FamSocialNetwork - Marketplace Feed
echo =========================================
echo.

if not exist "%marketplace_posts_file%" (
    echo No items currently listed in the Marketplace.
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo --- Latest Listings ---
echo.
type "%marketplace_posts_file%"
echo.
echo =========================================
echo.
echo To list your own item, return to the dashboard.
echo.

if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof
@echo off
setlocal

if "%~1"=="" (
    echo Error: Username not provided to clubs_feed.bat.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "current_user=%~1"
set "community_type=Club"
set "user_membership_folder=JoinedClubs"
set "community_posts_file=FamSocialNetwork\community_posts.txt"
set "user_membership_file=FamSocialNetwork\%current_user%\%user_membership_folder%\%community_type%s.txt"

cls
echo.
echo =========================================
echo   %current_user%'s Clubs Feed
echo =========================================
echo.

if not exist "%user_membership_file%" (
    echo You have not joined any Clubs yet. Join some to see their posts!
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

if not exist "%community_posts_file%" (
    echo No posts in any communities yet.
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo --- Posts from your Joined Clubs ---
echo.

set "found_posts=false"
for /f "tokens=*" %%c in ('type "%user_membership_file%"') do (
    :: %%c contains a joined club's name
    :: Filter community_posts.txt for posts from this club
    findstr /i /l /c:"[%community_type%:%%c]" "%community_posts_file%"
    if not errorlevel 1 set "found_posts=true"
)

if "%found_posts%"=="false" (
    echo No recent posts from your joined clubs.
)

echo.
echo =========================================
echo.
if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof

@echo off
setlocal

if "%~1"=="" (
    echo Error: Username not provided to groups_feed.bat.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "current_user=%~1"
set "community_type=Group"
set "user_membership_folder=JoinedGroups"
set "community_posts_file=FamSocialNetwork\community_posts.txt"
set "user_membership_file=FamSocialNetwork\%current_user%\%user_membership_folder%\%community_type%s.txt"

cls
echo.
echo =========================================
echo   %current_user%'s Groups Feed
echo =========================================
echo.

if not exist "%user_membership_file%" (
    echo You have not joined any Groups yet. Join some to see their posts!
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

if not exist "%community_posts_file%" (
    echo No posts in any communities yet.
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo --- Posts from your Joined Groups ---
echo.

set "found_posts=false"
for /f "tokens=*" %%c in ('type "%user_membership_file%"') do (
    :: %%c contains a joined group's name
    :: Filter community_posts.txt for posts from this group
    findstr /i /l /c:"[%community_type%:%%c]" "%community_posts_file%"
    if not errorlevel 1 set "found_posts=true"
)

if "%found_posts%"=="false" (
    echo No recent posts from your joined groups.
)

echo.
echo =========================================
echo.
if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof

@echo off
setlocal

if "%~1"=="" (
    echo Error: Username not provided to pages_feed.bat.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "current_user=%~1"
set "community_type=Page"
set "user_membership_folder=FollowedPages"
set "community_posts_file=FamSocialNetwork\community_posts.txt"
set "user_membership_file=FamSocialNetwork\%current_user%\%user_membership_folder%\%community_type%s.txt"

cls
echo.
echo =========================================
echo   %current_user%'s Pages Feed
echo =========================================
echo.

if not exist "%user_membership_file%" (
    echo You have not followed any Pages yet. Follow some to see their posts!
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

if not exist "%community_posts_file%" (
    echo No posts in any communities yet.
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo --- Posts from your Followed Pages ---
echo.

set "found_posts=false"
for /f "tokens=*" %%c in ('type "%user_membership_file%"') do (
    :: %%c contains a followed page's name
    :: Filter community_posts.txt for posts from this page
    findstr /i /l /c:"[%community_type%:%%c]" "%community_posts_file%"
    if not errorlevel 1 set "found_posts=true"
)

if "%found_posts%"=="false" (
    echo No recent posts from your followed pages.
)

echo.
echo =========================================
echo.
if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof

@echo off
setlocal

set "signup_join_log_file=FamSocialNetwork\signup_join_log.txt"

cls
echo.
echo =========================================
echo   FamSocialNetwork - Join & Signup Feed
echo =========================================
echo.

if not exist "%signup_join_log_file%" (
    echo No signup or join activity recorded yet.
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo --- Recent Activity ---
echo.
type "%signup_join_log_file%"
echo.
echo =========================================
echo.
if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof

@echo off
setlocal

:: This script requires the sender's username as an argument
if "%~1"=="" (
    echo Error: Sender username not provided to send_message.bat.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "sender_user=%~1"
set "sender_dir=FamSocialNetwork\%sender_user%"
set "social_dir=FamSocialNetwork"

cls
echo.
echo =========================================
echo   FamSocialNetwork - Send Message
echo =========================================
echo.

set /p "recipient_user=Enter recipient's username: "

if "%recipient_user%"=="" (
    echo Error: Recipient username cannot be empty.
    pause
    goto :eof
)

if /i "%recipient_user%"=="%sender_user%" (
    echo You cannot send a message to yourself.
    pause
    goto :eof
)

set "recipient_dir=%social_dir%\%recipient_user%"
if not exist "%recipient_dir%" (
    echo Error: Recipient user '%recipient_user%' does not exist.
    pause
    goto :eof
)

set /p "message_subject=Enter message subject (optional): "
set /p "message_text=Enter your message (max 200 chars, no special characters like < > |): "

if "%message_text%"=="" (
    echo Message cannot be empty.
    pause
    goto :eof
)

:: Get current timestamp
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
    set "yyyy=%%d"
    set "mm=%%b"
    set "dd=%%c"
    if not "%mm:~0,1%"=="0" if "%mm%"=="1" set "mm=01"
    if not "%mm:~0,1%"=="0" if "%mm%"=="2" set "mm=02"
    if not "%mm:~0,1%"=="0" if "%mm%"=="3" set "mm=03"
    if not "%mm:~0,1%"=="0" if "%mm%"=="4" set "mm=04"
    if not "%mm:~0,1%"=="0" if "%mm%"=="5" set "mm=05"
    if not "%mm:~0,1%"=="0" if "%mm%"=="6" set "mm=06"
    if not "%mm:~0,1%"=="0" if "%mm%"=="7" set "mm=07"
    if not "%mm:~0,1%"=="0" if "%mm%"=="8" set "mm=08"
    if not "%mm:~0,1%"=="0" if "%mm%"=="9" set "mm=09"
    set "current_date_ts=%yyyy%-%mm%-%dd%"
)
for /f "tokens=1-2 delims=:" %%a in ('time /t') do (set current_time_ts=%%a:%%b)
set "timestamp=[%current_date_ts% %current_time_ts%]"

:: Append message to recipient's inbox
echo %timestamp% From: %sender_user% Subject: %message_subject% >> "%recipient_dir%\Messages\inbox.txt"
echo %message_text% >> "%recipient_dir%\Messages\inbox.txt"
echo ------------------------------------- >> "%recipient_dir%\Messages\inbox.txt"

:: Optionally, append a copy to sender's sent messages (for a full feature)
:: This line below would need a "sent.txt" file in the Messages folder if you want to track sent messages
:: echo %timestamp% To: %recipient_user% Subject: %message_subject% >> "%sender_dir%\Messages\sent.txt"
:: echo %message_text% >> "%sender_dir%\Messages\sent.txt"
:: echo ------------------------------------- >> "%sender_dir%\Messages\sent.txt"

echo.
echo Message sent successfully to %recipient_user%!
echo.
pause
endlocal
goto :eof

@echo off
setlocal

if "%~1"=="" (
    echo Error: Username not provided to view_messages.bat.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

set "current_user=%~1"
set "inbox_file=FamSocialNetwork\%current_user%\Messages\inbox.txt"

cls
echo.
echo =========================================
echo   %current_user%'s Inbox
echo =========================================
echo.

if not exist "%inbox_file%" (
    echo Your inbox is empty.
    echo.
    if not defined called_from_dashboard (
        pause
    )
    goto :eof
)

echo --- Newest messages at the bottom ---
echo.
type "%inbox_file%"
echo.
echo =========================================
echo.
echo (Messages are not removed after viewing.)
echo.

if not defined called_from_dashboard (
    pause
)
endlocal
goto :eof

