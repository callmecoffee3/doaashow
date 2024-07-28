
@echo off

:: Create main directory
mkdir Main Directory

:: Create subfolders
for %% in (a b c d e f g h i j k l m n o p q r s t u v w x y z) do (
mkdir Main Directory(+)%%
)

This script will create a main directory named "Main Directory" and then 26 subdirectories with the exact naming convention "(+)letter", for example:

Main Directory
(+)
a
(+)
b
(+)
c
...
(+)
z

The subdirectories will be named exactly as "(+)a", "(+)b", "(+)c", etc. Let me know if this is what you needed!