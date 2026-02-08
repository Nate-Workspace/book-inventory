import { FolderCheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import useDeleteCheckout from "../../hooks/checkout/useDeleteCheckout";
import type Checkout from "../../models/Checkout";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

const DeleteCheckout = ({ checkout, isOnMenu }: { isOnMenu?: boolean; checkout: Checkout }) => {
  const { mutate: DeleteCheckout, isPending } = useDeleteCheckout();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          size="sm"
          title="Delete checkout"
          className={`${isOnMenu ? "flex items-center justify-start -pl-2" : ""}`}
        >
          <FolderCheckIcon className={`${isOnMenu ? "h-4 w-4 dark:text-white/70 text-black/40" : "h-4 w-4"}`} />
          {isOnMenu && "Return"}
        </Button>
      </DialogTrigger>
      <DialogContent className="font-[poppins]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this checkout data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            onClick={() => {
              setOpen(false);
            }}
            asChild
          >
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={() => {
              DeleteCheckout(
                { id: checkout.id },
                {
                  onSettled: () => {
                    setOpen(false);
                  },
                }
              );
            }}
          >
            {isPending ? <Loader2Icon className="animate-spin" /> : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCheckout;
