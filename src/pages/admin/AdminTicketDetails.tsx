import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService, userService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { TicketStatus } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, CheckCircle, Paperclip, Send, User } from 'lucide-react';

const AdminTicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  
  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketId ? ticketService.getTicketById(ticketId) : Promise.resolve(undefined),
    enabled: !!ticketId,
  });
  
  const addCommentMutation = useMutation({
    mutationFn: () => {
      if (!ticketId || !user?.id || !newComment.trim()) {
        throw new Error("Missing required information");
      }
      return ticketService.addComment(ticketId, user.id, newComment.trim(), isInternal);
    },
    onSuccess: () => {
      toast.success("Comment added successfully");
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
    onError: () => {
      toast.error("Failed to add comment");
    }
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: (status: TicketStatus) => {
      if (!ticketId) {
        throw new Error("Missing ticket ID");
      }
      return ticketService.updateTicketStatus(ticketId, status);
    },
    onSuccess: () => {
      toast.success("Ticket status updated");
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
    onError: () => {
      toast.error("Failed to update ticket status");
    }
  });
  
  const assignTicketMutation = useMutation({
    mutationFn: () => {
      if (!ticketId || !user?.id) {
        throw new Error("Missing required information");
      }
      return ticketService.assignTicket(ticketId, user.id);
    },
    onSuccess: () => {
      toast.success("Ticket assigned to you");
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
    onError: () => {
      toast.error("Failed to assign ticket");
    }
  });
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate();
    }
  };
  
  const handleStatusChange = (status: TicketStatus) => {
    updateStatusMutation.mutate(status);
  };
  
  const handleAssignToMe = () => {
    assignTicketMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Loading ticket details...</p>
        </div>
      </Layout>
    );
  }
  
  if (!ticket) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h2 className="text-xl font-medium">Ticket not found</h2>
          <p className="text-muted-foreground mt-2">The ticket you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBackClick} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Ticket #{ticket.id.split('-')[1]}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                  <StatusBadge status={ticket.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
                </div>
                
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {ticket.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center p-2 border rounded">
                          <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <a 
                              href={attachment.filePath} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-blue-600 hover:underline"
                            >
                              {attachment.fileName}
                            </a>
                            <p className="text-xs text-gray-500">
                              {(attachment.fileSize / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Comments & Activity</h3>
                  
                  {ticket.comments && ticket.comments.length > 0 ? (
                    <div className="space-y-4">
                      {ticket.comments.map(comment => (
                        <div key={comment.id} className={`flex gap-3 ${comment.isInternal ? 'bg-amber-50 p-3 rounded-md' : ''}`}>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {comment.userName.split(' ').map(part => part[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">
                                  {comment.userName}
                                </p>
                                {comment.isInternal && (
                                  <span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                                    Internal Note
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet</p>
                  )}
                  
                  <div className="pt-4 space-y-3">
                    <Textarea
                      placeholder="Add a comment or internal note..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="internal-note"
                        checked={isInternal}
                        onCheckedChange={setIsInternal}
                      />
                      <Label htmlFor="internal-note">
                        Mark as internal note (only visible to staff)
                      </Label>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddComment} 
                        disabled={!newComment.trim() || addCommentMutation.isPending}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {addCommentMutation.isPending ? "Sending..." : "Send"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Ticket Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Update Status</h3>
                  <Select
                    value={ticket.status}
                    onValueChange={value => handleStatusChange(value as TicketStatus)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {!ticket.assignedTo && (
                  <div className="pt-2">
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={handleAssignToMe}
                      disabled={assignTicketMutation.isPending}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {assignTicketMutation.isPending ? "Assigning..." : "Assign to Me"}
                    </Button>
                  </div>
                )}
                
                {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleStatusChange('resolved')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 flex items-center">
                    <StatusBadge status={ticket.status} />
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <p className="mt-1 flex items-center">
                    <PriorityBadge priority={ticket.priority} />
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="text-sm mt-1">
                    {format(new Date(ticket.createdAt), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="text-sm mt-1">
                    {format(new Date(ticket.updatedAt), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p className="text-sm mt-1">{ticket.department}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted By</h3>
                  <div className="flex items-center mt-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {users.find(u => u.id === ticket.createdBy)?.name || 'Unknown User'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                  <div className="flex items-center mt-1">
                    {ticket.assignedTo ? (
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {users.find(u => u.id === ticket.assignedTo)?.name || 'IT Support'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not yet assigned</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Keep a reference to the users for display
const users = [
  { id: 'user-1', name: 'John Doe' },
  { id: 'user-2', name: 'Jane Smith' },
  { id: 'admin-1', name: 'Admin User' },
];

export default AdminTicketDetails;
