import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronRight, Calendar, Dumbbell, Footprints, X, Upload, BarChart3, Home } from 'lucide-react';

const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? { value: item } : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
};

const TrainingApp = () => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState({});
  const [completedExercises, setCompletedExercises] = useState({});
  const [workoutData, setWorkoutData] = useState({});
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [indoorMode, setIndoorMode] = useState({});

  useEffect(() => {
    const loadData = () => {
      try {
        const saved = storage.get('training-progress');
        if (saved) {
          const data = JSON.parse(saved.value);
          setCompletedWorkouts(data.completed || {});
          setCompletedExercises(data.exercises || {});
          setWorkoutData(data.workoutData || {});
          setCurrentPhase(data.phase || 0);
        }
      } catch (error) {
        console.log('Primeira vez usando o app');
      }
    };
    loadData();
  }, []);

  const saveData = (completed, exercises, data, phase) => {
    try {
      storage.set('training-progress', JSON.stringify({
        completed,
        exercises,
        workoutData: data,
        phase,
        lastUpdate: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const phases = [
    { name: "Fase 1: Base", period: "Fevereiro - Março", weeks: 8, color: "bg-blue-500" },
    { name: "Fase 2: Volume", period: "Abril - Maio", weeks: 8, color: "bg-green-500" },
    { name: "Fase 3: Intensidade", period: "Junho - Julho", weeks: 8, color: "bg-orange-500" },
    { name: "Fase 4: Pico", period: "Agosto - Setembro", weeks: 8, color: "bg-purple-500" }
  ];

  const workoutTemplates = {
    0: {
      corrida: [
        { day: "Segunda", type: "Corrida Confortável", details: "5-6 km", pace: "6:30-7:00 min/km", zone: "Zona 2 - Conversação fácil", location: "Rua", indoorOption: { pace: "6:30-7:00 min/km", incline: "1%", details: "40-45min na esteira" }},
        { day: "Quarta", type: "Intervalado", details: "Aquecimento 10min + 8x400m + Volta calma 10min", pace: "400m: 5:30-5:45 min/km | Recuperação: caminhada 1min", zone: "Zona 4 - Intenso", location: "Rua/Pista", indoorOption: { pace: "5:30-5:45 min/km nos tiros", incline: "2%", details: "Aquec 10min + 8x(2min rápido + 1min caminhada) + Volta calma 10min" }},
        { day: "Sábado", type: "Long Run", details: "8-10 km", pace: "6:45-7:15 min/km", zone: "Zona 2 - Conversação fácil", location: "Rua", indoorOption: { pace: "6:45-7:15 min/km", incline: "1-2%", details: "60-75min na esteira (varie inclinação a cada 10min)" }}
      ],
      musculacao: [
        { day: "Terça", name: "Treino A - Quadríceps e Posterior", exercises: ["Agachamento livre: 4x10-12", "Leg press 45°: 3x12-15", "Cadeira extensora: 3x12-15", "Levantamento terra: 4x8-10", "Cadeira flexora: 3x12-15", "Stiff: 3x10-12", "Panturrilha em pé: 4x15-20"]},
        { day: "Quinta", name: "Treino B - Puxar e Empurrar", exercises: ["Supino reto: 4x10-12", "Supino inclinado: 3x10-12", "Crucifixo: 3x12-15", "Remada curvada: 4x10-12", "Puxada frente: 4x10-12", "Remada máquina: 3x12-15", "Desenvolvimento: 3x10-12"]},
        { day: "Domingo", name: "Treino C - Glúteos e Core", exercises: ["Hip thrust: 4x12-15", "Agachamento sumo: 3x12-15", "Afundo búlgaro: 3x10-12 cada perna", "Cadeira abdutora: 3x15-20", "Elevação pélvica: 3x15-20", "Prancha: 4x45-60seg", "Abdominal canivete: 3x15-20", "Prancha lateral: 3x30-45seg cada lado"]}
      ]
    },
    1: {
      corrida: [
        { day: "Segunda", type: "Ritmo Moderado", details: "7-8 km", pace: "6:00-6:30 min/km", zone: "Zona 3 - Ritmo firme", location: "Rua", indoorOption: { pace: "6:00-6:30 min/km", incline: "1-2%", details: "50-60min na esteira" }},
        { day: "Quarta", type: "Tempo Run", details: "Aquecimento 10min + 5 km forte + Volta calma 10min", pace: "5:30-5:50 min/km", zone: "Zona 4 - Limiar", location: "Rua", indoorOption: { pace: "5:30-5:50 min/km", incline: "2%", details: "Aquec 10min + 30min ritmo forte + Volta calma 10min" }},
        { day: "Sexta", type: "Recuperação", details: "4 km muito leve", pace: "7:00-7:30 min/km", zone: "Zona 1 - Muito fácil", location: "Rua", indoorOption: { pace: "7:00-7:30 min/km", incline: "0-1%", details: "30min relaxado na esteira" }},
        { day: "Domingo", type: "Long Run", details: "12-15 km", pace: "6:30-7:00 min/km", zone: "Zona 2 - Conversação", location: "Rua", indoorOption: { pace: "6:30-7:00 min/km", incline: "1-2% variado", details: "90-110min (varie: 15min 1% / 15min 2%...)" }}
      ],
      musculacao: [
        { day: "Terça", name: "Treino A - Quadríceps e Posterior", exercises: ["Agachamento livre: 4x8-10", "Leg press 45°: 4x10-12", "Hack machine: 3x10-12", "Cadeira extensora: 3x12-15", "Levantamento terra: 4x6-8", "Stiff: 3x10-12", "Cadeira flexora: 3x12-15", "Panturrilha sentado: 4x15-20"]},
        { day: "Quinta", name: "Treino B - Puxar e Empurrar", exercises: ["Supino reto: 4x8-10", "Supino inclinado halteres: 3x10-12", "Crossover: 3x12-15", "Tríceps testa: 3x10-12", "Remada curvada: 4x8-10", "Puxada pegada neutra: 4x10-12", "Remada unilateral: 3x10-12 cada", "Rosca direta: 3x10-12", "Desenvolvimento: 3x10-12"]},
        { day: "Sábado", name: "Treino C - Glúteos e Core", exercises: ["Hip thrust com barra: 4x10-12", "Agachamento sumo: 4x10-12", "Afundo caminhando: 3x12 cada perna", "Cadeira abdutora: 4x15-20", "Stiff unilateral: 3x10 cada perna", "Prancha com elevação perna: 3x45seg", "Abdominal bicicleta: 3x20", "Russian twist: 3x30 total", "Mountain climber: 3x20"]}
      ]
    },
    2: {
      corrida: [
        { day: "Segunda", type: "Pace de Prova", details: "Aquecimento 10min + 8 km + Volta calma 5min", pace: "5:40-6:00 min/km", zone: "Zona 3-4 - Ritmo da Meia", location: "Rua", indoorOption: { pace: "5:40-6:00 min/km", incline: "1%", details: "Aquec 10min + 50min ritmo prova + Volta calma 5min" }},
        { day: "Quarta", type: "Intervalado Longo", details: "Aquecimento 15min + 5x1km + Volta calma 10min", pace: "1km: 5:20-5:40 min/km | Recuperação: 2min trote", zone: "Zona 4-5 - Muito intenso", location: "Rua", indoorOption: { pace: "5:20-5:40 min/km nos tiros", incline: "2%", details: "Aquec 15min + 5x(6min forte + 2min leve) + Volta calma 10min" }},
        { day: "Sexta", type: "Regenerativo", details: "5 km muito leve", pace: "7:00-7:30 min/km", zone: "Zona 1 - Recuperação ativa", location: "Rua", indoorOption: { pace: "7:00-7:30 min/km", incline: "0%", details: "35-40min super leve" }},
        { day: "Domingo", type: "Long Run Progressivo", details: "16-18 km (últimos 5km mais forte)", pace: "Início: 6:45-7:00 | Final: 5:50-6:10 min/km", zone: "Zona 2-3 - Progressivo", location: "Rua", indoorOption: { pace: "Início 6:45-7:00 | Últimos 30min 5:50-6:10", incline: "1-2%", details: "2h total (acelerar gradualmente nos últimos 30min)" }}
      ],
      musculacao: [
        { day: "Terça", name: "Treino A - Quadríceps e Posterior (Força)", exercises: ["Agachamento livre: 5x5 (pesado)", "Leg press 45°: 4x8", "Afundo: 3x8 cada perna", "Levantamento terra: 4x5 (pesado)", "Stiff: 3x8", "Cadeira flexora: 3x10", "Panturrilha em pé: 4x12"]},
        { day: "Quinta", name: "Treino B - Puxar e Empurrar (Força)", exercises: ["Supino reto: 5x5 (pesado)", "Supino inclinado: 3x8", "Desenvolvimento: 4x6", "Remada curvada: 5x5 (pesado)", "Puxada frente: 4x8", "Remada cavalinho: 3x10", "Elevação lateral: 3x12"]},
        { day: "Sábado", name: "Treino C - Glúteos e Core (Metabólico)", exercises: ["Hip thrust: 4x12-15", "Agachamento búlgaro: 3x12 cada", "Cadeira abdutora: 4x20", "Swing kettlebell: 3x15", "Prancha com toque ombro: 3x12 cada", "Abdominal completo: 3x15", "Prancha lateral dinâmica: 3x10 cada", "Dead bug: 3x15"]}
      ]
    },
    3: {
      corrida: [
        { day: "Segunda", type: "Manutenção", details: "6-8 km confortável", pace: "6:15-6:45 min/km", zone: "Zona 2 - Confortável", location: "Rua", indoorOption: { pace: "6:15-6:45 min/km", incline: "1%", details: "45-60min relaxado" }},
        { day: "Quarta", type: "Qualidade", details: "Aquecimento 15min + 4x800m + Volta calma 10min", pace: "800m: 5:10-5:30 min/km | Recuperação: 90seg", zone: "Zona 4 - Intenso", location: "Rua", indoorOption: { pace: "5:10-5:30 min/km", incline: "2%", details: "Aquec 15min + 4x(5min forte + 90seg leve) + Volta calma 10min" }},
        { day: "Sábado", type: "Long Run (Taper)", details: "12-15 km (reduzindo)", pace: "6:20-6:50 min/km", zone: "Zona 2 - Fácil", location: "Rua", indoorOption: { pace: "6:20-6:50 min/km", incline: "1%", details: "90-110min (reduzir para 60min nas últimas 2 semanas)" }}
      ],
      musculacao: [
        { day: "Terça", name: "Treino A - Quadríceps e Posterior (Manutenção)", exercises: ["Agachamento livre: 3x5", "Leg press: 3x8", "Levantamento terra: 3x5", "Stiff: 2x10", "Panturrilha: 3x12"]},
        { day: "Quinta", name: "Treino B - Puxar e Empurrar (Manutenção)", exercises: ["Supino reto: 3x5", "Desenvolvimento: 3x6", "Remada curvada: 3x5", "Puxada: 3x8", "Elevação lateral: 2x12"]}
      ]
    }
  };

  const toggleWorkout = (key) => {
    const newCompleted = { ...completedWorkouts };
    newCompleted[key] = !newCompleted[key];
    setCompletedWorkouts(newCompleted);
    saveData(newCompleted, completedExercises, workoutData, currentPhase);
  };

  const toggleExercise = (workoutKey, exerciseIndex) => {
    const exerciseKey = `${workoutKey}-ex-${exerciseIndex}`;
    const newExercises = { ...completedExercises };
    newExercises[exerciseKey] = !newExercises[exerciseKey];
    setCompletedExercises(newExercises);
    saveData(completedWorkouts, newExercises, workoutData, currentPhase);
  };

  const handleFileUpload = (event, workoutKey) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const newData = { ...workoutData };
        newData[workoutKey] = {
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          content: content.substring(0, 1000)
        };
        setWorkoutData(newData);
        saveData(completedWorkouts, completedExercises, newData, currentPhase);
        alert('Dados importados com sucesso! ✓');
      } catch (error) {
        alert('Erro ao importar arquivo. Tente novamente.');
      }
    };
    reader.readAsText(file);
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
    saveData(completedWorkouts, completedExercises, workoutData, phaseIndex);
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
      totalWorkouts: 0, completedWorkouts: 0, corridaCompleted: 0,
      musculacaoCompleted: 0, totalExercises: 0, completedEx: 0,
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

  if (showAnalysis) {
    const analysis = getAnalysisData();
    const completionRate = analysis.totalWorkouts > 0 ? Math.round((analysis.completedWorkouts / analysis.totalWorkouts) * 100) : 0;
    const exerciseRate = analysis.totalExercises > 0 ? Math.round((analysis.completedEx / analysis.totalExercises) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setShowAnalysis(false)} className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <ChevronRight className="rotate-180" /> Voltar aos treinos
          </button>
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" /> Análise de Progresso
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-400">{completionRate}%</div>
                <div className="text-sm text-slate-300">Taxa de conclusão</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">{analysis.completedWorkouts}</div>
                <div className="text-sm text-slate-300">Treinos completos</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>🏃 Corrida</span>
                  <span>{analysis.corridaCompleted} treinos</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${analysis.corridaCompleted > 0 ? (analysis.corridaCompleted / analysis.completedWorkouts * 100) : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>💪 Musculação</span>
                  <span>{analysis.musculacaoCompleted} treinos</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${analysis.musculacaoCompleted > 0 ? (analysis.musculacaoCompleted / analysis.completedWorkouts * 100) : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>✓ Exercícios concluídos</span>
                  <span>{analysis.completedEx}/{analysis.totalExercises} ({exerciseRate}%)</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${exerciseRate}%` }} />
                </div>
              </div>
              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">Dados do Huawei</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">{analysis.uploadsCount}</div>
                <div className="text-xs text-slate-300">arquivos importados</div>
              </div>
            </div>
            {analysis.uploadsCount > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-3">Uploads recentes:</h3>
                <div className="space-y-2">
                  {Object.entries(workoutData).slice(-5).map(([key, data]) => (
                    <div key={key} className="bg-slate-700 p-3 rounded text-sm">
                      <div className="font-semibold">{data.fileName}</div>
                      <div className="text-xs text-slate-400">{new Date(data.uploadDate).toLocaleDateString('pt-BR')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">🏃‍♀️ Meia Maratona 2025</h1>
          <p className="text-slate-400">Fev-Set | Huawei Watch Fit 3</p>
        </div>

        <button onClick={() => setShowAnalysis(true)} className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition">
          <BarChart3 className="w-5 h-5" /> Ver Análise de Progresso
        </button>

        <div className="mb-6 grid grid-cols-2 gap-2">
          {phases.map((phase, idx) => (
            <button key={idx} onClick={() => changePhase(idx)} className={`p-3 rounded-lg transition ${currentPhase === idx ? phase.color + ' shadow-lg' : 'bg-slate-700 hover:bg-slate-600'}`}>
              <div className="font-bold text-sm">{phase.name}</div>
              <div className="text-xs opacity-75">{phase.period}</div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {Array.from({ length: phases[currentPhase].weeks }, (_, i) => {
            const weekNum = i + 1;
            const progress = getWeekProgress(weekNum);
            
            return (
              <div key={weekNum} className="bg-slate-800 rounded-lg overflow-hidden">
                <button onClick={() => setExpandedWeek(expandedWeek === weekNum ? null : weekNum)} className="w-full p-4 flex items-center justify-between hover:bg-slate-700 transition">
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
                      <button onClick={() => setExpandedDay(expandedDay === `${weekNum}-corrida` ? null : `${weekNum}-corrida`)} className="w-full flex items-center gap-2 mb-2 text-green-400 font-semibold">
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
                                  <Home className="w-3 h-3" /> {showIndoor ? 'Ver treino de rua' : 'Ver opção indoor (esteira)'}
                                </button>

                                {!showIndoor ? (
                                  <div className="bg-slate-900/50 p-2 rounded text-xs space-y-1 mb-2">
                                    <div className="text-yellow-400">⏱️ Pace: {workout.pace}</div>
                                    <div className="text-blue-400">💓 {workout.zone}</div>
                                    <div className="text-green-400">📍 {workout.location}</div>
                                  </div>
                                ) : (
                                  <div className="bg-purple-900/30 p-2 rounded text-xs space-y-1 mb-2 border border-purple-500">
                                    <div className="text-purple-300 font-semibold flex items-center gap-1">
                                      <Home className="w-3 h-3" /> OPÇÃO INDOOR (Esteira)
                                    </div>
                                    <div className="text-yellow-400">⏱️ Pace: {workout.indoorOption.pace}</div>
                                    <div className="text-orange-400">📐 Inclinação: {workout.indoorOption.incline}</div>
                                    <div className="text-slate-300">📝 {workout.indoorOption.details}</div>
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  <button onClick={() => toggleWorkout(key)} className={`flex-1 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${isCompleted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                    {isCompleted ? (<><X className="w-4 h-4" /> Desmarcar</>) : (<><Check className="w-4 h-4" /> Marcar Feito</>)}
                                  </button>
                                  
                                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg flex items-center gap-2 transition">
                                    <Upload className="w-4 h-4" />
                                    <input type="file" accept=".csv,.gpx,.tcx,.fit,.txt" onChange={(e) => handleFileUpload(e, key)} className="hidden" />
                                    Dados
                                  </label>
                                </div>
                                
                                {workoutData[key] && (
                                  <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Dados importados: {workoutData[key].fileName}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <button onClick={() => setExpandedDay(expandedDay === `${weekNum}-musculacao` ? null : `${weekNum}-musculacao`)} className="w-full flex items-center gap-2 mb-2 text-orange-400 font-semibold">
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
                                    return (
                                      <div key={i} onClick={() => toggleExercise(key, i)} className={`p-2 rounded cursor-pointer transition flex items-center gap-2 ${exDone ? 'bg-orange-900/40 text-orange-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${exDone ? 'border-orange-400 bg-orange-400' : 'border-slate-500'}`}>
                                          {exDone && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={exDone ? 'line-through' : ''}>{ex}</span>
                                      </div>
                                    );
                                  })}
                                </div>

                                <button onClick={() => toggleWorkout(key)} className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${isCompleted ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                                  {isCompleted ? (<><X className="w-4 h-4" /> Desmarcar Treino</>) : (<><Check className="w-4 h-4" /> Marcar Treino Completo</>)}
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
            <li>• <span className="text-purple-400">Indoor:</span> Clique em "Ver opção indoor" para treino na esteira</li>
            <li>• <span className="text-green-400">Exercícios:</span> Clique em cada exercício para marcar ✓</li>
            <li>• <span className="text-blue-400">Dados:</span> Importe arquivos do Huawei (.csv, .gpx, .tcx, .fit)</li>
            <li>• Configure pace e zonas FC no Watch Fit 3 antes do treino</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainingApp;
