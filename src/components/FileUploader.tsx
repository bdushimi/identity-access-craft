
import { useState } from "react";
import { Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface FileUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export function FileUploader({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    // Check if adding these files would exceed the max file limit
    if (value.length + files.length > maxFiles) {
      toast({
        title: "File limit exceeded",
        description: `You can only upload a maximum of ${maxFiles} files.`,
        variant: "destructive",
      });
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum file size of ${maxSize / (1024 * 1024)}MB.`,
          variant: "destructive",
        });
        return false;
      }

      // Check file type
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!acceptedTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an accepted file type.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      onChange([...value, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center",
          isDragging ? "border-primary bg-primary/10" : "border-input",
          "transition-colors"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-center text-muted-foreground mb-1">
          Drag and drop files here or click to browse
        </p>
        <p className="text-xs text-center text-muted-foreground">
          Accepted files: {acceptedTypes.join(", ")} (Max {maxFiles} files, {maxSize / (1024 * 1024)}MB each)
        </p>
        <input 
          type="file" 
          className="hidden" 
          id="file-upload" 
          multiple 
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => document.getElementById("file-upload")?.click()}
          className="mt-4"
        >
          <Upload className="mr-2 h-4 w-4" /> Select Files
        </Button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files ({value.length}/{maxFiles})</p>
          <div className="space-y-2">
            {value.map((file, index) => (
              <div 
                key={index}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2 text-primary" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
