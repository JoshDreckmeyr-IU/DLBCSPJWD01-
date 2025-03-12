
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TradeProvider } from "@/contexts/TradeContext";
import TradeForm from "@/components/TradeForm";
import PnLChart from "@/components/PnLChart";
import TradeHistory from "@/components/TradeHistory";
import AnalyticsSummary from "@/components/AnalyticsSummary";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import TradeRecommendations from "@/components/TradeRecommendations";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Redirect to auth page if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // If user is not logged in, show nothing while redirecting
  if (!user) {
    return null;
  }

  return (
    <TradeProvider>
      <div className="min-h-screen bg-gray-50 pb-8">
        <header className="bg-white border-b border-gray-200 py-6 mb-6">
          <div className="container flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Log</h1>
              <p className="text-gray-500">Track, analyze, and improve your trading performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-500">Logged in as </span>
                <span className="font-medium">{user.email}</span>
              </div>
              <Button onClick={() => signOut()} variant="outline" className="gap-2">
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          </div>
        </header>
        
        <main className="container">
          <Tabs defaultValue="dashboard" className="w-full mb-6">
            <TabsList className="w-full max-w-md mb-4 mx-auto">
              <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
              <TabsTrigger value="recommendations" className="flex-1">Trade Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <AnalyticsSummary />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PnLChart />
                <PerformanceMetrics />
              </div>
              
              <TradeForm />
              
              <TradeHistory />
            </TabsContent>
            
            <TabsContent value="recommendations">
              <TradeRecommendations />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TradeProvider>
  );
};

export default Index;
