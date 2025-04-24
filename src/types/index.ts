
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  department?: string;
  department_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
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
  department_id: string;
  user_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  attachments?: Attachment[];
  comments?: Comment[];
}

// Comment types
export interface Comment {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

// Attachment types
export interface Attachment {
  id: string;
  ticket_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  created_at: string;
}

// Department types
export interface Department {
  id: string;
  name: string;
  description?: string;
}
