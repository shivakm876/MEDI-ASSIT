"use client"

import { useState, useEffect } from 'react';
import Select, { MultiValue } from 'react-select';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTheme } from 'next-themes';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Option {
  value: string;
  label: string;
}

interface DiseasePrediction {
  id: string;
  diseaseName: string;
  probability: number;
  description: string;
  precautions: string[];
  medications: string[];
  workouts: string[];
  diets: string[];
  aiInsights?: {
    severity: string;
    recommendedActions: string[];
    lifestyleChanges: string[];
    warningSigns: string[];
    followUpRecommendations: string[];
  };
}

interface PredictionResult {
  individual_model_results: {
    DecisionTree: Record<string, number>;
    NaiveBayes: Record<string, number>;
    RandomForest: Record<string, number>;
  };
  input_symptoms: string[];
  iterations_per_model: number;
  predicted_probabilities: Record<string, number>;
  total_predictions: number;
  symptomEntryId: string;
  diseasePredictions: DiseasePrediction[];
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
];

export default function DiseasePredictor() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<DiseasePrediction | null>(null);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/disease-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get predictions');
      }

      setResults(data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get predictions');
    } finally {
      setLoading(false);
    }
  };

  const formatProbability = (prob: number) => {
    return prob.toFixed(2);
  };

  const renderModelPredictions = (modelName: string, predictions: Record<string, number>) => {
    return (
      <div className="space-y-2">
        {Object.entries(predictions)
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
    );
  };

  const getChartData = () => {
    if (!results) return null;

    const diseases = Object.entries(results.predicted_probabilities)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Show top 5 predictions

    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
    ];

    return {
      labels: diseases.map(([disease]) => disease),
      datasets: [
        {
          data: diseases.map(([, probability]) => probability),
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: theme === 'dark' ? '#fff' : '#000',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.raw.toFixed(2)}%`;
          },
        },
      },
    },
  };

  const renderDiseaseDetails = (disease: DiseasePrediction) => {
    return (
      <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-200">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{disease.diseaseName}</h3>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              {disease.probability.toFixed(2)}% Probability
            </span>
            {disease.aiInsights && (
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                disease.aiInsights.severity === 'High' 
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  : disease.aiInsights.severity === 'Medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              }`}>
                {disease.aiInsights.severity} Severity
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{disease.description}</p>

        {disease.aiInsights && (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">AI Analysis & Recommendations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Recommended Actions</h5>
                <ul className="space-y-2">
                  {disease.aiInsights.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                      <span className="mr-2">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Warning Signs to Watch For</h5>
                <ul className="space-y-2">
                  {disease.aiInsights.warningSigns.map((sign, index) => (
                    <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                      <span className="mr-2">•</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Lifestyle Changes</h5>
                <ul className="space-y-2">
                  {disease.aiInsights.lifestyleChanges.map((change, index) => (
                    <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                      <span className="mr-2">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Follow-up Recommendations</h5>
                <ul className="space-y-2">
                  {disease.aiInsights.followUpRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                      <span className="mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100 text-lg">Precautions</h4>
            <ul className="space-y-2">
              {disease.precautions.map((precaution, index) => (
                <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                  <span className="mr-2">•</span>
                  <span>{precaution}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100 text-lg">Medications</h4>
            <ul className="space-y-2">
              {disease.medications.map((medication, index) => (
                <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                  <span className="mr-2">•</span>
                  <span>{medication}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100 text-lg">Recommended Exercises</h4>
            <ul className="space-y-2">
              {disease.workouts.map((workout, index) => (
                <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                  <span className="mr-2">•</span>
                  <span>{workout}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100 text-lg">Dietary Recommendations</h4>
            <ul className="space-y-2">
              {disease.diets.map((diet, index) => (
                <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                  <span className="mr-2">•</span>
                  <span>{diet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const toggleDiseaseDetails = (disease: DiseasePrediction) => {
    if (selectedDisease?.id === disease.id) {
      setSelectedDisease(null);
    } else {
      setSelectedDisease(disease);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Disease Predictor</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Symptoms (Max 5)
            </label>
            <Select<Option, true>
              isMulti
              value={selectedSymptoms.map(symptom => ({ value: symptom, label: symptom }))}
              onChange={(selected: MultiValue<Option>) => {
                const newSymptoms = selected ? selected.map(option => option.value) : [];
                if (newSymptoms.length <= 5) {
                  setSelectedSymptoms(newSymptoms);
                }
              }}
              options={symptoms}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select symptoms..."
              isOptionDisabled={() => selectedSymptoms.length >= 5}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: theme === 'dark' ? 'rgb(31 41 55)' : 'rgb(255 255 255)',
                  borderColor: theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(209 213 219)',
                  '&:hover': {
                    borderColor: theme === 'dark' ? 'rgb(107 114 128)' : 'rgb(156 163 175)'
                  }
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: theme === 'dark' ? 'rgb(31 41 55)' : 'rgb(255 255 255)'
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused 
                    ? (theme === 'dark' ? 'rgb(55 65 81)' : 'rgb(243 244 246)')
                    : (theme === 'dark' ? 'rgb(31 41 55)' : 'rgb(255 255 255)'),
                  color: theme === 'dark' ? 'rgb(243 244 246)' : 'rgb(17 24 39)',
                  '&:active': {
                    backgroundColor: theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(229 231 235)'
                  }
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: theme === 'dark' ? 'rgb(55 65 81)' : 'rgb(243 244 246)'
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: theme === 'dark' ? 'rgb(243 244 246)' : 'rgb(17 24 39)'
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: theme === 'dark' ? 'rgb(156 163 175)' : 'rgb(107 114 128)',
                  '&:hover': {
                    backgroundColor: theme === 'dark' ? 'rgb(75 85 99)' : 'rgb(229 231 235)',
                    color: theme === 'dark' ? 'rgb(243 244 246)' : 'rgb(17 24 39)'
                  }
                })
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
              loading 
                ? 'bg-blue-400 dark:bg-blue-500' 
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            }`}
          >
            {loading ? 'Predicting...' : 'Predict Disease'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}

        {results && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Prediction Distribution</h3>
                <div className="h-[400px] flex items-center justify-center">
                  {getChartData() && <Pie data={getChartData()!} options={chartOptions} />}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Model Predictions</h3>
                <div className="space-y-4">
                  {Object.entries(results.individual_model_results).map(([model, predictions]) => (
                    <div key={model} className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{model}</h4>
                      {renderModelPredictions(model, predictions)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Disease Details</h3>
              <div className="space-y-4">
                {results.diseasePredictions
                  .sort((a, b) => b.probability - a.probability)
                  .map((prediction) => (
                    <div key={prediction.id} className="space-y-2">
                      <div
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                        onClick={() => toggleDiseaseDetails(prediction)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{prediction.diseaseName}</span>
                            <svg
                              className={`w-5 h-5 transform transition-transform duration-200 ${
                                selectedDisease?.id === prediction.id ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                          <span className="text-blue-600 dark:text-blue-400">{formatProbability(prediction.probability)}%</span>
                        </div>
                      </div>
                      
                      {selectedDisease?.id === prediction.id && (
                        <div className="mt-2 animate-fadeIn">
                          {renderDiseaseDetails(prediction)}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 