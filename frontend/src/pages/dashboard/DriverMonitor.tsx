import { useState, useRef, useEffect, useCallback } from "react";
import { Activity, Camera, CameraOff, ShieldAlert, Smartphone, Eye, Clock, User, Timer, AlertCircle, CheckCircle2, Info, Compass } from "lucide-react";
import { AreaChart, Area, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { uploadFrame, type DriverMonitorResponse } from "../../services/driverMonitor";

interface TimelineEvent {
  id: string;
  time: string;
  message: string;
  type: "info" | "warning" | "alert";
}

interface SessionStats {
  totalAlerts: number;
  maxRiskScore: number;
  totalEar: number;
  totalMar: number;
  earCount: number;
  marCount: number;
  totalBlinks: number;
  totalYawns: number;
  framesProcessed: number;
  durationSeconds: number;
  score: number | null;
}

export default function DriverMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  
  const [status, setStatus] = useState<"Idle" | "Initializing" | "Running" | "Summary" | "Error">("Idle");
  const [metrics, setMetrics] = useState<DriverMonitorResponse | null>(null);
  
  // Real-time trackers
  const [fps, setFps] = useState(0);
  const [sessionDuration, setSessionDuration] = useState("00:00");
  const [framesProcessed, setFramesProcessed] = useState(0);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [history, setHistory] = useState<{time: string, ear: number, attention: number, mar: number}[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  
  // Aggregated Stats
  const [stats, setStats] = useState<SessionStats>({
    totalAlerts: 0,
    maxRiskScore: 0,
    totalEar: 0,
    totalMar: 0,
    earCount: 0,
    marCount: 0,
    totalBlinks: 0,
    totalYawns: 0,
    framesProcessed: 0,
    durationSeconds: 0,
    score: null
  });

  const sessionStart = useRef<number | null>(null);
  const fpsCounter = useRef(0);
  const lastFpsTime = useRef(Date.now());
  const monitorInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isAlarmPlaying = useRef(false);
  const consecutiveDrowsy = useRef(0);

  useEffect(() => {
    // Placeholder audio
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ......");
  }, []);

  const addEvent = useCallback((message: string, type: "info" | "warning" | "alert") => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTimeline(prev => {
      const newEvent = { id: Math.random().toString(36).substring(7), time, message, type };
      return [newEvent, ...prev].slice(0, 20);
    });
  }, []);

  const playAlarm = useCallback(() => {
    if (!isAlarmPlaying.current) {
      isAlarmPlaying.current = true;
      const utterance = new SpeechSynthesisUtterance("Driver Alert! Please pay attention.");
      utterance.rate = 1.2;
      utterance.pitch = 1.5;
      utterance.onend = () => { isAlarmPlaying.current = false; };
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const startCamera = async () => {
    console.log("Monitoring started");
    try {
      setStatus("Initializing");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: "user" } 
      });
      console.log("Camera initialized");
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log("Video ready");
      }
      
      setStatus("Running");
      sessionStart.current = Date.now();
      
      // Reset State
      setFramesProcessed(0);
      setTimeline([]);
      setHistory([]);
      setRecommendation(null);
      consecutiveDrowsy.current = 0;
      setStats({
        totalAlerts: 0,
        maxRiskScore: 0,
        totalEar: 0,
        totalMar: 0,
        earCount: 0,
        marCount: 0,
        totalBlinks: 0,
        totalYawns: 0,
        framesProcessed: 0,
        durationSeconds: 0,
        score: null
      });

      addEvent("Monitoring session started", "info");
      
      startAnalysisLoop();
      
      durationInterval.current = setInterval(() => {
        if (sessionStart.current) {
          const diff = Math.floor((Date.now() - sessionStart.current) / 1000);
          const mins = Math.floor(diff / 60).toString().padStart(2, '0');
          const secs = (diff % 60).toString().padStart(2, '0');
          setSessionDuration(`${mins}:${secs}`);
        }
      }, 1000);

    } catch (err) {
      console.error("Camera error:", err);
      setStatus("Error");
      alert("Failed to access camera. Please allow camera permissions.");
    }
  };

  const calculateSafetyScore = (finalStats: SessionStats) => {
    let score = 100;
    
    // Penalize heavily for severe alerts
    score -= (finalStats.totalAlerts * 15);
    
    // Penalize for high risk max
    if (finalStats.maxRiskScore > 70) score -= 20;
    else if (finalStats.maxRiskScore > 40) score -= 10;
    
    // Penalize for excessive yawning relative to duration
    const durationMins = Math.max(1, finalStats.durationSeconds / 60);
    const yawnsPerMin = finalStats.totalYawns / durationMins;
    if (yawnsPerMin > 2) score -= 15;
    
    // Check if attention score average is extremely low
    if (history.length > 0) {
        const avgAttention = history.reduce((sum, h) => sum + h.attention, 0) / history.length;
        if (avgAttention < 50) score -= 20;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const stopCamera = useCallback(() => {
    console.log("Monitoring stopped, clearing logs");
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (monitorInterval.current) clearInterval(monitorInterval.current);
    if (durationInterval.current) clearInterval(durationInterval.current);
    
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
    
    window.speechSynthesis.cancel();
    isAlarmPlaying.current = false;

    // Transition to Summary
    if (status === "Running") {
      setStats(prev => {
        const finalDuration = sessionStart.current ? Math.floor((Date.now() - sessionStart.current) / 1000) : 0;
        const finalStats = { ...prev, durationSeconds: finalDuration, framesProcessed };
        finalStats.score = calculateSafetyScore(finalStats);
        return finalStats;
      });
      setStatus("Summary");
      addEvent("Monitoring session completed", "info");
    }
    
    sessionStart.current = null;
    setFps(0);
  }, [addEvent, framesProcessed, status]);

  const drawOverlay = (video: HTMLVideoElement, result: DriverMonitorResponse) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    overlay.width = video.clientWidth;
    overlay.height = video.clientHeight;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const scaleX = overlay.width / video.videoWidth;
    const scaleY = overlay.height / video.videoHeight;

    if (result.detections) {
      result.detections.forEach(det => {
        if (det.box) {
          const [x1, y1, x2, y2] = det.box;
          const w = x2 - x1;
          const h = y2 - y1;
          
          ctx.strokeStyle = det.class === "cell phone" ? "#ef4444" : "#3b82f6";
          ctx.lineWidth = 3;
          ctx.strokeRect(x1 * scaleX, y1 * scaleY, w * scaleX, h * scaleY);
          
          ctx.fillStyle = det.class === "cell phone" ? "#ef4444" : "#3b82f6";
          ctx.fillRect(x1 * scaleX, (y1 * scaleY) - 25, w * scaleX, 25);
          ctx.fillStyle = "#ffffff";
          ctx.font = "14px Inter, sans-serif";
          ctx.fillText(`${det.class} ${(det.confidence * 100).toFixed(0)}%`, (x1 * scaleX) + 5, (y1 * scaleY) - 8);
        }
      });
    }

    if (result.face_box) {
      const [x1, y1, x2, y2] = result.face_box;
      const w = x2 - x1;
      const h = y2 - y1;
      ctx.strokeStyle = result.drowsy ? "#ef4444" : "#10b981";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(x1 * scaleX, y1 * scaleY, w * scaleX, h * scaleY);
      ctx.setLineDash([]);
    }

    const drawEye = (eye?: [number, number][]) => {
      if (!eye) return;
      ctx.fillStyle = "#f59e0b";
      eye.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x * scaleX, y * scaleY, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    };
    
    drawEye(result.left_eye);
    drawEye(result.right_eye);
  };

  const captureAndUpload = async () => {
    // Avoid stale state checks like status !== "Running". The interval lifecycle manages it.
    if (!videoRef.current || !canvasRef.current) {
      console.log("Missing refs", { video: !!videoRef.current, canvas: !!canvasRef.current });
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0) return; // Wait for video to be ready

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    console.log("Capture Tick");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    console.log("Frame captured");

    canvas.toBlob(async (blob) => {
      console.log(`Blob created: ${blob?.size || 0} bytes, type: ${blob?.type || 'none'}`);
      if (blob) {
        try {
          console.log("Uploading frame...");
          const result = await uploadFrame(blob);
          console.log("AI response received");
          
          setMetrics(result);
          console.log("Updating UI");
          setFramesProcessed(prev => prev + 1);
          drawOverlay(video, result);
          
          // --- AI Recommendation & Alerts Logic ---
          let isAlert = false;
          
          if (result.drowsy) {
            consecutiveDrowsy.current += 1;
            if (consecutiveDrowsy.current === 1) {
              addEvent("Drowsiness detected!", "alert");
              playAlarm();
              isAlert = true;
            }
            if (consecutiveDrowsy.current >= 3) {
              setRecommendation("Driver fatigue detected. Recommend taking a 15-minute break before continuing the journey.");
            }
          } else {
            consecutiveDrowsy.current = 0;
            setRecommendation(null);
          }

          if (result.phone_detected) {
            addEvent("Phone usage detected!", "warning");
            isAlert = true;
          }

          if (result.fatigue_level !== "Alert" && result.fatigue_level !== "Unknown") {
             // addEvent(`Fatigue level: ${result.fatigue_level}`, "warning"); // Prevent spam
          }

          if (result.looking_away) {
              // We won't play alarm on looking away unless it persists, to avoid spam, but we'll show UI.
          }

          // --- History Update for Charts ---
          const timeLabel = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
          setHistory(prev => {
              const newHist = [...prev, { time: timeLabel, ear: result.ear || 0, attention: result.attention_score || 100, mar: result.mar || 0 }];
              return newHist.slice(-60); // Keep last 60 points (~1 minute at 1 FPS, or less depending on FPS)
          });

          // --- Session Stats Update ---
          setStats(prev => ({
            ...prev,
            totalAlerts: isAlert ? prev.totalAlerts + 1 : prev.totalAlerts,
            maxRiskScore: Math.max(prev.maxRiskScore, result.risk_score),
            totalEar: prev.totalEar + (result.ear || 0),
            earCount: result.ear ? prev.earCount + 1 : prev.earCount,
            totalMar: prev.totalMar + (result.mar || 0),
            marCount: result.mar ? prev.marCount + 1 : prev.marCount,
            totalBlinks: Math.max(prev.totalBlinks, result.blink_count),
            totalYawns: Math.max(prev.totalYawns, result.yawn_count)
          }));

          // Calculate FPS
          fpsCounter.current++;
          const now = Date.now();
          if (now - lastFpsTime.current >= 1000) {
            setFps(fpsCounter.current);
            fpsCounter.current = 0;
            lastFpsTime.current = now;
          }
        } catch (err) {
          console.error("Analysis error:", err);
        }
      }
    }, "image/jpeg", 0.7);
  };

  const startAnalysisLoop = () => {
    console.log("Capture loop started");
    monitorInterval.current = setInterval(captureAndUpload, 1000);
  };

  useEffect(() => {
    return () => {
      console.log("Component unmounting, stopping camera");
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (monitorInterval.current) clearInterval(monitorInterval.current);
      if (durationInterval.current) clearInterval(durationInterval.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  const renderSummary = () => {
    const avgEar = stats.earCount > 0 ? (stats.totalEar / stats.earCount).toFixed(2) : '---';
    const avgMar = stats.marCount > 0 ? (stats.totalMar / stats.marCount).toFixed(2) : '---';
    const blinkRate = stats.durationSeconds > 0 ? ((stats.totalBlinks / stats.durationSeconds) * 60).toFixed(1) : 0;
    
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-full mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Session Completed</h2>
          <p className="text-slate-500 mt-2">Here is the detailed safety breakdown for the completed trip.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 rounded-2xl p-6 text-white col-span-1 md:col-span-3 lg:col-span-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-bl-full blur-2xl" />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Driver Safety Score</h3>
            <div className="flex items-end gap-2">
              <span className={`text-6xl font-bold ${stats.score && stats.score > 80 ? 'text-emerald-400' : stats.score && stats.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {stats.score}
              </span>
              <span className="text-xl text-slate-500 mb-1">/100</span>
            </div>
            <p className="text-sm text-slate-400 mt-4">
              {stats.score && stats.score > 80 ? "Excellent driving behavior. No significant fatigue detected." :
               stats.score && stats.score > 50 ? "Moderate fatigue or distractions detected. Recommend rest." : 
               "Severe safety risks detected during session."}
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase">Duration</span>
              <span className="text-xl font-bold text-slate-900">{sessionDuration}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase">Alerts</span>
              <span className={`text-xl font-bold ${stats.totalAlerts > 0 ? 'text-red-600' : 'text-slate-900'}`}>{stats.totalAlerts}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase">Blink Rate</span>
              <span className="text-xl font-bold text-slate-900">{blinkRate} <span className="text-xs">/min</span></span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase">Yawns</span>
              <span className="text-xl font-bold text-slate-900">{stats.totalYawns}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase">Avg EAR</span>
              <span className="text-xl font-bold text-slate-900">{avgEar}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase">Avg MAR</span>
              <span className="text-xl font-bold text-slate-900">{avgMar}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase">Max Risk</span>
              <span className="text-xl font-bold text-slate-900">{stats.maxRiskScore}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-500 uppercase">Frames</span>
              <span className="text-xl font-bold text-slate-900">{stats.framesProcessed}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setStatus("Idle")}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Driver Monitoring</h1>
          <p className="text-slate-500 mt-1">Live AI telemetry and safety analysis</p>
        </div>
        <div className="flex gap-3">
          {status !== "Running" ? (
            <button 
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Camera size={18} /> Start Monitoring
            </button>
          ) : (
            <button 
              onClick={stopCamera}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
            >
              <CameraOff size={18} /> Stop Monitoring
            </button>
          )}
        </div>
      </div>

      {status === "Summary" ? (
        renderSummary()
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Video & Timeline */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* AI Recommendation Banner */}
            {recommendation && (
              <div className="bg-indigo-600 text-white rounded-2xl p-4 shadow-xl shadow-indigo-600/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="p-2 bg-white/20 rounded-xl shrink-0">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">AI Recommendation</h3>
                  <p className="font-medium opacity-90">{recommendation}</p>
                </div>
              </div>
            )}

            {/* Video Viewport with Canvas Overlay */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-xl">
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white text-sm font-medium border border-white/10">
                <div className={`w-2 h-2 rounded-full ${status === 'Running' ? 'bg-red-500 animate-pulse' : status === 'Initializing' ? 'bg-yellow-500' : 'bg-slate-500'}`} />
                {status}
              </div>
              {status === "Running" && (
                <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white text-sm font-medium border border-white/10 font-mono flex items-center gap-2">
                  <Activity size={14} className="text-emerald-400" />
                  {fps} FPS
                </div>
              )}

              {/* Main Alert Banner Overlay */}
              {status === "Running" && !recommendation && metrics?.alerts && metrics.alerts.length > 0 && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 w-3/4 animate-in fade-in slide-in-from-top-4">
                  <div className="bg-red-600/90 backdrop-blur-md text-white rounded-2xl p-4 border border-red-400 shadow-2xl shadow-red-600/20 text-center">
                    <div className="flex items-center justify-center gap-2 font-bold text-lg">
                      <ShieldAlert size={24} /> DRIVER ALERT
                    </div>
                    <p className="mt-1 font-medium opacity-90">{metrics.alerts[0]}</p>
                  </div>
                </div>
              )}
              
              <div className="aspect-[16/9] bg-black flex items-center justify-center relative">
                {status !== "Running" && status !== "Initializing" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4">
                    <CameraOff size={48} className="opacity-50" />
                    <p className="font-medium">Camera Offline</p>
                  </div>
                )}
                
                <video 
                  ref={videoRef} 
                  playsInline 
                  muted 
                  className={`absolute inset-0 w-full h-full object-cover ${status !== "Running" ? 'hidden' : ''}`}
                />
                
                {/* Hidden canvas required for extracting frames from the video */}
                <canvas ref={canvasRef} className="hidden" />
                
                <canvas 
                  ref={overlayRef} 
                  className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${status !== "Running" ? 'hidden' : ''}`}
                />
              </div>
            </div>

            {/* Event Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="text-blue-500" /> Event Timeline
              </h2>
              <div className="h-48 overflow-y-auto pr-2 space-y-3">
                {timeline.length === 0 ? (
                  <div className="text-slate-400 text-sm italic text-center py-8">No events recorded yet.</div>
                ) : (
                  timeline.map((event) => (
                    <div key={event.id} className="flex gap-4 items-start text-sm animate-in fade-in slide-in-from-left-2">
                      <span className="font-mono text-slate-400 whitespace-nowrap">{event.time}</span>
                      <span className={`font-medium ${
                        event.type === 'alert' ? 'text-red-600' : 
                        event.type === 'warning' ? 'text-yellow-600' : 
                        'text-slate-700'
                      }`}>
                        {event.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry Panels */}
          <div className="space-y-6">
            
            {/* Session Overview Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-bl-full blur-2xl" />
              <h3 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
                <Timer size={18} /> Session Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Duration</span>
                  <span className="text-2xl font-mono">{sessionDuration}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Frames</span>
                  <span className="text-2xl font-mono">{framesProcessed}</span>
                </div>
              </div>
            </div>

            {/* Detailed Telemetry Panel */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Activity className="text-blue-500" /> Live Diagnostics
              </h2>

              {!metrics ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                  <ShieldAlert size={32} className="opacity-50" />
                  <p className="text-sm font-medium">Awaiting Data...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Driver Presence & Risk */}
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${metrics.face_box ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                        <User size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900">{metrics.face_box ? 'Driver Detected' : 'No Driver'}</span>
                        <span className="text-xs text-slate-500">
                          {metrics.face_box ? 'Face Conf: N/A' : 'Presence Check'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`block text-2xl font-bold ${metrics.risk_score > 70 ? 'text-red-500' : metrics.risk_score > 30 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                        {metrics.risk_score}
                      </span>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Risk Score</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                        <Activity size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900">Attention Score</span>
                        <span className="text-xs text-slate-500">Live Focus Level</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`block text-2xl font-bold ${metrics.attention_score < 50 ? 'text-red-500' : metrics.attention_score < 80 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                        {metrics.attention_score}
                      </span>
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">/ 100</span>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Granular EAR Metrics */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Eye size={16} className="text-slate-400" /> Eye Monitoring (EAR)
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                        <span className="block text-xs text-slate-500 mb-1">Left</span>
                        <span className="font-mono font-medium text-slate-700">{metrics.left_ear?.toFixed(2) || '---'}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                        <span className="block text-xs text-slate-500 mb-1">Average</span>
                        <span className={`font-mono font-bold ${metrics.eye_closed ? 'text-red-500' : 'text-slate-900'}`}>{metrics.ear?.toFixed(2) || '---'}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                        <span className="block text-xs text-slate-500 mb-1">Right</span>
                        <span className="font-mono font-medium text-slate-700">{metrics.right_ear?.toFixed(2) || '---'}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs font-medium px-1">
                      <span className="text-slate-500">Status: <span className={metrics.eye_closed ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>{metrics.eye_closed ? 'CLOSED' : 'OPEN'}</span></span>
                      <span className="text-slate-500">
                        Blink Rate: <span className="text-slate-900 font-bold">
                          {stats.durationSeconds > 0 ? ((metrics.blink_count / stats.durationSeconds) * 60).toFixed(1) : 0}/m
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Granular MAR Metrics */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <User size={16} className="text-slate-400" /> Mouth Monitoring (MAR)
                    </h3>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="block text-xs text-slate-500 mb-1">Mouth Aspect Ratio</span>
                        <span className="font-mono font-bold text-slate-900">{metrics.mar?.toFixed(2) || '---'}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-slate-500 mb-1">Yawn Count</span>
                        <span className="font-mono font-bold text-slate-900">{metrics.yawn_count}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fatigue & PERCLOS */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Activity size={16} className="text-slate-400" /> Fatigue Analysis
                    </h3>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="block text-xs text-slate-500 mb-1">Fatigue Level</span>
                        <span className={`font-bold ${metrics.fatigue_level === 'Alert' ? 'text-emerald-500' : metrics.fatigue_level === 'Slightly Fatigued' ? 'text-yellow-500' : 'text-red-500'}`}>
                          {metrics.fatigue_level}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs text-slate-500 mb-1">PERCLOS</span>
                        <span className="font-mono font-bold text-slate-900">{metrics.perclos?.toFixed(1) || '0.0'}%</span>
                      </div>
                    </div>
                  </div>

                  {/* State Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${metrics.drowsy ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                      {metrics.drowsy ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                      <span className="text-sm font-bold">{metrics.drowsy ? 'Drowsy' : 'Normal'}</span>
                    </div>
                    
                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${metrics.phone_detected ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                      <Smartphone size={18} />
                      <span className="text-sm font-bold">{metrics.phone_detected ? 'Distracted' : 'Focused'}</span>
                    </div>

                    <div className={`p-3 col-span-2 rounded-xl border flex items-center justify-center gap-2 ${metrics.looking_away ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                      <Compass size={18} />
                      <span className="text-sm font-bold">{metrics.looking_away ? 'Head Turned / Looking Away' : 'Looking Forward'}</span>
                    </div>
                  </div>

                  {/* Telemetry Charts */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                     <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Activity size={16} className="text-slate-400" /> Live Attention Trend
                     </h3>
                     <div className="h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                              <Area type="monotone" dataKey="attention" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorAttention)" isAnimationActive={false} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
