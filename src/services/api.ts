
import { supabase } from "@/integrations/supabase/client";
import { supabaseService } from "./supabaseService";
import { Ticket, Comment, Attachment, Department, User } from "@/types";

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
      priority: item.priority,
      status: item.status,
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
      priority: item.priority,
      status: item.status,
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
      priority: data.priority,
      status: data.status,
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
    return await supabaseService.createTicket({
      subject: ticket.subject!,
      description: ticket.description!,
      priority: ticket.priority!,
      status: ticket.status || 'open',
      department_id: ticket.department_id!,
      user_id: ticket.user_id!,
      assigned_to: ticket.assigned_to
    });
  },

  // Update a ticket
  updateTicket: async (id: string, updates: Partial<Ticket>): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .update({
        subject: updates.subject,
        description: updates.description,
        priority: updates.priority,
        status: updates.status,
        department_id: updates.department_id,
        assigned_to: updates.assigned_to,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Get comments for a ticket
  getTicketComments: async (ticketId: string): Promise<Comment[]> => {
    return await supabaseService.getTicketComments(ticketId);
  },

  // Add a comment to a ticket
  addComment: async (comment: Partial<Comment>): Promise<Comment> => {
    return await supabaseService.addComment({
      ticket_id: comment.ticket_id!,
      user_id: comment.user_id!,
      content: comment.content!,
      is_internal: comment.is_internal
    });
  }
};

export const departmentService = {
  // Get all departments
  getAllDepartments: async (): Promise<Department[]> => {
    return await supabaseService.getDepartments();
  }
};

export const fileService = {
  // Upload a file attachment
  uploadFile: async (file: File, ticketId: string): Promise<Attachment> => {
    const result = await supabaseService.uploadFile(file, ticketId);
    
    // Get the public URL
    const { data } = supabase.storage
      .from('ticket-attachments')
      .getPublicUrl(result.path);
    
    // Save the attachment metadata to the database
    // Note: In a real app, you'd have a separate attachments table
    return {
      id: Math.random().toString(),
      ticket_id: ticketId,
      file_name: file.name,
      file_path: data.publicUrl,
      file_size: file.size,
      file_type: file.type,
      uploaded_by: 'current_user_id', // This would be replaced with the actual user ID
      created_at: new Date().toISOString()
    };
  }
};
