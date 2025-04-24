
import { supabase } from "@/integrations/supabase/client";
import { Department, Ticket, Comment, User } from "@/types";

export const supabaseService = {
  // User related functions
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  },

  // Ticket related functions
  async getTickets() {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        departments(name),
        profiles!tickets_user_id_fkey(name),
        profiles!tickets_assigned_to_fkey(name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createTicket(ticket: Partial<Ticket>) {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticket)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Comment related functions
  async getTicketComments(ticketId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(name)
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async addComment(comment: Partial<Comment>) {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Department related functions
  async getDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select('*');

    if (error) throw error;
    return data;
  },

  // File upload function
  async uploadFile(file: File, ticketId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${ticketId}/${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('ticket-attachments')
      .upload(fileName, file);

    if (error) throw error;
    return data;
  }
};
