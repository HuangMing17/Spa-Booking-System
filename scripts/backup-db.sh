#!/bin/bash
# Backup MySQL database from Docker container
# Usage: ./backup-db.sh

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/spa_bonlai_${TIMESTAMP}.sql"

echo "Creating backup directory..."
mkdir -p "$BACKUP_DIR"

echo "Backing up database to $BACKUP_FILE..."
docker-compose exec -T mysql mysqldump -uroot -proot123 \
    --databases exercise201 \
    --single-transaction \
    --routines \
    --triggers > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Backup successful: $BACKUP_FILE"
    echo "File size: $(du -h "$BACKUP_FILE" | cut -f1)"
    
    # Compress backup
    echo "Compressing backup..."
    gzip "$BACKUP_FILE"
    echo "✓ Compressed: ${BACKUP_FILE}.gz"
else
    echo ""
    echo "✗ Backup failed!"
    exit 1
fi

echo ""
echo "To restore this backup:"
echo "gunzip -c ${BACKUP_FILE}.gz | docker-compose exec -T mysql mysql -uroot -proot123"
