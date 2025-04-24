
import { User, Ticket, Comment, Department, TicketStatus, TicketPriority } from '@/types';
import { users, tickets, departments } from './mockData';
import { toast } from "sonner";

// Simple delay to simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth Service
export const authService = {
  // Login function
  login: async (email: string, password: string): Promise<User | null> => {
    await delay(800);
    const user = users.find(u => u.email === email);
    
    if (user) {
      // In a real app, we would validate the password here
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid email or password');
  },
  
  // Register function
  register: async (name: string, email: string, password: string, department: string): Promise<User> => {
    await delay(1000);
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${users.length + 1}`,
      name,
      email,
      role: 'user',
      department,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return newUser;
  },
  
  // Logout function
  logout: () => {
    localStorage.removeItem('currentUser');
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Ticket Service
export const ticketService = {
  // Get all tickets
  getAllTickets: async (): Promise<Ticket[]> => {
    await delay(800);
    return [...tickets];
  },
  
  // Get user tickets
  getUserTickets: async (userId: string): Promise<Ticket[]> => {
    await delay(800);
    return tickets.filter(ticket => ticket.createdBy === userId);
  },
  
  // Get ticket by ID
  getTicketById: async (ticketId: string): Promise<Ticket | undefined> => {
    await delay(500);
    return tickets.find(ticket => ticket.id === ticketId);
  },
  
  // Create new ticket
  createTicket: async (
    subject: string,
    description: string,
    priority: TicketPriority,
    department: string,
    userId: string,
    file?: File
  ): Promise<Ticket> => {
    await delay(1000);
    
    const newTicket: Ticket = {
      id: `ticket-${tickets.length + 1}`,
      subject,
      description,
      priority,
      status: 'open',
      department,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: file ? [{
        id: `attachment-1`,
        ticketId: `ticket-${tickets.length + 1}`,
        fileName: file.name,
        filePath: URL.createObjectURL(file),
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      }] : []
    };
    
    tickets.push(newTicket);
    
    return newTicket;
  },
  
  // Update ticket status
  updateTicketStatus: async (ticketId: string, status: TicketStatus): Promise<Ticket> => {
    await delay(600);
    
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    
    return ticket;
  },
  
  // Assign ticket
  assignTicket: async (ticketId: string, userId: string): Promise<Ticket> => {
    await delay(600);
    
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    ticket.assignedTo = userId;
    ticket.status = 'in-progress';
    ticket.updatedAt = new Date().toISOString();
    
    return ticket;
  },
  
  // Add comment to ticket
  addComment: async (ticketId: string, userId: string, content: string, isInternal: boolean): Promise<Comment> => {
    await delay(700);
    
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const newComment: Comment = {
      id: `comment-${Math.floor(Math.random() * 1000)}`,
      ticketId,
      userId,
      userName: user.name,
      content,
      isInternal,
      createdAt: new Date().toISOString(),
    };
    
    if (!ticket.comments) {
      ticket.comments = [];
    }
    
    ticket.comments.push(newComment);
    ticket.updatedAt = new Date().toISOString();
    
    return newComment;
  },
};

// Department Service
export const departmentService = {
  // Get all departments
  getAllDepartments: async (): Promise<Department[]> => {
    await delay(500);
    return [...departments];
  },
};

// User Service
export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    await delay(700);
    return [...users];
  },
  
  // Get user by ID
  getUserById: async (userId: string): Promise<User | undefined> => {
    await delay(500);
    return users.find(user => user.id === userId);
  },
};
