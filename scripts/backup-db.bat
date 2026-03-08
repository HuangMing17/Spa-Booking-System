@echo off
REM Backup MySQL database from Docker container
REM Usage: backup-db.bat

SET BACKUP_DIR=backups
SET TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
SET TIMESTAMP=%TIMESTAMP: =0%
SET BACKUP_FILE=%BACKUP_DIR%\spa_bonlai_%TIMESTAMP%.sql

echo Creating backup directory...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo Backing up database to %BACKUP_FILE%...
docker-compose exec -T mysql mysqldump -uroot -proot123 --databases exercise201 --single-transaction --routines --triggers > "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Backup successful: %BACKUP_FILE%
    echo File size: 
    dir "%BACKUP_FILE%" | find "%BACKUP_FILE%"
) else (
    echo.
    echo ✗ Backup failed!
    exit /b 1
)

echo.
echo To restore this backup:
echo docker-compose exec -T mysql mysql -uroot -proot123 ^< "%BACKUP_FILE%"
pause
