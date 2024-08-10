@echo off
:: the fam Simulation
:the_fam

:: Load username credentials from file
if exist users.txt (
for /f "tokens=*" %%u in (users.txt) do (
set username=%%u
set u/ username=<users.txt
echo !username!
)
)

:: Load posts from file
if exist posts.txt (
for /f "tokens=*" %%p in (posts.txt) do (
set posts=%%p
set p/ post=<post.txt
echo !post!
)
)

:START
echo the fam
echo 1. Login
echo 2. Signup
echo 3. Menu
echo 4. Exit

set /p CHOICE=Choose an option:

if %CHOICE%==1 goto LOGIN
if %CHOICE%==2 goto SIGNUP
if %CHOICE%==3 goto MENU
if %CHOICE%==4 go to EXIT

:LOGIN
echo Facebook Login
set /p username=Username:
set /p password=Password:

:: Authenticate Username
for %%u in (%users.txt%) do (
set username=%%u
set username=%username:%username%=%
if "%username%"=="" (
set authenticated=true

:: Authenticate Password
for %%p in (%users.txt%) do (
set password=%%p
set password=%password:%password%=%
if "%password%"=="" (
set authenticated=true
)
)

echo Invalid username or password
goto START

:SIGNUP
echo Facebook Signup
set /p username=Username:
set /p password=Password:
echo "%username%":"%password%" >> users.txt
goto START

:MENU
echo TheFam
echo 1. News Feed
echo 2. Post
echo 3. Friends
echo 4. Profile
echo 5. Logout
echo 6. Login 
echo 7. Signup

set /p CHOICE=Choose an option:

if %CHOICE%==1 goto NEWSFEED
if %CHOICE%==2 goto POST
if %CHOICE%==3 goto FRIENDS
if %CHOICE%==4 goto PROFILE
if %CHOICE%==5 goto LOGOUT
if %CHOICE%==6 goto LOGIN
if %CHOICE%==7 goto SIGNUP

:NEWSFEED
echo News Feed
for %%p in (%posts%) do (
set post=%%p
echo %posts%
)
goto MENU

:POST
echo Post
set /p post=Enter your post:
set posts=%posts%, "%post%":"%username%"
echo "%post%":"%username%" >> posts.txt
goto MENU

:FRIENDS
:: List friends here
echo Friends
echo Friends: !friends!
set /p friends=Enter your friends:
set posts=%friends%, "%friends%":"%username%"
echo "%friends%":"%username%" >> friends.txt


:PROFILE
:: Display profile information here
echo Profile
echo Name: %username%
echo Bio: %bio%
echo Birthday: %birthday%
echo Fam: %fam%
echo Followers: %followers%


set /p birthday=Enter your birthday:
set posts=%birithday%, "%birthday%":"%username%"
echo "%profile%:%birthday%":"%username%" >> users.txt

set /p followers=Enter your followers:
set posts=%followers%, "%followers%":"%username%"
echo "%profile%:%followers%":"%username%" >> users.txt

set /p fam=Enter your fam:
set posts=%fam%, "%fam%":"%username%"
echo "%profile%:%fam%":"%username%" >> users.txt

set /p bio=Enter your bio:
set posts=%bio%, "%bio%":"%username%"
echo "%profile%:%bio%":"%username%" >> users.txt

:: Display profile information here
goto MENU

:LOGOUT
echo Logging out...
set authenticated=true
goto START


:: the fam log in signup Simulation
:MENU
echo The Fam Login & Signup
echo 1. News Feed
echo 2. Post
echo 3. Friends
echo 4. Profile
echo 5. Logout
echo 6. ScanFdrive
echo 7. User Menu

set /p CHOICE=Choose an option:

if %CHOICE%==1 goto NEWSFEED
if %CHOICE%==2 goto POST
if %CHOICE%==3 goto FRIENDS
if %CHOICE%==4 goto PROFILE
if %CHOICE%==5 goto LOGOUT
if %CHOICE%==6 gotoSCANFDRIVE
if %CHOICE%==7 goto USERMENU

:NEWSFEED
echo News Feed
for %%p in (%posts%) do (
set post=%%p
echo !post!
)
goto MENU

:POST
echo Post
set /p post=Enter your post:
set posts=!posts!, "!post!":"!username!"
echo "!post!":"!username!" >> posts.txt
goto MENU

:FRIENDS
echo Friends
:: List friends here
goto MENU

:PROFILE
echo Profile
echo Name: !username!
:: Display profile information here
goto MENU

:LOGOUT
echo Logging out...
set authenticated=

:: User Database
set users=^{
"username1":"password1",
"username2":"password2"
}

:: Posts Database
set posts=^{
}

:: Load posts from file
if exist posts.txt (
for /f "tokens=*" %%p in (posts.txt) do (
set posts=!posts!, "%%p"
)
)

:LOGIN
echo Facebook Login
set /p username=Username:
set /p password=Password:

:: Authenticate User
for %%u in (%users%) do (
set user=%%u
set user_username=!user:%username%=!
if "!user_username!"=="" (
set authenticated=true
goto MENU
)
)

echo Invalid username or password
goto LOGIN

:USERMENU
echo USER Menu
echo 1. Enter new feed item
echo 2. Edit existing feed item
echo 3. Remove feed item
echo 4. View feed
echo 5. View user feed list
echo 6. View user feed
echo 7. Display user feed
echo 8. Add existing user
echo 9. Search profile
echo 10. Exit


set /p CHOICE=Choose an option: 

if %CHOICE%==1 goto ENTER
if %CHOICE%==2 goto EDIT
if %CHOICE%==3 goto REMOVE
if %CHOICE%==4 goto VIEW
if %CHOICE%==5 goto VIEW_USER_FEED_LIST
if %CHOICE%==6 goto VIEW_USER_FEED
if %CHOICE%==7 goto DISPLAY_USER_FEED
if %CHOICE%==8 goto ADD_EXISTING_USER
if %CHOICE%==9 goto SEARCH_PROFILE
if %CHOICE%==10 goto EXIT

:: Set the feed file
set FEED_FILE=user_feed.txt

:: Set the user feed list file
set USER_FEED_LIST=user_feed_list.txt

:: Set the user feed file
set USER_FEED=user_feed_%USER_ID%.txt

:: Search for a profile
set /p search="Enter a name to search for or add to FamSocialNetwork: "

:SEARCH_PROFILE
set /p SEARCH_ID=Enter the ID of the user to search: 
if exist %USER_FEED_LIST% (
    findstr /m "%SEARCH_ID%" %USER_FEED_LIST% > nul
    if errorlevel 1 (
        echo User not found
    ) else (
        type %USER_FEED%
    )
) else (
    echo User feed list not found
)
goto MENU

:: Check if the profile exists
if exist FamSocialNetwork%search%\ (
echo Profile found!
cd FamSocialNetwork%search%
dir
type Profile\profile.txt
type Interests\interests.txt
type Preferences\preferences.txt
type Appearances\appearances.txt
type Likes\likes.txt
type Abilities\abilities.txt
type Props\props.txt
type Houses\houses.txt
type Businesses\businesses.txt
) else (
echo Profile not found! Add to FamSocialNetwork? (y/n)
set /p add="Enter y to add: "
if %add%==y (
mkdir FamSocialNetwork%search%

:: Set profile information
set /p name="Enter name: "
set /p date="Enter date: "
set /p bio="Enter bio: "
:: ... (rest of the profile information prompts)
:: Write profile information to file
(echo PROFILE: ... ) > FamSocialNetwork%search%\Profile\profile.txt
:: ... (rest of the file writing commands)
echo Profile added!
:: Create main directory for social network
mkdir FamSocialNetwork

:: Set profile information
set /p name="Enter name: "
set /p date="Enter date: "
set /p bio="Enter bio: "
set /p websites="Enter websites: "
set /p creature="Enter creature:"
set /p powers="Enter powers:"
set /p relationship=" Enter single/dating/married/devorcied:"
set /p ownership="Enter ownership or renting just staying:"
set /p money="Enter ammout:" 
set /p business="Enter business:"
set /p birthdate="Enter birthdate: "

:: Set interests and preferences
set /p food="Enter favorite food: "
set /p drinks="Enter favorite drinks: "
set /p snacks="Enter favorite snacks: "
set /p rooms="Enter favorite rooms: "
set /p bed="Enter favorite bed type: "
set /p restroom="Enter favorite restroom type: "
set /p sink="Enter favorite sink type: "
set /p furniture="Enter favorite furniture: "
set /p follows="Enter what you follow: "
set /p interest="Enter interests: "
set /p weapons="Enter weapons: "
set /p scenes="Enter scenes: "

:: Set appearances, likes, and abilities
set /p appearances="Enter appearances: "
set /p likes="Enter likes: "
set /p dislikes="Enter Dislikes: "
set /p abilities="Enter abilities: "

:: Set props, houses, and businesses
set /p props="Enter props: "
set /p houses="Enter houses: "
set /p business="Enter businesses: "

:: Create folders for profile, interests, preferences, appearances, likes, abilities, props, houses, and businesses
mkdir FamSocialNetwork%name%\Profile
mkdir FamSocialNetwork%name%\Interests
mkdir FamSocialNetwork%name%\Preferences
mkdir FamSocialNetwork%name%\Appearances
mkdir FamSocialNetwork%name%\Likes
mkdir FamSocialNetwork%name%\Abilities
mkdir FamSocialNetwork%name%\Props
mkdir FamSocialNetwork%name%\Houses
mkdir FamSocialNetwork%name%\Businesses


:: Write profile information to file
(
echo PROFILE:
echo creature %creature%
echo powers %powers
echo relationship %relationship%
echo ownership %ownership%
echo money %money% 
echo business: %business%
echo birthdate: %birthdate%
echo Name: %name%
echo Date: %date%
echo Bio: %bio%
echo Websites: %websites%
echo Birthdate: %birthdate%
) > FamSocialNetwork%name%\Profile\profile.txt

:: Write interests to file
(
echo INTERESTS:
echo Follows: %follows%
echo Interests: %interest%
echo Weapons: %weapons%
echo Scenes: %scenes%
) > FamSocialNetwork%name%\Interests\interests.txt

:: Write preferences to file
(
echo PREFERENCES:
echo Food: %food%
echo Drinks: %drinks%
echo Snacks: %snacks%
echo Rooms: %rooms%
echo Outside: %outside%
echo Travel: %travel%
echo Bed: %bed%
echo Restroom: %restroom%
echo Sink: %sink%
echo Furniture: %furniture%
) > FamSocialNetwork%name%\Preferences\preferences.txt

:: Write appearances, likes, and abilities to files
(
echo APPEARANCES:
echo %appearances%
) > FamSocialNetwork%name%\Appearances\appearances.txt
(
echo LIKES:
echo Dislikes:
echo %likes%
echo %dislikes%
) > FamSocialNetwork%name%\Likes\likes.txt
(
echo ABILITIES:
echo %abilities%
) > FamSocialNetwork%name%\Abilities\abilities.txt

:: Write props, houses, and businesses to files
(
echo PROPS:
echo Strongly:
echo %props%
echo %strongly%
) > FamSocialNetwork%name%\Props\props.txt
(
echo HOUSES:
echo %houses%
) > FamSocialNetwork%name%\Houses\houses.txt
(
echo BUSINESSES:
echo %business%
) > FamSocialNetwork%name%\Businesses\businesses.txt

:: Read folders and files
echo Reading Folders and Files:
cd FamSocialNetwork%name%
dir
type Profile\profile.txt
type Interests\interests.txt
type Preferences\preferences.txt
type Appearances\appearances.txt
type Likes\likes.txt
type Abilities\abilities.txt
type Props\props.txt
type Houses\houses.txt
type Businesses\businesses.txt

pause

:: Set the feed file
set FEED_FILE=user_feed.txt

:: Set the user feed list file
set USER_FEED_LIST=user_feed_list.txt

:: Set the user feed file
set USER_FEED=user_feed_%USER_ID%.txt

:: Set the feed file
set FEED_FILE=user_feed.txt

:: Set the user feed list file
set USER_FEED_LIST=user_feed_list.txt

:: Set the user feed file
set USER_FEED=user_feed_%USER_ID%.txt

:: Set the user ID
set /p USER_ID=Enter your ID: 

:: Set the feed file
set FEED_FILE=user_feed.txt

:: Set the user feed list file
set USER_FEED_LIST=user_feed_list.txt

:: Set the user feed file
set USER_FEED=user_feed_%USER_ID%.txt

:DISPLAY_USER_FEED
set /p USER_ID=Enter the ID of the user: 
echo Displaying feed for user %USER_ID%:
type %USER_FEED%
goto MENU
```
:ENTER
set /p USER_ID=Enter your ID: 
set /p FEED_ITEM=Enter your feed item: 
echo %FEED_ITEM% >> %USER_FEED%
echo %USER_ID%: %FEED_ITEM% >> %FEED_FILE%
echo %USER_ID% >> %USER_FEED_LIST%
goto MENU

:EDIT
set /p ITEM_TO_EDIT=Enter the ID of the item to edit: 
set /p NEW_ITEM=Enter the new feed item: 
type %FEED_FILE% | findstr /v "%ITEM_TO_EDIT%" > temp.txt
echo %ITEM_TO_EDIT%: %NEW_ITEM% >> temp.txt
move /y temp.txt %FEED_FILE%
goto MENU

:REMOVE
set /p ITEM_TO_REMOVE=Enter the ID of the item to remove: 
type %FEED_FILE% | findstr /v "%ITEM_TO_REMOVE%" > temp.txt
move /y temp.txt %FEED_FILE%
goto MENU

:VIEW
for /f "tokens=*" %%a in (%FEED_FILE%) do (
    set ITEM=%%a
    echo %ITEM%
)
goto MENU

:VIEW_USER_FEED_LIST
echo User Feed List:
for /f "tokens=*" %%a in (%USER_FEED_LIST%) do (
    set USER_ID=%%a
    echo %USER_ID%
)
goto MENU

:VIEW_USER_FEED
set /p USER_ID=Enter the ID of the user: 
echo User Feed:
for /f "tokens=*" %%a in (%USER_FEED%) do (
    set ITEM=%%a
    echo %ITEM%
)
goto MENU

:ADD_EXISTING_USER
set /p EXISTING_USER_ID=Enter the ID of the existing user: 
if exist %USER_FEED_LIST% (
    findstr /m "%EXISTING_USER_ID%" %USER_FEED_LIST% > nul
    if errorlevel 1 (
        echo User not found
    ) else (
        set USER_ID=%EXISTING_USER_ID%
        goto MENU
    )
) else (
    echo User feed list not found
)
:EXIT
exit /b

type %output_file%.txt

:: Ask user if they want to edit the batch file
set /p edit_batch="Do you want to edit this batch file? (y/n): "

if /i "%edit_batch%"=="y" (
    notepad %0
)
```
:USERPROFILE
echo USER PROFILE 
echo 1. Enter new feed item
echo 2. Edit existing feed item
echo 3. Display user feed
echo 4. View feed
echo 5. View user feed list
echo 6. View user feed
echo 7. Remove feed item
echo 8. Add existing user
echo 9. Search profile
echo 10. Exit


set /p CHOICE=Choose an option: 

if %CHOICE%==1 goto ENTER
if %CHOICE%==2 goto EDIT
if %CHOICE%==3 goto DISPLAY
if %CHOICE%==4 goto VIEW
if %CHOICE%==5 goto VIEW_USER_FEED_LIST
if %CHOICE%==6 goto VIEW_USER_FEED
if %CHOICE%==7 goto REMOVE_USER_ITEM
if %CHOICE%==8 goto ADD_EXISTING_USER
if %CHOICE%==9 goto SEARCH_PROFILE
if %CHOICE%==10 goto MENU

pause

:: Set the feed file
set profile_FILE=user_profile.txt

:: Set the user feed list file
set USER_PROFILE_FEED_LIST=user_profile_feed_list.txt

:: Set the user feed file
set USER_FEED=user_feed_%USER_ID%.txt

:: Set the feed file
set FEED_FILE=user_feed.txt

:: Set the user feed list file
set USER_FEED_LIST=user_feed_list.txt

:: Set the user feed file
set USER_FEED=user_feed_%USER_ID%.txt

:: Set the user ID
set /p USER_ID=Enter your ID: 

:: Set the feed file
set FEED_FILE=user_feed.txt

:: Set the user feed list file
set USER_FEED_LIST=user_feed_list.txt

:: Set the user feed file
set USER_FEED=user_feed_%USER_ID%.txt

:DISPLAY_USER_FEED
set /p USER_ID=Enter the ID of the user: 
echo Displaying feed for user %USER_ID%:
type %USER_FEED%
goto MENU
```
:ENTER
set /p USER_ID=Enter your ID: 
set /p FEED_ITEM=Enter your feed item: 
echo %FEED_ITEM% >> %USER_FEED%
echo %USER_ID%: %FEED_ITEM% >> %FEED_FILE%
echo %USER_ID% >> %USER_FEED_LIST%
goto MENU

:EDIT
set /p ITEM_TO_EDIT=Enter the ID of the item to edit: 
set /p NEW_ITEM=Enter the new feed item: 
type %FEED_FILE% | findstr /v "%ITEM_TO_EDIT%" > temp.txt
echo %ITEM_TO_EDIT%: %NEW_ITEM% >> temp.txt
move /y temp.txt %FEED_FILE%
goto MENU

:REMOVE
set /p ITEM_TO_REMOVE=Enter the ID of the item to remove: 
type %FEED_FILE% | findstr /v "%ITEM_TO_REMOVE%" > temp.txt
move /y temp.txt %FEED_FILE%
goto MENU

:VIEW
for /f "tokens=*" %%a in (%FEED_FILE%) do (
    set ITEM=%%a
    echo %ITEM%
)
goto MENU

:VIEW_USER_FEED_LIST
echo User Feed List:
for /f "tokens=*" %%a in (%USER_FEED_LIST%) do (
    set USER_ID=%%a
    echo %USER_ID%
)
goto MENU

:VIEW_USER_FEED
set /p USER_ID=Enter the ID of the user: 
echo User Feed:
for /f "tokens=*" %%a in (%USER_FEED%) do (
    set ITEM=%%a
    echo %ITEM%
)
goto MENU

:ADD_EXISTING_USER
set /p EXISTING_USER_ID=Enter the ID of the existing user: 
if exist %USER_FEED_LIST% (
    findstr /m "%EXISTING_USER_ID%" %USER_FEED_LIST% > nul
    if errorlevel 1 (
        echo User not found
    ) else (
        set USER_ID=%EXISTING_USER_ID%
        goto MENU
    )
) else (
    echo User feed list not found
)
