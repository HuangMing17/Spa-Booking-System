#!/bin/bash
# Complete backup script for SPA Bon Lai project
# Backs up database, uploads, and configuration

BACKUP_ROOT="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_ROOT}/backup_${TIMESTAMP}"

echo "========================================="
echo "SPA Bon Lai - Complete Backup Script"
echo "========================================="
echo ""

# Create backup directory
echo "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# 1. Backup Database
echo ""
echo "1. Backing up MySQL database..."
docker-compose exec -T mysql mysqldump -uroot -proot123 \
    --databases exercise201 \
    --single-transaction \
    --routines \
    --triggers > "${BACKUP_DIR}/database.sql"

if [ $? -eq 0 ]; then
    echo "   ✓ Database backup successful"
    gzip "${BACKUP_DIR}/database.sql"
    echo "   ✓ Database compressed"
else
    echo "   ✗ Database backup failed!"
fi

# 2. Backup uploads (if exists)
echo ""
echo "2. Backing up uploaded files..."
if [ -d "bonlai/uploads" ]; then
    tar -czf "${BACKUP_DIR}/uploads.tar.gz" bonlai/uploads/
    echo "   ✓ Uploads backup successful"
else
    echo "   ⚠ No uploads directory found, skipping..."
fi

# 3. Backup configuration files
echo ""
echo "3. Backing up configuration files..."
cp .env "${BACKUP_DIR}/.env.backup" 2>/dev/null
cp docker-compose.yml "${BACKUP_DIR}/docker-compose.yml.backup" 2>/dev/null
cp create_admin.sql "${BACKUP_DIR}/create_admin.sql.backup" 2>/dev/null
echo "   ✓ Configuration files backed up"

# 4. Create backup info file
echo ""
echo "4. Creating backup info..."
cat > "${BACKUP_DIR}/backup_info.txt" << EOF
SPA Bon Lai Backup Information
================================
Backup Date: $(date)
Backup Directory: $BACKUP_DIR

Contents:
- database.sql.gz : MySQL database dump
- uploads.tar.gz : Uploaded files (if exists)
- .env.backup : Environment configuration
- docker-compose.yml.backup : Docker configuration
- create_admin.sql.backup : Admin user script

Restore Instructions:
1. Extract database: gunzip database.sql.gz
2. Restore database: docker-compose exec -T mysql mysql -uroot -proot123 < database.sql
3. Extract uploads: tar -xzf uploads.tar.gz
4. Copy configs: cp *.backup to original locations

EOF
echo "   ✓ Backup info created"

# Summary
echo ""
echo "========================================="
echo "Backup completed successfully!"
echo "========================================="
echo "Backup location: $BACKUP_DIR"
echo "Backup size: $(du -sh "$BACKUP_DIR" | cut -f1)"
echo ""
echo "To restore this backup, see: ${BACKUP_DIR}/backup_info.txt"
