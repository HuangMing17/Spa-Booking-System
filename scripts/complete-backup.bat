@echo off
REM Complete backup script for SPA Bon Lai project
REM Backs up database, uploads, and configuration

SET BACKUP_ROOT=backups
SET TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
SET TIMESTAMP=%TIMESTAMP: =0%
SET BACKUP_DIR=%BACKUP_ROOT%\backup_%TIMESTAMP%

echo =========================================
echo SPA Bon Lai - Complete Backup Script
echo =========================================
echo.

REM Create backup directory
echo Creating backup directory: %BACKUP_DIR%
mkdir "%BACKUP_DIR%" 2>nul

REM 1. Backup Database
echo.
echo 1. Backing up MySQL database...
docker-compose exec -T mysql mysqldump -uroot -proot123 --databases exercise201 --single-transaction --routines --triggers > "%BACKUP_DIR%\database.sql"

if %ERRORLEVEL% EQU 0 (
    echo    ✓ Database backup successful
) else (
    echo    ✗ Database backup failed!
)

REM 2. Backup uploads (if exists)
echo.
echo 2. Backing up uploaded files...
if exist "bonlai\uploads" (
    xcopy "bonlai\uploads" "%BACKUP_DIR%\uploads\" /E /I /Y >nul 2>&1
    echo    ✓ Uploads backup successful
) else (
    echo    ⚠ No uploads directory found, skipping...
)

REM 3. Backup configuration files
echo.
echo 3. Backing up configuration files...
copy ".env" "%BACKUP_DIR%\.env.backup" >nul 2>&1
copy "docker-compose.yml" "%BACKUP_DIR%\docker-compose.yml.backup" >nul 2>&1
copy "create_admin.sql" "%BACKUP_DIR%\create_admin.sql.backup" >nul 2>&1
echo    ✓ Configuration files backed up

REM 4. Create backup info file
echo.
echo 4. Creating backup info...
(
echo SPA Bon Lai Backup Information
echo ================================
echo Backup Date: %date% %time%
echo Backup Directory: %BACKUP_DIR%
echo.
echo Contents:
echo - database.sql : MySQL database dump
echo - uploads\ : Uploaded files ^(if exists^)
echo - .env.backup : Environment configuration
echo - docker-compose.yml.backup : Docker configuration
echo - create_admin.sql.backup : Admin user script
echo.
echo Restore Instructions:
echo 1. Restore database: docker-compose exec -T mysql mysql -uroot -proot123 ^< database.sql
echo 2. Copy uploads: xcopy uploads\ bonlai\uploads\ /E /I /Y
echo 3. Copy configs: copy *.backup to original locations
) > "%BACKUP_DIR%\backup_info.txt"
echo    ✓ Backup info created

REM Summary
echo.
echo =========================================
echo Backup completed successfully!
echo =========================================
echo Backup location: %BACKUP_DIR%
dir "%BACKUP_DIR%" | find "File(s)"
echo.
echo To restore this backup, see: %BACKUP_DIR%\backup_info.txt
echo.
pause
