#!/bin/bash
# Restore MySQL database from backup file
# Usage: ./restore-db.sh <backup-file>

if [ -z "$1" ]; then
    echo "Usage: $0 <backup-file>"
    echo "Example: $0 backups/spa_bonlai_20260308_140000.sql"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Restoring database from $BACKUP_FILE..."

# Check if file is gzipped
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Detected gzip file, decompressing and restoring..."
    gunzip -c "$BACKUP_FILE" | docker-compose exec -T mysql mysql -uroot -proot123
else
    docker-compose exec -T mysql mysql -uroot -proot123 < "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Database restored successfully!"
else
    echo ""
    echo "✗ Restore failed!"
    exit 1
fi
