import { FileText, Download, Calendar, User, Pill, FileCheck } from "lucide-react";
import { downloadPrescription } from "../utils/prescriptionUtils";

const PrescriptionCard = ({ prescription, downloadingId, setDownloadingId }) => {
  const handleDownload = async () => {
    setDownloadingId(prescription._id);
    try {
      await downloadPrescription(prescription._id);
    } finally {
      setDownloadingId(null);
    }
  };

  // Fallback check for either 'advice' or 'notes'
  const displayAdvice = prescription.advice || prescription.notes;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-sky-200 transition-all duration-200 flex flex-col justify-between space-y-4">
      <div>
        {/* Header Section */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-slate-900 text-sm truncate">
                {prescription.patient?.name || prescription.patientName || "Patient Record"}
              </h4>
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                {new Date(prescription.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloadingId === prescription._id}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            {downloadingId === prescription._id ? "Downloading..." : "PDF"}
          </button>
        </div>

        {/* Diagnosis */}
        <div className="mt-3 bg-sky-50/50 border border-sky-100 rounded-xl p-2.5">
          <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider block">
            Diagnosis
          </span>
          <p className="text-xs font-bold text-slate-800 mt-0.5">
            {prescription.diagnosis || "No diagnosis specified"}
          </p>
        </div>

        {/* Prescribed Medicines */}
        <div className="mt-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
            Prescribed Medicines
          </span>
          <ul className="space-y-1.5">
            {prescription.medicines?.map((med, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-700 flex justify-between items-center bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg font-medium"
              >
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Pill className="w-3 h-3 text-sky-500" />
                  {med.name}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {med.dosage} {med.frequency ? `(${med.frequency})` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Additional Advice / Footer */}
      {displayAdvice && (
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 italic">
            <span className="font-bold not-italic text-slate-700">Advice:</span> {displayAdvice}
          </p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionCard;