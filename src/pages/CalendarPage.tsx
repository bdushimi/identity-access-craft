
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isEqual, isSameDay, isSameMonth, addMonths, getDaysInMonth, startOfMonth } from "date-fns";
import LogoutConfirmationDialog from "@/components/LogoutConfirmationDialog";

// Mock data for departments, teams, and leave types
const departments = ["Engineering", "HR", "Finance", "Marketing", "Operations"];
const teams = ["Frontend", "Backend", "DevOps", "QA", "Design", "HR Team", "Finance Team"];
const leaveTypes = ["Annual", "Sick", "Personal", "Public Holiday"];

// Mock data for team members
const teamMembers = [
  { id: 1, name: "John Doe", department: "Engineering", team: "Frontend" },
  { id: 2, name: "Jane Smith", department: "Engineering", team: "Backend" },
  { id: 3, name: "David Wilson", department: "HR", team: "HR Team" },
  { id: 4, name: "Sarah Johnson", department: "Finance", team: "Finance Team" },
  { id: 5, name: "Michael Brown", department: "Engineering", team: "DevOps" },
  { id: 6, name: "Emily Davis", department: "Marketing", team: "Design" },
];

// Mock data for leave records
const leaveRecords = [
  { 
    userId: 1, 
    startDate: new Date(2025, 5, 5), 
    endDate: new Date(2025, 5, 9), 
    type: "Annual", 
    status: "approved"
  },
  { 
    userId: 2, 
    startDate: new Date(2025, 5, 12), 
    endDate: new Date(2025, 5, 16), 
    type: "Annual", 
    status: "approved"
  },
  { 
    userId: 3, 
    startDate: new Date(2025, 5, 8), 
    endDate: new Date(2025, 5, 8), 
    type: "Sick", 
    status: "approved"
  },
  { 
    userId: 4, 
    startDate: new Date(2025, 5, 20), 
    endDate: new Date(2025, 5, 20), 
    type: "Personal", 
    status: "approved"
  },
  { 
    userId: 5, 
    startDate: new Date(2025, 5, 25), 
    endDate: new Date(2025, 5, 27), 
    type: "Annual", 
    status: "pending"
  },
];

// Rwandan public holidays for 2025 (example data)
const rwandanHolidays = [
  { date: new Date(2025, 0, 1), name: "New Year's Day" },
  { date: new Date(2025, 1, 1), name: "National Heroes' Day" },
  { date: new Date(2025, 3, 7), name: "Tutsi Genocide Memorial Day" },
  { date: new Date(2025, 4, 1), name: "Labor Day" },
  { date: new Date(2025, 6, 1), name: "Independence Day" },
  { date: new Date(2025, 6, 4), name: "Liberation Day" },
  { date: new Date(2025, 7, 15), name: "Assumption Day" },
  { date: new Date(2025, 11, 25), name: "Christmas Day" },
  { date: new Date(2025, 11, 26), name: "Boxing Day" },
];

const CalendarPage = () => {
  const { user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedTeam, setSelectedTeam] = useState<string>("All");
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("All");
  const [selectedPerson, setSelectedPerson] = useState<string>("All");
  const [filteredMembers, setFilteredMembers] = useState(teamMembers);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter team members based on department and team selection
  useEffect(() => {
    let filtered = teamMembers;
    
    if (selectedDepartment !== "All") {
      filtered = filtered.filter(member => member.department === selectedDepartment);
    }
    
    if (selectedTeam !== "All") {
      filtered = filtered.filter(member => member.team === selectedTeam);
    }
    
    setFilteredMembers(filtered);
    
    // Reset person selection if the selected person is not in filtered results
    const personExists = filtered.some(member => member.name === selectedPerson);
    if (!personExists && selectedPerson !== "All") {
      setSelectedPerson("All");
    }
  }, [selectedDepartment, selectedTeam, selectedPerson]);

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };
  
  // Function to check if a date has any leave records
  const getLeaveRecordsForDate = (date: Date) => {
    return leaveRecords.filter(record => {
      const recordStartDate = new Date(record.startDate);
      const recordEndDate = new Date(record.endDate);
      
      // Check if the date is within the leave period
      return (
        date >= recordStartDate && 
        date <= recordEndDate && 
        (selectedLeaveType === "All" || record.type === selectedLeaveType) &&
        (selectedPerson === "All" || 
          teamMembers.find(member => member.id === record.userId)?.name === selectedPerson)
      );
    });
  };
  
  // Function to check if a date is a public holiday
  const getHolidayForDate = (date: Date) => {
    return rwandanHolidays.find(holiday => isSameDay(holiday.date, date));
  };
  
  // Function to generate the calendar day class
  const getDayClass = (date: Date) => {
    const leaveRecords = getLeaveRecordsForDate(date);
    const isHoliday = getHolidayForDate(date);
    
    if (isHoliday && (selectedLeaveType === "All" || selectedLeaveType === "Public Holiday")) {
      return "bg-red-100 text-red-800";
    } else if (leaveRecords.length > 0) {
      if (leaveRecords.some(record => record.type === "Annual")) {
        return "bg-blue-100 text-blue-800";
      } else if (leaveRecords.some(record => record.type === "Sick")) {
        return "bg-yellow-100 text-yellow-800";
      } else if (leaveRecords.some(record => record.type === "Personal")) {
        return "bg-purple-100 text-purple-800";
      }
    }
    
    return "";
  };

  // Function to generate the calendar view
  const renderCalendarContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border shadow"
          classNames={{
            day_today: "bg-slate-100",
            day: (props) => {
              const dayDate = props.date;
              return getDayClass(dayDate);
            }
          }}
          components={{
            DayContent: (props) => {
              const dayDate = props.date;
              const leaveRecords = getLeaveRecordsForDate(dayDate);
              const holiday = getHolidayForDate(dayDate);
              
              return (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="w-full h-full flex items-center justify-center">
                      {props.date.getDate()}
                      {leaveRecords.length > 0 && <span className="ml-1 w-1 h-1 bg-blue-500 rounded-full"></span>}
                      {holiday && <span className="ml-1 w-1 h-1 bg-red-500 rounded-full"></span>}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 text-sm">
                    <div className="font-semibold">{format(dayDate, "EEEE, MMMM do, yyyy")}</div>
                    {holiday && (
                      <div className="mt-2">
                        <Badge className="bg-red-100 text-red-800">Public Holiday</Badge>
                        <div className="mt-1">{holiday.name}</div>
                      </div>
                    )}
                    {leaveRecords.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <div className="font-medium">Team Members on Leave:</div>
                        {leaveRecords.map((record, idx) => {
                          const member = teamMembers.find(m => m.id === record.userId);
                          return (
                            <div key={idx} className="flex items-center justify-between">
                              <span>{member?.name}</span>
                              <Badge 
                                className={
                                  record.type === "Annual" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : record.type === "Sick" 
                                      ? "bg-yellow-100 text-yellow-800" 
                                      : "bg-purple-100 text-purple-800"
                                }
                              >
                                {record.type}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {!holiday && leaveRecords.length === 0 && (
                      <div className="text-muted-foreground">No leave or holidays</div>
                    )}
                  </HoverCardContent>
                </HoverCard>
              );
            }
          }}
        />

        <div className="mt-4">
          <h3 className="font-medium mb-2">Legend:</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100"></div>
              <span className="text-sm">Annual Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100"></div>
              <span className="text-sm">Sick Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-100"></div>
              <span className="text-sm">Personal Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100"></div>
              <span className="text-sm">Public Holiday</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Leave Calendar</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            Sign out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Team Leave Calendar
            </CardTitle>
            <CardDescription>
              View your team's leave schedule and Rwandan public holidays
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium">Department</label>
                  <Select 
                    value={selectedDepartment} 
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium">Team</label>
                  <Select 
                    value={selectedTeam} 
                    onValueChange={setSelectedTeam}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Teams</SelectItem>
                      {teams
                        .filter(team => 
                          selectedDepartment === "All" || 
                          teamMembers.some(member => 
                            member.department === selectedDepartment && 
                            member.team === team
                          )
                        )
                        .map((team) => (
                          <SelectItem key={team} value={team}>{team}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium">Leave Type</label>
                  <Select 
                    value={selectedLeaveType} 
                    onValueChange={setSelectedLeaveType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium">Team Member</label>
                  <Select 
                    value={selectedPerson} 
                    onValueChange={setSelectedPerson}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Members</SelectItem>
                      {filteredMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="month" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="month">Month View</TabsTrigger>
                  <TabsTrigger value="list" disabled>List View</TabsTrigger>
                </TabsList>
                <TabsContent value="month" className="space-y-4">
                  {renderCalendarContent()}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <LogoutConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default CalendarPage;
