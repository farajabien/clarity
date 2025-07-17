"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  VolumeX, 
  Hand, 
  Focus,
  Type,
  Contrast,
  Mouse,
  Keyboard,
  TestTube,
  RotateCcw
} from 'lucide-react';

interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number;
  lineHeight: number;
  focusIndicator: string;
  colorBlindSupport: boolean;
  
  // Audio
  soundEffects: boolean;
  voiceOutput: boolean;
  audioFeedback: boolean;
  volume: number;
  
  // Motor
  largerClickTargets: boolean;
  stickyKeys: boolean;
  slowKeys: boolean;
  mouseKeys: boolean;
  dragDelay: number;
  
  // Cognitive
  autoSave: boolean;
  confirmations: boolean;
  timeout: number;
  notifications: boolean;
  distractionMode: boolean;
}

export function AccessibilityOptions() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    // Visual
    highContrast: false,
    reducedMotion: false,
    fontSize: 14,
    lineHeight: 1.5,
    focusIndicator: 'ring',
    colorBlindSupport: false,
    
    // Audio
    soundEffects: true,
    voiceOutput: false,
    audioFeedback: false,
    volume: 75,
    
    // Motor
    largerClickTargets: false,
    stickyKeys: false,
    slowKeys: false,
    mouseKeys: false,
    dragDelay: 300,
    
    // Cognitive
    autoSave: true,
    confirmations: true,
    timeout: 300,
    notifications: true,
    distractionMode: false,
  });

  const [testMode, setTestMode] = useState<string | null>(null);

  const handleSettingChange = (key: keyof AccessibilitySettings, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTestFeature = (feature: string) => {
    setTestMode(feature);
    setTimeout(() => setTestMode(null), 3000);
  };

  const handleResetToDefaults = () => {
    setSettings({
      highContrast: false,
      reducedMotion: false,
      fontSize: 14,
      lineHeight: 1.5,
      focusIndicator: 'ring',
      colorBlindSupport: false,
      soundEffects: true,
      voiceOutput: false,
      audioFeedback: false,
      volume: 75,
      largerClickTargets: false,
      stickyKeys: false,
      slowKeys: false,
      mouseKeys: false,
      dragDelay: 300,
      autoSave: true,
      confirmations: true,
      timeout: 300,
      notifications: true,
      distractionMode: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Visual Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visual Accessibility
          </CardTitle>
          <CardDescription>
            Options to improve visual clarity and readability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                High Contrast Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleTestFeature('contrast')}
              >
                <TestTube className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
            />
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Size: {settings.fontSize}px
            </Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => handleSettingChange('fontSize', value)}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small (12px)</span>
              <span>Large (24px)</span>
            </div>
          </div>

          <Separator />

          {/* Line Height */}
          <div className="space-y-3">
            <Label>Line Height: {settings.lineHeight}</Label>
            <Slider
              value={[settings.lineHeight]}
              onValueChange={([value]) => handleSettingChange('lineHeight', value)}
              min={1.2}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tight (1.2)</span>
              <span>Loose (2.0)</span>
            </div>
          </div>

          <Separator />

          {/* Focus Indicator */}
          <div className="space-y-2">
            <Label>Focus Indicator Style</Label>
            <Select
              value={settings.focusIndicator}
              onValueChange={(value) => handleSettingChange('focusIndicator', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ring">Ring (default)</SelectItem>
                <SelectItem value="thick-ring">Thick Ring</SelectItem>
                <SelectItem value="underline">Underline</SelectItem>
                <SelectItem value="background">Background Highlight</SelectItem>
                <SelectItem value="border">Colored Border</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Color Blind Support */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Color Blind Support</Label>
              <p className="text-sm text-muted-foreground">
                Enhanced patterns and symbols for color identification
              </p>
            </div>
            <Switch
              checked={settings.colorBlindSupport}
              onCheckedChange={(checked) => handleSettingChange('colorBlindSupport', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Accessibility
          </CardTitle>
          <CardDescription>
            Sound and audio feedback options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Button clicks, notifications, and UI sounds
              </p>
            </div>
            <Switch
              checked={settings.soundEffects}
              onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
            />
          </div>

          <Separator />

          {/* Voice Output */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Voice Output</Label>
              <p className="text-sm text-muted-foreground">
                Screen reader compatible announcements
              </p>
            </div>
            <Switch
              checked={settings.voiceOutput}
              onCheckedChange={(checked) => handleSettingChange('voiceOutput', checked)}
            />
          </div>

          <Separator />

          {/* Audio Feedback */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Audio Feedback</Label>
              <p className="text-sm text-muted-foreground">
                Audio cues for interactions and state changes
              </p>
            </div>
            <Switch
              checked={settings.audioFeedback}
              onCheckedChange={(checked) => handleSettingChange('audioFeedback', checked)}
            />
          </div>

          {settings.audioFeedback && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  {settings.volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Volume: {settings.volume}%
                </Label>
                <Slider
                  value={[settings.volume]}
                  onValueChange={([value]) => handleSettingChange('volume', value)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Motor Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5" />
            Motor Accessibility
          </CardTitle>
          <CardDescription>
            Options for users with motor impairments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Larger Click Targets */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Larger Click Targets</Label>
              <p className="text-sm text-muted-foreground">
                Increase the size of buttons and interactive elements
              </p>
            </div>
            <Switch
              checked={settings.largerClickTargets}
              onCheckedChange={(checked) => handleSettingChange('largerClickTargets', checked)}
            />
          </div>

          <Separator />

          {/* Sticky Keys */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Sticky Keys
              </Label>
              <p className="text-sm text-muted-foreground">
                Press modifier keys one at a time instead of holding
              </p>
            </div>
            <Switch
              checked={settings.stickyKeys}
              onCheckedChange={(checked) => handleSettingChange('stickyKeys', checked)}
            />
          </div>

          <Separator />

          {/* Slow Keys */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Slow Keys</Label>
              <p className="text-sm text-muted-foreground">
                Require keys to be held down before registering
              </p>
            </div>
            <Switch
              checked={settings.slowKeys}
              onCheckedChange={(checked) => handleSettingChange('slowKeys', checked)}
            />
          </div>

          <Separator />

          {/* Mouse Keys */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Mouse className="h-4 w-4" />
                Mouse Keys
              </Label>
              <p className="text-sm text-muted-foreground">
                Control cursor with numeric keypad
              </p>
            </div>
            <Switch
              checked={settings.mouseKeys}
              onCheckedChange={(checked) => handleSettingChange('mouseKeys', checked)}
            />
          </div>

          <Separator />

          {/* Drag Delay */}
          <div className="space-y-3">
            <Label>Drag Delay: {settings.dragDelay}ms</Label>
            <Slider
              value={[settings.dragDelay]}
              onValueChange={([value]) => handleSettingChange('dragDelay', value)}
              min={0}
              max={1000}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Immediate (0ms)</span>
              <span>Delayed (1000ms)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Focus className="h-5 w-5" />
            Cognitive Accessibility
          </CardTitle>
          <CardDescription>
            Features to reduce cognitive load and improve focus
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto Save</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes without confirmation
              </p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
            />
          </div>

          <Separator />

          {/* Confirmations */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Confirmation Dialogs</Label>
              <p className="text-sm text-muted-foreground">
                Ask for confirmation before destructive actions
              </p>
            </div>
            <Switch
              checked={settings.confirmations}
              onCheckedChange={(checked) => handleSettingChange('confirmations', checked)}
            />
          </div>

          <Separator />

          {/* Session Timeout */}
          <div className="space-y-3">
            <Label>Session Timeout: {settings.timeout} minutes</Label>
            <Slider
              value={[settings.timeout]}
              onValueChange={([value]) => handleSettingChange('timeout', value)}
              min={30}
              max={1440}
              step={30}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 minutes</span>
              <span>24 hours</span>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Smart Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Reduce notification frequency during focus sessions
              </p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>

          <Separator />

          {/* Distraction Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Distraction-Free Mode</Label>
              <p className="text-sm text-muted-foreground">
                Hide non-essential UI elements during focus sessions
              </p>
            </div>
            <Switch
              checked={settings.distractionMode}
              onCheckedChange={(checked) => handleSettingChange('distractionMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Test accessibility features and manage settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleTestFeature('focus')}
              disabled={testMode === 'focus'}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test Focus Indicators
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleTestFeature('audio')}
              disabled={testMode === 'audio'}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Test Audio Feedback
            </Button>
            <Button 
              variant="outline" 
              onClick={handleResetToDefaults}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Mode Indicator */}
      {testMode && (
        <div className="fixed top-4 right-4 z-50">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Testing {testMode} accessibility features...
          </Badge>
        </div>
      )}

      {/* Accessibility Summary */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Accessibility Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Visual</p>
              <p className="text-muted-foreground">
                {[settings.highContrast, settings.reducedMotion, settings.colorBlindSupport].filter(Boolean).length}/3 enabled
              </p>
            </div>
            <div>
              <p className="font-medium">Audio</p>
              <p className="text-muted-foreground">
                {[settings.soundEffects, settings.voiceOutput, settings.audioFeedback].filter(Boolean).length}/3 enabled
              </p>
            </div>
            <div>
              <p className="font-medium">Motor</p>
              <p className="text-muted-foreground">
                {[settings.largerClickTargets, settings.stickyKeys, settings.slowKeys, settings.mouseKeys].filter(Boolean).length}/4 enabled
              </p>
            </div>
            <div>
              <p className="font-medium">Cognitive</p>
              <p className="text-muted-foreground">
                {[settings.autoSave, settings.confirmations, settings.notifications, settings.distractionMode].filter(Boolean).length}/4 enabled
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
