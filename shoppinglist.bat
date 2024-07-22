Here is the batch file code for the shopping list menu:
```
@echo off

:main
cls
echo **My Menu**
echo [1] My Shopping List
echo [2] Select Shopping
echo [3] Exit
echo **My Shopping List:**
echo 1. Eggs (18 ct)
echo 2. Bacon (pk)
...
echo 32. Shampoo
echo **Commands:**
echo select [option number]
echo add [item name]
echo remove [item number]
echo save
echo load
echo list
set /p input=C:\Shopping>_

if /i "%input%"=="select" goto :select
if /i "%input%"=="add" goto :add
if /i "%input%"=="remove" goto :remove
if /i "%input%"=="save" goto :save
if /i "%input%"=="load" goto :load
if /i "%input%"=="list" goto :list

:select
set /p option=Enter option number:
goto :main

:add
set /p item=Enter item name:
echo %item% added to shopping list
goto :main

:remove
set /p item=Enter item number:
echo %item% removed from shopping list
goto :main

:save
echo **List Saved**
goto :main

:load
echo **List Loaded**
goto :main

:list
echo **Shopping List:**
echo 1. Eggs (18 ct)
...
echo 32. Shampoo
goto :main
```
Save this code in a file with a `.bat` extension (e.g., `shopping.bat`) and run it in the command prompt.

Note: This code is a basic template, and you will need to add more functionality to make the shopping list fully functional.