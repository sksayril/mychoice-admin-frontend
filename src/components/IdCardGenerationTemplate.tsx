import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image
} from '@react-pdf/renderer';

// Import the logo for watermark
const logoPath = 'mychoicelogonew.png';

// ID Card dimensions: 240 × 320 mm (increased size for better content display)
const CARD_WIDTH = 240;
const CARD_HEIGHT = 320;

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f0f4f8',
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    gap: 20,
  },

  // Front and Back side containers - ID Card Frames
  frontSide: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
  },
  backSide: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
  },

  // Header styling
  cardHeader: {
    backgroundColor: '#059669',
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 10,
    gap: 15,
  },

  companyLogo: {
    width: 40,
    height: 40,
    marginRight: 6,
    objectFit: 'contain',
  },
  
  headerTextContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  
  employeeIdCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    // 3D effect with multiple text shadows
    textShadowOffset: { width: 1, height: 1 },
    textShadowColor: '#000000',
    textShadowRadius: 2,
  },

  // Front side content
  frontContent: {
    padding: 20,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  // Employee section
  employeeSection: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  
  photoContainer: {
    width: 50,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    border: '3px solid #059669',
    backgroundColor: '#f8fafc',
  },
  
  employeePhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  employeeDetails: {
    flex: 1,
    paddingTop: 3,
    marginLeft: 15,
  },
  
  employeeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  employeeDesignation: {
    fontSize: 9,
    color: '#059669',
    marginBottom: 6,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  
  employeeIdBadge: {
    fontSize: 7,
    color: '#ffffff',
    backgroundColor: '#059669',
    padding: '3px 8px',
    borderRadius: 4,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },

  // Information section
  infoContainer: {
    flex: 1,
    marginBottom: 20,
  },
  
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
    paddingBottom: 3,
    borderBottom: '1px solid #e2e8f0',
  },
  
  infoLabel: {
    width: 45,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#059669',
    textTransform: 'uppercase',
  },
  
  infoValue: {
    flex: 1,
    fontSize: 8,
    color: '#1e293b',
    fontWeight: '600',
  },

  // Bottom contact section
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    border: '2px solid #cbd5e1',
  },
  
  contactInfo: {
    flex: 1,
  },
  
  contactLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 3,
  },
  
  contactValue: {
    fontSize: 9,
    color: '#059669',
    fontWeight: 'bold',
  },
  
  qrContainer: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    border: '2px solid #059669',
  },
  
  qrCode: {
    width: 30,
    height: 30,
  },
  
  qrPlaceholder: {
    width: 30,
    height: 30,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },

  // Back side styles
  backContent: {
    padding: 20,
    flex: 1,
  },

  disclaimer: {
    fontSize: 7,
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#fef2f2',
    padding: 6,
    borderRadius: 6,
    border: '1px solid #fca5a5',
    marginBottom: 15,
  },

  // Back side sections
  backSection: {
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  
  backSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottom: '2px solid #d1fae5',
    paddingBottom: 4,
  },
  
  backInfoRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  
  backInfoLabel: {
    width: 45,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#059669',
  },
  
  backInfoValue: {
    flex: 1,
    fontSize: 7,
    color: '#1e293b',
    lineHeight: 1.3,
  },

  // Address section special styling
  addressSection: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #10b981',
  },
  
  addressSectionTitle: {
    color: '#059669',
  },

  addressText: {
    fontSize: 8,
    color: '#1e293b',
    lineHeight: 1.4,
    marginBottom: 3,
    fontWeight: '600',
    wordWrap: 'break-word',
  },

  addressLine: {
    fontSize: 7,
    color: '#1e293b',
    lineHeight: 1.4,
    marginBottom: 2,
    flexWrap: 'wrap',
  },

  // Terms section
  termsSection: {
    backgroundColor: '#fefce8',
    border: '1px solid #eab308',
  },
  
  termsSectionTitle: {
    color: '#a16207',
  },
  
  termsText: {
    fontSize: 6,
    color: '#451a03',
    lineHeight: 1.4,
    textAlign: 'justify',
  },

  // Footer
  cardFooter: {
    backgroundColor: '#059669',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 10,
  },
  
  footerLogo: {
    width: 24,
    height: 24,
    marginRight: 8,
    objectFit: 'contain',
  },
  
  footerContact: {
    fontSize: 7,
    color: '#e0e7ff',
    fontWeight: 'bold',
  },

  // Watermark
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    opacity: 0.03,
    zIndex: 0,
  },
  
  watermarkLogo: {
    width: 120,
    height: 120,
    objectFit: 'contain',
  },
});

interface IdCardData {
  idCard: {
    _id: string;
    idCardNumber: string;
    employeePicture: string;
    employeeType: string;
    fullName: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    bloodGroup: string;
    mobileNumber: string;
    email: string;
    dateOfBirth: string;
    dateOfJoining: string;
    department: string | { _id: string; name: string };
    designation: string | { _id: string; title: string };
    qrCodeDataURL?: string;
  };
  departments: Array<{ _id: string; name: string }>;
  designations: Array<{ _id: string; title: string }>;
}

const IdCardGenerationTemplate: React.FC<IdCardData> = ({ idCard, departments, designations }) => {
  // Get department and designation names
  const getDepartmentName = (departmentId: string) => {
    if (typeof idCard.department === 'object') {
      return idCard.department.name;
    }
    const dept = departments.find(d => d._id === departmentId);
    return dept ? dept.name : 'Unknown Department';
  };

  const getDesignationName = (designationId: string) => {
    if (typeof idCard.designation === 'object') {
      return idCard.designation.title;
    }
    const desig = designations.find(d => d._id === designationId);
    return desig ? desig.title : 'Unknown Designation';
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Front Side - ID Card */}
        <View style={styles.frontSide}>
          {/* Watermark */}
          <View style={styles.watermark}>
            <Image src={logoPath} style={styles.watermarkLogo} />
          </View>

          {/* Front Side Header */}
          <View style={styles.cardHeader}>
            <Image src={logoPath} style={styles.companyLogo} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.employeeIdCardTitle}>ID CARD</Text>
            </View>
          </View>
          
          {/* Front Side Content */}
          <View style={styles.frontContent}>
            {/* Employee Section */}
            <View style={styles.employeeSection}>
              <View style={{ alignItems: 'center' }}>
                <View style={styles.photoContainer}>
                  <Image 
                    src={idCard.employeePicture} 
                    style={styles.employeePhoto}
                  />
                </View>
                <Text style={styles.employeeIdBadge}>ID: {idCard.idCardNumber}</Text>
              </View>
              <View style={styles.employeeDetails}>
                <Text style={styles.employeeName}>{idCard.fullName}</Text>
                <Text style={styles.employeeDesignation}>
                  {getDesignationName(typeof idCard.designation === 'string' ? idCard.designation : idCard.designation._id || '')}
                </Text>
              </View>
            </View>

            {/* Employee Information */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>TYPE:</Text>
                <Text style={styles.infoValue}>{idCard.employeeType.replace('-', ' ').toUpperCase()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>DEPT:</Text>
                <Text style={styles.infoValue}>
                  {getDepartmentName(typeof idCard.department === 'string' ? idCard.department : idCard.department._id || '')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>BLOOD:</Text>
                <Text style={styles.infoValue}>{idCard.bloodGroup}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>DOB:</Text>
                <Text style={styles.infoValue}>{formatDate(idCard.dateOfBirth)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>JOIN DATE:</Text>
                <Text style={styles.infoValue}>{formatDate(idCard.dateOfJoining)}</Text>
              </View>
            </View>

            {/* Bottom Contact Section */}
            <View style={styles.contactSection}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Contact</Text>
                <Text style={styles.contactValue}>{idCard.mobileNumber}</Text>
              </View>
              <View style={styles.qrContainer}>
                {idCard.qrCodeDataURL ? (
                  <Image src={idCard.qrCodeDataURL} style={styles.qrCode} />
                ) : (
                                     <View style={styles.qrPlaceholder}>
                     <Text style={{ fontSize: 4, color: '#059669', fontWeight: 'bold' }}>QR</Text>
                     <Text style={{ fontSize: 3, color: '#64748b' }}>CODE</Text>
                   </View>
                )}
              </View>
            </View>
          </View>
          
                     {/* Front Side Footer */}
           <View style={styles.cardFooter}>
             <Image src={logoPath} style={styles.footerLogo} />
             <View style={styles.headerTextContainer}>
               <Text style={styles.footerContact}>Contact: +91-03345013784</Text>
             </View>
           </View>
        </View>
         
        {/* Back Side - ID Card */}
        <View style={styles.backSide}>
          {/* Watermark */}
          <View style={styles.watermark}>
            <Image src={logoPath} style={styles.watermarkLogo} />
          </View>

          {/* Back Side Header */}
          <View style={styles.cardHeader}>
            <Image src={logoPath} style={styles.companyLogo} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.employeeIdCardTitle}>ID CARD</Text>
            </View>
          </View>
           
          {/* Back Side Content */}
          <View style={styles.backContent}>
            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              Property of MyChoice. Return if found.
            </Text>

            {/* Terms & Conditions */}
            <View style={[styles.backSection, styles.termsSection]}>
              <Text style={[styles.backSectionTitle, styles.termsSectionTitle]}>Terms & Conditions</Text>
              <Text style={styles.termsText}>
                This card is the property of MyChoice and must be returned upon termination of employment. 
                Unauthorized use is prohibited. Report loss immediately to HR department.
              </Text>
            </View>

                         {/* Employee Address */}
             <View style={[styles.backSection, styles.addressSection]}>
               <Text style={[styles.backSectionTitle, styles.addressSectionTitle]}>Employee Address</Text>
               <Text style={styles.addressText}>
                 {idCard.address.street || 'Street Address'}
               </Text>
               <Text style={styles.addressText}>
                 {idCard.address.city || 'City'}, {idCard.address.state || 'State'} {idCard.address.zipCode || 'ZIP'}
               </Text>
               <Text style={styles.addressText}>
                 {idCard.address.country || 'Country'}
               </Text>
             </View>

            {/* Contact Information */}
            <View style={styles.backSection}>
              <Text style={styles.backSectionTitle}>Contact Information</Text>
              <View style={styles.backInfoRow}>
                <Text style={styles.backInfoLabel}>Email:</Text>
                <Text style={styles.backInfoValue}>{idCard.email}</Text>
              </View>
              <View style={styles.backInfoRow}>
                <Text style={styles.backInfoLabel}>Phone:</Text>
                <Text style={styles.backInfoValue}>{idCard.mobileNumber}</Text>
              </View>
            </View>

            {/* Emergency Information */}
            <View style={styles.backSection}>
              <Text style={styles.backSectionTitle}>Emergency Details</Text>
              <View style={styles.backInfoRow}>
                <Text style={styles.backInfoLabel}>Blood Group:</Text>
                <Text style={styles.backInfoValue}>{idCard.bloodGroup}</Text>
              </View>
              <View style={styles.backInfoRow}>
                <Text style={styles.backInfoLabel}>Employee ID:</Text>
                <Text style={styles.backInfoValue}>{idCard.idCardNumber}</Text>
              </View>
            </View>
          </View>
           
                     {/* Back Side Footer */}
           <View style={styles.cardFooter}>
             <Image src={logoPath} style={styles.footerLogo} />
             <View style={styles.headerTextContainer}>
               <Text style={styles.footerContact}>Contact: +91-03345013784</Text>
             </View>
           </View>
        </View>
      </Page>
    </Document>
  );
};

export default IdCardGenerationTemplate;