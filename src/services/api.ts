import { supabase } from "@/integrations/supabase/client";
import { supabaseService } from "./supabaseService";
import { Ticket, Comment, Attachment, Department, User, TicketPriority, TicketStatus } from "@/types";

export const ticketService = {
  // Get all tickets (admin)
  getAllTickets: async (): Promise<Ticket[]> => {
    const { data } = await supabase
      .from('tickets')
      .select(`
        *,
        departments(name)
      `)
      .order('created_at', { ascending: false });
    
    if (!data) return [];

    // Transform data to match our Ticket interface
    return data.map(item => ({
      id: item.id,
      subject: item.subject,
      description: item.description,
      priority: item.priority as TicketPriority,
      status: item.status as TicketStatus,
      department: item.departments?.name || '',
      department_id: item.department_id,
      user_id: item.user_id,
      assigned_to: item.assigned_to,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  },

  // Get tickets for a specific user
  getUserTickets: async (userId: string): Promise<Ticket[]> => {
    const { data } = await supabase
      .from('tickets')
      .select(`
        *,
        departments(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!data) return [];

    // Transform data to match our Ticket interface
    return data.map(item => ({
      id: item.id,
      subject: item.subject,
      description: item.description,
      priority: item.priority as TicketPriority,
      status: item.status as TicketStatus,
      department: item.departments?.name || '',
      department_id: item.department_id,
      user_id: item.user_id,
      assigned_to: item.assigned_to,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  },

  // Get a single ticket by ID
  getTicketById: async (id: string): Promise<Ticket | null> => {
    const { data } = await supabase
      .from('tickets')
      .select(`
        *,
        departments(name)
      `)
      .eq('id', id)
      .single();
    
    if (!data) return null;

    return {
      id: data.id,
      subject: data.subject,
      description: data.description,
      priority: data.priority as TicketPriority,
      status: data.status as TicketStatus,
      department: data.departments?.name || '',
      department_id: data.department_id,
      user_id: data.user_id,
      assigned_to: data.assigned_to,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  // Create a new ticket
  createTicket: async (ticket: Partial<Ticket>): Promise<Ticket> => {
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        subject: ticket.subject!,
        description: ticket.description!,
        priority: ticket.priority!,
        status: ticket.status || 'open',
        department_id: ticket.department_id!,
        user_id: ticket.user_id!,
        assigned_to: ticket.assigned_to
      })
      .select()
      .single();

    if (error) throw error;
    
    // Get department name for the response
    const { data: deptData } = await supabase
      .from('departments')
      .select('name')
      .eq('id', data.department_id)
      .single();
      
    return {
      ...data,
      priority: data.priority as TicketPriority,
      status: data.status as TicketStatus,
      department: deptData?.name || ''
    };
  },

  // Update a ticket's status
  updateTicketStatus: async (ticketId: string, status: TicketStatus): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
    
    if (error) throw error;
  },

  // Assign a ticket to a user
  assignTicket: async (ticketId: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        assigned_to: userId,
        status: 'in-progress' as TicketStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
    
    if (error) throw error;
  },

  // Update a ticket
  updateTicket: async (id: string, updates: Partial<Ticket>): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get comments for a ticket
  getTicketComments: async (ticketId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(name)
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    if (!data) return [];

    return data.map(comment => ({
      id: comment.id,
      ticket_id: comment.ticket_id,
      user_id: comment.user_id,
      content: comment.content,
      is_internal: comment.is_internal || false,
      created_at: comment.created_at,
      user_name: comment.profiles?.name || ''
    }));
  },

  // Add a comment to a ticket
  addComment: async (ticketId: string, userId: string, content: string, isInternal: boolean = false): Promise<Comment> => {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        ticket_id: ticketId,
        user_id: userId,
        content: content,
        is_internal: isInternal
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const userService = {
  // Get all users (for admin)
  getAllUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (!data) return [];

    return data.map(user => ({
      id: user.id,
      name: user.name || '',
      email: '', // Email not available directly from profiles
      role: user.role as 'user' | 'admin',
      department_id: user.department_id,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
  }
};

export const departmentService = {
  // Get all departments
  getAllDepartments: async (): Promise<Department[]> => {
    const { data, error } = await supabase
      .from('departments')
      .select('*');

    if (error) throw error;
    return data || [];
  }
};

export const fileService = {
  // Upload a file attachment
  uploadFile: async (file: File, ticketId: string): Promise<Attachment> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${ticketId}/${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('ticket-attachments')
      .upload(fileName, file);

    if (error) throw error;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('ticket-attachments')
      .getPublicUrl(data.path);
    
    // Create attachment record
    return {
      id: Math.random().toString(),
      ticket_id: ticketId,
      file_name: file.name,
      file_path: urlData.publicUrl,
      file_size: file.size,
      file_type: file.type,
      uploaded_by: 'current_user_id', // This would be replaced with the actual user ID
      created_at: new Date().toISOString()
    };
  }
};
