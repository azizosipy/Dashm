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
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Color scheme
const THEME = {
  primary: '#1E40AF', // Dark blue
  secondary: '#3B82F6', // Medium blue
  accent: '#93C5FD', // Light blue
  background: '#F8FAFC', // Very light blue/gray
  white: '#FFFFFF',
  gray: {
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  }
};

// Chart colors
const CHART_COLORS = [
  '#3B82F6', // Blue
  '#60A5FA',
  '#93C5FD',
  '#BFDBFE',
  '#2563EB',
  '#1D4ED8',
  '#1E40AF',
];

// Animation keyframes
const ANIMATIONS = {
  fadeIn: `@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }`,
  slideIn: `@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }`,
  pulse: `@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }`,
};

// Add styles to head
const style = document.createElement('style');
style.textContent = `
  ${ANIMATIONS.fadeIn}
  ${ANIMATIONS.slideIn}
  ${ANIMATIONS.pulse}
  
  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }
  
  .slide-in {
    animation: slideIn 0.5s ease-out;
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
  
  .hover-scale {
    transition: transform 0.2s ease-in-out;
  }
  
  .hover-scale:hover {
    transform: scale(1.02);
  }
  
  .glass-effect {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;
document.head.appendChild(style);

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

const GeologicalMap: React.FC<GeologicalMapProps> = ({ data }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 rounded-2xl shadow-2xl p-8 transform transition-all duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-300">
          <div className="relative inline-block">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 mb-3">
              Advanced Geological Visualization
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 mx-auto rounded-full 
                          transform hover:scale-x-110 transition-transform duration-300"></div>
          </div>
          <p className="text-gray-300 mt-4 text-lg">
            Multidimensional Geological Data Analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* 3D Model View */}
          <div 
            className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl 
                       transform transition-all duration-500 hover:scale-[1.02] 
                       ${hoveredCard === 0 ? 'ring-2 ring-cyan-400 shadow-cyan-400/20' : ''}`}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setSelectedCard(selectedCard === 0 ? null : 0)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Interactive 3D Model
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-cyan-300">Depth: 0-500m</span>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
              <img 
                src="/3D Deposit Model.png" 
                alt="3D Deposit Model" 
                className="w-full h-full object-cover transform transition-transform duration-700 
                         group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent 
                            opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 right-4 backdrop-blur-md bg-black/30 p-3 rounded-lg 
                            transform transition-all duration-300 group-hover:translate-y-0 translate-y-2 opacity-90">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded animate-pulse"></div>
                    <span className="text-gray-200">Mineralized Zone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded animate-pulse"></div>
                    <span className="text-gray-200">Veining</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded animate-pulse"></div>
                    <span className="text-gray-200">Host Rock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Geochemical Anomalies */}
          <div 
            className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl 
                       transform transition-all duration-500 hover:scale-[1.02]
                       ${hoveredCard === 1 ? 'ring-2 ring-teal-400 shadow-teal-400/20' : ''}`}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setSelectedCard(selectedCard === 1 ? null : 1)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-xl opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                Geochemical Anomalies
              </h3>
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                <span className="text-sm text-teal-300">Cu (ppm):</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">&lt;50</span>
                  <div className="w-20 h-2 bg-gradient-to-r from-teal-500 via-emerald-400 to-yellow-300 rounded-full"></div>
                  <span className="text-xs text-gray-400">&gt;1000</span>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
              <img 
                src="/Geochemical Anomalies.png" 
                alt="Geochemical Anomalies" 
                className="w-full h-full object-cover transform transition-transform duration-700 
                         group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent 
                            opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Geophysical Anomaly Map */}
          <div 
            className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl 
                       transform transition-all duration-500 hover:scale-[1.02]
                       ${hoveredCard === 2 ? 'ring-2 ring-purple-400 shadow-purple-400/20' : ''}`}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setSelectedCard(selectedCard === 2 ? null : 2)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                Geophysical Anomalies
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-purple-300">Resolution: 100m</span>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
              <img 
                src="/Geophysical Anomaly Map.png" 
                alt="Geophysical Anomaly Map" 
                className="w-full h-full object-cover transform transition-transform duration-700 
                         group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent 
                            opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 right-4 backdrop-blur-md bg-black/30 p-3 rounded-lg 
                            transform transition-all duration-300 group-hover:translate-y-0 translate-y-2 opacity-90">
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="text-gray-200">Magnetic Intensity</span>
                  </div>
                  <div className="text-xs text-purple-300 mt-1">IP Anomaly</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mineralization Potential */}
          <div 
            className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl 
                       transform transition-all duration-500 hover:scale-[1.02]
                       ${hoveredCard === 3 ? 'ring-2 ring-amber-400 shadow-amber-400/20' : ''}`}
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setSelectedCard(selectedCard === 3 ? null : 3)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
                Mineralization Potential
              </h3>
              <div className="flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full">
                <span className="text-sm text-amber-300">34.5°N, 106.3°W</span>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
              <img 
                src="/Mineralization Potential Heatmap.png" 
                alt="Mineralization Potential Heatmap" 
                className="w-full h-full object-cover transform transition-transform duration-700 
                         group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent 
                            opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 right-4 backdrop-blur-md bg-black/30 p-3 rounded-lg 
                            transform transition-all duration-300 group-hover:translate-y-0 translate-y-2 opacity-90">
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    <span className="text-gray-200">Mineralization Potential</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 border-2 border-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-300">Drill Points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 backdrop-blur-md bg-white/5 rounded-xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-teal-400 rounded-full mr-4"></div>
            <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              Integrated Analysis
            </h3>
          </div>
          <div className="text-gray-300 space-y-6">
            <p className="leading-relaxed">
              The geological data reveals a remarkable correlation between magnetic anomalies 
              and high-grade copper zones. The 3D model highlights a characteristic 
              inverted cone mineralization structure, typical of porphyry deposits.
            </p>
            <div className="pl-6 border-l-2 border-blue-500/30">
              <p className="text-lg font-medium text-blue-300 mb-4">
                Key Mineralization Indicators:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Geochemical anomalies Cu {'>'} 1000 ppm</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Characteristic magnetic signature</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>Well-developed vein structures</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Intensive hydrothermal alteration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KnowledgeBase: React.FC<{ data: AnalysisData }> = ({ data }) => {
  return (
    <div className="glass-effect rounded-xl p-6 shadow-lg slide-in">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent mb-6">
        Knowledge Base Integration
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-5 shadow-md hover-scale">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Retrieved Similar Deposit Types
            </h3>
            <div className="space-y-2">
              {data.retrieved_knowledge.relevant_deposits.map((deposit, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-md">
                  <div className="font-medium text-blue-900">{deposit.name}</div>
                  <div className="text-sm text-gray-600">Similarity: {(deposit.similarity_score * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-md hover-scale">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-blue-600" />
              Retrieved Host Rock Associations
            </h3>
            <div className="p-3 bg-blue-50 rounded-md">
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {data.input_data.host_rocks.map((rock, index) => (
                  <li key={index}>{rock}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-5 shadow-md hover-scale">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-600" />
              Pathfinder Element Knowledge
            </h3>
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-gray-700">
                Pathfinder elements identified from the knowledge base that are commonly 
                associated with these deposit types. These elements can be used to guide 
                geochemical exploration programs.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-md hover-scale">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Knowledge Integration Process
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Query formulation based on geological context
              </li>
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Knowledge retrieval using vector similarity search
              </li>
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Relevance scoring and ranking of retrieved documents
              </li>
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Integration of retrieved knowledge with ML predictions
              </li>
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Confidence weighting based on knowledge support
              </li>
              <li className="flex items-center text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Refinement of deposit type and mineralization predictions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgenticSystem: React.FC<{ data: AnalysisData }> = ({ data }) => {
  return (
    <div className="glass-effect rounded-xl p-6 shadow-lg slide-in">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent mb-6">
        Neurons AI System
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-5 shadow-md hover-scale">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-blue-600" />
              Autonomous Decision Making
            </h3>
            <p className="text-gray-700 mb-4">
              The Mineral Exploration Agent operates as an autonomous decision-making entity 
              that processes geological data, performs multi-step reasoning, and makes 
              strategic recommendations without human intervention.
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-md hover-scale">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Capabilities</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></div>
                <span className="text-gray-700">Multi-step reasoning - Progressive analysis from geological context to specific recommendations</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></div>
                <span className="text-gray-700">Decision optimization - Intelligent prioritization of exploration activities and budget allocation</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></div>
                <span className="text-gray-700">Knowledge integration - Combining retrieved information with geological reasoning</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></div>
                <span className="text-gray-700">Self-assessment - Evaluating confidence in predictions and recommendations</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></div>
                <span className="text-gray-700">Explanatory reasoning - Providing transparent rationale for all decisions</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-md hover-scale">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Decision Process</h3>
          <div className="space-y-4">
            <div className="relative pl-8">
              <div className="absolute left-0 top-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">1</span>
              </div>
              <h4 className="font-medium text-blue-900">Context Creation</h4>
              <p className="text-gray-600 text-sm">The agent processes input data to create a comprehensive geological context for reasoning.</p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-0 top-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">2</span>
              </div>
              <h4 className="font-medium text-blue-900">Knowledge Retrieval</h4>
              <p className="text-gray-600 text-sm">Similar deposits and geological contexts are retrieved from the knowledge base.</p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-0 top-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">3</span>
              </div>
              <h4 className="font-medium text-blue-900">Deposit Type Analysis</h4>
              <p className="text-gray-600 text-sm">The agent evaluates evidence to determine the most probable deposit type with alternatives.</p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-0 top-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">4</span>
              </div>
              <h4 className="font-medium text-blue-900">Mineralization Assessment</h4>
              <p className="text-gray-600 text-sm">Potential minerals, commodities, grades, and tonnage are evaluated.</p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-0 top-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">5</span>
              </div>
              <h4 className="font-medium text-blue-900">Exploration Strategy</h4>
              <p className="text-gray-600 text-sm">The agent determines optimal drilling, surveys, sampling, and prioritizes actions.</p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-0 top-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">6</span>
              </div>
              <h4 className="font-medium text-blue-900">Confidence Evaluation</h4>
              <p className="text-gray-600 text-sm">Overall confidence and contributing factors are assessed for transparency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MineralExplorationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [inputData, setInputData] = useState<InputData>(SAMPLE_DATA);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
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
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl p-8 transform transition-all duration-500">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
            Geological Input Data
          </h2>
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl flex items-center hover:scale-105 transform transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="mr-2 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap size={20} className="mr-2" />
                <span>Run Analysis</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Host Rocks</label>
              <textarea
                name="host_rocks"
                value={inputData.host_rocks.join('\n')}
                onChange={(e) => setInputData(prev => ({
                  ...prev,
                  host_rocks: e.target.value.split('\n')
                }))}
                className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none backdrop-blur-xl"
                rows={3}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Geological Features</label>
              <textarea
                name="geological_features"
                value={inputData.geological_features.join('\n')}
                onChange={(e) => setInputData(prev => ({
                  ...prev,
                  geological_features: e.target.value.split('\n')
                }))}
                className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none backdrop-blur-xl"
                rows={3}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Deposit Type</label>
              <input
                type="text"
                name="deposit_type"
                value={inputData.deposit_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Mineralogy</label>
              <textarea
                name="mineralogy"
                value={inputData.mineralogy.join('\n')}
                onChange={(e) => setInputData(prev => ({
                  ...prev,
                  mineralogy: e.target.value.split('\n')
                }))}
                className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none backdrop-blur-xl"
                rows={3}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Latitude"
                    value={inputData.location.latitude}
                    onChange={(e) => setInputData(prev => ({
                      ...prev,
                      location: { ...prev.location, latitude: parseFloat(e.target.value) }
                    }))}
                    className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Longitude"
                    value={inputData.location.longitude}
                    onChange={(e) => setInputData(prev => ({
                      ...prev,
                      location: { ...prev.location, longitude: parseFloat(e.target.value) }
                    }))}
                    className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Grade</label>
                <input
                  type="number"
                  name="grade"
                  value={inputData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Tonnage</label>
                <input
                  type="number"
                  name="tonnage"
                  value={inputData.tonnage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const DepositTypePrediction = ({ data }: { data: AnalysisData }) => {
    if (!data || !data.refined_predictions) return null;
    
    const depositData = [
      { 
        name: 'Porphyry',
        value: 0.53,
        color: '#3B82F6',
        description: 'Most common deposit type'
      },
      { 
        name: 'Skarn',
        value: 0.28,
        color: '#22C55E',
        description: 'Significant but less common type'
      },
      { 
        name: 'IOCG',
        value: 0.19,
        color: '#EAB308',
        description: 'Least frequent type'
      }
    ];
    
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Deposit Type Distribution
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {depositData.map((item, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-xl transition-transform hover:scale-105"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <div className="flex items-center justify-center mb-2">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-semibold text-gray-900">{item.name}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: item.color }}>
                  {(item.value * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-700 text-center">
              The distribution shows a predominance of Porphyry deposits (53%), 
              followed by Skarn deposits (28%) and IOCG (19%). This distribution 
              is typical of regions with high porphyry copper-gold potential.
            </p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <header className="relative overflow-hidden backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl mb-8 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <img 
                    src="/logo-png.png" 
                    alt="Mineral Exploration AI Logo" 
                    className="relative h-16 w-auto transform transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
                  EarthScience.AI
                  </h1>
                  <p className="text-gray-300 mt-2 text-lg">
                    Advanced Geological Analysis and Exploration Optimization System
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl text-sm flex items-center hover:scale-105 transform transition-all duration-300 shadow-lg shadow-blue-500/20">
                  <Database size={18} className="mr-2" /> 
                  <span>RAG System Active</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-800 text-white rounded-xl text-sm flex items-center hover:scale-105 transform transition-all duration-300 shadow-lg shadow-cyan-500/20">
                  <Map size={18} className="mr-2" /> 
                  <span>GIS Enabled</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-xl text-sm flex items-center hover:scale-105 transform transition-all duration-300 shadow-lg shadow-teal-500/20">
                  <Cpu size={18} className="mr-2" /> 
                  <span>EarthScience AI</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="mb-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl p-8 transform transition-all duration-500">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
                  Geological Input Data
                </h2>
                <button
                  onClick={runAnalysis}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl flex items-center hover:scale-105 transform transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={20} className="mr-2 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={20} className="mr-2" />
                      <span>Run Analysis</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Host Rocks</label>
                    <textarea
                      name="host_rocks"
                      value={inputData.host_rocks.join('\n')}
                      onChange={(e) => setInputData(prev => ({
                        ...prev,
                        host_rocks: e.target.value.split('\n')
                      }))}
                      className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none backdrop-blur-xl"
                      rows={3}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Geological Features</label>
                    <textarea
                      name="geological_features"
                      value={inputData.geological_features.join('\n')}
                      onChange={(e) => setInputData(prev => ({
                        ...prev,
                        geological_features: e.target.value.split('\n')
                      }))}
                      className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none backdrop-blur-xl"
                      rows={3}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Deposit Type</label>
                    <input
                      type="text"
                      name="deposit_type"
                      value={inputData.deposit_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mineralogy</label>
                    <textarea
                      name="mineralogy"
                      value={inputData.mineralogy.join('\n')}
                      onChange={(e) => setInputData(prev => ({
                        ...prev,
                        mineralogy: e.target.value.split('\n')
                      }))}
                      className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none backdrop-blur-xl"
                      rows={3}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          placeholder="Latitude"
                          value={inputData.location.latitude}
                          onChange={(e) => setInputData(prev => ({
                            ...prev,
                            location: { ...prev.location, latitude: parseFloat(e.target.value) }
                          }))}
                          className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Longitude"
                          value={inputData.location.longitude}
                          onChange={(e) => setInputData(prev => ({
                            ...prev,
                            location: { ...prev.location, longitude: parseFloat(e.target.value) }
                          }))}
                          className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Grade</label>
                      <input
                        type="number"
                        name="grade"
                        value={inputData.grade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tonnage</label>
                      <input
                        type="number"
                        name="tonnage"
                        value={inputData.tonnage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl p-12 text-center mb-8">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-12 h-12 text-blue-500" />
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent mb-2">
                Analysis in Progress
              </h3>
              <div className="text-gray-500">
                Processing geological data and generating recommendations...
              </div>
              <div className="mt-6 flex space-x-2 items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {analysisResults && !loading && (
          <div className="space-y-8">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75"></div>
                  <div className="relative bg-gray-900 rounded-full p-2">
                    <Check className="text-green-500 w-6 h-6" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  Analysis Complete
                </h2>
              </div>

              <div className="relative">
                <div className="flex border-b border-gray-700/50 mb-8 overflow-x-auto scrollbar-hide">
                  {[
                    { icon: <PieChart className="w-5 h-5" />, text: "Deposit Type" },
                    { icon: <Database className="w-5 h-5" />, text: "Knowledge Base" },
                    { icon: <Brain className="w-5 h-5" />, text: "Agent System" },
                    { icon: <Map className="w-5 h-5" />, text: "Geological Maps" },
                    { icon: <BarChart className="w-5 h-5" />, text: "Mineralization" },
                    { icon: <Search className="w-5 h-5" />, text: "Exploration Plan" },
                    { icon: <Terminal className="w-5 h-5" />, text: "Similar Deposits" },
                    { icon: <Award className="w-5 h-5" />, text: "Confidence Level" }
                  ].map((tab, index) => (
                    <button 
                      key={index}
                      className={`flex items-center px-6 py-4 font-medium focus:outline-none transition-all duration-300 whitespace-nowrap
                        ${activeTab === index 
                          ? 'text-blue-400 border-b-2 border-blue-500 translate-y-[1px]' 
                          : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab(index)}
                    >
                      <div className={`mr-2 transition-colors duration-300 ${activeTab === index ? 'text-blue-400' : 'text-gray-500'}`}>
                        {tab.icon}
                      </div>
                      {tab.text}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  {activeTab === 0 && <DepositTypePrediction data={analysisResults} />}
                  {activeTab === 1 && <KnowledgeBase data={analysisResults} />}
                  {activeTab === 2 && <AgenticSystem data={analysisResults} />}
                  {activeTab === 3 && <GeologicalMap data={inputData} />}
                  {activeTab === 4 && <MineralizationAnalysis data={analysisResults} />}
                  {activeTab === 5 && <ExplorationRecommendations data={analysisResults} />}
                  {activeTab === 6 && <SimilarDeposits data={analysisResults} />}
                  {activeTab === 7 && <ConfidenceAssessment data={analysisResults} />}
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 pb-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl p-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <img 
                    src="/logo-png.png" 
                    alt="Mineral Exploration AI Logo" 
                    className="relative h-12 w-auto"
                  />
                </div>
                <h3 className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Mineral Exploration AI
                </h3>
              </div>
              <p className="text-gray-400 mb-6">Advanced Geological Analysis System</p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <span>© 2025 Mineral Exploration Systems Inc.</span>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MineralExplorationDashboard;