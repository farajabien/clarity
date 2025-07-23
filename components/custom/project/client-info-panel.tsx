"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Project } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { useHydratedStore } from "@/hooks/use-hydrated-store";
import type { AppState } from "@/lib/types";
import {
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  Edit,
  Save,
  X
} from "lucide-react";

interface ClientInfo {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  contactPerson: string;
  relationship: "new" | "ongoing" | "completed" | "on-hold";
  totalProjects: number;
  totalRevenue: number;
  startDate: string;
  notes: string;
  tags: string[];
}

export function ClientInfoPanel() {
  const { projects, isHydrated } = useHydratedStore() as AppState & { isHydrated: boolean };
  
  // Get client projects (projects with "client" category)
  const clientProjects = !isHydrated ? [] : (Object.values(projects) as Project[]).filter((p: Project) => p.category === "client");
  const totalRevenue = clientProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

  // Create a client from project data or use defaults
  const [client, setClient] = useState<ClientInfo>({
    id: "default-client",
    name: clientProjects.length > 0 ? "Client Portfolio" : "No Client Projects",
    company: "Various Clients",
    email: "",
    phone: "",
    website: "",
    address: "",
    contactPerson: "",
    relationship: clientProjects.length > 0 ? "ongoing" : "new",
    totalProjects: clientProjects.length,
    totalRevenue,
    startDate: clientProjects.length > 0 
      ? clientProjects.sort((a: Project, b: Project) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0].createdAt.split('T')[0]
      : new Date().toISOString().split('T')[0],
    notes: clientProjects.length > 0 
      ? `Managing ${clientProjects.length} client projects with total budget of $${totalRevenue.toLocaleString()}`
      : "No client projects yet. Create a project with 'client' category to see client information.",
    tags: ["client"],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ClientInfo>(client);

  const handleSave = () => {
    setClient(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(client);
    setIsEditing(false);
  };

  const getRelationshipColor = (relationship: ClientInfo["relationship"]) => {
    switch (relationship) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "ongoing": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "on-hold": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateClientValue = () => {
    const avgProjectValue = client.totalRevenue / client.totalProjects;
    return avgProjectValue;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="w-5 h-5" />
              Client Information
            </CardTitle>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="basic-info">
              <AccordionTrigger>Basic Information</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Name</Label>
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{client.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Company</Label>
                    {isEditing ? (
                      <Input
                        value={editData.company}
                        onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm">{client.company}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    {isEditing ? (
                      <Input
                        value={editData.contactPerson}
                        onChange={(e) => setEditData({ ...editData, contactPerson: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {client.contactPerson}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Relationship Status</Label>
                    {isEditing ? (
                      <select
                        value={editData.relationship}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          relationship: e.target.value as ClientInfo["relationship"]
                        })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="new">New</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                      </select>
                    ) : (
                      <Badge className={getRelationshipColor(client.relationship)}>
                        {client.relationship.replace("-", " ")}
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact-info">
              <AccordionTrigger>Contact Information</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                          {client.email}
                        </a>
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    {isEditing ? (
                      <Input
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                          {client.phone}
                        </a>
                      </p>
                    )}
                  </div>
                  
                  {client.website && (
                    <div className="space-y-2">
                      <Label>Website</Label>
                      {isEditing ? (
                        <Input
                          value={editData.website || ""}
                          onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <a 
                            href={client.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {client.website}
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                  
                  {client.address && (
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      {isEditing ? (
                        <Textarea
                          value={editData.address || ""}
                          onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5" />
                          {client.address}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="business-metrics">
              <AccordionTrigger>Business Metrics</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{client.totalProjects}</div>
                    <div className="text-sm text-muted-foreground">Total Projects</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(client.totalRevenue)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculateClientValue())}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Project Value</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-sm font-medium flex items-center justify-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(client.startDate)}
                    </div>
                    <div className="text-sm text-muted-foreground">Client Since</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="notes-tags">
              <AccordionTrigger>Notes & Tags</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    {isEditing ? (
                      <Textarea
                        value={editData.notes}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        rows={3}
                        placeholder="Add notes about this client..."
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {client.notes || "No notes added yet."}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {client.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Quick Alerts */}
      {client.relationship === "on-hold" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This client relationship is currently on hold. Consider reaching out to reactivate.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
