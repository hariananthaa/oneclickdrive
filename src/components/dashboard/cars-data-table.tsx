"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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

interface Car {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  dailyRate: number;
  monthlyRate: number;
  location: string;
  imageUrl: string;
  isPremium: boolean;
  availableForRent: boolean;
  status: string;
  createdAt: string;
}

interface CarsResponse {
  cars: Car[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function CarsDataTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<CarsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const searchQuery = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";

  // Local state for input (for debouncing)
  const [searchInput, setSearchInput] = useState(searchQuery);

  const [debounceSearch, setDebounceSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Function to create query string while preserving existing params
  const createQueryString = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      });

      return params.toString();
    },
    [searchParams]
  );

  // Update URL when debounced search changes
  useEffect(() => {
    if (debounceSearch !== searchQuery) {
      const queryString = createQueryString({
        search: debounceSearch,
        page: 1, // Reset to first page when searching
      });
      router.push(pathname + (queryString ? "?" + queryString : ""));
    }
  }, [debounceSearch, searchQuery, createQueryString, router, pathname]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(debounceSearch && { search: debounceSearch }),
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
  }, [currentPage, pageSize, debounceSearch, statusFilter]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

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

  // URL update functions
  const updatePageSize = (newPageSize: string) => {
    const queryString = createQueryString({
      limit: newPageSize,
      page: 1, // Reset to first page when changing page size
    });
    router.push(pathname + (queryString ? "?" + queryString : ""));
  };

  const updateStatusFilter = (newStatus: string) => {
    const queryString = createQueryString({
      status: newStatus,
      page: 1, // Reset to first page when changing filter
    });
    router.push(pathname + (queryString ? "?" + queryString : ""));
  };

  const updatePage = (newPage: number) => {
    const queryString = createQueryString({
      page: newPage,
    });
    router.push(pathname + (queryString ? "?" + queryString : ""));
  };

  const resetFilters = () => {
    setSearchInput("");
    router.push(pathname);
  };

  const handleRefresh = () => {
    fetchCars();
  };

  // Pagination handlers
  const goToFirstPage = () => updatePage(1);
  const goToPreviousPage = () => updatePage(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    updatePage(Math.min(data?.pagination.totalPages || 1, currentPage + 1));
  const goToLastPage = () => updatePage(data?.pagination.totalPages || 1);

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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          <Select value={statusFilter} onValueChange={updateStatusFilter}>
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

          <Button variant="outline" onClick={resetFilters} disabled={loading}>
            Reset
          </Button>
        </div>

        <div className="flex justify-between items-center gap-4 w-full md:w-max">
          <Select value={pageSize.toString()} onValueChange={updatePageSize}>
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
                              "/placeholder.svg?height=48&width=64"
                            }
                            alt={car.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{car.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {car.brand} {car.model}
                        </div>
                      </TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{car.category}</Badge>
                      </TableCell>
                      <TableCell>{formatPrice(car.dailyRate)}</TableCell>
                      <TableCell>{formatPrice(car.monthlyRate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {car.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(car.status)}>
                          {car.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {car.isPremium && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            car.availableForRent ? "default" : "secondary"
                          }
                        >
                          {car.availableForRent ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(car.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
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
    </div>
  );
}
