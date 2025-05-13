
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, FileText, Upload } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "@/hooks/use-toast";

// Leave type definitions
const leaveTypes = [
  { id: "annual", name: "Annual Leave", reasonRequired: false, documentsRequired: false },
  { id: "sick", name: "Sick Leave", reasonRequired: true, documentsRequired: true },
  { id: "personal", name: "Personal Leave", reasonRequired: true, documentsRequired: false },
  { id: "bereavement", name: "Bereavement Leave", reasonRequired: true, documentsRequired: true },
  { id: "unpaid", name: "Unpaid Leave", reasonRequired: true, documentsRequired: false },
];

// Form schema for validation
const formSchema = z.object({
  leaveType: z.string({
    required_error: "Please select a leave type",
  }),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }).refine((endDate, ctx) => {
    if (ctx.parent.startDate && endDate < ctx.parent.startDate) {
      return false;
    }
    return true;
  }, {
    message: "End date cannot be earlier than start date",
  }),
  reason: z.string().optional(),
  documents: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LeaveRequestPage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null);

  // Find the current leave type details
  const currentLeaveType = leaveTypes.find(type => type.id === selectedLeaveType);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveType: "",
      reason: "",
      documents: [],
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log("Leave request submitted:", data);
    
    // Calculate the number of days
    const startDate = data.startDate;
    const endDate = data.endDate;
    const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Show success toast
    toast({
      title: "Leave Request Submitted",
      description: `Your ${diffInDays} day leave request has been submitted successfully!`,
    });

    // Add a notification
    addNotification(
      "Leave Request Submitted", 
      `Your ${data.leaveType} leave request from ${format(data.startDate, "PP")} to ${format(data.endDate, "PP")} has been submitted for approval.`
    );

    // Navigate back to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  // Handle leave type change
  const handleLeaveTypeChange = (value: string) => {
    setSelectedLeaveType(value);
    form.setValue("leaveType", value);
    
    // Reset reason if not required for this leave type
    const leaveType = leaveTypes.find(type => type.id === value);
    if (!leaveType?.reasonRequired) {
      form.setValue("reason", "");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Request Leave</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Leave Type */}
            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select onValueChange={handleLeaveTypeChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of leave you want to request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.getValues("startDate");
                          return (
                            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                            (startDate && date < startDate)
                          );
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reason - Only shown if required for the selected leave type */}
            {currentLeaveType?.reasonRequired && (
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Leave</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide details about your leave request"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {currentLeaveType?.id === "sick" ? 
                        "Please explain your medical reason for taking leave." : 
                        "Please provide a reason for your leave request."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Document Upload - Only shown if required for the selected leave type */}
            {currentLeaveType?.documentsRequired && (
              <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supporting Documents</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value || []}
                        onChange={(files) => field.onChange(files)}
                        maxFiles={3}
                        maxSize={5 * 1024 * 1024} // 5MB
                        acceptedTypes={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                      />
                    </FormControl>
                    <FormDescription>
                      {currentLeaveType?.id === "sick" ? 
                        "Upload your medical certificate or supporting documents." : 
                        "Upload any supporting documents for your leave request."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Leave Request</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
