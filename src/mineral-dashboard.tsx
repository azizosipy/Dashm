import React, { useState, useEffect } from 'react';
import { Map, Brain, BarChart, PieChart, LineChart, Check, Award, Database, Settings, FileText, Upload, MapPin, Terminal, Zap, RefreshCw, Cpu, Search, Layers, AlertCircle, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import {
  Bar,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  BarChart as RechartsBarChart
} from 'recharts';

// Type definitions
interface InputData {
  host_rocks: string[];
  geological_features: string[];
  deposit_type: string;
  mineralogy: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  age: string;
  grade: number;
  tonnage: number;
}

interface AnalysisData {
  input_data: InputData;
  refined_predictions: {
    deposit_type: string;
    deposit_type_confidence: number;
    alternative_deposit_types: Array<{
      type: string;
      probability: number;
    }>;
    mineral_types: Array<{
      mineral: string;
      probability: number;
    }>;
    commodities: Array<{
      commodity: string;
      probability: number;
    }>;
    grade_estimates: {
      copper: {
        low: number;
        average: number;
        high: number;
        unit: string;
        confidence: number;
      };
      molybdenum: {
        low: number;
        average: number;
        high: number;
        unit: string;
        confidence: number;
      };
      gold: {
        low: number;
        average: number;
        high: number;
        unit: string;
        confidence: number;
      };
    };
    resource_estimates: {
      size_category: string;
      estimated_tonnage: number;
      unit: string;
      range: {
        low: number;
        high: number;
      };
      confidence: number;
    };
    confidence_assessment: {
      overall_confidence: number;
      factors: {
        data_completeness: number;
        deposit_type_confidence: number;
        mineralization_evidence: number;
        knowledge_support: number;
      };
      confidence_level: string;
      explanation: string;
    };
    exploration_strategy: {
      recommended_actions: string[];
      risk_factors: string[];
      timeline: string;
    };
  };
  decision_explanation: string;
  retrieved_knowledge: {
    deposit_type: string;
    confidence: number;
    explanation: string;
    relevant_deposits: Array<{
      name: string;
      location: string;
      similarity_score: number;
    }>;
  };
}

interface GeologicalMapProps {
  data: InputData;
}

interface AgenticSystemProps {
  data: AnalysisData;
}

// Sample data
const SAMPLE_DATA: InputData = {
  host_rocks: ['Granodiorite intruded by quartz monzonite porphyry'],
  geological_features: ['Stockwork quartz veining with potassic alteration grading outward to phyllic and propylitic alteration'],
  deposit_type: 'Porphyry',
  mineralogy: ['Chalcopyrite', 'bornite', 'molybdenite', 'pyrite'],
  location: {
    latitude: 34.5,
    longitude: -106.3
  },
  age: 'Late Cretaceous',
  grade: 0.5,
  tonnage: 300
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const GeologicalMap: React.FC<GeologicalMapProps> = ({ data }: GeologicalMapProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Geological Map</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <Map className="w-8 h-8 text-gray-500" />
        <p className="mt-2">Map visualization will be implemented here</p>
      </div>
    </div>
  );
};

const AgenticSystem: React.FC<AgenticSystemProps> = ({ data }: AgenticSystemProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Agentic System</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <Brain className="w-8 h-8 text-gray-500" />
        <p className="mt-2">Agentic system visualization will be implemented here</p>
      </div>
    </div>
  );
};

const MineralExplorationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [inputData, setInputData] = useState<InputData>(SAMPLE_DATA);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Initialize with sample data
  useEffect(() => {
    console.log("Component mounted, running initial analysis...");
    // Simulate API call to the backend with a timeout
    setTimeout(() => {
      const results = simulateAnalysis(inputData);
      setAnalysisResults(results);
      setLoading(false);
    }, 1500);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const runAnalysis = () => {
    setLoading(true);
    
    // Simulate API call to the backend
    setTimeout(() => {
      const results = simulateAnalysis(inputData);
      setAnalysisResults(results);
      setLoading(false);
    }, 1500);
  };
  
const simulateAnalysis = (data: InputData) => {
    // This function simulates running the model on the input data
    
    return {
      input_data: data,
      refined_predictions: {
        deposit_type: data.deposit_type || 'Porphyry',
        deposit_type_confidence: 0.85,
        alternative_deposit_types: [
          { type: 'Skarn', probability: 0.45 },
          { type: 'IOCG', probability: 0.30 }
        ],
        mineral_types: [
          { mineral: 'Chalcopyrite', probability: 0.92 },
          { mineral: 'Bornite', probability: 0.78 },
          { mineral: 'Molybdenite', probability: 0.86 },
          { mineral: 'Pyrite', probability: 0.95 }
        ],
        commodities: [
          { commodity: 'Copper', probability: 0.94 },
          { commodity: 'Molybdenum', probability: 0.88 },
          { commodity: 'Gold', probability: 0.76 }
        ],
        grade_estimates: {
          copper: { low: 0.3, average: 0.5, high: 0.8, unit: '%', confidence: 0.75 },
          molybdenum: { low: 0.01, average: 0.02, high: 0.05, unit: '%', confidence: 0.7 },
          gold: { low: 0.2, average: 0.4, high: 0.8, unit: 'g/t', confidence: 0.65 }
        },
        resource_estimates: {
          size_category: 'large',
          estimated_tonnage: 300,
          unit: 'Mt',
          range: { low: 150, high: 450 },
          confidence: 0.7
        },
        confidence_assessment: {
          overall_confidence: 0.72,
          confidence_level: 'High',
          factors: {
            data_completeness: 0.8,
            deposit_type_confidence: 0.85,
            mineralization_evidence: 0.75,
            knowledge_support: 0.65
          },
          explanation: "The input data is reasonably complete, supporting reliable analysis. There is good evidence supporting the deposit type classification."
        },
        exploration_strategy: {
          recommended_actions: ['Drill at 100-200m spacing', 'Conduct geophysical surveys'],
          risk_factors: ['Geological complexity', 'Economic uncertainty'],
          timeline: '2-3 years'
        }
      },
      decision_explanation: "The geological context suggests a porphyry deposit type with high confidence, based on the host rocks matching typical host rocks for porphyry. Primary economic commodities would be copper, molybdenum, gold.",
      retrieved_knowledge: {
        deposit_type: 'Porphyry',
        confidence: 0.85,
        explanation: "Based on the geological features and mineralogy, this deposit shows strong characteristics of a porphyry copper deposit.",
        relevant_deposits: [
          { name: 'Bingham Canyon', location: 'Utah, USA', similarity_score: 0.85 },
          { name: 'El Teniente', location: 'Chile', similarity_score: 0.82 },
          { name: 'Grasberg', location: 'Indonesia', similarity_score: 0.78 }
        ]
      }
    };
  };
  
  // Components
  const InputForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Geological Input Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Host Rocks</label>
          <textarea
            name="host_rocks"
            value={inputData.host_rocks.join('\n')}
            onChange={(e) => setInputData(prev => ({
              ...prev,
              host_rocks: e.target.value.split('\n')
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Geological Features</label>
          <textarea
            name="geological_features"
            value={inputData.geological_features.join('\n')}
            onChange={(e) => setInputData(prev => ({
              ...prev,
              geological_features: e.target.value.split('\n')
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deposit Type</label>
          <input
            type="text"
            name="deposit_type"
            value={inputData.deposit_type}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mineralogy</label>
          <textarea
            name="mineralogy"
            value={inputData.mineralogy.join('\n')}
            onChange={(e) => setInputData(prev => ({
              ...prev,
              mineralogy: e.target.value.split('\n')
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={`${inputData.location.latitude}, ${inputData.location.longitude}`}
            onChange={(e) => {
              const [lat, lon] = e.target.value.split(',').map(Number);
              setInputData(prev => ({
                ...prev,
                location: {
                  latitude: lat,
                  longitude: lon
                }
              }));
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="text"
            name="age"
            value={inputData.age}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Grade</label>
          <input
            type="number"
            name="grade"
            value={inputData.grade}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tonnage</label>
          <input
            type="number"
            name="tonnage"
            value={inputData.tonnage}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Run Analysis'}
        </button>
      </div>
    </div>
  );
  
  const DepositTypePrediction = ({ data }: { data: AnalysisData }) => {
    if (!data || !data.refined_predictions) return null;
    
    const { deposit_type, deposit_type_confidence, alternative_deposit_types } = data.refined_predictions;
    
    // Prepare data for pie chart
    const pieData = [
      { name: deposit_type, value: deposit_type_confidence },
      ...(alternative_deposit_types || []).map((alt: { type: string; probability: number }) => ({
        name: alt.type,
        value: alt.probability
      }))
    ];
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Deposit Type Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Primary Deposit Type</h3>
              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                <div className="text-2xl font-bold text-blue-700">{deposit_type}</div>
                <div className="text-sm text-gray-500">Confidence: {(deposit_type_confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Alternative Deposit Types</h3>
              <div className="mt-2 space-y-2">
                {alternative_deposit_types && alternative_deposit_types.map((alt: any, idx: number) => (
                  <div key={idx} className="p-2 bg-gray-50 border border-gray-200 rounded">
                    <div className="font-medium">{alt.type}</div>
                    <div className="text-sm text-gray-500">Probability: {(alt.probability * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-2">Deposit Type Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const MineralizationAnalysis = ({ data }: { data: AnalysisData }) => {
    if (!data || !data.refined_predictions) return null;
    
    const { mineral_types, commodities, grade_estimates } = data.refined_predictions;
    
    // Prepare mineral data for chart
    const mineralData = mineral_types.map(mineral => ({
      name: mineral.mineral,
      probability: mineral.probability
    }));
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Mineralization Analysis</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Potential Minerals</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={mineralData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1]} tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`} />
                  <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                  <Bar dataKey="probability" fill="#8884d8">
                    {mineralData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Grade Estimates</h3>
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commodity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">High</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grade_estimates && Object.entries(grade_estimates).map(([commodity, grade], idx) => {
                    if (commodity === 'estimation_confidence') return null;
                    return (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{commodity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.low}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.average}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.high}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.unit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const ExplorationRecommendations = ({ data }: { data: AnalysisData }) => {
    if (!data || !data.refined_predictions) return null;
    
    const { exploration_strategy } = data.refined_predictions;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Exploration Recommendations</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Recommended Actions</h3>
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="space-y-2">
              {exploration_strategy.recommended_actions.map((action: string, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <div className="font-medium">{action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Risk Factors</h3>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="space-y-2">
                {exploration_strategy.risk_factors.map((risk: string, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <div className="font-medium">{risk}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Timeline</h3>
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-700">{exploration_strategy.timeline}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Update the SimilarDeposits component with better mapping
  const SimilarDeposits = ({ data }: { data: AnalysisData }) => {
    if (!data || !data.retrieved_knowledge || !data.retrieved_knowledge.relevant_deposits) return null;
    
    const { relevant_deposits } = data.retrieved_knowledge;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Similar Deposits</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {relevant_deposits.map((deposit: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-md">
                <div className="font-medium text-blue-700">{deposit.name}</div>
                <div className="text-sm text-gray-700">Location: {deposit.location}</div>
                <div className="text-sm text-gray-700">Similarity: {(deposit.similarity_score * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Global Deposit Distribution</h3>
            <div className="h-80 bg-blue-50 rounded-md overflow-hidden relative">
              {/* World map background */}
              <div className="absolute inset-0 bg-blue-100" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='400' viewBox='0 0 800 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M122,56L85,92L125,113L175,98L217,129L265,133L315,120L346,146L396,139L415,165L485,173L506,153L546,170L585,143L615,167L672,158L705,182L739,171L758,196' stroke='%23BFDBFE' stroke-width='6' fill='none' /%3E%3Cpath d='M125,205L162,223L196,217L224,245L275,250L331,230L385,251L422,218L476,230L525,205L568,225L625,215L675,236L726,222' stroke='%23BFDBFE' stroke-width='6' fill='none' /%3E%3Cpath d='M179,276L225,289L276,275L336,294L382,270L417,295L477,284L542,302L595,278L650,292L702,271L748,294' stroke='%23BFDBFE' stroke-width='6' fill='none' /%3E%3C/svg%3E")`,
                backgroundSize: 'cover'
              }}></div>
              
              {/* Add deposit markers */}
              {/* Bingham Canyon */}
              <div className="absolute top-1/4 left-1/5 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute opacity-75"></div>
                  <div className="w-4 h-4 bg-red-500 rounded-full relative"></div>
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs">
                    <div className="font-bold">Bingham Canyon</div>
                    <div className="text-xs text-gray-500">40.5°N, 112.1°W</div>
                  </div>
                </div>
              </div>
              
              {/* El Teniente */}
              <div className="absolute top-3/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute opacity-75"></div>
                  <div className="w-4 h-4 bg-red-500 rounded-full relative"></div>
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs">
                    <div className="font-bold">El Teniente</div>
                    <div className="text-xs text-gray-500">34.1°S, 70.4°W</div>
                  </div>
                </div>
              </div>
              
              {/* Grasberg */}
              <div className="absolute top-2/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute opacity-75"></div>
                  <div className="w-4 h-4 bg-red-500 rounded-full relative"></div>
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs">
                    <div className="font-bold">Grasberg</div>
                    <div className="text-xs text-gray-500">4.1°S, 137.1°E</div>
                  </div>
                </div>
              </div>
              
              {/* Current location marker */}
              <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-5 h-5 bg-blue-500 rounded-full animate-ping absolute opacity-75"></div>
                  <div className="w-5 h-5 bg-blue-500 rounded-full relative flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded shadow-md text-xs">
                    <div className="font-bold">Current Target</div>
                    <div className="text-xs">34.5°N, 106.3°W</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-2 left-2 bg-white bg-opacity-50 rounded px-2 py-1">
                <div className="text-xs text-gray-700 font-medium">Deposit Similarity</div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-600">Similar Deposits</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-600">Current Target</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Regional Geological Context</h3>
          <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-700">
            The identified similar deposits share geological characteristics with the target area, 
            including comparable tectonic settings (Continental arc) and intrusive host rocks.
            These analogs suggest favorable conditions for porphyry-style mineralization in the target region.
          </div>
        </div>
      </div>
    );
  };
  
  const ConfidenceAssessment = ({ data }: { data: AnalysisData }) => {
    if (!data || !data.refined_predictions || !data.refined_predictions.confidence_assessment) return null;
    
    const { confidence_assessment } = data.refined_predictions;
    const { overall_confidence, confidence_level, factors, explanation } = confidence_assessment;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Confidence Assessment</h2>
        
        <div className="flex items-center mb-4">
          <div className="text-3xl font-bold mr-3">{(overall_confidence * 100).toFixed(0)}%</div>
          <div className="text-xl font-medium text-gray-700">{confidence_level} Confidence</div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Confidence Factors</h3>
          <div className="space-y-2">
            {Object.entries(factors).map(([factor, value]) => (
              <div key={factor} className="flex items-center">
                <div className="w-48 text-sm capitalize">{factor.replace(/_/g, ' ')}</div>
                <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${value * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-sm">{(value * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Explanation</h3>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{explanation}</p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mineral Exploration AI</h1>
              <p className="text-gray-500 mt-1">Advanced geological analysis and exploration optimization system</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm flex items-center">
                <Database size={16} className="mr-1" /> RAG System Active
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm flex items-center">
                <Map size={16} className="mr-1" /> GIS Enabled
              </button>
              <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm flex items-center">
                <Cpu size={16} className="mr-1" /> Agentic AI Active
              </button>
            </div>
          </div>
        </header>
        
        <div className="mb-6">
          <InputForm />
        </div>
        
        {loading && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
              <div className="text-xl font-bold text-gray-800">Processing Geological Data</div>
              <div className="text-gray-500 mt-2">Analyzing and generating exploration recommendations...</div>
            </div>
          </div>
        )}
        
        {analysisResults && !loading && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Check className="text-green-500" size={24} />
                <h2 className="text-xl font-bold">Analysis Complete</h2>
              </div>
              
              <div>
                <div className="flex border-b border-gray-200 mb-4">
                  <button 
                    className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(0)}
                  >
                    Deposit Type
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 5 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(5)}
                  >
                    Knowledge Base
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 6 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(6)}
                  >
                    Agentic System
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 7 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(7)}
                  >
                    Geological Maps
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(1)}
                  >
                    Mineralization
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(2)}
                  >
                    Exploration Plan
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 3 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(3)}
                  >
                    Similar Deposits
                  </button>
                  <button 
                    className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 4 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(4)}
                  >
                    Confidence
                  </button>
                </div>
                
                <div>
                  {activeTab === 0 && <DepositTypePrediction data={analysisResults} />}
                  {activeTab === 1 && <MineralizationAnalysis data={analysisResults} />}
                  {activeTab === 2 && <ExplorationRecommendations data={analysisResults} />}
                  {activeTab === 3 && <SimilarDeposits data={analysisResults} />}
                  {activeTab === 4 && <ConfidenceAssessment data={analysisResults} />}
                  {activeTab === 5 && <AgenticSystem data={analysisResults} />}
                  {activeTab === 6 && <GeologicalMap data={inputData} />}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Mineral Exploration AI - Advanced geological analysis system</p>
          <p className="mt-1">© 2025 Mineral Exploration Systems Inc.</p>
        </footer>
      </div>
    </div>
  );
};

export default MineralExplorationDashboard;
