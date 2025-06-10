"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowRight, Stethoscope, Pill, Dumbbell, Utensils, Info, Shield, AlertTriangle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { MultiSelect } from "@/components/ui/multi-select"
import { useTheme } from "next-themes"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"
import { Alert, AlertDescription } from "@/components/ui/alert"

ChartJS.register(ArcElement, Tooltip, Legend)

interface DiseasePrediction {
  diseaseName: string
  probability: number
  description: string
  precautions: string[]
  medications: string[]
  workouts: string[]
  diets: string[]
  aiInsights?: {
    severity: string
    recommendedActions: string[]
    lifestyleChanges: string[]
    warningSigns: string[]
    followUpRecommendations: string[]
  }
}

interface PredictionResult {
  individual_model_results: {
    DecisionTree: Record<string, number>
    NaiveBayes: Record<string, number>
    RandomForest: Record<string, number>
  }
  input_symptoms: string[]
  iterations_per_model: number
  predicted_probabilities: Record<string, number>
  total_predictions: number
  diseasePredictions: DiseasePrediction[]
}

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

export default function FreeSymptomInput() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<PredictionResult | null>(null)
  const [selectedDisease, setSelectedDisease] = useState<DiseasePrediction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { theme } = useTheme()

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("freeSymptomAnalysis")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // Validate the structure before setting
        if (parsedData && typeof parsedData === 'object' && parsedData.predicted_probabilities) {
          setResults(parsedData)
        }
      } catch (error) {
        console.error("Error parsing saved data:", error)
        localStorage.removeItem("freeSymptomAnalysis")
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
    setError(null)
    
    try {
      const response = await fetch("/api/free-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      })

      const analysisData = await response.json()

      if (!response.ok) {
        throw new Error(analysisData.error || "Failed to analyze symptoms")
      }

      // Validate the response structure
      if (!analysisData.predicted_probabilities || typeof analysisData.predicted_probabilities !== 'object') {
        throw new Error("Invalid response format received")
      }

      setResults(analysisData)
      localStorage.setItem("freeSymptomAnalysis", JSON.stringify(analysisData))
      
      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed successfully",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze symptoms. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatProbability = (prob: number) => {
    return prob.toFixed(2)
  }

  const renderModelPredictions = (modelName: string, predictions: Record<string, number>) => {
    if (!predictions || typeof predictions !== 'object') {
      return (
        <div className="text-center text-muted-foreground py-4">
          No predictions available for {modelName}
        </div>
      )
    }

    const entries = Object.entries(predictions)
    if (entries.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-4">
          No predictions available for {modelName}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {entries
          .sort(([, a], [, b]) => b - a)
          .map(([disease, probability]) => (
            <div
              key={`${modelName}-${disease}`}
              className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded shadow-sm"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">{disease}</span>
              <span className="text-blue-600 dark:text-blue-400">{formatProbability(probability)}%</span>
            </div>
          ))}
      </div>
    )
  }

  const getChartData = () => {
    if (!results || !results.predicted_probabilities || typeof results.predicted_probabilities !== 'object') {
      return null
    }

    const entries = Object.entries(results.predicted_probabilities)
    if (entries.length === 0) {
      return null
    }

    const topPredictions = entries
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    return {
      labels: topPredictions.map(([disease]) => disease),
      datasets: [
        {
          data: topPredictions.map(([, probability]) => probability),
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  const renderDiseaseDetails = (disease: DiseasePrediction) => {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{disease.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Precautions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {disease.precautions.map((precaution, index) => (
                  <li key={index} className="text-muted-foreground">
                    {precaution}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="medications">
              <Pill className="w-4 h-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="workouts">
              <Dumbbell className="w-4 h-4 mr-2" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="diets">
              <Utensils className="w-4 h-4 mr-2" />
              Diets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications">
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc list-inside space-y-1">
                  {disease.medications.map((medication, index) => (
                    <li key={index} className="text-muted-foreground">
                      {medication}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts">
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc list-inside space-y-1">
                  {disease.workouts.map((workout, index) => (
                    <li key={index} className="text-muted-foreground">
                      {workout}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diets">
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc list-inside space-y-1">
                  {disease.diets.map((diet, index) => (
                    <li key={index} className="text-muted-foreground">
                      {diet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {disease.aiInsights && (
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Severity Level</h4>
                <p className="text-muted-foreground">{disease.aiInsights.severity}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recommended Actions</h4>
                <ul className="list-disc list-inside space-y-1">
                  {disease.aiInsights.recommendedActions.map((action, index) => (
                    <li key={index} className="text-muted-foreground">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lifestyle Changes</h4>
                <ul className="list-disc list-inside space-y-1">
                  {disease.aiInsights.lifestyleChanges.map((change, index) => (
                    <li key={index} className="text-muted-foreground">
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Warning Signs</h4>
                <ul className="list-disc list-inside space-y-1">
                  {disease.aiInsights.warningSigns.map((sign, index) => (
                    <li key={index} className="text-muted-foreground">
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Follow-up Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {disease.aiInsights.followUpRecommendations.map((rec, index) => (
                    <li key={index} className="text-muted-foreground">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const toggleDiseaseDetails = (disease: DiseasePrediction) => {
    setSelectedDisease(selectedDisease?.diseaseName === disease.diseaseName ? null : disease)
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
            Select your symptoms to get an instant analysis
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Symptoms
                </label>
                <MultiSelect
                  options={symptoms}
                  value={selectedSymptoms}
                  onChange={setSelectedSymptoms}
                  placeholder="Select symptoms..."
                />
              </div>
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

        {results && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
                <CardDescription>
                  Based on your selected symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-4">Top Predictions</h3>
                    {getChartData() ? (
                      <div className="w-full max-w-[300px] mx-auto">
                        <Pie data={getChartData()!} />
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No prediction data available for chart
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Model Predictions</h3>
                    <Tabs defaultValue="combined" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="combined">Combined</TabsTrigger>
                        <TabsTrigger value="decisionTree">Decision Tree</TabsTrigger>
                        <TabsTrigger value="naiveBayes">Naive Bayes</TabsTrigger>
                        <TabsTrigger value="randomForest">Random Forest</TabsTrigger>
                      </TabsList>
                      <TabsContent value="combined">
                        {renderModelPredictions("Combined", results.predicted_probabilities)}
                      </TabsContent>
                      <TabsContent value="decisionTree">
                        {renderModelPredictions("Decision Tree", results.individual_model_results?.DecisionTree || {})}
                      </TabsContent>
                      <TabsContent value="naiveBayes">
                        {renderModelPredictions("Naive Bayes", results.individual_model_results?.NaiveBayes || {})}
                      </TabsContent>
                      <TabsContent value="randomForest">
                        {renderModelPredictions("Random Forest", results.individual_model_results?.RandomForest || {})}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>

            {results.diseasePredictions && results.diseasePredictions.length > 0 && (
              <div className="space-y-4">
                {results.diseasePredictions.map((disease) => (
                  <Card key={disease.diseaseName}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{disease.diseaseName}</CardTitle>
                          <CardDescription>
                            Probability: {formatProbability(disease.probability)}%
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => toggleDiseaseDetails(disease)}
                        >
                          {selectedDisease?.diseaseName === disease.diseaseName
                            ? "Hide Details"
                            : "Show Details"}
                        </Button>
                      </div>
                    </CardHeader>
                    {selectedDisease?.diseaseName === disease.diseaseName && (
                      <CardContent>{renderDiseaseDetails(disease)}</CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}