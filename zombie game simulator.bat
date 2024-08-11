Here is the game written in a batch file:

@echo off
set day=1
set infected=100
set zombies=20
set deaths=10
set vaccines=0
set quarantine=0
set government=0
set supplies=100
set military=0
set saved_lives=0

:loop
cls
echo Day %day%:
echo Infected: %infected%
echo Zombies: %zombies%
echo Deaths: %deaths%
echo Vaccines: %vaccines%
echo Quarantine: %quarantine%
echo Government: %government%
echo Supplies: %supplies%
echo Military: %military%
echo Saved Lives: %saved_lives%

echo What do you think the government should do first?
echo 1. Distribute masks and PPE to citizens
echo 2. Develop a vaccine
echo 3. Establish quarantine zones
echo 4. Deploy military to contain zombies
echo 5. Get supplies

set /p opinion=Enter your choice (1-5):

if %opinion%==1 set /a infected-=20 & echo Masks and PPE distributed. Infections reduced.
if %opinion%==2 set /a vaccines+=50 & echo Vaccine development started. Vaccines available soon.
if %opinion%==3 set /a quarantine+=50 & echo Quarantine zones established. Zombie containment successful.
if %opinion%==4 set /a zombies-=20 & set /a deaths+=10 & echo Military deployed. Zombies contained but casualties high.
if %opinion%==5 set /a supplies+=100 & echo Supplies received.

set /a day+=1
set /a infected+=10
set /a zombies+=5
set /a deaths+=5
set /a supplies-=20
set /a military+=10
set /a saved_lives+=10

if %infected%==0 echo Outbreak contained! You win! & goto end
if %zombies%>100 echo Zombies overwhelmed the city! Game over. & goto end

goto loop

:end
pause
