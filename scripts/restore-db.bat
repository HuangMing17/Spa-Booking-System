@echo off
REM Restore MySQL database from backup file
REM Usage: restore-db.bat <backup-file>

if "%~1"=="" (
    echo Usage: %0 ^<backup-file^>
    echo Example: %0 backups\spa_bonlai_20260308_140000.sql
    exit /b 1
)

SET BACKUP_FILE=%~1

if not exist "%BACKUP_FILE%" (
    echo Error: Backup file not found: %BACKUP_FILE%
    exit /b 1
)

echo Restoring database from %BACKUP_FILE%...
docker-compose exec -T mysql mysql -uroot -proot123 < "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database restored successfully!
) else (
    echo.
    echo ✗ Restore failed!
    exit /b 1
)

pause
