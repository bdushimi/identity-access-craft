
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import LogoutConfirmationDialog from "@/components/LogoutConfirmationDialog";
import { LogOut, UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  const defaultProfilePicture = (
    <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center">
      <UserRound className="h-12 w-12 text-slate-400" />
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
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

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                What you can do in your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This is a sample dashboard page after successful authentication.
                In a real application, you would see your personalized content and
                functionality here.
              </p>
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>View and edit your profile</li>
                <li>Access your personalized dashboard</li>
                <li>Manage your account settings</li>
                <li>View your recent activity</li>
              </ul>
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
