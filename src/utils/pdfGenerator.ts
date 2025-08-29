import { pdf } from '@react-pdf/renderer';
import React from 'react';
import IdCardGenerationTemplate from '../components/IdCardGenerationTemplate';
import { IdCard } from '../types/idCard';
import { Department, Designation } from '../types/department';
import { getEmployeePictureUrl } from './imageUtils';
import { generateEmployeeQRCode } from './qrCodeGenerator';

export const generateIdCardPDF = async (
  idCard: IdCard,
  departments: Department[],
  designations: Designation[]
) => {
  try {
    // Generate QR code for the employee
    const qrCodeDataURL = await generateEmployeeQRCode({
      name: idCard.fullName,
      id: idCard.idCardNumber,
      address: idCard.address,
      contact: idCard.mobileNumber,
      email: idCard.email
    });

    // Prepare the data for the template
    const templateData = {
      idCard: {
        ...idCard,
        // Convert employee picture to full URL for PDF
        employeePicture: getEmployeePictureUrl(idCard.employeePicture),
        // Add QR code data URL
        qrCodeDataURL
      },
      departments,
      designations
    };

    // Generate PDF blob
    const blob = await pdf(React.createElement(IdCardGenerationTemplate, templateData)).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ID_Card_${idCard.idCardNumber}_${idCard.fullName.replace(/\s+/g, '_')}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: 'Failed to generate PDF' };
  }
};
