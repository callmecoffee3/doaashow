Here is a batch script that asks the user to enter a topic to search on YouTube, then scans YouTube for that topic and saves the list of video titles and URLs to a text file:
```
@echo off

set /p search_topic="Enter topic to search on YouTube: "

echo Searching YouTube for %search_topic%...

powershell -Command "Invoke-WebRequest -Uri '(WWW.YOUTUBE.COM)%' -OutFile youtube_search.html"

powershell -Command "(Get-Content youtube_search.html -Raw) -match 'yt-lockup-title' | Set-Content video_titles.txt"

powershell -Command "(Get-Content youtube_search.html -Raw) -match 'href=\"/watch?v=[^\"]+\"' | Set-Content video_urls.txt"

echo Search complete. Video titles saved to video_titles.txt and video URLs saved to video_urls.txt

pause
```
Let me explain how the script works:

- `set /p search_topic="Enter topic to search on YouTube: "` asks the user to enter a topic to search on YouTube and stores it in the `search_topic` variable.
- `powershell -Command "Invoke-WebRequest -Uri '(link unavailable)%' -OutFile youtube_search.html"` uses PowerShell to send a web request to YouTube with the search query and saves the HTML response to a file named `youtube_search.html`.
- `powershell -Command "(Get-Content youtube_search.html -Raw) -match 'yt-lockup-title' | Set-Content video_titles.txt"` uses PowerShell to extract the video titles from the HTML file and saves them to a file named `video_titles.txt`.
- `powershell -Command "(Get-Content youtube_search.html -Raw) -match 'href=\"/watch?v=[^\"]+\"' | Set-Content video_urls.txt"` uses PowerShell to extract the video URLs from the HTML file and saves them to a file named `video_urls.txt`.

Note: This script requires PowerShell to be installed on the system. Also, please note that this script is just a basic example and may not work perfectly for all search queries, as YouTube's HTML structure may change over time.