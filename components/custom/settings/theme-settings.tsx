"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Eye, 
  Zap, 
  Brush,
  Download,
  Upload,
  RotateCcw,
  Check
} from 'lucide-react';

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  borderRadius: number;
  fontFamily: string;
  fontSize: number;
  animations: boolean;
  customTheme: string | null;
}

interface ColorOption {
  name: string;
  value: string;
  preview: string;
}

export function ThemeSettings() {
  const [settings, setSettings] = useState<ThemeSettings>({
    mode: 'system',
    primaryColor: 'blue',
    accentColor: 'emerald',
    borderRadius: 8,
    fontFamily: 'inter',
    fontSize: 14,
    animations: true,
    customTheme: null,
  });

  const [previewMode, setPreviewMode] = useState(false);

  const colorOptions: ColorOption[] = [
    { name: 'Blue', value: 'blue', preview: 'bg-blue-500' },
    { name: 'Emerald', value: 'emerald', preview: 'bg-emerald-500' },
    { name: 'Rose', value: 'rose', preview: 'bg-rose-500' },
    { name: 'Orange', value: 'orange', preview: 'bg-orange-500' },
    { name: 'Purple', value: 'purple', preview: 'bg-purple-500' },
    { name: 'Cyan', value: 'cyan', preview: 'bg-cyan-500' },
    { name: 'Pink', value: 'pink', preview: 'bg-pink-500' },
    { name: 'Indigo', value: 'indigo', preview: 'bg-indigo-500' },
  ];

  const fontOptions = [
    { name: 'Inter', value: 'inter' },
    { name: 'Roboto', value: 'roboto' },
    { name: 'System UI', value: 'system' },
    { name: 'Geist Sans', value: 'geist-sans' },
    { name: 'JetBrains Mono', value: 'jetbrains-mono' },
  ];

  const presetThemes = [
    { name: 'ADHD Focus', description: 'High contrast, minimal distractions' },
    { name: 'Calm Waters', description: 'Soft blues and gentle curves' },
    { name: 'Forest Productivity', description: 'Nature-inspired greens' },
    { name: 'Sunset Warmth', description: 'Warm oranges and yellows' },
  ];

  const handleSettingChange = (key: keyof ThemeSettings, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleColorSelect = (type: 'primaryColor' | 'accentColor', color: string) => {
    handleSettingChange(type, color);
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  const handleSaveTheme = () => {
    // Simulate saving theme
    console.log('Saving theme settings:', settings);
  };

  const handleResetTheme = () => {
    setSettings({
      mode: 'system',
      primaryColor: 'blue',
      accentColor: 'emerald',
      borderRadius: 8,
      fontFamily: 'inter',
      fontSize: 14,
      animations: true,
      customTheme: null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Theme Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Mode
          </CardTitle>
          <CardDescription>
            Choose between light, dark, or system preference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.mode}
            onValueChange={(value) => handleSettingChange('mode', value)}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
              { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
              { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={option.value}
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  {option.icon}
                  <span className="mt-2 text-sm">{option.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Color Scheme */}
      <Card>
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
          <CardDescription>
            Customize your app&apos;s color palette
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Color */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Primary Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect('primaryColor', color.value)}
                  className={`
                    flex items-center gap-2 p-2 rounded-md border transition-all
                    ${settings.primaryColor === color.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-muted-foreground/50'
                    }
                  `}
                >
                  <div className={`w-4 h-4 rounded-full ${color.preview}`} />
                  <span className="text-xs">{color.name}</span>
                  {settings.primaryColor === color.value && (
                    <Check className="h-3 w-3 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Accent Color */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Accent Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect('accentColor', color.value)}
                  className={`
                    flex items-center gap-2 p-2 rounded-md border transition-all
                    ${settings.accentColor === color.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-muted-foreground/50'
                    }
                  `}
                >
                  <div className={`w-4 h-4 rounded-full ${color.preview}`} />
                  <span className="text-xs">{color.name}</span>
                  {settings.accentColor === color.value && (
                    <Check className="h-3 w-3 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Configure fonts and text sizing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => handleSettingChange('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => handleSettingChange('fontSize', value)}
              min={12}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small (12px)</span>
              <span>Large (20px)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Effects */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Effects</CardTitle>
          <CardDescription>
            Customize visual appearance and animations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Border Radius: {settings.borderRadius}px</Label>
            <Slider
              value={[settings.borderRadius]}
              onValueChange={([value]) => handleSettingChange('borderRadius', value)}
              min={0}
              max={16}
              step={2}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sharp (0px)</span>
              <span>Rounded (16px)</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Enable Animations
              </Label>
              <p className="text-sm text-muted-foreground">
                Smooth transitions and micro-interactions
              </p>
            </div>
            <Button
              variant={settings.animations ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange('animations', !settings.animations)}
            >
              {settings.animations ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preset Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brush className="h-5 w-5" />
            Preset Themes
          </CardTitle>
          <CardDescription>
            Quick theme configurations optimized for different use cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {presetThemes.map((theme, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{theme.name}</h4>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Management</CardTitle>
          <CardDescription>
            Save, load, or reset your theme configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handlePreviewToggle} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Exit Preview' : 'Preview Changes'}
            </Button>
            <Button onClick={handleSaveTheme}>
              <Download className="h-4 w-4 mr-2" />
              Save Theme
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Theme
            </Button>
            <Button onClick={handleResetTheme} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Badge */}
      {previewMode && (
        <div className="fixed top-4 right-4 z-50">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Preview Mode Active
          </Badge>
        </div>
      )}
    </div>
  );
}
