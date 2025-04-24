
import { User, Ticket, Comment, Department, TicketStatus, TicketPriority } from '@/types';

// Mock Users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    department: 'Marketing',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    department: 'Sales',
    createdAt: '2023-02-20T09:15:00Z',
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    department: 'IT',
    createdAt: '2022-12-01T08:00:00Z',
  },
];

// Mock Departments
export const departments: Department[] = [
  { id: 'dept-1', name: 'IT' },
  { id: 'dept-2', name: 'HR' },
  { id: 'dept-3', name: 'Finance' },
  { id: 'dept-4', name: 'Marketing' },
  { id: 'dept-5', name: 'Sales' },
  { id: 'dept-6', name: 'Operations' },
];

// Mock Tickets
export const tickets: Ticket[] = [
  {
    id: 'ticket-1',
    subject: 'Cannot access email',
    description: 'I am unable to log into my email account since this morning. I have tried resetting my password but still getting an error message.',
    priority: 'high',
    status: 'open',
    department: 'IT',
    createdBy: 'user-1',
    createdAt: '2023-04-10T09:30:00Z',
    updatedAt: '2023-04-10T09:30:00Z',
    comments: [],
  },
  {
    id: 'ticket-2',
    subject: 'Request for new monitor',
    description: 'My current monitor has dead pixels. I would like to request a replacement.',
    priority: 'medium',
    status: 'in-progress',
    department: 'IT',
    createdBy: 'user-2',
    assignedTo: 'admin-1',
    createdAt: '2023-04-08T14:20:00Z',
    updatedAt: '2023-04-09T10:15:00Z',
    comments: [
      {
        id: 'comment-1',
        ticketId: 'ticket-2',
        userId: 'admin-1',
        userName: 'Admin User',
        content: 'We have ordered a new monitor. It should arrive by Wednesday.',
        isInternal: false,
        createdAt: '2023-04-09T10:15:00Z',
      },
    ],
  },
  {
    id: 'ticket-3',
    subject: 'Software installation request',
    description: 'I need Adobe Photoshop installed on my workstation for a new project.',
    priority: 'low',
    status: 'resolved',
    department: 'IT',
    createdBy: 'user-1',
    assignedTo: 'admin-1',
    createdAt: '2023-04-05T11:45:00Z',
    updatedAt: '2023-04-07T16:30:00Z',
    comments: [
      {
        id: 'comment-2',
        ticketId: 'ticket-3',
        userId: 'admin-1',
        userName: 'Admin User',
        content: 'Software has been installed. Please test and confirm it works correctly.',
        isInternal: false,
        createdAt: '2023-04-07T16:30:00Z',
      },
    ],
  },
  {
    id: 'ticket-4',
    subject: 'Printer not working',
    description: 'The printer on the 2nd floor is showing an error message and won\'t print documents.',
    priority: 'high',
    status: 'closed',
    department: 'IT',
    createdBy: 'user-2',
    assignedTo: 'admin-1',
    createdAt: '2023-04-01T08:50:00Z',
    updatedAt: '2023-04-03T14:10:00Z',
    comments: [
      {
        id: 'comment-3',
        ticketId: 'ticket-4',
        userId: 'admin-1',
        userName: 'Admin User',
        content: 'Printer has been fixed. It needed a new toner cartridge.',
        isInternal: false,
        createdAt: '2023-04-02T11:20:00Z',
      },
      {
        id: 'comment-4',
        ticketId: 'ticket-4',
        userId: 'user-2',
        userName: 'Jane Smith',
        content: 'Thank you! It\'s working now.',
        isInternal: false,
        createdAt: '2023-04-03T14:10:00Z',
      },
    ],
  },
  {
    id: 'ticket-5',
    subject: 'VPN connection issues',
    description: 'I cannot connect to the company VPN from my home office. The connection keeps timing out.',
    priority: 'medium',
    status: 'open',
    department: 'IT',
    createdBy: 'user-1',
    createdAt: '2023-04-12T15:20:00Z',
    updatedAt: '2023-04-12T15:20:00Z',
    comments: [],
  },
];
