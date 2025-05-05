import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from '@/lib/queryClient';
import { Loader2, CheckCircle2, AlertCircle, Calendar, Timer, ArrowDownUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TestingTools() {
  const { toast } = useToast();
  const [isCreatingInactive, setIsCreatingInactive] = useState(false);
  const [isCreatingTraded, setIsCreatingTraded] = useState(false);
  const [inactiveResult, setInactiveResult] = useState<{ success: boolean; message: string } | null>(null);
  const [tradedResult, setTradedResult] = useState<{ success: boolean; message: string } | null>(null);

  const createInactiveToy = async () => {
    setIsCreatingInactive(true);
    setInactiveResult(null);
    
    try {
      const response = await apiRequest('POST', '/api/test/create-inactive-toy');
      const data = await response.json();
      
      if (response.ok) {
        setInactiveResult({
          success: true,
          message: `Test inactive toy created successfully with ID: ${data.id}`
        });
        toast({
          title: "Success",
          description: "Created test inactive toy. Check your profile's Inactive tab.",
        });
      } else {
        setInactiveResult({
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
      setInactiveResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`
      });
      toast({
        title: "Error",
        description: "Failed to create test inactive toy",
        variant: "destructive"
      });
    } finally {
      setIsCreatingInactive(false);
    }
  };

  const createTradedToy = async () => {
    setIsCreatingTraded(true);
    setTradedResult(null);
    
    try {
      // First create a regular toy
      const createResponse = await apiRequest('POST', '/api/toys', {
        title: "Test Traded Toy",
        description: "This is a test toy for testing traded functionality",
        category: "Testing",
        ageRange: "3-12",
        condition: "Good",
        images: [],
        location: "Test Location"
      });
      
      if (!createResponse.ok) {
        throw new Error("Failed to create toy");
      }
      
      const toy = await createResponse.json();
      
      // Now mark it as traded
      const tradeResponse = await apiRequest('PATCH', `/api/toys/${toy.id}`, {
        status: "traded"
      });
      
      if (!tradeResponse.ok) {
        throw new Error("Failed to mark toy as traded");
      }
      
      setTradedResult({
        success: true,
        message: `Test traded toy created successfully with ID: ${toy.id}`
      });
      
      toast({
        title: "Success",
        description: "Created test traded toy. Check your profile's Traded tab.",
      });
    } catch (error) {
      console.error("Error creating traded toy:", error);
      setTradedResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`
      });
      toast({
        title: "Error",
        description: "Failed to create test traded toy",
        variant: "destructive"
      });
    } finally {
      setIsCreatingTraded(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Testing Tools</h1>
      <p className="text-neutral-600 mb-6">
        These tools help you generate test data for development and testing purposes.
      </p>
      
      <Tabs defaultValue="inactive">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="inactive">
            <Timer className="mr-2 h-4 w-4" />
            Inactive Toys
          </TabsTrigger>
          <TabsTrigger value="traded">
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Traded Toys
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Test Inactive Toys</CardTitle>
              <CardDescription>
                Create a test toy marked as inactive (older than 31 days) to test the inactive toys feature.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <Button 
                  onClick={createInactiveToy} 
                  disabled={isCreatingInactive}
                  className="mb-4 w-full sm:w-auto"
                >
                  {isCreatingInactive ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                      Creating...
                    </>
                  ) : 'Create Test Inactive Toy'}
                </Button>
                
                {inactiveResult && (
                  <div className={`p-4 rounded-md ${inactiveResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} flex items-start mt-2`}>
                    {inactiveResult.success ? 
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" /> : 
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    }
                    <p>{inactiveResult.message}</p>
                  </div>
                )}
                
                <div className="mt-6 text-sm text-neutral-600">
                  <p className="font-medium mb-2">What this does:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Creates a new toy with your user as the owner</li>
                    <li>Sets the status to "inactive" and lastActivityDate to over 31 days ago</li>
                    <li>The toy will appear in your profile's "Inactive" tab</li>
                    <li>You can test the reactivation process from there</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="traded">
          <Card>
            <CardHeader>
              <CardTitle>Test Traded Toys</CardTitle>
              <CardDescription>
                Create a test toy marked as traded to test the traded toys feature and the "Mark as Active" functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <Button 
                  onClick={createTradedToy} 
                  disabled={isCreatingTraded}
                  className="mb-4 w-full sm:w-auto"
                >
                  {isCreatingTraded ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                      Creating...
                    </>
                  ) : 'Create Test Traded Toy'}
                </Button>
                
                {tradedResult && (
                  <div className={`p-4 rounded-md ${tradedResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} flex items-start mt-2`}>
                    {tradedResult.success ? 
                      <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" /> : 
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    }
                    <p>{tradedResult.message}</p>
                  </div>
                )}
                
                <div className="mt-6 text-sm text-neutral-600">
                  <p className="font-medium mb-2">What this does:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Creates a new toy with your user as the owner</li>
                    <li>Sets the status to "traded"</li>
                    <li>The toy will appear in your profile's "Traded" tab</li>
                    <li>You can test the "Mark as Active" process from there</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}