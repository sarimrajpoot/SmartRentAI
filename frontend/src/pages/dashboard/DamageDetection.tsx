import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, ShieldAlert, CheckCircle2, Download, Image as ImageIcon, Loader2, AlertTriangle, Info } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import api from "../../api/api";
import { analyzeDamage, type DamageReport } from "../../services/damage";

export default function DamageDetection() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DamageReport | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'before') {
        setBeforeImage(file);
        setBeforePreview(previewUrl);
      } else {
        setAfterImage(file);
        setAfterPreview(previewUrl);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!id || !beforeImage || !afterImage) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeDamage(id, beforeImage, afterImage);
      setReport(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to analyze images. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Damage-Report-${id}.pdf`);
    } catch (err) {
      alert("Failed to generate PDF.");
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              AI Damage Inspection
            </h1>
            <p className="text-slate-500 mt-1 font-mono text-sm">Booking ID: {id?.split('-')[0].toUpperCase()}</p>
          </div>
        </div>
        {report && (
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download size={18} /> Download PDF
          </button>
        )}
      </div>

      {!report ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
                <ImageIcon size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Upload Inspection Images</h2>
              <p className="text-slate-500 mt-2">Upload the vehicle condition photos from before and after the rental. Our AI will automatically detect any new damages.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Before Image Upload */}
              <div className="space-y-3">
                <span className="font-bold text-slate-700 block">1. Before Rental</span>
                <label className="block w-full aspect-video border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer relative overflow-hidden group">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'before')} />
                  {beforePreview ? (
                    <img src={beforePreview} alt="Before" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                      <UploadCloud size={32} className="mb-2 text-slate-400 group-hover:text-blue-500" />
                      <span className="font-medium">Click to upload</span>
                    </div>
                  )}
                </label>
              </div>

              {/* After Image Upload */}
              <div className="space-y-3">
                <span className="font-bold text-slate-700 block">2. After Rental</span>
                <label className="block w-full aspect-video border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer relative overflow-hidden group">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'after')} />
                  {afterPreview ? (
                    <img src={afterPreview} alt="After" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                      <UploadCloud size={32} className="mb-2 text-slate-400 group-hover:text-blue-500" />
                      <span className="font-medium">Click to upload</span>
                    </div>
                  )}
                </label>
              </div>

            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                <AlertTriangle size={20} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="flex justify-center pt-6">
              <button
                onClick={handleAnalyze}
                disabled={!beforeImage || !afterImage || loading}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Analyzing Deep Models...
                  </>
                ) : (
                  <>
                    <ShieldAlert size={20} /> Run AI Damage Detection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Report View */
        <div ref={reportRef} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
          
          <div className="text-center pb-6 border-b border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900">Official AI Inspection Report</h2>
            <p className="text-slate-500 mt-2 font-mono">Report ID: {report.id} • Booking: {id?.split('-')[0].toUpperCase()}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Condition Overview Card */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white col-span-1 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-bl-full blur-2xl" />
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Vehicle Condition Score</h3>
                <div className="flex items-end gap-2">
                  <span className={`text-6xl font-bold ${report.condition_score >= 90 ? 'text-emerald-400' : report.condition_score >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {report.condition_score}
                  </span>
                  <span className="text-xl text-slate-500 mb-1">/100</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-800">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 block">Est. Repair Cost</span>
                <span className="text-3xl font-bold text-white">Rs {report.total_repair_cost.toLocaleString()}</span>
              </div>
            </div>

            {/* Damage Details List */}
            <div className="col-span-1 lg:col-span-2 space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" /> Detected Discrepancies
              </h3>
              
              {report.damages.length === 0 ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 text-emerald-700">
                  <CheckCircle2 size={32} />
                  <div>
                    <h4 className="font-bold text-lg">Vehicle Clean</h4>
                    <p>No new damages were detected by the AI model.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.damages.map((dmg, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <AlertTriangle size={18} className="text-red-500" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900">{dmg.type} on {dmg.part}</span>
                          <span className="block text-sm text-slate-500 font-medium">Severity: {dmg.severity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-slate-900">Rs {dmg.repair_cost_est}</span>
                        <span className="text-xs text-slate-400 uppercase font-bold">Est. Cost</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Disclaimer */}
              <div className="mt-4 flex gap-3 text-xs font-medium text-slate-500 bg-blue-50 p-3 rounded-lg text-blue-700">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>This report is generated using an automated Deep Learning visual inspection model. Estimates are preliminary. Final charges require manual verification.</p>
              </div>
            </div>

          </div>

          {/* Premium Side-by-Side Images */}
          <div className="pt-8 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ImageIcon className="text-blue-500" /> AI Visual Evidence Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-xs uppercase tracking-wider">Before Rental</span>
                </div>
                <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                  <img src={(api.defaults.baseURL?.replace('/api', '') || '') + report.before_image_url} alt="Before" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert size={14} /> AI Annotated (After)
                  </span>
                </div>
                <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-red-200 shadow-sm relative">
                  {report.annotated_image_url ? (
                    <img src={(api.defaults.baseURL?.replace('/api', '') || '') + report.annotated_image_url} alt="After Annotated" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">No annotated image</div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
