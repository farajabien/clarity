"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, Cloud, Smartphone, Laptop, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface SyncSettings {
  autoSync: boolean;
  syncInterval: string;
  syncScope: string[];
  cloudProvider: string;
  lastSync: Date | null;
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  conflictResolution: string;
  offlineMode: boolean;
}

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastSync: Date;
  isOnline: boolean;
}

export function SyncSettings() {
  const [settings, setSettings] = useState<SyncSettings>({
    autoSync: true,
    syncInterval: '15min',
    syncScope: ['todos', 'projects', 'focus-sessions'],
    cloudProvider: 'google-drive',
    lastSync: new Date(),
    syncStatus: 'idle',
    conflictResolution: 'ask',
    offlineMode: false,
  });

  const [devices] = useState<Device[]>([
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      lastSync: new Date(),
      isOnline: true,
    },
    {
      id: '2',
      name: 'iPhone 14',
      type: 'mobile',
      lastSync: new Date(Date.now() - 300000), // 5 minutes ago
      isOnline: true,
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      lastSync: new Date(Date.now() - 3600000), // 1 hour ago
      isOnline: false,
    },
  ]);

  const handleSettingChange = (key: keyof SyncSettings, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleScopeToggle = (scope: string) => {
    setSettings(prev => ({
      ...prev,
      syncScope: prev.syncScope.includes(scope)
        ? prev.syncScope.filter(s => s !== scope)
        : [...prev.syncScope, scope],
    }));
  };

  const handleManualSync = () => {
    setSettings(prev => ({ ...prev, syncStatus: 'syncing' }));
    
    // Simulate sync process
    setTimeout(() => {
      setSettings(prev => ({
        ...prev,
        syncStatus: 'success',
        lastSync: new Date(),
      }));
    }, 2000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'desktop':
        return <Laptop className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  const getStatusIcon = () => {
    switch (settings.syncStatus) {
      case 'syncing':
        return <RotateCcw className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Cloud className="h-4 w-4" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Sync Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Sync Status
            </CardTitle>
            <CardDescription>
              Current synchronization status and last sync time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Last synced: {settings.lastSync?.toLocaleString() || 'Never'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Status: {settings.syncStatus}
                </p>
              </div>
              <Button 
                onClick={handleManualSync} 
                disabled={settings.syncStatus === 'syncing'}
                variant="outline"
              >
                {settings.syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auto Sync Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Auto Sync</CardTitle>
            <CardDescription>
              Configure automatic synchronization behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Auto Sync</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync data in the background
                </p>
              </div>
              <Switch
                checked={settings.autoSync}
                onCheckedChange={(checked) => handleSettingChange('autoSync', checked)}
              />
            </div>

            {settings.autoSync && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Sync Interval</Label>
                  <Select
                    value={settings.syncInterval}
                    onValueChange={(value) => handleSettingChange('syncInterval', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5min">Every 5 minutes</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="30min">Every 30 minutes</SelectItem>
                      <SelectItem value="1hour">Every hour</SelectItem>
                      <SelectItem value="manual">Manual only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sync Scope */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              What to Sync
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choose which data types to include in synchronization</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Select which data types to synchronize across devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: 'todos', label: 'Tasks & Todos', description: 'All task lists and individual todos' },
              { key: 'projects', label: 'Projects', description: 'Project data, timelines, and resources' },
              { key: 'focus-sessions', label: 'Focus Sessions', description: 'Pomodoro sessions and focus data' },
              { key: 'settings', label: 'Settings', description: 'User preferences and configurations' },
              { key: 'themes', label: 'Themes', description: 'Custom themes and appearance settings' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{item.label}</Label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  checked={settings.syncScope.includes(item.key)}
                  onCheckedChange={() => handleScopeToggle(item.key)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cloud Provider */}
        <Card>
          <CardHeader>
            <CardTitle>Cloud Provider</CardTitle>
            <CardDescription>
              Choose where to store your synchronized data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Storage Provider</Label>
              <Select
                value={settings.cloudProvider}
                onValueChange={(value) => handleSettingChange('cloudProvider', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google-drive">Google Drive</SelectItem>
                  <SelectItem value="icloud">iCloud</SelectItem>
                  <SelectItem value="dropbox">Dropbox</SelectItem>
                  <SelectItem value="onedrive">OneDrive</SelectItem>
                  <SelectItem value="local">Local Storage Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Conflict Resolution</Label>
              <Select
                value={settings.conflictResolution}
                onValueChange={(value) => handleSettingChange('conflictResolution', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ask">Ask me each time</SelectItem>
                  <SelectItem value="newest">Use newest version</SelectItem>
                  <SelectItem value="local">Prefer local changes</SelectItem>
                  <SelectItem value="remote">Prefer remote changes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Connected Devices */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>
              Devices currently syncing with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.type)}
                    <div>
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last sync: {device.lastSync.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={device.isOnline ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {device.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offline Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Offline Mode</CardTitle>
            <CardDescription>
              Control behavior when internet connection is unavailable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Offline Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Continue working without internet, sync when reconnected
                </p>
              </div>
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
