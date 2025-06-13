
// Format currency to Vietnamese Dong
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0 ₫';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with thousand separators
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  
  return new Intl.NumberFormat('vi-VN').format(number);
};

// Format date to Vietnamese format
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const moment = require('moment');
  return moment(date).format(format);
};

// Format percentage
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  
  return `${Number(value).toFixed(decimals)}%`;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};