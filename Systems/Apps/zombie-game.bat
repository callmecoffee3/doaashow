@echo off

:: Initialize variables
set day=1
set infected=100
set zombies=20
set deaths=10
set vaccines=0

:display_options
cls
echo Welcome to Zombie Infection Simulator!
echo ---------------------------------------------
echo 1. Start Game
echo 2. Set Initial Infection Rate (current: %infected%)
echo 3. Set Zombie Conversion Rate (current: %zombies%)
echo 4. Set Vaccine Effectiveness (current: %vaccines%)
echo 5. Exit

set /p option=Enter your choice (1-5):

if %option%==1 goto start_game
if %option%==2 (
    set /p infected=Enter initial infection rate:
    goto display_options
)
if %option%==3 (
    set /p zombies=Enter zombie conversion rate:
    goto display_options
)
if %option%==4 (
    set /p vaccines=Enter vaccine effectiveness:
    goto display_options
)
if %option%==5 exit /b
echo Invalid option.
goto display_options

:start_game
:loop
cls
echo Day %day%:
echo Infected: %infected%
echo Zombies: %zombies%
echo Deaths: %deaths%
echo Vaccines: %vaccines%
echo.
echo What should the government do?
echo 1. Distribute masks and PPE
echo 2. Develop a vaccine
echo 3. Establish quarantine zones
echo 4. Deploy military
set /p opinion=Enter your choice (1-4):

if %opinion%==1 set /a infected-=20
if %opinion%==2 set /a vaccines+=50
if %opinion%==3 set /a zombies-=10
if %opinion%==4 (
    set /a zombies-=20
    set /a deaths+=10
)

set /a day+=1
set /a infected+=10
set /a zombies+=5
set /a deaths+=5

if %infected% LEQ 0 (
    echo Outbreak contained! You win!
    pause
    exit /b
)
if %zombies% GTR 100 (
    echo Zombies overwhelmed the city! Game over.
    pause
    exit /b
)
goto loop
