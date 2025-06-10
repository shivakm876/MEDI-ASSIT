"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowRight, Stethoscope, Pill, Dumbbell, Utensils, Info, Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { MultiSelect } from "@/components/ui/multi-select"


const symptoms = [
  { value: "itching", label: "Itching" },
  { value: "skin_rash", label: "Skin Rash" },
  { value: "nodal_skin_eruptions", label: "Nodal Skin Eruptions" },
  { value: "continuous_sneezing", label: "Continuous Sneezing" },
  { value: "shivering", label: "Shivering" },
  { value: "chills", label: "Chills" },
  { value: "joint_pain", label: "Joint Pain" },
  { value: "stomach_pain", label: "Stomach Pain" },
  { value: "acidity", label: "Acidity" },
  { value: "ulcers_on_tongue", label: "Ulcers on Tongue" },
  { value: "muscle_wasting", label: "Muscle Wasting" },
  { value: "vomiting", label: "Vomiting" },
  { value: "burning_micturition", label: "Burning Micturition" },
  { value: "spotting_ urination", label: "Spotting Urination" },
  { value: "fatigue", label: "Fatigue" },
  { value: "weight_gain", label: "Weight Gain" },
  { value: "anxiety", label: "Anxiety" },
  { value: "cold_hands_and_feets", label: "Cold Hands and Feet" },
  { value: "mood_swings", label: "Mood Swings" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "restlessness", label: "Restlessness" },
  { value: "lethargy", label: "Lethargy" },
  { value: "patches_in_throat", label: "Patches in Throat" },
  { value: "irregular_sugar_level", label: "Irregular Sugar Level" },
  { value: "cough", label: "Cough" },
  { value: "high_fever", label: "High Fever" },
  { value: "sunken_eyes", label: "Sunken Eyes" },
  { value: "breathlessness", label: "Breathlessness" },
  { value: "sweating", label: "Sweating" },
  { value: "dehydration", label: "Dehydration" },
  { value: "indigestion", label: "Indigestion" },
  { value: "headache", label: "Headache" },
  { value: "yellowish_skin", label: "Yellowish Skin" },
  { value: "dark_urine", label: "Dark Urine" },
  { value: "nausea", label: "Nausea" },
  { value: "loss_of_appetite", label: "Loss of Appetite" },
  { value: "pain_behind_the_eyes", label: "Pain Behind the Eyes" },
  { value: "back_pain", label: "Back Pain" },
  { value: "constipation", label: "Constipation" },
  { value: "abdominal_pain", label: "Abdominal Pain" },
  { value: "diarrhoea", label: "Diarrhoea" },
  { value: "mild_fever", label: "Mild Fever" },
  { value: "yellow_urine", label: "Yellow Urine" },
  { value: "yellowing_of_eyes", label: "Yellowing of Eyes" },
  { value: "acute_liver_failure", label: "Acute Liver Failure" },
  { value: "fluid_overload", label: "Fluid Overload" },
  { value: "swelling_of_stomach", label: "Swelling of Stomach" },
  { value: "swelled_lymph_nodes", label: "Swelled Lymph Nodes" },
  { value: "malaise", label: "Malaise" },
  { value: "blurred_and_distorted_vision", label: "Blurred and Distorted Vision" },
  { value: "phlegm", label: "Phlegm" },
  { value: "throat_irritation", label: "Throat Irritation" },
  { value: "redness_of_eyes", label: "Redness of Eyes" },
  { value: "sinus_pressure", label: "Sinus Pressure" },
  { value: "runny_nose", label: "Runny Nose" },
  { value: "congestion", label: "Congestion" },
  { value: "chest_pain", label: "Chest Pain" },
  { value: "weakness_in_limbs", label: "Weakness in Limbs" },
  { value: "fast_heart_rate", label: "Fast Heart Rate" },
  { value: "pain_during_bowel_movements", label: "Pain During Bowel Movements" },
  { value: "pain_in_anal_region", label: "Pain in Anal Region" },
  { value: "bloody_stool", label: "Bloody Stool" },
  { value: "irritation_in_anus", label: "Irritation in Anus" },
  { value: "neck_pain", label: "Neck Pain" },
  { value: "dizziness", label: "Dizziness" },
  { value: "cramps", label: "Cramps" },
  { value: "bruising", label: "Bruising" },
  { value: "obesity", label: "Obesity" },
  { value: "swollen_legs", label: "Swollen Legs" },
  { value: "swollen_blood_vessels", label: "Swollen Blood Vessels" },
  { value: "puffy_face_and_eyes", label: "Puffy Face and Eyes" },
  { value: "enlarged_thyroid", label: "Enlarged Thyroid" },
  { value: "brittle_nails", label: "Brittle Nails" },
  { value: "swollen_extremeties", label: "Swollen Extremities" },
  { value: "excessive_hunger", label: "Excessive Hunger" },
  { value: "extra_marital_contacts", label: "Extra Marital Contacts" },
  { value: "drying_and_tingling_lips", label: "Drying and Tingling Lips" },
  { value: "slurred_speech", label: "Slurred Speech" },
  { value: "knee_pain", label: "Knee Pain" },
  { value: "hip_joint_pain", label: "Hip Joint Pain" },
  { value: "muscle_weakness", label: "Muscle Weakness" },
  { value: "stiff_neck", label: "Stiff Neck" },
  { value: "swelling_joints", label: "Swelling Joints" },
  { value: "movement_stiffness", label: "Movement Stiffness" },
  { value: "spinning_movements", label: "Spinning Movements" },
  { value: "loss_of_balance", label: "Loss of Balance" },
  { value: "unsteadiness", label: "Unsteadiness" },
  { value: "weakness_of_one_body_side", label: "Weakness of One Body Side" },
  { value: "loss_of_smell", label: "Loss of Smell" },
  { value: "bladder_discomfort", label: "Bladder Discomfort" },
  { value: "foul_smell_of urine", label: "Foul Smell of Urine" },
  { value: "continuous_feel_of_urine", label: "Continuous Feel of Urine" },
  { value: "passage_of_gases", label: "Passage of Gases" },
  { value: "internal_itching", label: "Internal Itching" },
  { value: "toxic_look_(typhos)", label: "Toxic Look (Typhos)" },
  { value: "depression", label: "Depression" },
  { value: "irritability", label: "Irritability" },
  { value: "muscle_pain", label: "Muscle Pain" },
  { value: "altered_sensorium", label: "Altered Sensorium" },
  { value: "red_spots_over_body", label: "Red Spots Over Body" },
  { value: "belly_pain", label: "Belly Pain" },
  { value: "abnormal_menstruation", label: "Abnormal Menstruation" },
  { value: "dischromic _patches", label: "Dischromic Patches" },
  { value: "watering_from_eyes", label: "Watering from Eyes" },
  { value: "increased_appetite", label: "Increased Appetite" },
  { value: "polyuria", label: "Polyuria" },
  { value: "family_history", label: "Family History" },
  { value: "mucoid_sputum", label: "Mucoid Sputum" },
  { value: "rusty_sputum", label: "Rusty Sputum" },
  { value: "lack_of_concentration", label: "Lack of Concentration" },
  { value: "visual_disturbances", label: "Visual Disturbances" },
  { value: "receiving_blood_transfusion", label: "Receiving Blood Transfusion" },
  { value: "receiving_unsterile_injections", label: "Receiving Unsterile Injections" },
  { value: "coma", label: "Coma" },
  { value: "stomach_bleeding", label: "Stomach Bleeding" },
  { value: "distention_of_abdomen", label: "Distention of Abdomen" },
  { value: "history_of_alcohol_consumption", label: "History of Alcohol Consumption" },
  { value: "fluid_overload.1", label: "Fluid Overload" },
  { value: "blood_in_sputum", label: "Blood in Sputum" },
  { value: "prominent_veins_on_calf", label: "Prominent Veins on Calf" },
  { value: "palpitations", label: "Palpitations" },
  { value: "painful_walking", label: "Painful Walking" },
  { value: "pus_filled_pimples", label: "Pus Filled Pimples" },
  { value: "blackheads", label: "Blackheads" },
  { value: "scurring", label: "Scurring" },
  { value: "skin_peeling", label: "Skin Peeling" },
  { value: "silver_like_dusting", label: "Silver Like Dusting" },
  { value: "small_dents_in_nails", label: "Small Dents in Nails" },
  { value: "inflammatory_nails", label: "Inflammatory Nails" },
  { value: "blister", label: "Blister" },
  { value: "red_sore_around_nose", label: "Red Sore Around Nose" },
  { value: "yellow_crust_ooze", label: "Yellow Crust Ooze" }
]

interface SymptomData {
  symptoms: string[]
  timestamp: number
  predictions: {
    diseaseName: string
    probability: number
    description: string
    precautions: string[]
    medications: string[]
    workouts: string[]
    diets: string[]
  }[]
}

export default function FreeSymptomInput() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<SymptomData | null>(null)
  const { toast } = useToast()

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("freeSymptomAnalysis")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setAnalysis(parsedData)
      } catch (error) {
        console.error("Error parsing saved data:", error)
      }
    }
  }, [])

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one symptom",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/free-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze symptoms")
      }

      const analysisData = await response.json()

      const data: SymptomData = {
        symptoms: selectedSymptoms,
        timestamp: Date.now(),
        predictions: analysisData.predictions || []
      }

      setAnalysis(data)
      localStorage.setItem("freeSymptomAnalysis", JSON.stringify(data))
      
      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4"
          >
            <Stethoscope className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
            Free Symptom Analysis
          </h1>
          <p className="text-muted-foreground">
            Select your symptoms below to get a free analysis
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Your Symptoms</CardTitle>
            <CardDescription>
              Choose from the list of symptoms for better analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <MultiSelect
                options={symptoms}
                value={selectedSymptoms}
                onChange={setSelectedSymptoms}
                placeholder="Select symptoms..."
              />
              <Button 
                onClick={analyzeSymptoms} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Symptoms
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {analysis.predictions.map((prediction, index) => (
              <Card key={index} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    {prediction.diseaseName} ({prediction.probability.toFixed(1)}% probability)
                  </CardTitle>
                  <CardDescription>{prediction.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="precautions" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="precautions">Precautions</TabsTrigger>
                      <TabsTrigger value="medications">Medications</TabsTrigger>
                      <TabsTrigger value="workouts">Workouts</TabsTrigger>
                      <TabsTrigger value="diets">Diets</TabsTrigger>
                    </TabsList>

                    <TabsContent value="precautions">
                      <ul className="list-disc list-inside space-y-2">
                        {prediction.precautions.map((precaution, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            {precaution}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="medications">
                      <ul className="list-disc list-inside space-y-2">
                        {prediction.medications.map((medication, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            {medication}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="workouts">
                      <ul className="list-disc list-inside space-y-2">
                        {prediction.workouts.map((workout, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            {workout}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="diets">
                      <ul className="list-disc list-inside space-y-2">
                        {prediction.diets.map((diet, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            {diet}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
} 