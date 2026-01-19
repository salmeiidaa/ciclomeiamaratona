import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronRight, Calendar, Dumbbell, Footprints, X, Upload, BarChart3, Home, Video } from 'lucide-react';

const TrainingApp = () => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [completedExercises, setCompletedExercises] = useState({});
  const [workoutData, setWorkoutData] = useState({});
  const [currentPhase, setCurrentPhase] = useState(-1);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [indoorMode, setIndoorMode] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados ao iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await window.storage.get('training-progress', false);
        if (saved && saved.value) {
          const data = JSON.parse(saved.value);
          console.log('Dados carregados:', data);
          setCompletedWorkouts(data.completed || {});
          setCompletedExercises(data.exercises || {});
          setWorkoutData(data.workoutData || {});
          setCurrentPhase(data.phase !== undefined ? data.phase : -1);
        }
      } catch (error) {
        console.log('Primeira vez usando o app ou erro ao carregar:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Salvar dados automaticamente quando houver mudanças
  useEffect(() => {
    if (!isLoading) {
      saveData(completedWorkouts, completedExercises, workoutData, currentPhase);
    }
  }, [completedWorkouts, completedExercises, workoutData, currentPhase, isLoading]);

  const saveData = async (completed, exercises, data, phase) => {
    try {
      const dataToSave = {
        completed,
        exercises,
        workoutData: data,
        phase,
        lastUpdate: new Date().toISOString()
      };
      console.log('Salvando dados:', dataToSave);
      await window.storage.set('training-progress', JSON.stringify(dataToSave), false);
      console.log('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const phases = [
    { name: "Treino Interior", period: "16-30 Janeiro", weeks: 2, color: "bg-purple-600", isInterior: true },
    { name: "Fase 1: Base", period: "Fevereiro - Março", weeks: 8, color: "bg-blue-500" },
    { name: "Fase 2: Volume", period: "Abril - Maio", weeks: 8, color: "bg-green-500" },
    { name: "Fase 3: Intensidade", period: "Junho - Julho", weeks: 8, color: "bg-orange-500" },
    { name: "Fase 4: Pico", period: "Agosto - Setembro", weeks: 8, color: "bg-purple-500" }
  ];

  const workoutTemplates = {
    '-1': {
      corrida: [
        { day: "20/Jan (Ter)", type: "Corrida Leve", details: "4-5 km", pace: "7:00-7:30 min/km", zone: "Zona 2", location: "Rua", indoorOption: { pace: "7:00-7:30 min/km", incline: "1%", details: "35-40min na esteira" }},
        { day: "23/Jan (Qui)", type: "Corrida Confortável", details: "5-6 km", pace: "6:45-7:15 min/km", zone: "Zona 2", location: "Rua", indoorOption: { pace: "6:45-7:15 min/km", incline: "1%", details: "40-45min" }},
        { day: "25/Jan (Sáb)", type: "Corrida Progressiva", details: "7-8 km", pace: "Início 7:00 | Final 6:15 min/km", zone: "Zona 2-3", location: "Rua", indoorOption: { pace: "Início 7:00 | Final 6:15", incline: "1-2%", details: "55-65min (acelerar últimos 20min)" }},
        { day: "28/Jan (Ter)", type: "Corrida Leve", details: "4-5 km", pace: "7:00-7:30 min/km", zone: "Zona 2", location: "Rua", indoorOption: { pace: "7:00-7:30 min/km", incline: "1%", details: "30-35min relaxado" }}
      ],
      musculacao: [
        {
          day: "16/Jan (Sex)",
          name: "Treino A - Inferior (Peso Corporal + Mini Band)",
          exercises: [
            { name: "Agachamento livre: 3x15", video: "https://www.youtube.com/watch?v=aclHkVaku9U" },
            { name: "Afundo caminhando: 3x10 cada perna", video: "https://www.youtube.com/watch?v=L8fvypPrzzs" },
            { name: "Agachamento sumo com mini band: 3x15 🟢 LEVE", video: "https://www.youtube.com/watch?v=5VcPeF4PzjA", intensity: "🟢 LEVE (Semana 1) → 🟡 MÉDIA (Semana 2)" },
            { name: "Elevação de quadril com mini band: 3x15 🟡 MÉDIA", video: "https://www.youtube.com/watch?v=OUgsJ8-Vi0E", intensity: "🟡 MÉDIA (Semana 1) → 🔴 FORTE (Semana 2)" },
            { name: "Caminhada lateral com mini band: 3x15 passos 🟢 LEVE", video: "https://www.youtube.com/watch?v=Ep9Y_KtZWT8", intensity: "🟢 LEVE (Semana 1) → 🟡 MÉDIA (Semana 2)" },
            { name: "Elevação de calcanhar: 3x20", video: "https://www.youtube.com/watch?v=3j4HFQXoe6s" }
          ]
        },
        {
          day: "18/Jan (Sáb)",
          name: "Treino B - Superior (Peso Corporal)",
          exercises: [
            { name: "Flexão de braço: 3x máximo", video: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
            { name: "Flexão com mãos juntas (tríceps): 3x8-10", video: "https://www.youtube.com/watch?v=nEXQs9v5Kxk" },
            { name: "Remada debaixo da mesa: 3x10", video: "https://www.youtube.com/watch?v=OYUxXMGVuuU" },
            { name: "Flexão em V (ombros): 3x8-10", video: "https://www.youtube.com/watch?v=x4YLHv50Z2k" },
            { name: "Prancha com toque no ombro: 3x8 cada lado", video: "https://www.youtube.com/watch?v=up68UAfH0ps" },
            { name: "Flexão com pés elevados: 3x8-10", video: "https://www.youtube.com/watch?v=3_bmD7YnQR4" }
          ]
        },
        {
          day: "21/Jan (Ter)",
          name: "Treino C - Glúteos e Core",
          exercises: [
            { name: "Elevação de quadril com uma perna: 3x12 cada", video: "https://www.youtube.com/watch?v=AVAXhy6pl7o" },
            { name: "Chute para trás com mini band: 3x15 cada 🟢 LEVE", video: "https://www.youtube.com/watch?v=Efo5lNF3pQo", intensity: "🟢 LEVE (Semana 1) → 🟡 MÉDIA (Semana 2)" },
            { name: "Abertura lateral com mini band: 3x15 cada 🟡 MÉDIA", video: "https://www.youtube.com/watch?v=TIhtpbHAhMQ", intensity: "🟡 MÉDIA (Semana 1) → 🔴 FORTE (Semana 2)" },
            { name: "Abertura de joelho (clamshell) mini band: 3x12 🟢 LEVE", video: "https://www.youtube.com/watch?v=RLJJFw7037I", intensity: "🟢 LEVE (Semana 1) → 🟡 MÉDIA (Semana 2)" },
            { name: "Prancha: 3x45seg", video: "https://www.youtube.com/watch?v=ASdvN_XEl_c" },
            { name: "Prancha lateral: 3x30seg cada lado", video: "https://www.youtube.com/watch?v=K2VljzCC16g" },
            { name: "Escalador (mountain climber): 3x15", video: "https://www.youtube.com/watch?v=nmwgirgXLYM" },
            { name: "Bicicleta no ar: 3x20seg", video: "https://www.youtube.com/watch?v=9FGilxCbdz8" },
            { name: "Inseto morto (dead bug): 3x10", video: "https://www.youtube.com/watch?v=4XLEnwUr1d8" }
          ]
        },
        {
          day: "24/Jan (Sex)",
          name: "Treino A - Inferior (Peso Corporal + Mini Band)",
          exercises: [
            { name: "Agachamento livre: 3x15", video: "https://www.youtube.com/watch?v=aclHkVaku9U" },
            { name: "Afundo caminhando: 3x10 cada perna", video: "https://www.youtube.com/watch?v=L8fvypPrzzs" },
            { name: "Agachamento sumo com mini band: 3x15 🟡 MÉDIA", video: "https://www.youtube.com/watch?v=5VcPeF4PzjA", intensity: "🟡 MÉDIA (evoluir da semana 1)" },
            { name: "Elevação de quadril com mini band: 3x15 🔴 FORTE", video: "https://www.youtube.com/watch?v=OUgsJ8-Vi0E", intensity: "🔴 FORTE (se conseguir manter forma)" },
            { name: "Caminhada lateral com mini band: 3x15 passos 🟡 MÉDIA", video: "https://www.youtube.com/watch?v=Ep9Y_KtZWT8", intensity: "🟡 MÉDIA (progressão)" },
            { name: "Elevação de calcanhar: 3x20", video: "https://www.youtube.com/watch?v=3j4HFQXoe6s" }
          ]
        },
        {
          day: "27/Jan (Seg)",
          name: "Treino B - Superior (Peso Corporal)",
          exercises: [
            { name: "Flexão de braço: 3x máximo", video: "https://www.youtube.com/watch?v=IODxDxX7oi4" },
            { name: "Flexão com mãos juntas (tríceps): 3x8-10", video: "https://www.youtube.com/watch?v=nEXQs9v5Kxk" },
            { name: "Remada debaixo da mesa: 3x10", video: "https://www.youtube.com/watch?v=OYUxXMGVuuU" },
            { name: "Flexão em V (ombros): 3x8-10", video: "https://www.youtube.com/watch?v=x4YLHv50Z2k" },
            { name: "Prancha com toque no ombro: 3x8 cada lado", video: "https://www.youtube.com/watch?v=up68UAfH0ps" },
            { name: "Flexão com pés elevados: 3x8-10", video: "https://www.youtube.com/watch?v=3_bmD7YnQR4" }
          ]
        },
        {
          day: "29/Jan (Qua)",
          name: "Treino C - Glúteos e Core",
          exercises: [
            { name: "Elevação de quadril com uma perna: 3x12 cada", video: "https://www.youtube.com/watch?v=AVAXhy6pl7o" },
            { name: "Chute para trás com mini band: 3x15 cada 🟡 MÉDIA", video: "https://www.youtube.com/watch?v=Efo5lNF3pQo", intensity: "🟡 MÉDIA (progressão da semana 1)" },
            { name: "Abertura lateral com mini band: 3x15 cada 🔴 FORTE", video: "https://www.youtube.com/watch?v=TIhtpbHAhMQ", intensity: "🔴 FORTE (aumentar desafio)" },
            { name: "Abertura de joelho (clamshell) mini band: 3x12 🟡 MÉDIA", video: "https://www.youtube.com/watch?v=RLJJFw7037I", intensity: "🟡 MÉDIA (progressão lenta)" },
            { name: "Prancha: 3x45seg", video: "https://www.youtube.com/watch?v=ASdvN_XEl_c" },
            { name: "Prancha lateral: 3x30seg cada lado", video: "https://www.youtube.com/watch?v=K2VljzCC16g" },
            { name: "Escalador (mountain climber): 3x15", video: "https://www.youtube.com/watch?v=nmwgirgXLYM" },
            { name: "Bicicleta no ar: 3x20seg", video: "https://www.youtube.com/watch?v=9FGilxCbdz8" },
            { name: "Inseto morto (dead bug): 3x10", video: "https://www.youtube.com/watch?v=4XLEnwUr1d8" }
          ]
        }
      ]
    },
    0: {
      corrida: [
        { day: "Segunda", type: "Corrida Confortável", details: "5-6 km", pace: "6:30-7:00 min/km", zone: "Zona 2 - Conversação fácil", location: "Rua", indoorOption: { pace: "6:30-7:00 min/km", incline: "1%", details: "40-45min na esteira" }},
        { day: "Quarta", type: "Intervalado", details: "Aquecimento 10min + 8x400m + Volta calma 10min", pace: "400m: 5:30-5:45 min/km | Recuperação: caminhada 1min", zone: "Zona 4 - Intenso", location: "Rua/Pista", indoorOption: { pace: "5:30-5:45 min/km nos tiros", incline: "2%", details: "Aquec 10min + 8x(2min rápido + 1min caminhada) + Volta calma 10min" }},
        { day: "Sábado", type: "Long Run", details: "8-10 km", pace: "6:45-7:15 min/km", zone: "Zona 2 - Conversação fácil", location: "Rua", indoorOption: { pace: "6:45-7:15 min/km", incline: "1-2%", details: "60-75min na esteira (varie inclinação a cada 10min)" }}
      ],
      musculacao: [
        { day: "Terça", name: "Treino A - Quadríceps e Posterior", exercises: [{ name: "Agachamento livre: 4x10-12" }, { name: "Leg press 45°: 3x12-15" }, { name: "Cadeira extensora: 3x12-15" }, { name: "Levantamento terra: 4x8-10" }, { name: "Cadeira flexora: 3x12-15" }, { name: "Stiff: 3x10-12" }, { name: "Panturrilha em pé: 4x15-20" }]},
        { day: "Quinta", name: "Treino B - Puxar e Empurrar", exercises: [{ name: "Supino reto: 4x10-12" }, { name: "Supino inclinado: 3x10-12" }, { name: "Crucifixo: 3x12-15" }, { name: "Remada curvada: 4x10-12" }, { name: "Puxada frente: 4x10-12" }, { name: "Remada máquina: 3x12-15" }, { name: "Desenvolvimento: 3x10-12" }]},
        { day: "Domingo", name: "Treino C - Glúteos e Core", exercises: [{ name: "Hip thrust: 4x12-15" }, { name: "Agachamento sumo: 3x12-15" }, { name: "Afundo búlgaro: 3x10-12 cada perna" }, { name: "Cadeira abdutora: 3x15-20" }, { name: "Elevação pélvica: 3x15-20" }, { name: "Prancha: 4x45-60seg" }, { name: "Abdominal canivete: 3x15-20" }, { name: "Prancha lateral: 3x30-45seg cada lado" }]}
      ]
    },
    1: {
      corrida: [
        { day: "Segunda", type: "Ritmo Moderado", details: "7-8 km", pace: "6:00-6:30 min/km", zone: "Zona 3", location: "Rua", indoorOption: { pace: "6:00-6:30 min/km", incline: "1-2%", details: "50-60min" }},
        { day: "Quarta", type: "Tempo Run", details: "Aquec 10min + 5km forte + Volta calma 10min", pace: "5:30-5:50 min/km", zone: "Zona 4", location: "Rua", indoorOption: { pace: "5:30-5:50 min/km", incline: "2%", details: "Aquec 10min + 30min forte + Volta 10min" }},
        { day: "Sexta", type: "Recuperação", details: "4 km leve", pace: "7:00-7:30 min/km", zone: "Zona 1", location: "Rua", indoorOption: { pace: "7:00-7:30 min/km", incline: "0-1%", details: "30min relaxado" }},
        { day: "Domingo", type: "Long Run", details: "12-15 km", pace: "6:30-7:00 min/km", zone: "Zona 2", location: "Rua", indoorOption: { pace: "6:30-7:00 min/km", incline: "1-2%", details: "90-110min variando inclinação" }}
      ],
      musculacao: [
        { day: "Terça", name: "Treino A - Quadríceps e Posterior", exercises: [{ name: "Agachamento: 4x8-10" }, { name: "Leg press: 4x10-12" }, { name: "Hack: 3x10-12" }, { name: "Extensora: 3x12-15" }, { name: "Terra: 4x6-8" }, { name: "Stiff: 3x10-12" }, { name: "Flexora: 3x12-15" }, { name: "Panturrilha: 4x15-20" }]},
        { day: "Quinta", name: "Treino B - Puxar e Empurrar", exercises: [{ name: "Supino: 4x8-10" }, { name: "Supino inclinado: 3x10-12" }, { name: "Crossover: 3x12-15" }, { name: "Tríceps testa: 3x10-12" }, { name: "Remada: 4x8-10" }, { name: "Puxada: 4x10-12" }, { name: "Remada unilateral: 3x10-12" }, { name: "Rosca: 3x10-12" }, { name: "Desenvolvimento: 3x10-12" }]},
        { day: "Sábado", name: "Treino C - Glúteos e Core", exercises: [{ name: "Hip thrust: 4x10-12" }, { name: "Agachamento sumo: 4x10-12" }, { name: "Afundo: 3x12 cada" }, { name: "Abdutora: 4x15-20" }, { name: "Stiff unilateral: 3x10 cada" }, { name: "Prancha com perna: 3x45seg" }, { name: "Bicicleta: 3x20" }, { name: "Russian twist: 3x30" }, { name: "Mountain climber: 3x20" }]}
      ]
    },
    2: {
      corrida: [
        { day: "Segunda", type: "Pace de Prova", details: "Aquec 10min + 8km + Volta 5min", pace: "5:40-6:00 min/km", zone: "Zona 3-4", location: "Rua", indoorOption: { pace: "5:40-6:00 min/km", incline: "1%", details: "Aquec 10min + 50min ritmo prova + Volta 5min" }},
        { day: "Quarta", type: "Intervalado Longo", details: "Aquec 15min + 5x1km + Volta 10min", pace: "1km: 5:20-5:40 | Recup: 2min", zone: "Zona 4-5", location: "Rua", indoorOption: { pace: "5:20-5:40 nos tiros", incline: "2%", details: "Aquec 15min + 5x(6min forte + 2min leve) + Volta 10min" }},
        { day: "Sexta", type: "Regenerativo", details: "5 km leve", pace: "7:00-7:30 min/km", zone: "Zona 1", location: "Rua", indoorOption: { pace: "7:00-7:30 min/km", incline: "0%", details: "35-40min super leve" }},
        { day: "Domingo", type: "Long Run Progressivo", details: "16-18 km (últimos 5km forte)", pace: "Início: 6:45-7:00 | Final: 5:50-6:10", zone: "Zona 2-3", location: "Rua", indoorOption: { pace: "Início 6:45 | Final 5:50-6:10", incline: "1-2%", details: "2h total (acelerar últimos 30min)" }}
      ],
      musculacao: [
        { day: "Terça", name: "Treino A - Força", exercises: [{ name: "Agachamento: 5x5" }, { name: "Leg press: 4x8" }, { name: "Afundo: 3x8 cada" }, { name: "Terra: 4x5" }, { name: "Stiff: 3x8" }, { name: "Flexora: 3x10" }, { name: "Panturrilha: 4x12" }]},
        { day: "Quinta", name: "Treino B - Força", exercises: [{ name: "Supino: 5x5" }, { name: "Supino inclinado: 3x8" }, { name: "Desenvolvimento: 4x6" }, { name: "Remada: 5x5" }, { name: "Puxada: 4x8" }, { name: "Remada cavalinho: 3x10" }, { name: "Elevação lateral: 3x12" }]},
        { day: "Sábado", name: "Treino C - Metabólico", exercises: [{ name: "Hip thrust: 4x12-15" }, { name: "Búlgaro: 3x12 cada" }, { name: "Abdutora: 4x20" }, { name: "Swing kettlebell: 3x15" }, { name: "Prancha toque ombro: 3x12 cada" }, { name: "Abdominal: 3x15" }, { name: "Prancha lateral: 3x10 cada" }, { name: "Dead bug: 3x15" }]}
      ]
    },
    3: {
      corrida: [
        { day: "Segunda", type: "Manutenção", details: "6-8 km", pace: "6:15-6:45 min/km", zone: "Zona 2", location: "Rua", indoorOption: { pace: "6:15-6:45 min/km", incline: "1%", details: "45-60min" }},
        { day: "Quarta", type: "Qualidade", details: "Aquec 15min + 4x800m + Volta 10min", pace: "800m: 5:10-5:30 | Recup: 90seg", zone: "Zona 4", location: "Rua", indoorOption: { pace: "5:10-5:30", incline: "2%", details: "Aquec 15min + 4x(5min forte + 90seg leve) + Volta 10min" }},
        { day: "Sábado", type: "Long Run (Taper)", details: "12-15 km (reduzindo)", pace: "6:20-6:50 min/km", zone: "Zona 2", location: "Rua", indoorOption: { pace: "6:20-6:50 min/km", incline: "1%", details: "90-110min (60min últimas 2 semanas)" }}
      ],
      musculacao: [
        { day: "Terça", name: "Treino A - Manutenção", exercises: [{ name: "Agachamento: 3x5" }, { name: "Leg press: 3x8" }, { name: "Terra: 3x5" }, { name: "Stiff: 2x10" }, { name: "Panturrilha: 3x12" }]},
        { day: "Quinta", name: "Treino B - Manutenção", exercises: [{ name: "Supino: 3x5" }, { name: "Desenvolvimento: 3x6" }, { name: "Remada: 3x5" }, { name: "Puxada: 3x8" }, { name: "Elevação lateral: 2x12" }]}
      ]
    }
  };

  const toggleWorkout = (key) => {
    setCompletedWorkouts(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      console.log('Toggle workout:', key, 'Novo estado:', newState[key]);
      return newState;
    });
  };

  const toggleExercise = (workoutKey, exerciseIndex) => {
    const exerciseKey = `${workoutKey}-ex-${exerciseIndex}`;
    setCompletedExercises(prev => {
      const newState = { ...prev, [exerciseKey]: !prev[exerciseKey] };
      console.log('Toggle exercise:', exerciseKey, 'Novo estado:', newState[exerciseKey]);
      return newState;
    });
  };

  const handleFileUpload = async (event, workoutKey) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setWorkoutData(prev => ({
      ...prev,
      [workoutKey]: { 
        fileName: file.name, 
        uploadDate: new Date().toISOString() 
      }
    }));
    alert('Dados importados! ✓');
  };

  const getExerciseProgress = (workoutKey, totalExercises) => {
    let completed = 0;
    for (let i = 0; i < totalExercises; i++) {
      if (completedExercises[`${workoutKey}-ex-${i}`]) completed++;
    }
    return completed;
  };

  const changePhase = (phaseIndex) => {
    setCurrentPhase(phaseIndex);
    setExpandedWeek(null);
    setExpandedDay(null);
  };

  const getWeekProgress = (weekNum) => {
    const workouts = workoutTemplates[currentPhase];
    const totalWorkouts = workouts.corrida.length + workouts.musculacao.length;
    let completed = 0;
    
    workouts.corrida.forEach(w => { 
      if (completedWorkouts[`${currentPhase}-${weekNum}-corrida-${w.day}`]) completed++; 
    });
    workouts.musculacao.forEach(w => { 
      if (completedWorkouts[`${currentPhase}-${weekNum}-musculacao-${w.day}`]) completed++; 
    });
    
    return Math.round((completed / totalWorkouts) * 100);
  };

  const getAnalysisData = () => {
    const analysis = { 
      totalWorkouts: 0, 
      completedWorkouts: 0, 
      corridaCompleted: 0, 
      musculacaoCompleted: 0, 
      totalExercises: 0, 
      completedEx: 0, 
      uploadsCount: Object.keys(workoutData).length 
    };
    
    Object.keys(completedWorkouts).forEach(key => {
      analysis.totalWorkouts++;
      if (completedWorkouts[key]) {
        analysis.completedWorkouts++;
        if (key.includes('corrida')) analysis.corridaCompleted++;
        if (key.includes('musculacao')) analysis.musculacaoCompleted++;
      }
    });
    
    Object.keys(completedExercises).forEach(key => {
      analysis.totalExercises++;
      if (completedExercises[key]) analysis.completedEx++;
    });
    
    return analysis;
  };

  const toggleIndoorMode = (key) => {
    setIndoorMode(prev => ({...prev, [key]: !prev[key]}));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🏃‍♀️</div>
          <div className="text-slate-400">Carregando...</div>
        </div>
      </div>
    );
  }

  if (showAnalysis) {
    const analysis = getAnalysisData();
    const completionRate = analysis.totalWorkouts > 0 ? Math.round((analysis.completedWorkouts / analysis.totalWorkouts) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setShowAnalysis(false)} className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <ChevronRight className="rotate-180" /> Voltar
          </button>
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-6 h-6" /> Análise</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-400">{completionRate}%</div>
                <div className="text-sm text-slate-300">Conclusão</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">{analysis.completedWorkouts}</div>
                <div className="text-sm text-slate-300">Treinos</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-400">{analysis.corridaCompleted}</div>
                <div className="text-sm text-slate-300">Corridas</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-400">{analysis.musculacaoCompleted}</div>
                <div className="text-sm text-slate-300">Musculação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">🏃‍♀️ Meia Maratona 2026</h1>
          <p className="text-slate-400">Jan-Set | Huawei Watch Fit 3</p>
        </div>

        <button onClick={() => setShowAnalysis(true)} className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition">
          <BarChart3 className="w-5 h-5" /> Ver Análise
        </button>

        <div className="mb-6 grid grid-cols-2 gap-2">
          {phases.map((phase, idx) => (
            <button 
              key={idx} 
              onClick={() => changePhase(idx - 1)} 
              className={`p-3 rounded-lg transition ${currentPhase === idx - 1 ? phase.color + ' shadow-lg' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
              <div className="font-bold text-sm">{phase.name}</div>
              <div className="text-xs opacity-75">{phase.period}</div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {Array.from({ length: phases.find((p, i) => i === currentPhase + 1)?.weeks || 2 }, (_, i) => {
            const weekNum = i + 1;
            const progress = getWeekProgress(weekNum);
            
            return (
              <div key={weekNum} className="bg-slate-800 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setExpandedWeek(expandedWeek === weekNum ? null : weekNum)} 
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div className="text-left">
                      <div className="font-bold">Semana {weekNum}</div>
                      <div className="text-xs text-slate-400">{progress}% completo</div>
                    </div>
                  </div>
                  {expandedWeek === weekNum ? <ChevronDown /> : <ChevronRight />}
                </button>

                {expandedWeek === weekNum && (
                  <div className="p-4 pt-0 space-y-3">
                    <div>
                      <button 
                        onClick={() => setExpandedDay(expandedDay === `${weekNum}-corrida` ? null : `${weekNum}-corrida`)} 
                        className="w-full flex items-center gap-2 mb-2 text-green-400 font-semibold"
                      >
                        <Footprints className="w-4 h-4" /> Corrida
                        {expandedDay === `${weekNum}-corrida` ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      
                      {expandedDay === `${weekNum}-corrida` && (
                        <div className="space-y-2 ml-6">
                          {workoutTemplates[currentPhase].corrida.map((workout, idx) => {
                            const key = `${currentPhase}-${weekNum}-corrida-${workout.day}`;
                            const isCompleted = completedWorkouts[key];
                            const showIndoor = indoorMode[key];
                            
                            return (
                              <div key={idx} className={`p-3 rounded-lg border-2 transition ${isCompleted ? 'bg-green-900/30 border-green-500' : 'bg-slate-700 border-slate-600'}`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm">{workout.day} - {workout.type}</div>
                                    <div className="text-xs text-slate-300 mt-1">{workout.details}</div>
                                  </div>
                                </div>
                                
                                <button onClick={() => toggleIndoorMode(key)} className="mb-2 flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300">
                                  <Home className="w-3 h-3" /> {showIndoor ? 'Ver rua' : 'Ver indoor'}
                                </button>

                                {!showIndoor ? (
                                  <div className="bg-slate-900/50 p-2 rounded text-xs space-y-1 mb-2">
                                    <div className="text-yellow-400">⏱️ {workout.pace}</div>
                                    <div className="text-blue-400">💓 {workout.zone}</div>
                                    <div className="text-green-400">📍 {workout.location}</div>
                                  </div>
                                ) : (
                                  <div className="bg-purple-900/30 p-2 rounded text-xs space-y-1 mb-2 border border-purple-500">
                                    <div className="text-purple-300 font-semibold flex items-center gap-1">
                                      <Home className="w-3 h-3" /> INDOOR
                                    </div>
                                    <div className="text-yellow-400">⏱️ {workout.indoorOption.pace}</div>
                                    <div className="text-orange-400">📐 {workout.indoorOption.incline}</div>
                                    <div className="text-slate-300">📝 {workout.indoorOption.details}</div>
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => toggleWorkout(key)} 
                                    className={`flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${isCompleted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                  >
                                    {isCompleted ? (<><X className="w-4 h-4" /> Desmarcar</>) : (<><Check className="w-4 h-4" /> Feito</>)}
                                  </button>
                                  
                                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg flex items-center gap-2 transition">
                                    <Upload className="w-4 h-4" />
                                    <input type="file" accept=".csv,.gpx,.tcx,.fit,.txt" onChange={(e) => handleFileUpload(e, key)} className="hidden" />
                                  </label>
                                </div>
                                
                                {workoutData[key] && (
                                  <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> {workoutData[key].fileName}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <button 
                        onClick={() => setExpandedDay(expandedDay === `${weekNum}-musculacao` ? null : `${weekNum}-musculacao`)} 
                        className="w-full flex items-center gap-2 mb-2 text-orange-400 font-semibold"
                      >
                        <Dumbbell className="w-4 h-4" /> Musculação
                        {expandedDay === `${weekNum}-musculacao` ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      
                      {expandedDay === `${weekNum}-musculacao` && (
                        <div className="space-y-2 ml-6">
                          {workoutTemplates[currentPhase].musculacao.map((workout, idx) => {
                            const key = `${currentPhase}-${weekNum}-musculacao-${workout.day}`;
                            const isCompleted = completedWorkouts[key];
                            const exCompleted = getExerciseProgress(key, workout.exercises.length);
                            
                            return (
                              <div key={idx} className={`p-3 rounded-lg border-2 transition ${isCompleted ? 'bg-orange-900/30 border-orange-500' : 'bg-slate-700 border-slate-600'}`}>
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm">{workout.day}</div>
                                    <div className="text-xs text-orange-300 font-semibold mt-1">{workout.name}</div>
                                    <div className="text-xs text-slate-400 mt-1">{exCompleted}/{workout.exercises.length} exercícios ✓</div>
                                  </div>
                                </div>
                                
                                <div className="bg-slate-900/50 p-2 rounded text-xs space-y-2 mb-3">
                                  {workout.exercises.map((ex, i) => {
                                    const exKey = `${key}-ex-${i}`;
                                    const exDone = completedExercises[exKey];
                                    const exerciseName = typeof ex === 'string' ? ex : ex.name;
                                    const videoUrl = typeof ex === 'object' ? ex.video : null;
                                    const intensity = typeof ex === 'object' ? ex.intensity : null;
                                    
                                    return (
                                      <div key={i} className="space-y-1">
                                        <div className={`p-2 rounded transition flex items-center gap-2 ${exDone ? 'bg-orange-900/40 text-orange-200' : 'bg-slate-800 text-slate-300'}`}>
                                          <div 
                                            onClick={() => toggleExercise(key, i)} 
                                            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${exDone ? 'border-orange-400 bg-orange-400' : 'border-slate-500'}`}
                                          >
                                            {exDone && <Check className="w-3 h-3 text-white" />}
                                          </div>
                                          <span className={`flex-1 ${exDone ? 'line-through' : ''}`}>{exerciseName}</span>
                                          {videoUrl && (
                                            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                              <Video className="w-4 h-4" />
                                            </a>
                                          )}
                                        </div>
                                        {intensity && (
                                          <div className="ml-6 text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                                            💪 {intensity}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                <button 
                                  onClick={() => toggleWorkout(key)} 
                                  className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${isCompleted ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                                >
                                  {isCompleted ? (<><X className="w-4 h-4" /> Desmarcar</>) : (<><Check className="w-4 h-4" /> Completo</>)}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-800 rounded-lg text-sm text-slate-300">
          <div className="font-bold mb-2">💡 Dicas:</div>
          <ul className="space-y-1 text-xs">
            <li>• <span className="text-purple-400">Indoor:</span> Clique para ver versão esteira</li>
            <li>• <span className="text-green-400">Exercícios:</span> Toque no checkbox para marcar</li>
            <li>• <span className="text-blue-400">Vídeos:</span> Ícone 🎥 abre tutorial no YouTube</li>
            <li>• Configure pace no Watch Fit 3 antes do treino</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainingApp;
