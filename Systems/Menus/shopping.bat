@echo off

:main
cls
echo **My Menu**
echo [a] My Shopping List
echo [b] Main Shopping
echo [1] Select Shopping
echo [2] Exit
echo **Commands:** select | add | remove | save | load | list | view | edit | back | new | previous
set /p input=C:\Shopping>_

if /i "%input%"=="a" goto :myShoppingList
if /i "%input%"=="2" exit /b
if /i "%input%"=="back" goto :main
if /i "%input%"=="previous" goto :previous
goto :main

:myShoppingList
cls
echo **My Shopping List**
echo (add items with: add [item])
pause
goto :main

:previous
cls
echo **Previous Shopping Lists**
echo 1. Previous List 1
echo 2. Previous List 2
echo 3. Previous List 3
set /p input=Enter list number:
echo Loading list %input%...
pause
goto :main
