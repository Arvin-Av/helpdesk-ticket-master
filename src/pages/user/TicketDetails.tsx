
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, Paperclip, Send, User } from 'lucide-react';

const TicketDetails = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  
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
      return ticketService.addComment(ticketId, user.id, newComment.trim(), false);
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
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate();
    }
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
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">Department: {ticket.department}</Badge>
                  <PriorityBadge priority={ticket.priority} />
                  <Badge variant="outline">
                    Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </Badge>
                </div>
                
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
                  <h3 className="font-medium">Comments</h3>
                  {ticket.comments && ticket.comments.length > 0 ? (
                    <div className="space-y-4">
                      {ticket.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {comment.userName.split(' ').map(part => part[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                {comment.userName}
                              </p>
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
                  
                  <div className="pt-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
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
                  <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                  <div className="flex items-center mt-1">
                    {ticket.assignedTo ? (
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">IT Support Team</span>
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

export default TicketDetails;
