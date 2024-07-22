Here is the updated batch file with the "view list" option:

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

set /p input=C:\Shopping>_

if /i "%input%"=="select a" goto :myShoppingList
if /i "%input%"=="add" goto :add
if /i "%input%"=="remove" goto :remove
if /i "%input%"=="save" goto :save
if /i "%input%"=="load" goto :load
if /i "%input%"=="list" goto :list
if /i "%input%"=="view" goto :view

:myShoppingList
cls
echo **My Shopping List:**
echo 1. Eggs (18 ct)
echo 2. Bacon (pk)
echo 3. Chicken (legs)
...
echo 32. Shampoo
goto :main

:add
set /p item=Enter item to add:
echo **Item Added:** %item% added to Select Shopping
goto :main

:remove
set /p item=Enter item number to remove:
echo **Item Removed:** %item% removed from Select Shopping
goto :main

:save
echo **List Saved**
goto :main

:load
echo **List Loaded**
goto :main

:list
cls
echo **Select Shopping:**
echo 1. Milk
echo 2. Bread
echo 3. Apples
echo 4. Carrots
echo 5. Bananas
echo 6. Oranges
echo 7. Spinach
goto :main

:view
cls
echo **View Select Shopping List:**
echo 1. Milk
echo 2. Bread
echo 3. Apples
echo 4. Carrots
echo 5. Bananas
echo 6. Oranges
echo 7. Spinach
pause
goto :main
```

Now, when you type `view` in the command prompt, it will display the Select Shopping List.

Note: I added the `view` option and the corresponding label `:view` to display the list. The `pause` command is used to pause the execution and allow the user to see the list before returning to the main menu.