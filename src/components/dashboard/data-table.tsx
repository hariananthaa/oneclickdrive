"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RefreshCw,
  Edit,
  Star,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import type { Car } from "@/lib/database";
import { EditCarDialog } from "@/components/dashboard/edit-car-dialog";
import { useCallback, useEffect, useState } from "react";

interface CarsResponse {
  cars: Car[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function CarsTable() {
  const [data, setData] = useState<CarsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Debounced search to avoid frequent rendering and triggering
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/cars?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CarsResponse = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Reseting while filter change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, statusFilter, currentPage]);

  const formatPrice = (price: number | string) => {
    const numPrice =
      typeof price === "string" ? Number.parseFloat(price) : price;
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(numPrice || 0);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleEditClick = (car: Car) => {
    setSelectedCar(car);
    setEditDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchCars();
  };

  const handleEditSuccess = () => {
    fetchCars();
  };

  // Pagination handling
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () =>
    setCurrentPage((prev) =>
      data ? Math.min(data.pagination.totalPages, prev + 1) : prev
    );
  const goToLastPage = () => setCurrentPage(data?.pagination.totalPages || 1);

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between items-center gap-4 w-full md:w-max">
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 rows</SelectItem>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="20">20 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 w-full h-full items-center justify-center">
          <div className="flex flex-col justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading cars...
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 rounded-md border">
          <div className="h-full overflow-auto relative">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead className="min-w-[200px]">Car Details</TableHead>
                  <TableHead className="w-20">Year</TableHead>
                  <TableHead className="w-24">Category</TableHead>
                  <TableHead className="w-32">Daily Rate</TableHead>
                  <TableHead className="w-36">Monthly Rate</TableHead>
                  <TableHead className="w-36">Location</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-20">Premium</TableHead>
                  <TableHead className="w-24">Available</TableHead>
                  <TableHead className="w-32">Created Date</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.cars.length ? (
                  data.cars.map((car) => (
                    <TableRow key={car.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="relative h-12 w-16 overflow-hidden rounded-md">
                          <Image
                            src={
                              car.imageUrl ||
                              "/images/sample_car.svg?height=48&width=64"
                            }
                            alt={car.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm leading-tight">
                            {car.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {car.brand} | {car.model}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{car.year}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{car.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-orange-600">
                        {formatPrice(car.dailyRate)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(car.monthlyRate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm max-w-[140px]">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{car.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(car.status)}>
                          {car.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {car.isPremium ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-current mx-auto" />
                        ) : (
                          <div className="h-4 w-4 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            car.availableForRent ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {car.availableForRent ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(car.createdAt || "").toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(car)}
                            className="h-8 w-8 p-0 hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit car</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center">
                      No cars found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
        <div className="text-sm text-muted-foreground">
          {data && (
            <>
              Showing {(data.pagination.page - 1) * data.pagination.limit + 1}{" "}
              to{" "}
              {Math.min(
                data.pagination.page * data.pagination.limit,
                data.pagination.total
              )}{" "}
              of {data.pagination.total} results
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={loading || !data || currentPage <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={loading || !data || currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm">
              {data
                ? `Page ${data.pagination.page} of ${data.pagination.totalPages}`
                : "Page 0 of 0"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={
              loading || !data || currentPage >= data.pagination.totalPages
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={
              loading || !data || currentPage >= data.pagination.totalPages
            }
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EditCarDialog
        car={selectedCar}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
