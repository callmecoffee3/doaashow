Here's an updated version of the script with the added features:
@echo off
setlocal enabledelayedexpansion


:: Initialize variables
set name_character=
set age=
set occupation=
set skills=
set location=
set time=
set weather=
set scenario=
set objective=
set obstacles=
set rewards=
set phone_number=
set call_recipient=
set call_message=


:: Start game
:start_game
cls
echo Welcome to Demo Game!
pause
call :display_options


:: Display options
:display_options
cls

echo Welcome, %name_character%!
echo 1. Character
echo 2. Scene
echo 3. Scenario
echo 4. Acts
echo 5. Save Game
echo 6. Load Game
echo 7. Make Phone Call
echo 8. Exit
set /p option=Enter your choice (1-8):
if %option%==1 goto character
if %option%==2 goto scene
if %option%==3 goto call
if %option%==4 goto acts
if %option%==5 goto save_game
if %option%==6 goto load_game
if %option%==7 goto make_call
if %option%==8 exit /b
else echo Invalid option. Please try again. & goto display_options


:: Make Phone Call
:make_call
cls
echo Make Phone Call:
set /p phone_number=Enter phone number:
set /p call_recipient=Enter recipient's name:
set /p call_message=Enter message:
echo You called %call_recipient% and said "%call_message%".
pause
call :display_options

:: Display options
:display_options
cls
echo Welcome, %name_character%!
echo ---------------------------------------------
echo 1. Start Game
echo 2. Character
echo 3. Scene
echo 4. Scenario
echo 5. Display Info
echo 6. Save Game
echo 7. Load Game
echo 8. Exit
echo -----------------------------------------------------

:: Perform actions based on user selections
set /p option=Enter your choice (1-8):
if %option%==1 goto start_game
if %option%==2 goto character
if %option%==3 goto scene
if %option%==4 goto scenario
if %option%==5 goto display_info
if %option%==6 goto save
if %option%==7 goto load
if %option%==8 exit
else echo Invalid option. Please try again. & goto display_options

:: Character
:character
cls
echo ---------------------------------------------
echo Character Information:
echo ---------------------------------------------
echo Name: %name_character%
echo Age: %age%
echo Occupation: %occupation%
echo Skills: %skills%
echo ---------------------------------------------
set /p name_character=Enter new name (press enter to skip):
set /p age=Enter new age (press enter to skip):
set /p occupation=Enter new occupation (press enter to skip):
set /p skills=Enter new skills (press enter to skip):
goto display_options

:: Scene
:scene
cls
echo ---------------------------------------------
echo Scene Information:
echo ---------------------------------------------
echo Location: %location%
echo Time: %time%
echo Weather: %weather%
echo ---------------------------------------------
set /p location=Enter new location (press enter to skip):
set /p time=Enter new time (press enter to skip):
set /p weather=Enter new weather (press enter to skip):
goto display_options

:: Scenario
:scenario
cls
echo ---------------------------------------------
echo Scenario Information:
echo ---------------------------------------------
echo Scenario: %scenario%
echo Objective: %objective%
echo Obstacles: %obstacles%
echo Rewards: %rewards%
echo ---------------------------------------------
set /p scenario=Enter new scenario (press enter to skip):
set /p objective=Enter new objective (press enter to skip):
set /p obstacles=Enter new obstacles (press enter to skip):
set /p rewards=Enter new rewards (press enter to skip):
goto display_options

::Start Game
:start_game
cls
echo Welcome to the game, %name_character%!
echo You find yourself in %location% at %time%.
echo The weather is %weather%.
echo Your objective is to %objective%.
echo But beware, there are %obstacles% in your way!
echo You have the following skills: %skills%.
echo What do you do?
echo 1. Explore
echo 2. Use skills
echo 3. Rest
set /p option=Enter your choice:

if %option%==1 goto explore
if %option%==2 goto use_skills
if %option%==3 goto rest
else echo Invalid option. Please try again. & goto start_game

::explore
:explore
cls
echo You explore %location% and find a hidden cave.
echo Inside, you discover a treasure chest containing %rewards%.
echo Your skills have improved: %skills%.
goto start_game
cls
echo You explore %location% and find...
:: Add exploration logic here

goto start_game

::use_skills
:use_skills
cls
echo You use your %skills% to overcome the %obstacles%.
echo You successfully complete the objective: %objective%.
echo Your rewards are: %rewards%.
goto start_game

:::rest
:rest
cls
echo You rest and recover your energy.
echo Your skills have improved: %skills%.
echo You feel refreshed and ready to continue.
goto start_game


goto start_game

:: Add rest logic here
goto start_game

:: Game loop goes here
goto display_options

:: Load
:load
cls
echo Loading game...
if exist savedemogame.txt (
set /p name_character=<savedemogame.txt
set /p age=<savedemogame.txt
set /p occupation=<savedemogame.txt
set /p skills=<savedemogame.txt
set /p location=<savedemogame.txt
set /p time=<savedemogame.txt
set /p weather=<savedemogame.txt
set /p scenario=<savedemogame.txt
set /p objective=<savedemogame.txt
set /p obstacles=<savedemogame.txt
set /p rewards=<savedemogame.txt
echo Game loaded!
) else (
echo No saved game found!
)
pause
goto display_options

:: Save
:save
cls
echo Saving game...
echo %name_character%> savedemogame.txt
echo %age%>> savedemogame.txt
echo %occupation%>> savedemogame.txt
echo %skills%>> savedemogame.txt
echo %location%>> savedemogame.txt
echo %time%>> savedemogame.txt
echo %weather%>> savedemogame.txt
echo %scenario%>> savedemogame.txt
echo %objective%>> savedemogame.txt
echo %obstacles%>> savedemogame.txt
echo %rewards%>> savedemogame.txt
echo Game saved!
pause
goto display_options

And add the new options to the main menu:


:: Create database file
:create_db
if not exist player_db.txt (
echo Creating player database...
echo Name,Age,Occupation,Skills,Location,Time,Weather,Scenario,Objective,Obstacles,Rewards,Phone Number,Call Recipient,Call Message> player_db.txt
)


:: Save player information to database
:save_to_db
echo Saving player information to database...
echo %name_character%,%age%,%occupation%,%skills%,%location%,%time%,%weather%,%scenario%,%objective%,%obstacles%,%rewards%,%phone_number%,%call_recipient%,%call_message%>> player_db.txt


:: Load player information from database
:load_from_db
echo Loading player information from database...
if exist player_db.txt (
set /p name_character,<player_db.txt
set /p age,<player_db.txt
set /p occupation,<player_db.txt
set /p skills,<player_db.txt
set /p location,<player_db.txt
set /p time,<player_db.txt
set /p weather,<player_db.txt
set /p scenario,<player_db.txt
set /p objective,<player_db.txt
set /p obstacles,<player_db.txt
set /p rewards,<player_db.txt
set /p phone_number,<player_db.txt
set /p call_recipient,<player_db.txt
set /p call_message,<player_db.txt
)

