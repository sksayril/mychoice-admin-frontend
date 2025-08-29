// Image utility functions

const BACKEND_BASE_URL = 'http://localhost:3100';

/**
 * Get the full URL for an employee picture
 * @param imagePath - The image path from the database (e.g., "/uploads/employees/pictures/employee-123.png")
 * @returns The full URL to access the image
 */
export const getEmployeePictureUrl = (imagePath: string): string => {
  if (!imagePath) {
    return 'https://via.placeholder.com/150x150?text=No+Photo';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend base URL
  if (imagePath.startsWith('/')) {
    return `${BACKEND_BASE_URL}${imagePath}`;
  }
  
  // If it's just a filename, assume it's in the uploads folder
  return `${BACKEND_BASE_URL}/uploads/employees/pictures/${imagePath}`;
};

/**
 * Generate a unique filename for uploaded employee pictures
 * @param originalName - The original filename
 * @returns A unique filename with timestamp
 */
export const generateEmployeePictureFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const extension = originalName.split('.').pop() || 'png';
  return `employee-${timestamp}-${random}.${extension}`;
};

/**
 * Get the relative path for storing employee pictures
 * @param filename - The generated filename
 * @returns The relative path for the database
 */
export const getEmployeePicturePath = (filename: string): string => {
  return `/uploads/employees/pictures/${filename}`;
};
