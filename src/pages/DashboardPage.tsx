import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LogoutConfirmationDialog from "@/components/LogoutConfirmationDialog";
import NotificationBell from "@/components/NotificationBell";
import NotificationDemo from "@/components/NotificationDemo";
import { 
  LogOut, 
  UserRound, 
  CalendarCheck, 
  CalendarX, 
  Clock, 
  Plus, 
  Package,
  ArrowRight,
  Calendar
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

// Mock data (would be replaced by actual API calls in production)
const leaveBalance = [
  { type: "Annual", total: 25, used: 10, remaining: 15 },
  { type: "Sick", total: 12, used: 3, remaining: 9 },
  { type: "Personal", total: 5, used: 1, remaining: 4 }
];

const recentRequests = [
  { id: 1, type: "Annual", startDate: "2025-06-01", endDate: "2025-06-05", status: "approved", days: 5 },
  { id: 2, type: "Sick", startDate: "2025-05-20", endDate: "2025-05-21", status: "approved", days: 2 },
  { id: 3, type: "Personal", startDate: "2025-05-28", endDate: "2025-05-28", status: "rejected", days: 1 },
  { id: 4, type: "Annual", startDate: "2025-06-15", endDate: "2025-06-16", status: "pending", days: 2 },
  { id: 5, type: "Sick", startDate: "2025-06-10", endDate: "2025-06-10", status: "pending", days: 1 }
];

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  const handleRequestLeave = () => {
    toast({
      title: "Request Leave",
      description: "Leave request feature is coming soon!",
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const defaultProfilePicture = (
    <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center">
      <UserRound className="h-12 w-12 text-slate-400" />
    </div>
  );

  // Calculate summary statistics
  const pendingCount = recentRequests.filter(req => req.status === "pending").length;
  const approvedCount = recentRequests.filter(req => req.status === "approved").length;
  const rejectedCount = recentRequests.filter(req => req.status === "rejected").length;

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2 items-center">
            <NotificationBell />
            <Link to="/calendar">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                View Calendar
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="col-span-1 md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle>Welcome back, {user?.name}</CardTitle>
              <CardDescription className="flex justify-between items-center">
                <span>Here's an overview of your leave information</span>
                <NotificationDemo />
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Leave Summary Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Leave Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {leaveBalance.reduce((acc, curr) => acc + curr.remaining, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total days remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingCount}</div>
              <p className="text-sm text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CalendarCheck className="h-5 w-5 mr-2" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{approvedCount}</div>
              <p className="text-sm text-muted-foreground">Leave requests approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CalendarX className="h-5 w-5 mr-2" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rejectedCount}</div>
              <p className="text-sm text-muted-foreground">Leave requests denied</p>
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                defaultProfilePicture
              )}
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-slate-500">{user?.email}</p>
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                  {user?.authProvider === 'azuread' ? 'Microsoft Account' : 'Local Account'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Balance Details */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Leave Balance Details</CardTitle>
              <CardDescription>Breakdown by leave type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveBalance.map((leave, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{leave.type} Leave</p>
                      <p className="text-sm text-muted-foreground">
                        Used: {leave.used} of {leave.total}
                      </p>
                    </div>
                    <div>
                      <span className="text-xl font-bold">{leave.remaining}</span>
                      <span className="text-sm text-muted-foreground ml-1">days left</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button onClick={handleRequestLeave} className="w-full flex gap-2">
                <Plus className="h-4 w-4" />
                Request Leave
              </Button>
            </CardFooter>
          </Card>

          {/* Recent Leave Requests */}
          <Card className="col-span-1 md:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Leave Requests</CardTitle>
                <CardDescription>Your 5 most recent leave requests</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.type}</TableCell>
                      <TableCell>{request.startDate}</TableCell>
                      <TableCell>{request.endDate}</TableCell>
                      <TableCell>{request.days}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <LogoutConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default DashboardPage;
