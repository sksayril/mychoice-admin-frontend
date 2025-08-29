import QRCode from 'qrcode';

export const generateQRCodeDataURL = async (data: string): Promise<string> => {
  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Return a placeholder QR code
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTQwIiB5PSI0MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI0MCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjE0MCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPg==';
  }
};

export const generateEmployeeQRCode = async (employeeData: {
  name: string;
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: string;
  email: string;
}): Promise<string> => {
  // Create QR code with the employee portal URL
  const qrData = `https://employes.my-choice.co.in?id=${employeeData.id}&name=${encodeURIComponent(employeeData.name)}`;
  return generateQRCodeDataURL(qrData);
};
