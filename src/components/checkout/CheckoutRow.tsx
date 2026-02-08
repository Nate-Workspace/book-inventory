import {
  BookOpen,
  Calendar,
  Clock,
  Loader2Icon,
  Mail,
  Phone,
  User,
} from "lucide-react";
import DeleteCheckout from "../../components/BooksPage/DeleteCheckout";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { TableCell, TableRow } from "../../components/ui/table";
import useDeleteCheckout from "../../hooks/checkout/useDeleteCheckout";
import useUpdateCheckout from "../../hooks/checkout/useUpdateCheckout";
import type Checkout from "../../models/Checkout";

const CheckoutRow = ({
  checkout,
  daysRemaining,
}: {
  daysRemaining: number;
  checkout: Checkout;
}) => {
  const { mutate, isPending } = useDeleteCheckout();
  const { mutate: renewCheckout, isPending: isPendingRenewal } =
    useUpdateCheckout();

  const getDaysRemainingColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) return "text-red-600 dark:text-red-400";
    if (daysRemaining <= 3) return "text-orange-600 dark:text-orange-400";
    if (daysRemaining <= 7) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  return (
    <TableRow key={checkout.id}>
      <TableCell>
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium truncate">{checkout.user.name}</div>
            <div className="text-sm flex items-center gap-2 text-gray-500 truncate ">
              <Mail size={15} />
              {checkout.user.email}
            </div>
            <div className="text-sm flex items-center gap-2 text-gray-500 truncate">
              <Phone size={15} />
              {checkout.user.phone}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="font-medium truncate">{checkout.book.title}</div>
            <div className="text-sm text-gray-500 truncate">
              {checkout.book.author}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          {new Date(checkout.created_at).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <div>
            {(() => {
              return (
                <div
                  className={`text-xs ${getDaysRemainingColor(daysRemaining)}`}
                >
                  {daysRemaining <= 0
                    ? `${Math.abs(daysRemaining)} days overdue`
                    : `${daysRemaining} days left`}
                </div>
              );
            })()}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={!(daysRemaining <= 0) ? "default" : "destructive"}>
          {!(daysRemaining <= 0) ? "Active" : "Overdue"}
        </Badge>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <span className="text-sm text-gray-600">
          {checkout.renewal_number}/3
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {
            <>
              <Button
                onClick={() => {
                  mutate({ id: checkout.id });
                }}
                variant="outline"
                disabled={isPending}
                size="sm"
                asChild
              >
                <DeleteCheckout isOnMenu checkout={checkout} />
              </Button>
              {checkout.renewal_number < 3 ? (
                <Button
                  onClick={() => {
                    renewCheckout({ id: checkout.id });
                  }}
                  variant="ghost"
                  size="sm"
                  disabled={isPendingRenewal}
                >
                  {isPendingRenewal ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Renew"
                  )}
                </Button>
              ) : (
                <span className="text-sm text-gray-500">Completed</span>
              )}
            </>
          }
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CheckoutRow;
