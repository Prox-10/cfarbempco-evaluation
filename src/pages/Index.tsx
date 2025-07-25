import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EvaluationSidebar } from "@/components/EvaluationSidebar";
import { EvaluationForm } from "@/components/EvaluationForm";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <EvaluationSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-primary">Employee Evaluation System</h1>
              <p className="text-sm text-muted-foreground">CFARBEMPCO Workers Assessment</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <EvaluationForm />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
