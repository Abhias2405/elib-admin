import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { updateBook, getBookById } from '@/http/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    genre: z.string().min(2, {
        message: 'Genre must be at least 2 characters.',
    }),
    writer: z.string().min(2, {
        message: 'Author must be at least 2 characters.',
    }),
    description: z.string().min(2, {
        message: 'Description must be at least 2 characters.',
    }),
    coverImage: z.instanceof(FileList).optional(),
    file: z.instanceof(FileList).optional(),
});

const UpdateBook = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: bookData, isLoading: isLoadingBook } = useQuery({
        queryKey: ['book', bookId],
        queryFn: () => getBookById(bookId!),
        enabled: !!bookId,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: bookData?.data?.title || '',
            genre: bookData?.data?.genre || '',
            writer: bookData?.data?.writer || '',
            description: bookData?.data?.description || '',
        },
        values: {
            title: bookData?.data?.title || '',
            genre: bookData?.data?.genre || '',
            writer: bookData?.data?.writer || '',
            description: bookData?.data?.description || '',
        },
    });

    const coverImageRef = form.register('coverImage');
    const fileRef = form.register('file');

    const mutation = useMutation({
        mutationFn: (formData: FormData) => updateBook(bookId!, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['book', bookId] });
            toast.success('Book updated successfully');
            navigate('/dashboard/books');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update book');
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const formdata = new FormData();
            formdata.append('title', values.title);
            formdata.append('genre', values.genre);
            formdata.append('writer', values.writer);
            formdata.append('description', values.description);
            
            if (values.coverImage?.[0]) {
                formdata.append('coverImage', values.coverImage[0]);
            }
            if (values.file?.[0]) {
                formdata.append('file', values.file[0]);
            }

            await mutation.mutateAsync(formdata);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    }

    if (isLoadingBook) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoaderCircle className="animate-spin h-8 w-8 text-muted-foreground" />
                <span className="ml-4 text-muted-foreground">Loading book details...</span>
            </div>
        );
    }

    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard/books">
                                <Button variant={'outline'}>Cancel</Button>
                            </Link>
                            <Button 
                                type="submit" 
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending && (
                                    <LoaderCircle className="animate-spin mr-2" />
                                )}
                                <span>
                                    {mutation.isPending ? 'Updating...' : 'Update Book'}
                                </span>
                            </Button>
                        </div>
                    </div>
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Edit book</CardTitle>
                            <CardDescription>
                                Update the book details below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="text" 
                                                    className="w-full" 
                                                    placeholder="Enter book title"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="genre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Genre</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="text" 
                                                    className="w-full" 
                                                    placeholder="Enter book genre"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="writer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="text" 
                                                    className="w-full" 
                                                    placeholder="Enter Author Name"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    className="min-h-32" 
                                                    placeholder="Enter book description"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Cover Image (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    className="w-full"
                                                    accept="image/*"
                                                    {...coverImageRef}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Book File (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    className="w-full"
                                                    accept=".pdf"
                                                    {...fileRef}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </section>
    );
};

export default UpdateBook;