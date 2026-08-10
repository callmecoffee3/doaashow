@echo off
setlocal enabledelayedexpansion

set /p VIRUS_NAME=Enter virus name: 
set /p MUTATION_RATE=Enter mutation rate (1-100): 
set /p POPULATION=Enter population: 
set /p INITIAL_INFECTIONS=Enter initial infections: 
set /p SIMULATION_WEEKS=Enter simulation weeks: 
set /p DAMAGE_RATE=Enter damage rate (1-100): 

set INFECTION_COUNTER=%INITIAL_INFECTIONS%
set WEEK=1
mkdir %VIRUS_NAME%_logs 2>nul
set LOG_FILE=%VIRUS_NAME%_logs\simulation_log.txt

:loop
cls
echo %VIRUS_NAME% Infection Simulator
echo -----------------------------
echo Week: %WEEK% / %SIMULATION_WEEKS%
echo Infections: %INFECTION_COUNTER% / %POPULATION%
echo Mutation Rate: %MUTATION_RATE%%%
echo Damage Rate: %DAMAGE_RATE%%%

set /a INFECTION_COUNTER=%INFECTION_COUNTER% + (%MUTATION_RATE% * %POPULATION% / 1000)
if %INFECTION_COUNTER% gtr %POPULATION% set INFECTION_COUNTER=%POPULATION%

echo Week %WEEK% - Infections: %INFECTION_COUNTER% >> %LOG_FILE%

set /a WEEK+=1
if %WEEK% gtr %SIMULATION_WEEKS% goto end
pause
goto loop

:end
echo Simulation complete!
type %LOG_FILE%
pause
