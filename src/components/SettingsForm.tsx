
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsForm = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Name</label>
            <Input placeholder="Your business name" defaultValue="Maria's Fashion Store" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Return Email</label>
            <Input placeholder="returns@yourbusiness.com" type="email" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Processing Time (Days)</label>
            <Input type="number" defaultValue={3} min={1} max={14} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Return Reasons</label>
            <div className="space-y-2">
              <Input placeholder="Add new reason" />
              <div className="space-y-2">
                {["Size issue", "Quality issue", "Changed mind", "Wrong item"].map((reason) => (
                  <div key={reason} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>{reason}</span>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto-approve returns</label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Email notifications</label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsForm;
