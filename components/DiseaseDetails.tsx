'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DiseaseDetailsProps {
  disease: string
  description: string
  precautions: string[]
  medications: string[]
  diet: string[]
  workout: string[]
}

export function DiseaseDetails({
  disease,
  description,
  precautions,
  medications,
  diet,
  workout
}: DiseaseDetailsProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{disease}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="precautions">Precautions</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <p className="text-lg leading-relaxed">{description}</p>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="precautions" className="mt-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <ul className="list-disc pl-6 space-y-2">
                {precautions.map((precaution, index) => (
                  <li key={index} className="text-lg">{precaution}</li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="medications" className="mt-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <ul className="list-disc pl-6 space-y-2">
                {medications.map((medication, index) => (
                  <li key={index} className="text-lg">{medication}</li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="diet" className="mt-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <ul className="list-disc pl-6 space-y-2">
                {diet.map((item, index) => (
                  <li key={index} className="text-lg">{item}</li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="workout" className="mt-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <ul className="list-disc pl-6 space-y-2">
                {workout.map((exercise, index) => (
                  <li key={index} className="text-lg">{exercise}</li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 