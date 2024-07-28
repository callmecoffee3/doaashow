Here's a basic template for a contract of agreement in batch script format:

@echo off

:: Contract of Agreement

:: Parties involved
set /p party1=Enter name of Party 1:
set /p party2=Enter name of Party 2:

:: Terms of agreement
set /p terms=Enter terms of agreement:

:: Signatures
set /p sig1=Enter signature of Party 1 (type 'signed' to confirm):
set /p sig2=Enter signature of Party 2 (type 'signed' to confirm):

:: Date
set /p date=Enter date of agreement (YYYY-MM-DD):

:: Output contract
echo Contract of Agreement between %party1% and %party2% > contract.txt
echo Terms of Agreement: %terms% >> contract.txt
echo Signed by %party1%: %sig1% >> contract.txt
echo Signed by %party2%: %sig2% >> contract.txt
echo Date: %date% >> contract.txt

:: Display success message
echo Contract saved to contract.txt


This script prompts users to enter the necessary information for a basic contract, including:

- Names of the parties involved
- Terms of the agreement
- Signatures (simulated by typing 'signed')
- Date of the agreement

The script then saves this information to a text file named contract.txt.

Note: This is a very basic template and should not be used for actual legal contracts without consulting a legal professional.