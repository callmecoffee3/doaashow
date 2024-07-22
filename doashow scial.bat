
```
@echo off

:main_menu
cls
echo 0. User
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
echo 12. List
echo 13. Quit
set /p choice=Enter your choice: 

if %choice%==0 goto :user_menu
if %choice%==1 goto :on_the_burner
if %choice%==2 goto :create_menu
if %choice%==3 goto :discover_menu
if %choice%==9 goto :tv_menu
if %choice%==10 goto :radio_menu
if %choice%==11 goto :podcast_menu
if %choice%==12 goto :list_menu
if %choice%==13 goto :quit
if %choice%==6 goto :main_menu

:comumnity_menu
cls
echo 1. communities
echo 2. users
echo 3. discover 
echo 4. add communites
echo 5. Back to Main Menu
set /p choice=Enter your choice: 

:User_menu
cls
echo 1. main user
echo 2. My users
echo 3. Search for users
echo 4. add user
echo 5. Back to Main Menu
set /p choice=Enter your choice: 

:list_menu
cls
echo 1. shopping
echo 2. My shopping
echo 3. Search for products
echo 4. add to list
echo 5. Back to Main Menu
set /p choice=Enter your choice: 

:discover_menu
cls
echo 1. Explore New Content
echo 2. Browse Categories
echo 3. Search for Specific Topics
echo 4. Discover New Creators
echo 5. Back to Main Menu
set /p choice=Enter your choice: 

if %choice%==5 goto :main_menu

:tv_menu
cls
echo 1. Browse Shows
echo 2. Search for Specific Titles
echo 3. Discover New Releases
echo 4. Back to Main Menu
set /p choice=Enter your choice: 

if %choice%==4 goto :main_menu

:radio_menu
cls
echo 1. Browse Stations
echo 2. Search for Specific Shows
echo 3. Discover New Podcasts
echo 4. Back to Main Menu
set /p choice=Enter your choice: 

if %choice%==4 goto :main_menu

:podcast_menu
cls
echo 1. Browse Episodes
echo 2. Search for Specific Topics
echo 3. Discover New Podcasts
echo 4. Back to Main Menu
set /p choice=Enter your choice: 

if %choice%==4 goto :main_menu

:quit
cls
echo Goodbye!
exit
```
