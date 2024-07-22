Here is the revised batch file code with the "My Shopping List" case:
```
:mylist
cls
echo **My Shopping List**
echo.
echo Eggs (18 ct)
echo Bacon (pk)
echo Chicken (legs)
echo Popcorn (pk)
echo Syrup (bottle)
echo Sweetener (bottle)
echo Milk 2% (gal)
echo Water (bottles)
echo Spaghetti sauce (jar)
echo Spaghetti (pk)
echo Meat (pk)
echo Hot dog (24 ct)
echo Ricotta cheese (pk)
echo Cheese sticks (pk)
echo Mountain dew (bottle)
echo Sliced cheese (bag)
echo Ramen shrimp noodles (box)
echo Pizza (microwave)
echo Pepperoni (bag)
echo Paper towels (pk)
echo Paper plates (pk)
echo Cheddar cheese (sliced)
echo Seafood dinners (microwave)
echo Condensed milk (can)
echo C batteries (pk)
echo Apple cider (powdered)
echo Maple syrup (jug)
echo Onion powder (bottle)
echo Garlic powder (bottle)
echo Index cards (pk)
echo Chicken broth (box)
echo Shampoo
echo.
echo **Choose an option:**
echo 1. Add item
echo 2. Remove item
echo 3. Back
set /p input=C:\My Shopping List>_

if %input%==1 goto :add
if %input%==2 goto :remove
if %input%==3 goto :main
```
This code displays the "My Shopping List" menu, showing all the items in the list. The user can then choose to add an item, remove an item, or go back to the main menu.