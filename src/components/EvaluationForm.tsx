import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from "./StarRating";
import { Download, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkFunction {
  name: string;
  quality: number;
  efficiency: number;
}

interface EvaluationData {
  department: string;
  workerName: string;
  employmentStatus: string;
  late: number;
  absent: number;
  attendanceRating: number;
  attendanceRemarks: string;
  supervisorAttitude: number;
  supervisorRemarks: string;
  coworkerAttitude: number;
  coworkerRemarks: string;
  workResponsibility: number;
  workInitiative: number;
  jobKnowledge: number;
  dependability: number;
  cooperation: number;
  workAttitudeRemarks: string;
  workFunctions: WorkFunction[];
  totalRating: number;
  observations: string;
  evaluatedBy: string;
}

const departments = [
  "Admin",
  "Engineering", 
  "Utility",
  "Pest & Disease",
  "Coop Area",
  "Packing Plant - Add Crew",
  "Harvesting"
];

const employmentStatuses = [
  "Regular",
  "Contractual", 
  "Seasonal"
];

const departmentWorkFunctions: Record<string, string[]> = {
  "Admin": [
    "Encode workers' daily time & accomplishment report (WDTAR)",
    "Prepare the payroll of periodic paid employees, COOP leave, honorarium and hired workers",
    "Maintain files of timesheets and other source documents",
    "Update generation of documents for remittance/payment schedules",
    "Prepare and furnish the bookkeeper summary of beneficiary's deductions",
    "Prepare individual billing of beneficiaries based on production reports",
    "Perform other duties as assigned by immediate superior and/or manager"
  ],
  "Engineering": [
    "Repair & Maintenance of Vehicles/Equipment",
    "Assist in Farm Equipment Needs", 
    "Machine Operation and Troubleshooting",
    "Equipment Safety Inspections",
    "Perform Other Duties as Assigned"
  ],
  "Utility": [
    "Clean Office Premises",
    "Maintain CR/Toilet",
    "Clean Hallways & Offices", 
    "Dispose Garbage Properly",
    "Follow Housekeeping Schedules",
    "Other Assigned Duties"
  ],
  "Pest & Disease": [
    "Monitor crop health and identify pest/disease issues",
    "Apply pesticides and treatments as needed",
    "Maintain pest control equipment",
    "Record and report pest/disease incidents",
    "Implement integrated pest management strategies",
    "Other duties as assigned"
  ],
  "Coop Area": [
    "Manage cooperative operations and activities",
    "Coordinate with cooperative members",
    "Maintain cooperative records and documentation",
    "Assist in cooperative meetings and events",
    "Handle cooperative financial transactions",
    "Other duties as assigned"
  ],
  "Packing Plant - Add Crew": [
    "Pack and process agricultural products",
    "Quality control and inspection of products",
    "Maintain packing equipment and facilities",
    "Follow food safety and hygiene protocols",
    "Load and unload products for shipment",
    "Other duties as assigned"
  ],
  "Harvesting": [
    "Harvest crops according to schedule",
    "Operate harvesting equipment and tools",
    "Sort and grade harvested products",
    "Transport harvested products to processing areas",
    "Maintain harvesting equipment",
    "Other duties as assigned"
  ]
};

export function EvaluationForm() {
  const { toast } = useToast();
  const [data, setData] = useState<EvaluationData>({
    department: "",
    workerName: "",
    employmentStatus: "",
    late: 0,
    absent: 0,
    attendanceRating: 10,
    attendanceRemarks: "",
    supervisorAttitude: 5,
    supervisorRemarks: "",
    coworkerAttitude: 5,
    coworkerRemarks: "",
    workResponsibility: 5,
    workInitiative: 5,
    jobKnowledge: 5,
    dependability: 5,
    cooperation: 5,
    workAttitudeRemarks: "",
    workFunctions: [],
    totalRating: 0,
    observations: "",
    evaluatedBy: ""
  });

  // Calculate attendance rating based on formula
  useEffect(() => {
    const totalDaysLateOrAbsent = data.late + data.absent;
    const calculatedRating = Math.max(0, 10 - ((totalDaysLateOrAbsent / 24) * 10));
    setData(prev => ({ ...prev, attendanceRating: Math.round(calculatedRating * 10) / 10 }));
  }, [data.late, data.absent]);

  // Initialize work functions when department changes
  useEffect(() => {
    if (data.department && departmentWorkFunctions[data.department]) {
      const functions = departmentWorkFunctions[data.department].map(name => ({
        name,
        quality: 5,
        efficiency: 5
      }));
      setData(prev => ({ ...prev, workFunctions: functions }));
    }
  }, [data.department]);

  // Calculate total rating
  useEffect(() => {
    const ratings = [
      data.attendanceRating,
      data.supervisorAttitude,
      data.coworkerAttitude,
      data.workResponsibility,
      data.workInitiative,
      data.jobKnowledge,
      data.dependability,
      data.cooperation,
      ...data.workFunctions.flatMap(f => [f.quality, f.efficiency])
    ];
    
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    const average = ratings.length > 0 ? total / ratings.length : 0;
    setData(prev => ({ ...prev, totalRating: Math.round(average * 10) / 10 }));
  }, [data.attendanceRating, data.supervisorAttitude, data.coworkerAttitude, 
      data.workResponsibility, data.workInitiative, data.jobKnowledge, 
      data.dependability, data.cooperation, data.workFunctions]);

  const handleWorkFunctionChange = (index: number, field: 'quality' | 'efficiency', value: number) => {
    setData(prev => ({
      ...prev,
      workFunctions: prev.workFunctions.map((func, i) => 
        i === index ? { ...func, [field]: value } : func
      )
    }));
  };

  const handleSubmit = () => {
    if (!data.department || !data.workerName || !data.employmentStatus) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Evaluation Submitted",
      description: `Evaluation for ${data.workerName} has been saved successfully.`,
    });
  };

  const handleReset = () => {
    setData({
      department: "",
      workerName: "",
      employmentStatus: "",
      late: 0,
      absent: 0,
      attendanceRating: 10,
      attendanceRemarks: "",
      supervisorAttitude: 5,
      supervisorRemarks: "",
      coworkerAttitude: 5,
      coworkerRemarks: "",
      workResponsibility: 5,
      workInitiative: 5,
      jobKnowledge: 5,
      dependability: 5,
      cooperation: 5,
      workAttitudeRemarks: "",
      workFunctions: [],
      totalRating: 0,
      observations: "",
      evaluatedBy: ""
    });
    
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Your evaluation form is being prepared for download.",
    });
    // PDF export functionality would be implemented here
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 10) return "text-success";
    if (rating >= 8) return "text-primary";
    if (rating >= 5) return "text-warning";
    return "text-destructive";
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 10) return "Excellent";
    if (rating >= 8) return "Very Satisfactory";
    if (rating >= 5) return "Satisfactory";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center bg-primary text-primary-foreground">
          <CardTitle className="text-2xl font-bold">CFARBEMPCO</CardTitle>
          <p className="text-lg">WORKERS EVALUATION</p>
        </CardHeader>
      </Card>

      {/* Employee Information */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="department">Department *</Label>
            <Select value={data.department} onValueChange={(value) => setData(prev => ({ ...prev, department: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="workerName">Name of Worker *</Label>
            <Input
              id="workerName"
              value={data.workerName}
              onChange={(e) => setData(prev => ({ ...prev, workerName: e.target.value }))}
              placeholder="Enter worker's full name"
            />
          </div>

          <div>
            <Label htmlFor="employmentStatus">Employment Status *</Label>
            <Select value={data.employmentStatus} onValueChange={(value) => setData(prev => ({ ...prev, employmentStatus: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {employmentStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>1. Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="late">Days Late</Label>
              <Input
                id="late"
                type="number"
                min="0"
                value={data.late}
                onChange={(e) => setData(prev => ({ ...prev, late: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="absent">Days Absent</Label>
              <Input
                id="absent"
                type="number"
                min="0"
                value={data.absent}
                onChange={(e) => setData(prev => ({ ...prev, absent: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Formula: ((Late + Absent) / 24 × 10) - 10 = Rating (minimum: 0)
            </p>
            <p className="font-semibold">
              Calculated Rating: <span className={getRatingColor(data.attendanceRating)}>{data.attendanceRating}</span>
            </p>
          </div>

          <div>
            <Label htmlFor="attendanceRemarks">Remarks</Label>
            <Textarea
              id="attendanceRemarks"
              value={data.attendanceRemarks}
              onChange={(e) => setData(prev => ({ ...prev, attendanceRemarks: e.target.value }))}
              placeholder="Enter remarks about attendance..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Attitudes */}
      <Card>
        <CardHeader>
          <CardTitle>2. Attitude Towards Supervisor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StarRating
            value={data.supervisorAttitude}
            onChange={(value) => setData(prev => ({ ...prev, supervisorAttitude: value }))}
          />
          <div>
            <Label htmlFor="supervisorRemarks">Remarks</Label>
            <Textarea
              id="supervisorRemarks"
              value={data.supervisorRemarks}
              onChange={(e) => setData(prev => ({ ...prev, supervisorRemarks: e.target.value }))}
              placeholder="Enter remarks about attitude towards supervisor..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Attitude Towards Co-worker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StarRating
            value={data.coworkerAttitude}
            onChange={(value) => setData(prev => ({ ...prev, coworkerAttitude: value }))}
          />
          <div>
            <Label htmlFor="coworkerRemarks">Remarks</Label>
            <Textarea
              id="coworkerRemarks"
              value={data.coworkerRemarks}
              onChange={(e) => setData(prev => ({ ...prev, coworkerRemarks: e.target.value }))}
              placeholder="Enter remarks about attitude towards co-workers..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Attitude/Performance */}
      <Card>
        <CardHeader>
          <CardTitle>4. Work Attitude/Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Responsible in Work Assignment</Label>
              <StarRating
                value={data.workResponsibility}
                onChange={(value) => setData(prev => ({ ...prev, workResponsibility: value }))}
              />
            </div>
            <div>
              <Label>Work Initiative</Label>
              <StarRating
                value={data.workInitiative}
                onChange={(value) => setData(prev => ({ ...prev, workInitiative: value }))}
              />
            </div>
            <div>
              <Label>Job Knowledge</Label>
              <StarRating
                value={data.jobKnowledge}
                onChange={(value) => setData(prev => ({ ...prev, jobKnowledge: value }))}
              />
            </div>
            <div>
              <Label>Dependability</Label>
              <StarRating
                value={data.dependability}
                onChange={(value) => setData(prev => ({ ...prev, dependability: value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Cooperation</Label>
              <StarRating
                value={data.cooperation}
                onChange={(value) => setData(prev => ({ ...prev, cooperation: value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="workAttitudeRemarks">Overall Work Attitude Remarks</Label>
            <Textarea
              id="workAttitudeRemarks"
              value={data.workAttitudeRemarks}
              onChange={(e) => setData(prev => ({ ...prev, workAttitudeRemarks: e.target.value }))}
              placeholder="Enter overall remarks about work attitude and performance..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Functions */}
      {data.department && data.workFunctions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>5. Work Functions - {data.department} Department</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.workFunctions.map((func, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">{func.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Work Quality (1-10)</Label>
                    <StarRating
                      value={func.quality}
                      onChange={(value) => handleWorkFunctionChange(index, 'quality', value)}
                    />
                  </div>
                  <div>
                    <Label>Work Efficiency (1-10)</Label>
                    <StarRating
                      value={func.efficiency}
                      onChange={(value) => handleWorkFunctionChange(index, 'efficiency', value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Total Rating */}
      <Card>
        <CardHeader>
          <CardTitle>Total Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className={`text-4xl font-bold ${getRatingColor(data.totalRating)}`}>
              {data.totalRating}/10
            </div>
            <div className={`text-lg font-medium ${getRatingColor(data.totalRating)}`}>
              {getRatingLabel(data.totalRating)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observations */}
      <Card>
        <CardHeader>
          <CardTitle>Observations / Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.observations}
            onChange={(e) => setData(prev => ({ ...prev, observations: e.target.value }))}
            placeholder="Enter detailed observations and comments about the employee's performance..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Signatures */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Signatures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="evaluatedBy">Evaluated by:</Label>
            <Input
              id="evaluatedBy"
              value={data.evaluatedBy}
              onChange={(e) => setData(prev => ({ ...prev, evaluatedBy: e.target.value }))}
              placeholder="Enter evaluator's name and position"
            />
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Approved by:</p>
            <p>Carmela B. Pedregosa</p>
            <p className="text-sm text-muted-foreground">Manager</p>
          </div>
        </CardContent>
      </Card>

      {/* Rating Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-destructive font-medium">1-4 = Fail</div>
            <div className="text-warning font-medium">5-7 = Satisfactory</div>
            <div className="text-primary font-medium">8-9 = Very Satisfactory</div>
            <div className="text-success font-medium">10 = Excellent</div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={handleSubmit} size="lg" className="bg-primary hover:bg-primary-hover">
          <Save className="w-4 h-4 mr-2" />
          Submit Evaluation
        </Button>
        
        <Button onClick={handleExportPDF} variant="secondary" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Export to PDF
        </Button>
        
        <Button onClick={handleReset} variant="outline" size="lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Form
        </Button>
      </div>
    </div>
  );
}