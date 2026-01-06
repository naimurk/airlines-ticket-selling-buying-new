import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../src/components/ui/tabs";
import { Plane } from "lucide-react";
import SellingInformation from "./components/selling/selling-information";
import PortalManagement from "./components/portal/portal";

export default function AirlineManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Airline Management
              </h1>
              <p className="text-gray-600">
                Manage your ticket sales and purchases
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="selling" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="selling" className="text-lg py-3">
              Selling Information
            </TabsTrigger>
            <TabsTrigger value="buying" className="text-lg py-3">
              Buying Information
            </TabsTrigger>
            <TabsTrigger value="portal" className="text-lg py-3">
              Portal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selling">
            <SellingInformation />
          </TabsContent>

          <TabsContent value="buying">
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Buying Information - Coming Soon
              </p>
            </div>
          </TabsContent>

          <TabsContent value="portal">
            <PortalManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
