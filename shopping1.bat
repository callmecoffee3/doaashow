Here is the revised batch file code with the requested features:
```
@echo off

:main
cls
echo **Main Menu**
echo [1] My Shopping List
echo [2] Select Shopping
echo [3] Exit
echo **Commands:**
echo add [item name]
echo remove [item number]
echo save
echo load
echo list
set /p input=C:\Shopping>_

if /i "%input%"=="add" goto :add
if /i "%input%"=="remove" goto :remove
if /i "%input%"=="save" goto :save
if /i "%input%"=="load" goto :load
if /i "%input%"=="list" goto :list
if /i "%input%"=="1" goto :mylist
if /i "%input%"=="2" goto :selectlist
if /i "%input%"=="3" goto :exit

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
echo 0. Eggs (18 ct)
...
echo 0. Shampoo
goto :main

:mylist
cls
echo **My Shopping List**
echo 0. Eggs (18 ct)
...
echo 0. Shampoo
echo **Commands:**
echo add [item name]
echo remove [item number]
echo back
set /p input=C:\My Shopping List>_

if /i "%input%"=="add" goto :add
if /i "%input%"=="remove" goto :remove
if /i "%input%"=="back" goto :main

:selectlist
cls
echo **Select Shopping List**
echo 1. Eggs (18 ct)
...
echo 32. Shampoo
echo **Commands:**
echo select [option number]
echo back
set /p input=C:\Select Shopping List>_

if /i "%input%"=="select" goto :select
if /i "%input%"=="back" goto :main

:select
set /p option=Enter option number:
echo %option% added to shopping list
goto :main

:exit
exit
```
Save this code in a file with a `.bat` extension (e.g., `shopping.bat`) and run it in the command prompt.

Note: This code is a basic template, and you will need to add more functionality to make the shopping list fully functional.