import { Clock, Loader2Icon, User } from "lucide-react";
import { CardContent, Card } from "../ui/card";
import type Checkout from "../../models/Checkout";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import DeleteCheckout from "./DeleteCheckout";
import useDeleteCheckout from "../../hooks/checkout/useDeleteCheckout";
import useUpdateCheckout from "../../hooks/checkout/useUpdateCheckout";

interface props {
  checkout: Checkout;
}

const CheckoutCard = ({ checkout }: props) => {
  const { mutate: renewCheckout, isPending: isPendingRenewal } =
    useUpdateCheckout();

  const getDaysRemainingColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) return "text-red-600 dark:text-red-400";
    if (daysRemaining <= 3) return "text-orange-600 dark:text-orange-400";
    if (daysRemaining <= 7) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const getDaysRemaining = (checkout: Checkout) => {
    const now = new Date();
    const returnDate = checkout.return_date
      ? new Date(checkout.return_date)
      : null;
    const daysRemaining = returnDate
      ? Math.ceil(
          (returnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    return daysRemaining;
  };

  const [daysRemaining] = useState(() => getDaysRemaining(checkout));
  const { mutate, isPending } = useDeleteCheckout();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          {/* Book Image */}
          <div className="flex-shrink-0">
            <img
              src={checkout.book.book_img || "/placeholder.svg"}
              alt={`Cover of ${checkout.book.title}`}
              className="w-16 h-20 object-cover rounded"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                  {checkout.book.title}
                </h3>
                <p className="text-xs text-gray-600">
                  by {checkout.book.author}
                </p>
              </div>
              <Badge
                variant={!(daysRemaining <= 0) ? "default" : "destructive"}
              >
                {!(daysRemaining <= 0) ? "Active" : "Overdue"}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-xs text-gray-600">
                <User className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{checkout.user.name}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="truncate">{checkout.user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dates and Status */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Checked out:</span>
            <span>{new Date(checkout.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Due date:</span>
            <span>{new Date(checkout.return_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <div>
              {(() => {
                return (
                  <div
                    className={`text-xs ${getDaysRemainingColor(
                      daysRemaining
                    )}`}
                  >
                    {daysRemaining <= 0
                      ? `${Math.abs(daysRemaining)} days overdue`
                      : `${daysRemaining} days left`}
                  </div>
                );
              })()}
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Renewals:</span>
            <span>{checkout.renewal_number}/3</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
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
      </CardContent>
    </Card>
  );
};

export default CheckoutCard;
