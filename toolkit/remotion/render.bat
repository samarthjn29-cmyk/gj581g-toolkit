@echo off
setlocal EnableDelayedExpansion
rem Decked out Data - renders the __PREFIX__ video on this computer with Remotion.
rem   render.bat            full video, 1080p, narration and grain included  -> out\__PREFIX___final.mp4
rem   render.bat draft      720p review copy, faster                          -> out\__PREFIX___draft_720p.mp4
rem   render.bat section 3  one section only (see sections.txt)               -> out\__PREFIX___section3.mp4
rem   render.bat studio     opens Remotion Studio in your browser to preview and scrub
cd /d "%~dp0"
title Decked out Data - __PREFIX__ render

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is not installed. Opening the download page: install the LTS version, then run render.bat again.
  start "" https://nodejs.org/en/download
  pause
  exit /b 1
)

for %%z in (__PREFIX___part*.zip) do (
  if not exist "unpacked_%%~nz.flag" (
    echo Unpacking %%z ...
    tar -xf "%%z" || (echo Could not unpack %%z & pause & exit /b 1)
    type nul > "unpacked_%%~nz.flag"
  )
)

if not exist node_modules (
  echo Installing Remotion - first run only, takes a few minutes...
  call npm install --no-audit --no-fund
  if errorlevel 1 (echo npm install failed & pause & exit /b 1)
)

if not exist out mkdir out
set MODE=%~1
if "%MODE%"=="" set MODE=full
echo This computer has %NUMBER_OF_PROCESSORS% processor threads.
set START=%TIME%

if /i "%MODE%"=="studio" (
  call npx remotion studio src/index.jsx
  goto :end
)
if /i "%MODE%"=="draft" (
  call npx remotion render src/index.jsx Video out/__PREFIX___draft_720p.mp4 --codec=h264 --crf=22 --scale=0.6667
  goto :done
)
if /i "%MODE%"=="section" (
  set FR=
  for /f "eol=# tokens=1,3" %%a in (sections.txt) do if "%%a"=="%~2" set FR=%%b
  if "!FR!"=="" (echo Unknown section "%~2" - see sections.txt & pause & exit /b 1)
  call npx remotion render src/index.jsx Video out/__PREFIX___section%~2.mp4 --frames=!FR! --codec=h264 --crf=18
  goto :done
)
call npx remotion render src/index.jsx Video out/__PREFIX___final.mp4 --codec=h264 --crf=18

:done
if errorlevel 1 (echo. & echo Render failed - see the messages above. & pause & exit /b 1)
echo.
echo Started %START%, finished %TIME%. The video is in the "out" folder.
start "" "%~dp0out"
:end
pause
