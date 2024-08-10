@echo off
echo famscocialnetwork create folders
:menu
cls
echo FamSocialNetwork Menu
echo 1. Create new folder
echo 2. Add folder to existing directory
echo 3. Edit folder name
echo 4. Display folders
echo 5. Display subfolders
echo 6. Edit subfolder name
echo 7. Remove subfolder
echo 8. Remove folder
echo 9. Copy folder
echo 10. Copy subfolder
echo 11. Copy subfolders to txt
echo 12. Display txt in folders
echo 13. Go to folder
echo 14. Write to txt
echo 15. Add txt file to folder
echo 16. Make clipboard
echo 17. Display clipboard
echo 18. Add subfolder
echo 19. Add user
echo 20. Exit
set /p choice=Choose an option:

if %choice%==1 goto create_folder
if %choice%==2 goto add_folder
if %choice%==3 goto edit_folder
if %choice%==4 goto display_folders
if %choice%==5 goto display_subfolders
if %choice%==6 goto edit_subfolder
if %choice%==7 goto remove_subfolder
if %choice%==8 goto remove_folder
if %choice%==9 goto copy_folder
if %choice%==10 goto copy_subfolder
if %choice%==11 goto copy_subfolders_to_txt
if %choice%==12 goto display_txt_in_folders
if %choice%==13 goto goto_folder
if %choice%==14 goto write_to_txt
if %choice%==15 goto add_txt_to_folder
if %choice%==16 goto make_clipboard
if %choice%==17 goto display_clipboard
if %choice%==18 goto add_subfolder
if %choice%==19 goto add_user
if %choice%==20 exit


:add_user
cls
set /p username=Enter username:
set /p password=Enter password:
echo Username: %username% > FamSocialNetwork\users%username%.txt
echo Password: %password% >> FamSocialNetwork\users%username%.txt
echo User %username% added
pause
goto menu


:make_clipboard
cls
set /p clipboard=Enter text to copy to clipboard:
echo %clipboard%|clip
echo Copied to clipboard
pause
goto menu

:display_clipboard
cls
echo Clipboard contents:
clip
pause
goto menu
:add_txt_to_folder
cls
set /p folder=Enter folder name:
set /p txt=Enter txt file name:
copy %txt%.txt / %folder%
echo %txt%.txt added to %folder%
pause
goto menu


:write_to_txt
cls
set /p txt=Enter txt file name:
set /p content=Enter content to write:
echo %content% >> FamSocialNetwork/%txt%.txt
echo Content written to %txt%.txt
pause
goto menu


:goto_folder
cls
set /p folder=Enter folder name:
cd FamSocialNetwork/%folder%
pause
goto menu

:display_txt_in_folders
cls
echo Displaying text files in folders:
for /r FamSocialNetwork %%i in (*.txt) do (
type "%%i"
echo -----------------------------------
)
pause
goto menu

:copy_subfolders_to_txt
cls
dir /b /s /ad FamSocialNetwork >> subfolders.txt
echo Subfolders copied to subfolders.txt
pause
goto menu

:copy_folder
cls
set /p folder_name=Enter folder name to copy:
set /p destination=Enter destination path:
xcopy /s /i FamSocialNetwork%folder_name% %destination%
goto menu

:copy_subfolder
cls
set /p subfolder_name=Enter subfolder name to copy:
set /p destination=Enter destination path:
xcopy /s /i FamSocialNetwork%subfolder_name% %destination%
goto menu


:display_subfolders
cls
echo Subfolders in FamSocialNetwork:
dir /b /s /ad FamSocialNetwork
pause
goto menu

:edit_subfolder
cls
set /p old_subfolder_name=Enter current subfolder name:
set /p new_subfolder_name=Enter new subfolder name:
ren FamSocialNetwork%old_subfolder_name% FamSocialNetwork%new_subfolder_name%
goto menu

:remove_subfolder
cls
set /p subfolder_name=Enter subfolder name to remove:
rmdir /s /q FamSocialNetwork%subfolder_name%
goto menu

:remove_folder
cls
set /p folder_name=Enter folder name to remove:
rmdir /s /q FamSocialNetwork%folder_name%
goto menu
:display_folders
cls
echo Folders in FamSocialNetwork:
dir /b /ad FamSocialNetwork
pause
goto menu

:edit_folder
set /p old_folder_name=Enter current folder name:
set /p new_folder_name=Enter new folder name:
ren FamSocialNetwork\%old_folder_name% FamSocialNetwork\%new_folder_name%
goto menu

:create_folder
set /p folder_name=Enter new folder name: 
mkdir FamSocialNetwork\%folder_name%
goto menu

:add_folder
set /p dir_name=Enter directory name: 
set /p folder_name=Enter new folder name: 
mkdir FamSocialNetwork\%dir_name%\%folder_name%
goto menu



mkdir FamSocialNetwork
mkdir FamSocialNetwork\Abilities
mkdir FamSocialNetwork\Admin
mkdir FamSocialNetwork\Adults
mkdir FamSocialNetwork\Appearances
mkdir FamSocialNetwork\Audio
mkdir FamSocialNetwork\Businesses
mkdir FamSocialNetwork\Discover
mkdir FamSocialNetwork\Groups
mkdir FamSocialNetwork\Houses
mkdir FamSocialNetwork\Interests
mkdir FamSocialNetwork\Jobs
mkdir FamSocialNetwork\Kids
mkdir FamSocialNetwork\Likes
mkdir FamSocialNetwork\Marketplace
mkdir FamSocialNetwork\Notes
mkdir FamSocialNetwork\Pages
mkdir FamSocialNetwork\Preferences

