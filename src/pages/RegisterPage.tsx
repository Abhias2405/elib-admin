import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/http/api';
import useTokenStore from '@/store';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const setToken = useTokenStore((state) => state.setToken);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const mutation = useMutation({
        mutationFn: register,
        onSuccess: (response) => {
            setToken(response.data.accessToken);
            navigate('/dashboard/home');
        },
        onError: (error: any) => {
            if (error.response?.status === 400) {
                if (error.response.data.message.includes('already exists')) {
                    setErrorMessage('An account with this email already exists');
                } else {
                    setErrorMessage(error.response.data.message || 'Please check your input');
                }
            } else {
                setErrorMessage('Something went wrong. Please try again later.');
            }
        }
    });

    const handleRegisterSubmit = () => {
        const name = nameRef.current?.value;
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        // Reset error message on new submission
        setErrorMessage('');

        // Client-side validation
        if (!name || !email || !password) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long');
            return;
        }

        mutation.mutate({ name, email, password });
    };

    return (
        <section className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Create Account</CardTitle>
                    <CardDescription>
                        Enter your details to create a new account.
                        {errorMessage && (
                            <p className="text-red-500 text-sm mt-2 font-medium">
                                {errorMessage}
                            </p>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            ref={nameRef}
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            ref={emailRef}
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            ref={passwordRef} 
                            id="password" 
                            type="password" 
                            required 
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full">
                        <Button
                            onClick={handleRegisterSubmit}
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Create Account</span>
                        </Button>

                        <div className="mt-4 text-center text-sm">
                            Already have an account?{' '}
                            <Link 
                                to={'/auth/login'} 
                                className="text-primary hover:underline"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </section>
    );
};

export default RegisterPage;