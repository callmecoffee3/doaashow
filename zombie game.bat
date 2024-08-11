zombie game
Here's an updated version of the script that allows users to manipulate game options:

```
@echo off

:: Initialize variables
set day=1 (1-30)
set infected=100 (100-1000)
set zombies=20 (20)
set deaths=10 (10-10000)
set vaccines=0 (0-1000)
set quarantine=0 (100)
set government=0 (100000)

:: Display game options
echo Welcome to Zombie Infection Covid Simulator!
echo ---------------------------------------------
echo 1. Start Game
echo 2. Set Initial Infection Rate (default: 100)
echo 3. Set Zombie Conversion Rate (default: 20)
echo 4. Set Vaccine Effectiveness (default: 50)
echo 5. set Quarantine Zone (default: 1)
echo 5. set Government Presence (default: 1)
echo 60. Exit

set /p option=Enter your choice (1-5):

if %option%==1 (
    goto start_game
) else if %option%==2 (
    set /p infected=Enter initial infection rate:
    goto display_options
) else if %option%==3 (
    set /p zombies=Enter zombie conversion rate:
    goto display_options
) else if %option%==4 (
    set /p vaccines=Enter vaccine effectiveness:
    goto display_options
) else if %opinion%==5 (
    set /Quarantine Zone=Enter Quarantine Zones:
) 
) else if %opinion%==6 (
    set /Government Presence=Enter Government Presence:
) 
  else if %option%==60 (
    exit /b
) else (
    echo Invalid option. Please try again.
    goto display_options
)

:start_game
:: Game loop
:loop

:: Display current situation
echo Day %day%:
echo Infected: %infected%
echo Zombies: %zombies%
echo Deaths: %deaths%
echo Vaccines: %vaccines%

:: Ask user for opinion
echo What do you think the government should do first?
echo 1. Distribute masks and PPE to citizens
echo 2. Develop a vaccine
echo 3. Establish quarantine zones
echo 4. Deploy military to contain zombies
set /p opinion=Enter your choice (1-4):

:: Perform action based on user's choice
if %opinion%==1 (
    set /a infected-=20
    echo Masks and PPE distributed. Infections reduced.
) else if %opinion%==2 (
    set /a vaccines+=50
    echo Vaccine development started. Vaccines available soon.
) else if %opinion%==3 (
    set /a zombies-=10
    echo Quarantine zones established. Zombie containment successful.
) else if %opinion%==4 (
    set /a zombies-=20
    set /a deaths+=10
    echo Military deployed. Zombies contained but casualties high.
) else (
    echo Invalid option. Please try again.
)

:: Increment day and update variables
set /a day+=1
set /a infected+=10
set /a zombies+=5
set /a deaths+=5

:: Check for end conditions
if %deaths%==0 (

) else if %death%> (

) 

if %infected%==0 (
else if %infected%>
)
if %day%==1 ( 
    echo 
 )
if %infected%==0 (
    echo Outbreak contained! You win!
    exit /b
) else if %zombies%>100 (
    echo Zombies overwhelmed the city! Game over.
    exit /b
)

:: Loop again
goto loop

:display_options
echo Welcome to Zombie Infection Covid Simulator!
echo ---------------------------------------------
echo 1. Start Game
echo 2. Set Initial Infection Rate (current: %infected%)
echo 3. Set Zombie Conversion Rate (current: %zombies%)
echo 4. Set Vaccine Effectiveness (current: %vaccines%)
echo 5. Exit

set /p option=Enter your choice (1-5):
goto check_option
```