Here is a batch script that creates a token maker:
@echo off

:: Token Maker

:: Set token details
set /p symbol="Enter token symbol: "
set /p name="Enter token name: "
set /p supply="Enter token supply: "
set /p amount="Enter token amount: "
set /p price="Enter price per token: "

:: Create token
echo Token created:
echo Symbol: %symbol%
echo Name: %name%
echo Supply: %supply%
echo Amount: %amount%
echo Price per token: %price%

:: Save token details to file
echo %symbol% %name% %supply% %amount% %price% > token_details.txt

:: Prompt user to create another token
set /p create_another="Create another token? (y/n): "
if %create_another%==y goto start
if %create_another%==n goto exit

:start
goto token

:exit
exit

This script prompts the user to enter the token symbol, name, supply, amount, and price per token. It then creates a token with the entered details and saves the details to a file named token_details.txt. The user is then prompted to create another token.

Note: This script is a simple example and does not include any error handling or validation. In a real-world scenario, you would want to add checks to ensure that the user enters valid data.