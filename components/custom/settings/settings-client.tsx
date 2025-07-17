"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  ProfileForm, 
  SyncSettings, 
  ThemeSettings, 
  AccessibilityOptions 
} from './index';

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-4 w-full max-w-md">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="sync">Sync</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="accessibility">Access</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <Card className="p-6">
          <ProfileForm />
        </Card>
      </TabsContent>

      <TabsContent value="sync" className="space-y-6">
        <SyncSettings />
      </TabsContent>

      <TabsContent value="theme" className="space-y-6">
        <ThemeSettings />
      </TabsContent>

      <TabsContent value="accessibility" className="space-y-6">
        <AccessibilityOptions />
      </TabsContent>
    </Tabs>
  );
}
