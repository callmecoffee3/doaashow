@echo off 
::doashow folder maker 
::make as buttons & pages
.in code 
:website notes 
.main hub 
.dark background color 
.logo name 
.website name 
.logo 
.image logo option 
.settings option 
.fullscreen option
.search bar & submit
.time & date display


:use clipboard

::settings button (add below)
.user input section 
.full screen optionuser input section 
.full screen option 
.color background option 
.image background option 
.sound options .edit details 
.exit option 
.save note options 
.save options 
.load options 
.rename options 
.folder options 
.display options 
.time options 
.logo options 
.website options  
.sign-on options 
.log-on options 
.guest options 
.desk options  
.tool options 

::change, edit, add, rename
.sound backgoud option
.color background option 
.image background option 
.sound options 
.edit details 
.exit option 
.save note options 
.save options 
.load options 
.rename options 
.folder options 
.display options 

//doshow settings as: 
.user input section 
.full screen option 
.color background option 
.image background option 
.sound options .edit details 
.exit option 
.save note options 
.save options 
.load options 
.rename options 
.folder options 
.display options 
.time options 
.logo options 
.website options  
.sign-on options 
.log-on options 
.guest options 
.desk options  
.tool options 

//main header
:website name
:website title
:website logo
:time & date
:add search bar & button
:settings options (button)
:full screen option (button)
:display search result
:display search terms: help; people; agents; actors; props; movie; radio; tv; images; shorts; video; sound
:display folders
:display toolbar
:display help 
:display batch code

//toolbar; (under)
;left
.new
.open
.edit
.load
.save
.rename
.properties
.upload
.download
.main menu

//left column 
;left
.left column 
.buttons row 
.time and date 
.notes with button
(save note on top)
.voice note with button
.video note with button
.save voice note on top
.save video note on top
.save note button
.guestbook note with save (save note on top)
.save notes on top

//center column 
;center 
::create directories 
::folder manager (for doashow) 
:put folders on top
:add batch command (center)

.folders
::Put directories on top in center column 
::Create main folder mkdir doaashow 


//bottom row 
;center 
::add user input 
::add submit button
:let user add commands
:let user use paste

//script begin 
::begin script 

//options:
.user input section 
.full screen option 
.color background option 
.image background option 
.sound options .edit details 
.exit option 
.save note options 
.save options 
.load options 
.rename options 
.folder options 
.display options 
.time options 
.logo options 
.website options  
.sign-on options 
.log-on options 
.guest options 
.desk options  
.tool options 

//main folder:
:: Create main folder
mkdir doaashow
(put folders on top)

//subfolders: 
::create subfolders
mkdir letters 
mkdir numbers 
mkdir symbols 
mkdir producers 
mkdir managers 
mkdir writers 
mkdir directors 
mkdir shows 
mkdir channels 
mkdir ideas 



:: create sub folders
:let user add to list when makes a directory
:add to file 
:add to folders
:save file
letters, 
numbers, 
symbols, 
producers, 
managers, 
writers, 
directors, 
shows, 
channels,
ideas,

::create buttons from folders
:put on top

::help
:just a tesat

//display
:display search
:display search results

//ai chat bot
.bottem,  center coloumn
.10000 responces
.make repsonces, 
.about:
:desion maker
:yourself
:family
:life
:personal
:entertainment
:website


//set settings
//make into buttons from echo
//make into pages
:main-menu
cls
echo Folder Manager
echo ===============
echo 1. Select Folder
echo 2. Rename Folder
echo 3. Upload to Folder
echo 4. Download from Folder
echo 5. Add New Folder
echo 6. Add Folder Inside doaashow
echo 7. Exit
set /p choice=Enter your choice: 
if %choice%==1 goto select-folder
if %choice%==2 goto rename-folder
if %choice%==3 goto upload-folder
if %choice%==4 goto download-folder
if %choice%==5 goto add-new-folder
if %choice%==6 goto add-folder-inside-doaashow
if %choice%==7 goto exit

//set folder type 
//in center column
:: Ask user for folder type 
set /p type=Enter folder type: 
(letters, numbers, symbols, producers, managers, writers, directors, shows, channels):

//set /letters mkdir a through z set /numbers mkdir 0 through 100 
//set /symbols mkdir each symbol in ascii code 
//set folder prefix 
:: Ask user for folder prefix 
set /p prefix=Enter folder prefix 
(e.g. a, A, 1, !, etc.): 

//set number of folders 
:: Ask user for number of folders 
set /p numfolders=Enter number of folders to create: 

:: Add folders inside doaashow if %type%==letters 
( for /l %%i in (97,1,122) do ( mkdir "doaashow%prefix%%%i" ) )
else if %type%==numbers ( for /l %%i in (1,1,%numfolders%) do 
( mkdir "doaashow%prefix%%%i" ) ) 
else if %type%==symbols 
( set /p symbol=Enter symbol 
(!, @, #, etc.): 
for /l %%i in (1,1,%numfolders%) 
do ( mkdir "doaashow%prefix%%symbol%%%i" ) ) 
else { mkdir "doaashow%prefix%%type%" } 
Script execution complete. 
Use the buttons above to interact with the folder manager.

:: Ask user for folder type
set /p type=Enter folder type: 
(letters, numbers, symbols): 

:: Ask user for folder prefix
set /p prefix=Enter folder prefix 
(e.g. a, A, 1, !, etc.): 

:: Ask user for number of folders
set /p numfolders=Enter number of folders to create: 

:: Add folders inside doaashow
if %type%==letters (
for /l %%i in (97,1,122) do (
mkdir "doaashow\%prefix%%%i")
) else if %type%==numbers (
for /l %%i in (1,1,%numfolders%) do (
mkdir "doaashow\%prefix%%%i")
) else if %type%==symbols (
set /p symbol=Enter symbol (!, @, #, etc.): 
for /l %%i in (1,1,%numfolders%) do (
mkdir "doaashow\%prefix%%symbol%%%i"
    )
)

