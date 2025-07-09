"use client";
import { useActionState, useEffect } from "react";
import Image from "next/image";
import type { Car } from "@/lib/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { updateCar } from "@/lib/dashboard-actions";

interface EditCarDialogProps {
  car: Car | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditCarDialog({
  car,
  open,
  onOpenChange,
  onSuccess,
}: EditCarDialogProps) {
  const [state, action, isPending] = useActionState(updateCar, null);

  // Handle successful update
  useEffect(() => {
    if (state?.success && open) {
      if (onSuccess) {
        onSuccess();
        console.log("onSuccess callback called");
      }
      setTimeout(() => {
        console.log("Close dialog");
        onOpenChange(false);
      }, 1500);
    }
  }, [state?.success, open, onSuccess, onOpenChange]);

  if (!car) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Car Details</DialogTitle>
          <DialogDescription>
            Update the car information below. The car image cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-6">
          <input type="hidden" name="id" value={car.id} />

          {/* Car Image - Display Only */}
          <div className="space-y-2">
            <Label>Car Image</Label>
            <div className="relative h-32 w-48 overflow-hidden rounded-md border">
              <Image
                src={car.imageUrl || "/placeholder.svg?height=128&width=192"}
                alt={car.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={car.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                name="brand"
                defaultValue={car.brand}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                name="model"
                defaultValue={car.model}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                name="year"
                type="number"
                defaultValue={car.year}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={car.category}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                  <SelectItem value="Convertible">Convertible</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyRate">Daily Rate (AED) *</Label>
              <Input
                id="dailyRate"
                name="dailyRate"
                type="number"
                step="0.01"
                min="0"
                defaultValue={car.dailyRate}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRate">Monthly Rate (AED) *</Label>
              <Input
                id="monthlyRate"
                name="monthlyRate"
                type="number"
                step="0.01"
                min="0"
                defaultValue={car.monthlyRate}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                defaultValue={car.location}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={car.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Boolean Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPremium">Premium Car</Label>
                <p className="text-sm text-muted-foreground">
                  Mark this car as premium
                </p>
              </div>
              <Switch
                id="isPremium"
                name="isPremium"
                defaultChecked={car.isPremium}
                value={car.isPremium ? "true" : "false"}
                onCheckedChange={(checked) => {
                  const input = document.querySelector(
                    'input[name="isPremium"]'
                  ) as HTMLInputElement;
                  if (input) input.value = checked ? "true" : "false";
                }}
              />
              <input
                type="hidden"
                name="isPremium"
                value={car.isPremium ? "true" : "false"}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="availableForRent">Available for Rent</Label>
                <p className="text-sm text-muted-foreground">
                  Car is available for rental
                </p>
              </div>
              <Switch
                id="availableForRent"
                name="availableForRent"
                defaultChecked={car.availableForRent}
                value={car.availableForRent ? "true" : "false"}
                onCheckedChange={(checked) => {
                  const input = document.querySelector(
                    'input[name="availableForRent"]'
                  ) as HTMLInputElement;
                  if (input) input.value = checked ? "true" : "false";
                }}
              />
              <input
                type="hidden"
                name="availableForRent"
                value={car.availableForRent ? "true" : "false"}
              />
            </div>
          </div>

          {/* Status Messages */}
          {state?.message && (
            <div
              className={`p-3 rounded-md text-sm ${
                state.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {state.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
