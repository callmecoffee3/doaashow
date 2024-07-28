@echo off

:: Contract of Agreement

:: Parties involved
set /p party1=Enter name of Party 1:
set /p party2=Enter name of Party 2:

:: Terms of agreement
set /p terms=Enter terms of agreement:

:: Price amount
set /p price=Enter price amount:

:: Signatures
set /p sig1=Enter signature of Party 1 (type 'signed' to confirm):
set /p sig2=Enter signature of Party 2 (type 'signed' to confirm):

:: Date
set /p date=Enter date of agreement (YYYY-MM-DD):

:: Output contract
echo Contract of Agreement between %party1% and %party2% > contract.txt
echo Terms of Agreement: %terms% >> contract.txt
echo Price Amount: $%price% >> contract.txt
echo Signed by %party1%: %sig1% >> contract.txt
echo Signed by %party2%: %sig2% >> contract.txt
echo Date: %date% >> contract.txt

:: Print contract
print /D:\printer_name contract.txt

:: Display success message
echo Contract saved and sent to printer.

Note: This script includes an additional prompt for the price amount and adds it to the contract.txt file.

Example output:

Contract of Agreement between John Doe and Jane Smith
Terms of Agreement: The terms are as follows...
Price Amount: $1000
Signed by John Doe: signed
Signed by Jane Smith: signed
Date: 2024-07-26

Make sure to replace \printer_name with the actual name of your printer.