
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

// Demo accounts for easy access
const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@example.com',
    password: 'password'
  },
  user: {
    email: 'john@example.com',
    password: 'password'
  }
};

const Login = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsProcessing(true);
      await login(data.email, data.password);
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Check if this is one of our demo accounts
      if (
        (data.email === DEMO_ACCOUNTS.admin.email || data.email === DEMO_ACCOUNTS.user.email) && 
        data.password === 'password'
      ) {
        // For demo accounts, we'll provide a more helpful message
        toast.error("The demo account exists but could not be authenticated. Please check the Supabase users settings.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const loginAsDemoUser = async (type: 'admin' | 'user') => {
    const account = DEMO_ACCOUNTS[type];
    form.setValue('email', account.email);
    form.setValue('password', account.password);
    
    try {
      setIsProcessing(true);
      await login(account.email, account.password);
      toast.success(`Successfully logged in as ${type}`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Failed to log in as demo ${type}. This account may need to be created in Supabase.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 text-white p-1 rounded mr-2">
          <Ticket size={24} />
        </div>
        <h1 className="text-2xl font-bold">HelpDesk</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your credentials to access the helpdesk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">Quick Access</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => loginAsDemoUser('user')}
                disabled={isProcessing}
              >
                Login as User
              </Button>
              <Button 
                variant="outline" 
                onClick={() => loginAsDemoUser('admin')}
                disabled={isProcessing}
              >
                Login as Admin
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Demo Accounts:</p>
        <p>User: john@example.com (password: password)</p>
        <p>Admin: admin@example.com (password: password)</p>
      </div>
    </div>
  );
};

export default Login;
