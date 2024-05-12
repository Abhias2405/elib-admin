import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteBook } from "@/http/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteBookDialogProps {
    bookId: string;
    bookTitle: string;
    trigger: React.ReactNode;
}

export function DeleteBookDialog({ bookId, bookTitle, trigger }: DeleteBookDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteBook(bookId);
            await queryClient.invalidateQueries({ queryKey: ['books'] });
            toast.success('Book deleted successfully');
            setIsOpen(false);
        } catch (error) {
            toast.error('Failed to delete book');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete "{bookTitle}"
                        and remove it from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={isDeleting ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}