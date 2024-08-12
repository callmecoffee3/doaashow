Here's an updated version of the script with the added features:

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
if %option%==8 exit /b
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

:explore
cls
echo You explore %location% and find...
:: Add exploration logic here

goto start_game

:use_skills
cls
echo You use your %skills% to...
:: Add skill usage logic here

goto start_game

:rest
cls
echo You rest and recover...

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
