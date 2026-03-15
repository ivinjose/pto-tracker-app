import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Placeholder for new train booking form. Wire up form fields when ready.
 */
export default function NewTrainBookingDialog({ children }) {
    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Train Booking</DialogTitle>
                </DialogHeader>
            </DialogContent>
            {children}
        </Dialog>
    );
}
