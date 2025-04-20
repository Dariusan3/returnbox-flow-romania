
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CurrentPlan = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-accent rounded-lg">
          <div className="font-medium">Standard Plan</div>
          <div className="text-sm text-muted-foreground mt-1">Your next billing date is May 1, 2025</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPlan;
