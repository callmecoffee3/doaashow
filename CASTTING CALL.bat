Here is a batch script to simulate a casting film call with the requested information and save it to a text file:
@echo off

echo Casting Call: Film Audition

echo [ACTOR'S INFORMATION]

set /p actor_name="Name: "
set /p actor_age="Age: "
set /p actor_race="Race: "
set /p actor_gender="Gender (M/F): "

echo MARITAL STATUS:
set /p actor_marital_status="Married/Single/Widow: "

set /p actor_children="Number of Children: "

echo PHYSICAL CHARACTERISTICS:

set /p actor_height="Height: "
set /p actor_weight="Weight: "

echo SIZES:
set /p actor_hips="Hips: "
set /p actor_chest="Chest: "

echo DEMO REEL:
set /p demo_reel="Link or File Path: "

echo [SAVING TO FILE]

echo Film Audition: %actor_name% > casting_call.txt
echo Age: %actor_age% >> casting_call.txt
echo Race: %actor_race% >> casting_call.txt
echo Gender: %actor_gender% >> casting_call.txt
echo Marital Status: %actor_marital_status% >> casting_call.txt
echo Children: %actor_children% >> casting_call.txt
echo Height: %actor_height% >> casting_call.txt
echo Weight: %actor_weight% >> casting_call.txt
echo Sizes: Hips - %actor_hips%, Chest - %actor_chest% >> casting_call.txt
echo Demo Reel: %demo_reel% >> casting_call.txt

echo File saved as casting_call.txt

pause

This script will prompt the user to enter the requested information and then save it to a text file named casting_call.txt.

Let me know if you'd like me to add anything else to the script!