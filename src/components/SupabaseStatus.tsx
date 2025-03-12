
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SupabaseStatus = () => {
  return (
    <Card className="border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Supabase Connected
        </CardTitle>
        <CardDescription>
          Your app is connected to Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          You can now use authentication and database features in your app.
        </p>
      </CardContent>
    </Card>
  );
};

export default SupabaseStatus;
