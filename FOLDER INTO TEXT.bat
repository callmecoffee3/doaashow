echo off
set folder_path=:\Path\To\Your\Folder
set output_file=:\Path\To\Your\Output.txt

dir /b /a %folder_path% > %output_file%


Let me explain how this works:

1. @echo off - This line turns off the command echoing, which means only the final output will be displayed in the command prompt.

2. set folder_path=:\Path\To\Your\Folder - Replace this with the path to the folder you want to convert.

3. set output_file=:\Path\To\Your\Output.txt - Replace this with the path and filename where you want to save the output text file.

4. dir /b /a %folder_path% > %output_file% - This line uses the dir command to list the contents of the specified folder. The /b option displays only the file names, and the /a option includes all file types. The output is then redirected to the specified output file using the > symbol.

Save this script as a .bat file and run it in the command prompt. The contents of the specified folder will be converted into a text file.

Note: This script only lists the files and subfolders in the specified folder, not the contents of subfolders. If you want to include subfolder contents, remove the /b option and add the /s option.