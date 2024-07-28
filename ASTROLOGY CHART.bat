::ASTROLOY CHART
Here's a simple batch script to create a basic astrology chart:

@echo off

:: Get user input
set /p name=Enter your name:
set /p month=Enter your birth month (1-12):
set /p day=Enter your birth day (1-31):
set /p year=Enter your birth year:

:: Determine sun sign
if %month%==1 (
if %day%>=20 set sign=Aquarius
else set sign=Capricorn
)
if %month%==2 (
if %day%>=19 set sign=Pisces
else set sign=Aquarius
)
if %month%==3 (
if %day%>=21 set sign=Aries
else set sign=Pisces
)
if %month%==4 (
if %day%>=20 set sign=Taurus
else set sign=Aries
)
if %month%==5 (
if %day%>=21 set sign=Gemini
else set sign=Taurus
)
if %month%==6 (
if %day%>=21 set sign=Cancer
else set sign=Gemini
)
if %month%==7 (
if %day%>=23 set sign=Leo
else set sign=Cancer
)
if %month%==8 (
if %day%>=23 set sign=Virgo
else set sign=Leo
)
if %month%==9 (
if %day%>=23 set sign=Libra
else set sign=Virgo
)
if %month%==10 (
if %day%>=23 set sign=Scorpio
else set sign=Libra
)
if %month%==11 (
if %day%>=22 set sign=Sagittarius
else set sign=Scorpio
)
if %month%==12 (
if %day%>=22 set sign=Capricorn
else set sign=Sagittarius
)

:: Display chart
echo Astrology Chart for %name%
echo --------------------------------
echo Sun Sign: %sign%
echo Birth Date: %month%/%day%/%year%

Note: This script only determines the sun sign and does not calculate other planetary positions or aspects. For a more accurate and detailed astrology chart, consider using specialized software or consulting an astrology professional.
echo Astrology Chart for %name% > astrology_chart.txt
echo -------------------------------- >> astrology_chart.txt
echo Sun Sign: %sign% >> astrology_chart.txt
echo Birth Date: %month%/%day%/%year% >> astrology_chart.txt
echo Predictions: >> astrology_chart.txt
if %sign%==Aquarius (
echo You will have a innovative and humanitarian approach to challenges. >> astrology_chart.txt
)
if %sign%==Pisces (
echo You will experience a strong connection to your intuition and creativity. >> astrology_chart.txt
)
...


This will create a new text file called astrology_chart.txt and append the chart and predictions to it. The >> symbol is used to append to the file, rather than overwrite it.

You can also specify a different file name or path if needed. For example:

echo Astrology Chart for %name% > F:\astrology_chart.txt


Make sure to run the batch script in the desired directory, or specify the full path to the file.