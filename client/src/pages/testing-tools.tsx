import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from '@/lib/queryClient';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TestingTools() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const createInactiveToy = async () => {
    setIsCreating(true);
    setResult(null);
    
    try {
      const response = await apiRequest('POST', '/api/test/create-inactive-toy');
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: `Test inactive toy created successfully with ID: ${data.id}`
        });
        toast({
          title: "Success",
          description: "Created test inactive toy. Check your profile's Inactive tab.",
        });
      } else {
        setResult({
          success: false,
          message: `Failed to create test toy: ${data.message || 'Unknown error'}`
        });
        toast({
          title: "Error",
          description: "Failed to create test inactive toy",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating test toy:", error);
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`
      });
      toast({
        title: "Error",
        description: "Failed to create test inactive toy",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Testing Tools</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Testing Inactive Toys</h2>
            <p className="text-neutral-600 mb-4">
              Create a test toy marked as inactive (older than 31 days) to test the inactive toys feature.
            </p>
            
            <div className="flex flex-col">
              <Button 
                onClick={createInactiveToy} 
                disabled={isCreating}
                className="mb-4"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                    Creating...
                  </>
                ) : 'Create Test Inactive Toy'}
              </Button>
              
              {result && (
                <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} flex items-start mt-2`}>
                  {result.success ? 
                    <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" /> : 
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  }
                  <p>{result.message}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}