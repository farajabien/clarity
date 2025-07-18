"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  ExternalLink, 
  FileText, 
  Image, 
  Link as LinkIcon,
  Download,
  MoreHorizontal
} from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: "link" | "document" | "image" | "file";
  description?: string;
  tags: string[];
  projectId?: string;
  dateAdded: string;
}

interface ResourceListProps {
  projectId?: string;
  category?: "work" | "client" | "personal";
}

export function ResourceList({ projectId }: ResourceListProps) {
  const { resources: storeResources, addResource } = useAppStore((state) => ({
    resources: state.resources,
    addResource: state.addResource
  }));

  // Convert store resources to display format
  const resources = Object.values(storeResources).map(resource => ({
    id: resource.id,
    title: resource.title,
    url: resource.link,
    type: "link" as const,
    description: "",
    tags: [],
    dateAdded: resource.createdAt.split('T')[0],
    projectId: resource.projectId
  }));

  const [showAddForm, setShowAddForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
    type: "link" as Resource["type"],
    description: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  // Filter resources by project if projectId is provided
  const filteredResources = projectId 
    ? resources.filter(resource => resource.projectId === projectId)
    : resources;

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "link": return <LinkIcon className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      case "image": return <Image className="w-4 h-4" aria-hidden="true" />;
      case "file": return <Download className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Resource["type"]) => {
    switch (type) {
      case "link": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "document": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "image": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "file": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newResource.tags.includes(tagInput.trim())) {
      setNewResource({
        ...newResource,
        tags: [...newResource.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewResource({
      ...newResource,
      tags: newResource.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title.trim() || !newResource.url.trim()) return;

    const resource: Resource = {
      ...newResource,
      id: Date.now().toString(),
      title: newResource.title.trim(),
      url: newResource.url.trim(),
      description: newResource.description.trim(),
      projectId,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    // Add to store instead of local state
    addResource({
      projectId: projectId || "",
      title: resource.title,
      link: resource.url,
      type: resource.description,
    });
    
    setNewResource({
      title: "",
      url: "",
      type: "link",
      description: "",
      tags: [],
    });
    setTagInput("");
    setShowAddForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">📚 Resources</CardTitle>
          <Popover open={showAddForm} onOpenChange={setShowAddForm}>
            <PopoverTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resource-title">Title *</Label>
                  <Input
                    id="resource-title"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    placeholder="Resource title..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resource-url">URL *</Label>
                  <Input
                    id="resource-url"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resource-type">Type</Label>
                  <Select 
                    value={newResource.type} 
                    onValueChange={(value: Resource["type"]) => 
                      setNewResource({ ...newResource, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resource-description">Description</Label>
                  <Input
                    id="resource-description"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    placeholder="Brief description..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resource-tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="resource-tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tags..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {newResource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newResource.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={!newResource.title.trim() || !newResource.url.trim()}
                    className="flex-1"
                  >
                    Add
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredResources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No resources added yet.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddForm(true)}
              className="mt-2"
            >
              Add First Resource
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          {resource.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`gap-1 ${getTypeColor(resource.type)}`}
                    >
                      {getTypeIcon(resource.type)}
                      {resource.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(resource.dateAdded)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
