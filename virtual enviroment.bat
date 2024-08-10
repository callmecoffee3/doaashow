@echo off

:: Set the name of the virtual environment
set VENV_NAME=myenv

:: Create a new directory for the virtual environment
mkdir %VENV_NAME%

:: Navigate to the new directory
cd %VENV_NAME%

:: Create a new virtual environment using Python's venv module
python -m venv venv

:: Activate the virtual environment
call venv\Scripts\activate.bat

:: Install any required packages (e.g. pip install requests)
:: Add any additional commands or setup here

:: Deactivate the virtual environment when finished
call venv\Scripts\deactivate.bat