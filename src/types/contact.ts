export interface Contact {
  _id: string;
  fullName: string;
  emailAddress: string;
  mobileNumber?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: {
    contacts: Contact[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalContacts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface ContactStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    new: number;
    read: number;
    replied: number;
    closed: number;
  };
}

export interface UpdateContactStatusRequest {
  status: 'new' | 'read' | 'replied' | 'closed';
}

export interface ContactFilters {
  page?: number;
  limit?: number;
  status?: 'new' | 'read' | 'replied' | 'closed';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
