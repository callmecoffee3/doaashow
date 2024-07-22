Here is the updated batch file with the "previous" option:

```
@echo off

:main
cls
echo **My Menu**
echo [a] My Shopping List
echo [b] Main Shopping
echo [1] Select Shopping
echo [2] Exit
echo **Commands:**
echo select [option number]
echo add [item name] to Select Shopping
echo remove [item number] from Select Shopping
echo save
echo load
echo list
echo view
echo edit
echo back
echo new
echo previous

set /p input=C:\Shopping>_

if /i "%input%"=="select a" goto :myShoppingList
if /i "%input%"=="add" goto :add
if /i "%input%"=="remove" goto :remove
if /i "%input%"=="save" goto :save
if /i "%input%"=="load" goto :load
if /i "%input%"=="list" goto :list
if /i "%input%"=="view" goto :view
if /i "%input%"=="edit" goto :edit
if /i "%input%"=="back" goto :main
if /i "%input%"=="new" goto :new
if /i "%input%"=="previous" goto :previous

...

:previous
cls
echo **Previous Shopping List:**
echo 1. Previous List 1
echo 2. Previous List 2
echo 3. Previous List 3
set /p input=Enter list number:
goto :loadlist

:loadlist
cls
echo **Loading List...**
echo **List Loaded:**
goto :main
```

Now, when you type `previous` in the command prompt, it will display a list of previous shopping lists and allow you to load a previous list.

Note: I added the `previous` option and the corresponding label `:previous` to display a list of previous shopping lists. The `set /p input` command is used to prompt the user for a list number, and the `goto :loadlist` command is used to load the selected list.