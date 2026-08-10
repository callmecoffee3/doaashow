@echo off

:main_menu
cls
echo **Main Menu**
echo 1. On the Burner
echo 2. Create
echo 3. Discover
echo 4. Community
echo 5. Products
echo 6. Settings
echo 7. Help
echo 8. Write a Message
echo 9. TV
echo 10. Radio
echo 11. Podcast
echo 12. Quit
set /p choice=Enter your choice: 

if %choice%==1 goto :on_the_burner
if %choice%==2 goto :create_menu
if %choice%==3 goto :discover_menu
if %choice%==9 goto :tv_menu
if %choice%==10 goto :radio_menu
if %choice%==11 goto :podcast_menu
if %choice%==12 goto :quit
goto :main_menu

:on_the_burner
cls
echo **On the Burner**
echo 1. Cooking
echo 2. Recipes
echo 3. Ingredients
echo 4. Back to Main Menu
set /p choice=Enter your choice: 
if %choice%==4 goto :main_menu
goto :on_the_burner

:create_menu
cls
echo 1. Write a Story
echo 2. Make a Video
echo 3. Create a Podcast
echo 4. Design an Image
echo 5. Compose Music
echo 6. Back to Main Menu
set /p choice=Enter your choice: 
if %choice%==6 goto :main_menu
goto :create_menu

:discover_menu
cls
echo 1. Explore New Content
echo 2. Browse Categories
echo 3. Search Topics
echo 4. Discover Creators
echo 5. Back to Main Menu
set /p choice=Enter your choice: 
if %choice%==5 goto :main_menu
goto :discover_menu

:tv_menu
cls
echo 1. Browse Shows
echo 2. Search Titles
echo 3. New Releases
echo 4. Back to Main Menu
set /p choice=Enter your choice: 
if %choice%==4 goto :main_menu
goto :tv_menu

:radio_menu
cls
echo 1. Browse Stations
echo 2. Search Shows
echo 3. Discover Podcasts
echo 4. Back to Main Menu
set /p choice=Enter your choice: 
if %choice%==4 goto :main_menu
goto :radio_menu

:podcast_menu
cls
echo 1. Browse Episodes
echo 2. Search Topics
echo 3. Discover Podcasts
echo 4. Back to Main Menu
set /p choice=Enter your choice: 
if %choice%==4 goto :main_menu
goto :podcast_menu

:quit
echo Goodbye!
exit /b
