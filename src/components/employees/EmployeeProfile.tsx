import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { fetchCurrentUserEmployee } from './attendance/attendanceUtils';
import { getProjects } from '@/services/projectService';
import { startTimeTracking } from '@/services/timeTrackingService';
import { Employee } from './types';

const EmployeeProfileComponent = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [projects, setProjects] = useState([]);
  const [newTimeEntry, setNewTimeEntry] = useState({
    projectId: null,
    description: '',
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const loadEmployeeData = async () => {
      if (user?.email) {
        const employeeData = await fetchCurrentUserEmployee(user.email);
        setEmployee(employeeData);
      }
    };
    
    loadEmployeeData();
  }, [user]);
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      }
    };
    
    loadProjects();
  }, [toast]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTimeEntry(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const startNewTimeEntry = (employeeId, projectId, description) => {
    startTimeTracking({
      employee_id: String(employeeId),
      project_id: projectId,
      description: description,
    })
    .then(newEntry => {
      if (newEntry) {
        toast({
          title: "Success",
          description: "Time entry started successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to start time entry",
          variant: "destructive",
        });
      }
    })
    .catch(error => {
      console.error("Error starting time entry:", error);
      toast({
        title: "Error",
        description: "Failed to start time entry",
        variant: "destructive",
      });
    });
  };
  
  const handleStartTimeEntry = () => {
    if (!employee) return;
    
    const projectIdAsNumber = newTimeEntry.projectId !== null ? Number(newTimeEntry.projectId) : null;
    
    const newEntry = startNewTimeEntry(
      // Convert the employee ID to a number if needed and ensure it's not NaN
      Number(employee.id),
      projectIdAsNumber,
      newTimeEntry.description
    );
    
    setNewTimeEntry({
      projectId: null,
      description: '',
    });
  };
  
  if (!employee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading employee data...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={employee.name} readOnly />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={employee.email} readOnly />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" value={employee.position} readOnly />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={employee.department} readOnly />
          </div>
        </div>
        
        <div>
          <Label htmlFor="project">Start Time Entry</Label>
          <Select onValueChange={(value) => handleInputChange({ target: { name: 'projectId', value: value } })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={String(project.id)}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={newTimeEntry.description}
            onChange={handleInputChange}
            placeholder="Enter description"
          />
        </div>
        
        <Button onClick={handleStartTimeEntry}>Start Time Entry</Button>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileComponent;
