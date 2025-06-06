"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MultiSelect } from "@/components/ui/multi-select"
import { useToast } from "@/hooks/use-toast"
import { DiseaseDetails } from "@/components/DiseaseDetails"

// Complete symptoms dictionary from the Flask app
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

export function SymptomsInput() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const { toast } = useToast()

  const handleSubmit = async () => {
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
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      })

      if (!response.ok) {
        throw new Error("Prediction failed")
      }

      const data = await response.json()
      setPrediction(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Disease Prediction</CardTitle>
          <CardDescription>
            Select your symptoms to get a prediction
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
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Predicting..." : "Predict Disease"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {prediction && (
        <DiseaseDetails
          disease={prediction.disease}
          description={prediction.description}
          precautions={prediction.precautions}
          medications={prediction.medications}
          diet={prediction.diet}
          workout={prediction.workout}
        />
      )}
    </div>
  )
} 