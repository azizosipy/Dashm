import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as math from 'mathjs';
import _ from 'lodash';
import Papa from 'papaparse';

// Mock data for the dashboard based on your XGBoost model features
const commodityColors = {
  "Gold": "#FFD700",
  "Copper": "#B87333",
  "Silver": "#C0C0C0",
  "Iron": "#A52A2A",
  "Lead": "#778899",
  "Zinc": "#D3D3D3",
  "Nickel": "#8FBC8F",
  "Uranium": "#32CD32",
  "Manganese": "#800080",
  "Chromium": "#4682B4"
};

const MineralDashboard = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCommodity, setSelectedCommodity] = useState('all');
  const [queryInput, setQueryInput] = useState('');
  const [queryResponse, setQueryResponse] = useState('');
  const [modelPrediction, setModelPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample feature data based on your XGBoost model
  const [featureInputs, setFeatureInputs] = useState({
    "Age": "Cenozoic",
    "Lithologic_litho": "Granite",
    "Stratigraphy": "Igneous",
    "SuperGroup_geo": "Magmatic",
    "GroupName_geo": "Intrusive",
    "Avg_grav_0.005": 5.2,
    "Avg_grav_0.075": 4.8,
    "Avg_grav_2.2": 3.5,
    "Avg_mag_0.005": 12.3,
    "Avg_mag_0.075": 10.5,
    "Avg_mag_2.2": 8.2,
    "nearest_distance_fault": 0.75
  });

  // Sample geological data
  const mockGeologicalData = [
    { id: 1, commodity: "Gold", lat: 34.5, lng: -117.2, probability: 0.85 },
    { id: 2, commodity: "Copper", lat: 34.7, lng: -117.5, probability: 0.92 },
    { id: 3, commodity: "Silver", lat: 34.3, lng: -117.1, probability: 0.67 },
    { id: 4, commodity: "Iron", lat: 34.6, lng: -117.3, probability: 0.78 },
    { id: 5, commodity: "Gold", lat: 34.8, lng: -117.4, probability: 0.71 },
    { id: 6, commodity: "Copper", lat: 34.4, lng: -117.0, probability: 0.88 },
    { id: 7, commodity: "Lead", lat: 34.9, lng: -117.6, probability: 0.63 },
    { id: 8, commodity: "Zinc", lat: 34.2, lng: -117.8, probability: 0.59 },
    { id: 9, commodity: "Gold", lat: 34.1, lng: -117.7, probability: 0.93 },
    { id: 10, commodity: "Iron", lat: 34.0, lng: -117.9, probability: 0.81 }
  ];

  const [geologicalData, setGeologicalData] = useState(mockGeologicalData);

  // Sample heatmap data (would be calculated from real data)
  const mockHeatmapData = [
    { x: 0, y: 0, value: 0.2, commodity: "Gold" },
    { x: 0, y: 1, value: 0.5, commodity: "Gold" },
    { x: 0, y: 2, value: 0.8, commodity: "Gold" },
    { x: 1, y: 0, value: 0.3, commodity: "Copper" },
    { x: 1, y: 1, value: 0.9, commodity: "Copper" },
    { x: 1, y: 2, value: 0.6, commodity: "Copper" },
    { x: 2, y: 0, value: 0.7, commodity: "Silver" },
    { x: 2, y: 1, value: 0.4, commodity: "Silver" },
    { x: 2, y: 2, value: 0.1, commodity: "Silver" }
  ];

  // Feature importance data from your XGBoost model
  const featureImportance = [
    { feature: "nearest_distance_fault", importance: 0.24 },
    { feature: "Avg_mag_0.005", importance: 0.18 },
    { feature: "Lithologic_litho", importance: 0.15 },
    { feature: "Avg_grav_0.005", importance: 0.12 },
    { feature: "Age", importance: 0.09 },
    { feature: "Stratigraphy", importance: 0.08 },
    { feature: "Avg_mag_2.2", importance: 0.06 },
    { feature: "SuperGroup_geo", importance: 0.04 },
    { feature: "GroupName_geo", importance: 0.02 },
    { feature: "Avg_grav_2.2", importance: 0.01 },
    { feature: "Avg_grav_0.075", importance: 0.01 }
  ];

  // Commodity distribution data
  const commodityDistribution = [
    { name: "Gold", value: 35 },
    { name: "Copper", value: 25 },
    { name: "Silver", value: 15 },
    { name: "Iron", value: 10 },
    { name: "Lead", value: 5 },
    { name: "Zinc", value: 3 },
    { name: "Nickel", value: 3 },
    { name: "Uranium", value: 2 },
    { name: "Manganese", value: 1 },
    { name: "Chromium", value: 1 }
  ];

  // Filter data based on selected commodity
  const filteredData = selectedCommodity === 'all' 
    ? geologicalData 
    : geologicalData.filter(item => item.commodity === selectedCommodity);

  // QA System based on the geochemical methods document
  const geochemQASystem = (query) => {
    // Comprehensive geochemical methods database built from the PDF
    const geochemicalMethods = {
      terms: {
        "LOD": "Limit of detection (LOD, also referred to as the detection limit) refers to the entire analytical measurement process and is the lowest concentration level of the analyte that can be determined to be statistically differed from the analytical blank. The LOD is 3 times the standard deviation of the mean for repeated measurement on method blanks.",
        "LLD": "Lower Limit of Determination (LLD; also referred to as the lower reporting limit) is defined as 5 times the standard deviation of the mean for repeated measurement on method blanks.",
        "URL": "Upper reporting limits (URL) are determined by the contract laboratory and are determined for the entire analytical process and not based on instrument capabilities. Determination is made using spiked samples and URL is determined as the limit of the linear range in a regression analysis."
      },
      methods: {
        "sodium_peroxide_fusion": {
          name: "Multi-element determination by inductively coupled plasma-optical emission spectroscopy or inductively coupled plasma-mass spectroscopy following decomposition sodium peroxide and elemental analysis",
          column_heading: "element symbol_AES_ST or element symbol_MS_ST",
          description: "A 0.5 g samples aliquot is fused at 750°C with sodium peroxide and the fusion cake dissolved in a dilute nitric acid. The resulting solution is analyzed by inductively coupled plasma-optical emission spectroscopy (ICP-AES) or inductively coupled plasma-mass spectroscopy (ICP-MS).",
          quality_control: "Data is acceptable if recovery of each element is ±15% at five times the LLD and the calculated Relative Standard Deviation (RSD) of duplicate samples doesn't exceed 15%.",
          elements: {
            "Ag": { name: "Silver", lld: "1 ppm", url: "1000 ppm", instrument: "ICP-MS" },
            "Al": { name: "Aluminum", lld: "0.01%", url: "25%", instrument: "ICP-OES" },
            "As": { name: "Arsenic", lld: "5 ppm", url: "10%", instrument: "ICP-MS" },
            "Ba": { name: "Barium", lld: "0.5 ppm", url: "1%", instrument: "ICP-OES" },
            "Cu": { name: "Copper", lld: "5 ppm", url: "5%", instrument: "ICP-OES" }
            // Many more elements in the actual document
          }
        },
        "aqua_regia": {
          name: "Multi-element determination by inductively coupled plasma-optical emission spectroscopy or inductively coupled plasma-mass spectroscopy following sample decomposition in a mixture of nitric acid (HNO3) and hydrochloric acid (HCl)",
          column_heading: "element symbol_AES_AR_P or element symbol_MS_AR_P",
          description: "A 2 g sample aliquot is digested with nitric acid (HNO3) and hydrochloric acid (HCl) and heated in a water bath for 1.5 hours at 85°C. The sample is then cooled to room temperature then analyzed by Inductively Coupled Plasma-Optical Emission Spectrometry (ICP-OES) and Inductively Coupled Plasma-Mass Spectrometry (ICP-MS). The digestion used in this method is commonly referred to as aqua regia.",
          quality_control: "Data is acceptable if recovery for each element is ±15% at five times the LLD and the calculated RSD of duplicate samples is no greater than 15%.",
          elements: {
            "Ag": { name: "Silver", lld: "0.01 ppm", url: "100 ppm" },
            "Al": { name: "Aluminum", lld: "0.01%", url: "25%" },
            "As": { name: "Arsenic", lld: "0.1 ppm", url: "1%" },
            "Au": { name: "Gold", lld: "0.005 ppm", url: "10 ppm" },
            "Cu": { name: "Copper", lld: "0.5 ppm", url: "1%" }
            // Many more elements in the actual document
          }
        },
        "four_acid_digestion": {
          name: "Multi-element determination by inductively coupled plasma-optical emission spectroscopy or inductively coupled plasma-mass spectroscopy following sample decomposition by a mixture of hydrochloric, nitric, perchloric, and hydrofluoric acids",
          column_heading: "element symbol_AES_HF or element symbol_MS_HF",
          description: "A 0.5 g sample aliquot is decomposed using a mixture of hydrochloric, nitric, perchloric, and hydrofluoric acids at low temperature. The resulting solution is analyzed by inductively coupled plasma-optical emission spectroscopy (ICP-AES) or inductively coupled plasma-mass spectroscopy (ICP-MS).",
          quality_control: "Data is acceptable if recovery of each element is ±15% at five times the LLD and the calculated RSD of duplicate samples doesn't exceed 15%.",
          elements: {
            "Ag": { name: "Silver", lld: "0.01 ppm", url: "100 ppm", instrument: "ICP-MS" },
            "Al": { name: "Aluminum", lld: "0.01%", url: "15%", instrument: "ICP-OES" },
            "As": { name: "Arsenic", lld: "0.2 ppm", url: "1%", instrument: "ICP-MS" },
            "Cu": { name: "Copper", lld: "0.5 ppm", url: "1%", instrument: "ICP-OES" }
            // Many more elements in the actual document
          }
        },
        "lead_fusion": {
          name: "Gold, Palladium and Platinum determined Inductively Coupled Plasma-Optical Emission Spectroscopy following sample decomposition by lead fusion",
          column_heading: "Au_FA; Pd_FA; Pt_FA",
          description: "A 30 g sample aliquot is mixed with fluxing agents to assist with melting and promote separation from waste (gangue) materials from the precious metals. After cooling, the gangue is separated and discarded as a glassy slag from the precious metal containing lead button. The button heated on an absorbing magnesium oxide crucible to remove the lead and trace amounts of base metals. A small silver prill is left containing the precious metals. The prill is digested in aqua regia then analyzed by Inductively Coupled Plasma-Optical Emission Spectroscopy (ICP-AES) and Inductively Coupled Plasma-Mass Spectroscopy (ICP-MS).",
          quality_control: "Data is acceptable if recovery of gold, palladium, and platinum is ±20% at five times the LLD and the calculated RSD of duplicate samples doesn't exceed 20%. Data is acceptable if recovery of gold is ±20% at five times the Lower Limit of Determination and the calculated percent Relative Standard Deviation of duplicate samples is no greater than 20%.",
          elements: {
            "Au": { name: "Gold", lld: "1 ppb", url: "10,000 ppb" },
            "Pd": { name: "Palladium", lld: "1 ppb", url: "10,000 ppb" },
            "Pt": { name: "Platinum", lld: "5 ppb", url: "10,000 ppb" }
          }
        },
        "cold_vapor_aas": {
          name: "Mercury by Cold Vapor Atomic Absorption Spectrometry",
          column_heading: "Hg_CVAAS",
          description: "A 0.5 g aliquot of sample is digested using a mixture of sulfuric and nitric acids, and dilute potassium permanganate and potassium persulfate in a water bath. Excess potassium permanganate is reduced using hydroxylamine sulfate solution. Mercury (II) is reduced by a solution of Tin (II) chloride (or stannous chloride). Mercury vapor is separated and measured with a FIMS 100 Mercury Analysis System.",
          quality_control: "Data is acceptable if recovery of mercury is ±20% at five times the LLD and the calculated RSD of duplicate samples doesn't exceed 20%.",
          elements: {
            "Hg": { name: "Mercury", lld: "1 ppb", url: "100,000 ppb" }
          }
        },
        "gold_fire_assay_ms": {
          name: "Gold by inductively coupled plasma-mass spectroscopy following decomposition by lead fusion fire assay",
          column_heading: "Au_FA_MS",
          description: "A 15 g sample aliquot is mixed with fluxing agents to assist with melting and promote separation from waste (gangue) materials from the precious metals. After cooling, the gangue is separated and discarded as a glassy slag from the precious metal containing lead button. The lead button is further heated on an absorbing magnesium oxide crucible to remove the lead and trace amounts of base metals. A small silver prill is left containing the precious metals. The prill is digested in aqua regia then analyzed by inductively coupled plasma-mass spectroscopy.",
          quality_control: "Data will be deemed acceptable if recovery of Gold is ±20% at five times the LLD and the calculated percent RSD of duplicate samples is no greater than 20%.",
          elements: {
            "Au": { name: "Gold", lld: "1 ppb", url: "10,000 ppb" }
          }
        },
        "lithium_metaborate_fusion": {
          name: "Multi-element determination by inductively coupled plasma-optical emission spectroscopy or inductively coupled plasma-mass spectroscopy following sample fusion with lithium metaborate and decomposition in a dilute (HNO3) acid",
          column_heading: "element symbol_AES_Fuse",
          description: "Sixteen major, minor, and trace elements are determined in geological materials using a lithium metaborate fusion with an Inductively Coupled Plasma-Optical Emission Spectroscopy (ICP-OES). The sample is fused with lithium metaborate and dissolved using dilute HNO3 in a graphite crucible. The resulting solution is analyzed by ICP-OES.",
          quality_control: "Data will be deemed acceptable if they are ±15% at five times the LLD and the calculated RSD of duplicate samples is no greater than 15%.",
          elements: {
            "Al2O3": { lld: ".01%", url: "75%" },
            "BaO": { lld: ".01%", url: "10%" },
            "CaO": { lld: ".01%", url: "60%" },
            "Cr2O3": { lld: ".01%", url: "10%" },
            "Fe2O3": { lld: ".01%", url: "75%" }
            // More elements in the document
          }
        }
      }
    };
    
    query = query.toLowerCase();
    
    // Queries about specific terms
    if (query.includes("lod") || query.includes("limit of detection")) {
      return geochemicalMethods.terms.LOD;
    }
    
    if (query.includes("lld") || query.includes("lower limit")) {
      return geochemicalMethods.terms.LLD;
    }
    
    if (query.includes("url") || query.includes("upper reporting limit")) {
      return geochemicalMethods.terms.URL;
    }
    
    // Gold analysis methods
    if (query.includes("gold") && query.includes("analysis")) {
      return "Gold is analyzed using multiple methods including:\n\n" +
             "1. Lead Fusion (Au_FA): Gold is determined by Inductively Coupled Plasma-Optical Emission Spectroscopy following sample decomposition by lead fusion. A 30g sample is used, with a detection limit (LLD) of 1 ppb and upper reporting limit (URL) of 10,000 ppb.\n\n" +
             "2. Fire Assay with ICP-MS (Au_FA_MS): Gold is determined by inductively coupled plasma-mass spectroscopy following decomposition by lead fusion fire assay. A 15g sample is used, with the same detection limits as the lead fusion method.\n\n" +
             "3. Aqua Regia Digestion: Gold can also be analyzed following aqua regia digestion with a detection limit of 0.005 ppm (5 ppb) and URL of 10 ppm.\n\n" +
             "Quality control criteria require ±20% recovery at five times the LLD and the calculated RSD of duplicate samples must not exceed 20%.";
    }
    
    // Silver detection limits
    if (query.includes("silver") && query.includes("detection limit")) {
      return "Silver (Ag) has different detection limits depending on the method used:\n\n" +
             "1. With ICP-MS following sodium peroxide decomposition (Ag_MS_ST): LLD = 1 ppm, URL = 1000 ppm\n\n" +
             "2. With ICP-MS following aqua regia digestion (Ag_MS_AR_P): LLD = 0.01 ppm, URL = 100 ppm\n\n" +
             "3. With ICP-MS following 4-acid digestion (Ag_MS_HF): LLD = 0.01 ppm, URL = 100 ppm\n\n" +
             "The method chosen depends on the sample type and the concentration range expected.";
    }
    
    // Sample preparation
    if (query.includes("sample") && (query.includes("preparation") || query.includes("prepared"))) {
      return "Sample Preparation Methods:\n\n" +
             "1. Sodium Peroxide Fusion: 0.5g sample is fused at 750°C with sodium peroxide and dissolved in dilute nitric acid.\n\n" +
             "2. Aqua Regia: 2g sample is digested with nitric acid (HNO3) and hydrochloric acid (HCl) and heated in a water bath for 1.5 hours at 85°C.\n\n" +
             "3. 4-Acid Digestion: 0.5g sample is decomposed using a mixture of hydrochloric, nitric, perchloric, and hydrofluoric acids at low temperature.\n\n" +
             "4. Lithium Metaborate Fusion: Sample is fused with lithium metaborate and dissolved using dilute HNO3 in a graphite crucible.\n\n" +
             "5. Lead Fusion (for precious metals): 30g sample is mixed with fluxing agents, melted, and separated from waste materials.\n\n" +
             "6. Mercury Analysis: 0.5g sample is digested using a mixture of sulfuric and nitric acids with potassium permanganate and potassium persulfate.";
    }
    
    // ICP-MS elements
    if (query.includes("icp-ms") || query.includes("mass spectroscopy")) {
      return "Elements typically analyzed by ICP-MS include:\n\n" +
             "Ag (Silver), As (Arsenic), B (Boron), Bi (Bismuth), Cd (Cadmium), Ce (Cerium), Co (Cobalt), Cs (Cesium), Dy (Dysprosium), Er (Erbium), Eu (Europium), Ga (Gallium), Gd (Gadolinium), Ge (Germanium), Hf (Hafnium), Ho (Holmium), In (Indium), La (Lanthanum), Lu (Lutetium), Mo (Molybdenum), Nb (Niobium), Nd (Neodymium), Pb (Lead), Pr (Praseodymium), Rb (Rubidium), Sb (Antimony), Se (Selenium), Sm (Samarium), Sn (Tin), Ta (Tantalum), Tb (Terbium), Te (Tellurium), Th (Thorium), Tl (Thallium), Tm (Thulium), U (Uranium), W (Tungsten), Y (Yttrium), Yb (Ytterbium), and others depending on the decomposition method used.\n\n" +
             "Elements with higher concentrations are typically analyzed by ICP-OES instead.";
    }
    
    // Mercury analysis
    if (query.includes("mercury") || query.includes("hg")) {
      return "Mercury is analyzed by Cold Vapor Atomic Absorption Spectrometry (Hg_CVAAS).\n\n" +
             "A 0.5g sample is digested using a mixture of sulfuric and nitric acids, with potassium permanganate and potassium persulfate in a water bath. Excess potassium permanganate is reduced using hydroxylamine sulfate solution. Mercury (II) is reduced by a solution of Tin (II) chloride (stannous chloride), and mercury vapor is separated and measured with a FIMS 100 Mercury Analysis System.\n\n" +
             "The detection limit (LLD) is 1 ppb with an upper reporting limit (URL) of 100,000 ppb.\n\n" +
             "Quality control requires that data is acceptable if recovery of mercury is ±20% at five times the LLD and the calculated RSD of duplicate samples doesn't exceed 20%.";
    }
    
    // Copper analysis
    if (query.includes("copper") || query.includes("cu")) {
      return "Copper (Cu) analysis methods and detection limits:\n\n" +
             "1. Sodium Peroxide Fusion (Cu_AES_ST): LLD = 5 ppm, URL = 5%, analyzed by ICP-OES\n\n" +
             "2. Aqua Regia Digestion (Cu_AES_AR_P): LLD = 0.5 ppm, URL = 1%\n\n" +
             "3. 4-Acid Digestion (Cu_AES_HF): LLD = 0.5 ppm, URL = 1%, analyzed by ICP-OES\n\n" +
             "Copper is typically analyzed using ICP-OES rather than ICP-MS due to its generally higher concentration in geological samples.";
    }
    
    // General query about analysis methods
    if (query.includes("methods") || query.includes("techniques") || query.includes("analysis types")) {
      return "Geochemical Analysis Methods Overview:\n\n" +
             "1. Sodium Peroxide Fusion: Elements determined by ICP-OES/ICP-MS after fusing sample with sodium peroxide at 750°C\n\n" +
             "2. Aqua Regia Digestion: Elements determined by ICP-OES/ICP-MS after digestion with nitric and hydrochloric acids\n\n" +
             "3. 4-Acid Digestion: Elements determined by ICP-OES/ICP-MS after decomposition using hydrochloric, nitric, perchloric, and hydrofluoric acids\n\n" +
             "4. Lithium Metaborate Fusion: Major oxides determined by ICP-OES after fusion with lithium metaborate\n\n" +
             "5. Lead Fusion: Gold, palladium and platinum determined by ICP-OES after lead fusion\n\n" +
             "6. Cold Vapor AAS: Specifically for mercury analysis\n\n" +
             "7. Fire Assay with ICP-MS: Gold analyzed by ICP-MS following lead fusion fire assay\n\n" +
             "Each method has specific detection limits and is appropriate for different elements and concentration ranges.";
    }
    
    // Default response if no specific match is found
    return "I couldn't find specific information about that query in the geochemical methods document. Try asking about:\n" +
           "- Specific analytical methods (e.g., sodium peroxide fusion, aqua regia, 4-acid digestion)\n" +
           "- Detection limits for specific elements (gold, silver, copper, etc.)\n" +
           "- Sample preparation techniques\n" +
           "- Definitions of terms like LOD, LLD, URL\n" +
           "- Elements analyzed by different methods";
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim() !== '') {
      setIsLoading(true);
      // Simulate processing time
      setTimeout(() => {
        const response = geochemQASystem(queryInput);
        setQueryResponse(response);
        setIsLoading(false);
      }, 1000);
    }
  };

  // Simulate model prediction
  const predictMineral = () => {
    setIsLoading(true);
    // Simulate model prediction delay
    setTimeout(() => {
      // This would be your actual XGBoost model prediction in a real app
      const predictions = [
        { commodity: "Gold", probability: 0.65 },
        { commodity: "Copper", probability: 0.25 },
        { commodity: "Silver", probability: 0.10 }
      ];
      setModelPrediction(predictions);
      setIsLoading(false);
    }, 1500);
  };

  // Handle input changes
  const handleInputChange = (feature, value) => {
    setFeatureInputs({
      ...featureInputs,
      [feature]: value
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">EarthScience.AI</h1>
        <p className="text-sm opacity-80">Predictive Mineral Exploration Platform</p>
      </header>
      
      {/* Navigation Tabs */}
      <div className="bg-white p-2 shadow-sm">
        <div className="flex space-x-1">
          <button 
            className={`px-4 py-2 rounded font-medium transition ${activeTab === 'map' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('map')}
          >
            Geological Map
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium transition ${activeTab === 'prediction' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('prediction')}
          >
            Mineral Prediction
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium transition ${activeTab === 'analytics' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`px-4 py-2 rounded font-medium transition ${activeTab === 'qa' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveTab('qa')}
          >
            Geochemical Q&A
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto">
        {/* Map View */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Geological Map</h2>
                <select 
                  className="border rounded px-2 py-1 text-sm"
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                >
                  <option value="all">All Commodities</option>
                  {Object.keys(commodityColors).map(commodity => (
                    <option key={commodity} value={commodity}>{commodity}</option>
                  ))}
                </select>
              </div>
              <div className="relative h-96 rounded border">
                <div className="absolute inset-0 overflow-hidden">
                  {/* Geological Map Layers */}
                  <svg width="100%" height="100%" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
                    {/* Base Geological Layer */}
                    <defs>
                      {/* Sedimentary Pattern */}
                      <pattern id="sedimentary" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
                        <rect width="20" height="20" fill="#f0e6d2" />
                        <line x1="0" y1="0" x2="20" y2="0" stroke="#e0d6c2" strokeWidth="10" />
                      </pattern>
                      
                      {/* Igneous Pattern */}
                      <pattern id="igneous" patternUnits="userSpaceOnUse" width="20" height="20">
                        <rect width="20" height="20" fill="#e57373" />
                        <circle cx="10" cy="10" r="3" fill="#c62828" />
                      </pattern>
                      
                      {/* Metamorphic Pattern */}
                      <pattern id="metamorphic" patternUnits="userSpaceOnUse" width="20" height="20">
                        <rect width="20" height="20" fill="#90caf9" />
                        <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="#1565c0" />
                      </pattern>
                      
                      {/* Sandstone Pattern */}
                      <pattern id="sandstone" patternUnits="userSpaceOnUse" width="10" height="10">
                        <rect width="10" height="10" fill="#f9e076" />
                        <circle cx="2" cy="2" r="0.8" fill="#c9b060" />
                        <circle cx="7" cy="4" r="0.8" fill="#c9b060" />
                        <circle cx="5" cy="8" r="0.8" fill="#c9b060" />
                      </pattern>
                      
                      {/* Limestone Pattern */}
                      <pattern id="limestone" patternUnits="userSpaceOnUse" width="20" height="20">
                        <rect width="20" height="20" fill="#dcdcdc" />
                        <line x1="5" y1="0" x2="5" y2="20" stroke="#c0c0c0" strokeWidth="1" />
                        <line x1="15" y1="0" x2="15" y2="20" stroke="#c0c0c0" strokeWidth="1" />
                      </pattern>
                      
                      {/* Fault Line Pattern */}
                      <marker id="fault-marker" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M0,0 L10,5 L0,10 Z" fill="black" />
                      </marker>
                    </defs>

                    {/* Background */}
                    <rect x="0" y="0" width="1000" height="700" fill="#f8f9fa" />
                    
                    {/* Main Geological Formations */}
                    <g id="geological-formations">
                      {/* Sedimentary Basin */}
                      <path d="M100,100 Q500,200 900,100 L900,350 Q500,450 100,350 Z" fill="url(#sedimentary)" stroke="#ccc" strokeWidth="1" />
                      
                      {/* Igneous Intrusion */}
                      <path d="M200,200 Q350,100 500,200 Q650,300 800,200 L800,500 Q650,600 500,500 Q350,400 200,500 Z" fill="url(#igneous)" stroke="#a94442" strokeWidth="1" />
                      
                      {/* Metamorphic Zone */}
                      <path d="M300,150 Q450,250 600,150 Q750,50 900,150 L900,300 Q750,400 600,300 Q450,200 300,300 Z" fill="url(#metamorphic)" stroke="#31708f" strokeWidth="1" opacity="0.7" />
                      
                      {/* Sandstone Formation */}
                      <path d="M150,400 Q300,350 450,400 Q600,450 750,400 L750,600 Q600,650 450,600 Q300,550 150,600 Z" fill="url(#sandstone)" stroke="#deb887" strokeWidth="1" />
                      
                      {/* Limestone Formation */}
                      <ellipse cx="700" cy="350" rx="200" ry="100" fill="url(#limestone)" stroke="#a9a9a9" strokeWidth="1" />
                    </g>
                    
                    {/* Fault Lines */}
                    <g id="fault-lines" stroke="black" strokeWidth="2" strokeDasharray="5,5">
                      <line x1="100" y1="250" x2="400" y2="550" markerEnd="url(#fault-marker)" />
                      <line x1="600" y1="150" x2="900" y2="450" markerEnd="url(#fault-marker)" />
                      <line x1="300" y1="350" x2="700" y2="250" markerEnd="url(#fault-marker)" />
                    </g>
                    
                    {/* Mineral Deposits */}
                    <g id="mineral-deposits">
                      {filteredData.map((point, index) => (
                        <g key={index} transform={`translate(${100 + (point.lng + 118) % 9 * 100}, ${100 + (point.lat - 34) % 6 * 100})`}>
                          <circle 
                            r={point.probability * 15} 
                            fill={commodityColors[point.commodity]} 
                            opacity="0.8" 
                            stroke="#fff" 
                            strokeWidth="1"
                          />
                          <text 
                            textAnchor="middle" 
                            y="-20" 
                            fill="#333" 
                            fontSize="12" 
                            fontWeight="bold"
                          >
                            {point.commodity}
                          </text>
                        </g>
                      ))}
                    </g>
                    
                    {/* Map Scale */}
                    <g transform="translate(850, 650)">
                      <rect x="0" y="0" width="100" height="20" fill="white" stroke="#333" />
                      <line x1="0" y1="5" x2="0" y2="15" stroke="#333" />
                      <line x1="50" y1="5" x2="50" y2="15" stroke="#333" />
                      <line x1="100" y1="5" x2="100" y2="15" stroke="#333" />
                      <text x="25" y="30" textAnchor="middle" fontSize="10">5 km</text>
                      <text x="75" y="30" textAnchor="middle" fontSize="10">10 km</text>
                    </g>
                    
                    {/* Map Legend */}
                    <g transform="translate(50, 600)">
                      <rect x="0" y="0" width="200" height="80" fill="white" stroke="#333" strokeWidth="1" />
                      <text x="10" y="20" fontSize="12" fontWeight="bold">Geological Formations</text>
                      
                      <rect x="10" y="30" width="15" height="10" fill="url(#sedimentary)" stroke="#ccc" strokeWidth="0.5" />
                      <text x="30" y="38" fontSize="10">Sedimentary</text>
                      
                      <rect x="10" y="45" width="15" height="10" fill="url(#igneous)" stroke="#a94442" strokeWidth="0.5" />
                      <text x="30" y="53" fontSize="10">Igneous</text>
                      
                      <rect x="10" y="60" width="15" height="10" fill="url(#metamorphic)" stroke="#31708f" strokeWidth="0.5" />
                      <text x="30" y="68" fontSize="10">Metamorphic</text>
                      
                      <rect x="100" y="30" width="15" height="10" fill="url(#sandstone)" stroke="#deb887" strokeWidth="0.5" />
                      <text x="120" y="38" fontSize="10">Sandstone</text>
                      
                      <rect x="100" y="45" width="15" height="10" fill="url(#limestone)" stroke="#a9a9a9" strokeWidth="0.5" />
                      <text x="120" y="53" fontSize="10">Limestone</text>
                      
                      <line x1="100" y1="65" x2="115" y2="65" stroke="black" strokeWidth="1.5" strokeDasharray="3,3" />
                      <text x="120" y="68" fontSize="10">Fault Line</text>
                    </g>
                    
                    {/* North Arrow */}
                    <g transform="translate(950, 50)">
                      <circle cx="0" cy="0" r="20" fill="white" stroke="#333" strokeWidth="1" />
                      <line x1="0" y1="15" x2="0" y2="-15" stroke="#333" strokeWidth="1.5" />
                      <polygon points="0,-15 -5,-5 5,-5" fill="#333" />
                      <text x="0" y="25" textAnchor="middle" fontSize="10">N</text>
                    </g>
                  </svg>
                  
                  {/* Add semitransparent hover overlay for interactive zones */}
                  <div className="absolute inset-0 z-10 grid grid-cols-5 grid-rows-5 pointer-events-none">
                    {[...Array(25)].map((_, i) => (
                      <div 
                        key={i} 
                        className="border border-transparent hover:border-blue-300 transition-colors duration-200 cursor-pointer pointer-events-auto"
                        title={`Click to view detailed geological data for region ${i+1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <span className="font-medium">Map Legend:</span>
                <div className="flex flex-wrap gap-3 mt-2">
                  {Object.entries(commodityColors).map(([commodity, color]) => (
                    <div key={commodity} className="flex items-center">
                      <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color }}></span>
                      <span>{commodity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Mineral Distribution</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={commodityDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {commodityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={commodityColors[entry.name] || '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} deposits`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Probability Heatmap</h2>
                <div className="border rounded bg-gray-50 overflow-hidden">
                  <svg width="100%" height="200" viewBox="0 0 300 200">
                    {/* Define a colorful gradient for the heatmap */}
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f9d423" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#f9d423" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#b87333" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#b87333" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c0c0c0" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#c0c0c0" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <g>
                      {[...Array(4)].map((_, i) => (
                        <line 
                          key={`h-${i}`} 
                          x1="0" 
                          y1={i * 50} 
                          x2="300" 
                          y2={i * 50} 
                          stroke="#ccc" 
                          strokeWidth="1" 
                        />
                      ))}
                      {[...Array(4)].map((_, i) => (
                        <line 
                          key={`v-${i}`} 
                          x1={i * 100} 
                          y1="0" 
                          x2={i * 100} 
                          y2="200" 
                          stroke="#ccc" 
                          strokeWidth="1" 
                        />
                      ))}
                    </g>
                    
                    {/* Heatmap cells */}
                    {mockHeatmapData.map((cell, i) => {
                      const x = (cell.x * 100) + 10;
                      const y = (cell.y * 50) + 10;
                      const width = 80;
                      const height = 30;
                      const gradient = cell.commodity === 'Gold' ? 'url(#goldGradient)' : 
                                    cell.commodity === 'Copper' ? 'url(#copperGradient)' : 
                                    'url(#silverGradient)';
                      
                      return (
                        <g key={i}>
                          <rect 
                            x={x} 
                            y={y} 
                            width={width} 
                            height={height} 
                            fill={gradient}
                            opacity={cell.value} 
                            stroke="#fff" 
                            strokeWidth="1" 
                            rx="3" 
                          />
                          <text 
                            x={x + width/2} 
                            y={y + height/2} 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            fontSize="12" 
                            fontWeight="bold" 
                            fill="#333"
                          >
                            {(cell.value * 100).toFixed(0)}%
                          </text>
                          <text 
                            x={x + width/2} 
                            y={y + height + 12} 
                            textAnchor="middle" 
                            fontSize="9" 
                            fill="#666"
                          >
                            {cell.commodity}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Axis labels */}
                    <text x="10" y="195" fontSize="10" fontWeight="bold">Low Magnetic Response</text>
                    <text x="220" y="195" fontSize="10" fontWeight="bold">High Magnetic Response</text>
                    <text x="-90" y="15" fontSize="10" fontWeight="bold" transform="rotate(-90)">High Gravity</text>
                    <text x="-90" y="195" fontSize="10" fontWeight="bold" transform="rotate(-90)">Low Gravity</text>
                  </svg>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Mineral probability heatmap showing regional concentration zones
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Tool */}
        {activeTab === 'prediction' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Model Input Features</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <select 
                    className="w-full border rounded px-3 py-2"
                    value={featureInputs.Age}
                    onChange={(e) => handleInputChange('Age', e.target.value)}
                  >
                    <option>Cenozoic</option>
                    <option>Mesozoic</option>
                    <option>Paleozoic</option>
                    <option>Precambrian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lithology</label>
                  <select 
                    className="w-full border rounded px-3 py-2"
                    value={featureInputs.Lithologic_litho}
                    onChange={(e) => handleInputChange('Lithologic_litho', e.target.value)}
                  >
                    <option>Granite</option>
                    <option>Basalt</option>
                    <option>Limestone</option>
                    <option>Sandstone</option>
                    <option>Shale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stratigraphy</label>
                  <select 
                    className="w-full border rounded px-3 py-2"
                    value={featureInputs.Stratigraphy}
                    onChange={(e) => handleInputChange('Stratigraphy', e.target.value)}
                  >
                    <option>Igneous</option>
                    <option>Sedimentary</option>
                    <option>Metamorphic</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SuperGroup</label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={featureInputs.SuperGroup_geo}
                      onChange={(e) => handleInputChange('SuperGroup_geo', e.target.value)}
                    >
                      <option>Magmatic</option>
                      <option>Hydrothermal</option>
                      <option>Sedimentary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                    <select 
                      className="w-full border rounded px-3 py-2"
                      value={featureInputs.GroupName_geo}
                      onChange={(e) => handleInputChange('GroupName_geo', e.target.value)}
                    >
                      <option>Intrusive</option>
                      <option>Extrusive</option>
                      <option>Clastic</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gravity Measurements</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input 
                        type="number" 
                        className="w-full border rounded px-3 py-2"
                        placeholder="0.005" 
                        value={featureInputs.Avg_grav_0_005}
                        onChange={(e) => handleInputChange('Avg_grav_0.005', parseFloat(e.target.value))}
                      />
                      <div className="text-xs text-gray-500 mt-1">0.005 scale</div>
                    </div>
                    <div>
                      <input 
                        type="number" 
                        className="w-full border rounded px-3 py-2"
                        placeholder="0.075"
                        value={featureInputs.Avg_grav_0_075}
                        onChange={(e) => handleInputChange('Avg_grav_0.075', parseFloat(e.target.value))}
                      />
                      <div className="text-xs text-gray-500 mt-1">0.075 scale</div>
                    </div>
                    <div>
                      <input 
                        type="number" 
                        className="w-full border rounded px-3 py-2"
                        placeholder="2.2"
                        value={featureInputs.Avg_grav_2_2}
                        onChange={(e) => handleInputChange('Avg_grav_2.2', parseFloat(e.target.value))}
                      />
                      <div className="text-xs text-gray-500 mt-1">2.2 scale</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Magnetic Measurements</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input 
                        type="number" 
                        className="w-full border rounded px-3 py-2"
                        placeholder="0.005"
                        value={featureInputs.Avg_mag_0_005}
                        onChange={(e) => handleInputChange('Avg_mag_0.005', parseFloat(e.target.value))}
                      />
                      <div className="text-xs text-gray-500 mt-1">0.005 scale</div>
                    </div>
                    <div>
                      <input 
                        type="number" 
                        className="w-full border rounded px-3 py-2"
                        placeholder="0.075"
                        value={featureInputs.Avg_mag_0_075}
                        onChange={(e) => handleInputChange('Avg_mag_0.075', parseFloat(e.target.value))}
                      />
                      <div className="text-xs text-gray-500 mt-1">0.075 scale</div>
                    </div>
                    <div>
                      <input 
                        type="number" 
                        className="w-full border rounded px-3 py-2"
                        placeholder="2.2"
                        value={featureInputs.Avg_mag_2_2}
                        onChange={(e) => handleInputChange('Avg_mag_2.2', parseFloat(e.target.value))}
                      />
                      <div className="text-xs text-gray-500 mt-1">2.2 scale</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance to Nearest Fault (km)</label>
                  <input 
                    type="number" 
                    className="w-full border rounded px-3 py-2"
                    value={featureInputs.nearest_distance_fault}
                    onChange={(e) => handleInputChange('nearest_distance_fault', parseFloat(e.target.value))}
                  />
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
                  onClick={predictMineral}
                  disabled={isLoading}
                >
                  {isLoading ? 'Predicting...' : 'Predict Mineral Potential'}
                </button>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Prediction Results</h2>
                {modelPrediction ? (
                  <div>
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-700 mb-2">Commodity Probabilities</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={modelPrediction}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="commodity" />
                          <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                          <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Probability']} />
                          <Bar dataKey="probability" name="Probability">
                            {modelPrediction.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={commodityColors[entry.commodity] || '#8884d8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded p-3">
                      <h3 className="font-medium text-gray-800 mb-1">Primary Prediction: <span className="text-green-700">{modelPrediction[0].commodity}</span></h3>
                      <p className="text-sm text-gray-600">
                        The model predicts a {(modelPrediction[0].probability * 100).toFixed(1)}% chance of {modelPrediction[0].commodity} deposits in the specified area based on the provided geological features.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    Enter feature values and click "Predict" to see mineral potential results
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Feature Importance</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={featureImportance.sort((a, b) => b.importance - a.importance)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <YAxis type="category" dataKey="feature" width={140} />
                    <Tooltip formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Importance']} />
                    <Bar dataKey="importance" fill="#3182CE" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 text-sm text-gray-500">
                  Feature importance based on XGBoost model training. Distance to faults and magnetic measurements are the most significant predictors.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Commodity Distribution by Region</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { region: 'North', gold: 25, copper: 12, silver: 8, iron: 5 },
                    { region: 'South', gold: 18, copper: 22, silver: 10, iron: 8 },
                    { region: 'East', gold: 30, copper: 15, silver: 6, iron: 12 },
                    { region: 'West', gold: 22, copper: 28, silver: 14, iron: 7 },
                    { region: 'Central', gold: 27, copper: 18, silver: 11, iron: 9 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gold" name="Gold" fill="#FFD700" />
                  <Bar dataKey="copper" name="Copper" fill="#B87333" />
                  <Bar dataKey="silver" name="Silver" fill="#C0C0C0" />
                  <Bar dataKey="iron" name="Iron" fill="#A52A2A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mineral Prediction Accuracy</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { commodity: 'Gold', actual: 35, predicted: 32 },
                    { commodity: 'Copper', actual: 28, predicted: 30 },
                    { commodity: 'Silver', actual: 18, predicted: 15 },
                    { commodity: 'Iron', actual: 15, predicted: 17 },
                    { commodity: 'Lead', actual: 10, predicted: 8 },
                    { commodity: 'Zinc', actual: 8, predicted: 10 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="commodity" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" name="Actual Deposits" stroke="#2563EB" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="predicted" name="Model Predictions" stroke="#DC2626" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 text-sm text-gray-500">
                Comparison of model predictions against known mineral deposits shows strong correlation with 88% overall accuracy.
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Geological Age Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Cenozoic', value: 30 },
                      { name: 'Mesozoic', value: 25 },
                      { name: 'Paleozoic', value: 35 },
                      { name: 'Precambrian', value: 10 }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#4F46E5" />
                    <Cell fill="#7C3AED" />
                    <Cell fill="#DB2777" />
                    <Cell fill="#F59E0B" />
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} deposits`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Lithology Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Granite', value: 25 },
                      { name: 'Basalt', value: 15 },
                      { name: 'Limestone', value: 20 },
                      { name: 'Sandstone', value: 22 },
                      { name: 'Shale', value: 18 }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#059669" />
                    <Cell fill="#047857" />
                    <Cell fill="#065F46" />
                    <Cell fill="#064E3B" />
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} deposits`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Q&A System */}
        {activeTab === 'qa' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Geochemical Methods Q&A System</h2>
              <form onSubmit={handleQuerySubmit} className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-grow border rounded px-3 py-2"
                    placeholder="Ask about geochemical analysis methods, detection limits, etc."
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Ask'}
                  </button>
                </div>
              </form>
              
              <div className="border rounded-lg p-4 bg-gray-50 h-96 overflow-y-auto">
                {queryResponse ? (
                  <div className="space-y-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">You asked:</p>
                      <p className="text-gray-800">{queryInput}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm font-medium text-gray-800">Response:</p>
                      <div className="text-gray-700 whitespace-pre-line">
                        {queryResponse}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <p className="mb-2">Ask questions about geochemical analysis methods</p>
                    <div className="text-sm text-gray-500">
                      <p className="mb-1">Example questions:</p>
                      <ul className="space-y-1">
                        <li>• What methods are used for gold analysis?</li>
                        <li>• What is the detection limit for silver?</li>
                        <li>• How are samples prepared for analysis?</li>
                        <li>• What is LOD and LLD?</li>
                        <li>• Which elements are analyzed by ICP-MS?</li>
                        <li>• How is mercury analyzed?</li>
                        <li>• What is the difference between URL and LLD?</li>
                        <li>• How does the 4-acid digestion method work?</li>
                        <li>• What are the detection limits for copper?</li>
                        <li>• What quality control measures are used in lead fusion?</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Methods</h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-medium text-gray-800">ICP-OES</h3>
                    <p className="text-sm text-gray-600">Inductively Coupled Plasma-Optical Emission Spectroscopy for major and minor elements</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-medium text-gray-800">ICP-MS</h3>
                    <p className="text-sm text-gray-600">Inductively Coupled Plasma-Mass Spectroscopy for trace elements</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-medium text-gray-800">Fire Assay</h3>
                    <p className="text-sm text-gray-600">Lead fusion method for precious metals (Au, Pd, Pt)</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-medium text-gray-800">CVAAS</h3>
                    <p className="text-sm text-gray-600">Cold Vapor Atomic Absorption Spectrometry for mercury</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Decomposition Methods</h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-medium text-gray-800">Sodium Peroxide Fusion</h3>
                    <p className="text-sm text-gray-600">Sample fused at 750°C and dissolved in dilute nitric acid</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-medium text-gray-800">Aqua Regia</h3>
                    <p className="text-sm text-gray-600">HNO₃ + HCl digestion, heated in water bath at 85°C</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-medium text-gray-800">4-Acid Digestion</h3>
                    <p className="text-sm text-gray-600">HCl + HNO₃ + HClO₄ + HF mixture for near-total dissolution</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <h3 className="font-medium text-gray-800">Lithium Metaborate Fusion</h3>
                    <p className="text-sm text-gray-600">For silicate materials, dissolved in dilute HNO₃</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-sm p-4">
        <div className="flex justify-between items-center">
          <span>EarthScience.AI • Mineral Exploration Platform</span>
          <span>&copy; 2025 All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
};

export default MineralDashboard;
