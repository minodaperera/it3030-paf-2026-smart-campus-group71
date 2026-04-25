@echo off
setlocal

echo ==============================================
echo        Smart Campus Backend Starter           
echo ==============================================

set TARGET_PORT=8081

echo [1/3] Checking if port %TARGET_PORT% is in use...

for /f "tokens=5" %%a in ('netstat -a -n -o ^| findstr :%TARGET_PORT%') do (
    if not "%%a"=="0" (
        echo [!] Port %TARGET_PORT% is in use by PID: %%a
        echo [2/3] Killing existing process to free the port...
        taskkill /F /PID %%a >nul 2>&1
        echo       Process killed successfully!
    )
)

echo [3/3] Starting Spring Boot application...

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

call mvnw.cmd spring-boot:run
