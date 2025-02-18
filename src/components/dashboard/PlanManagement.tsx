import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";

interface PlanFormData {
  name: string;
  price: number;
  billingPeriod: "monthly" | "quarterly" | "yearly";
  features: string[];
  trialDays?: number;
}

const PlanManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    price: 0,
    billingPeriod: "monthly",
    features: [],
    trialDays: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle plan creation/update
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscription Plans</CardTitle>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Plan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingPeriod">Billing Period</Label>
                  <Select
                    value={formData.billingPeriod}
                    onValueChange={(
                      value: "monthly" | "quarterly" | "yearly",
                    ) => setFormData({ ...formData, billingPeriod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trialDays">Trial Days</Label>
                  <Input
                    id="trialDays"
                    type="number"
                    value={formData.trialDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trialDays: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Plan
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Plan list will be rendered here */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanManagement;
