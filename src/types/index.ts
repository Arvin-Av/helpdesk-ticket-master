
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  department?: string;
  createdAt: string;
}

// Ticket types
export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  department: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
  comments?: Comment[];
}

// Comment types
export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

// Attachment types
export interface Attachment {
  id: string;
  ticketId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

// Department types
export interface Department {
  id: string;
  name: string;
}
