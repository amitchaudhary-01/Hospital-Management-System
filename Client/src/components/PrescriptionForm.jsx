import { useState } from "react";
import { Plus, Trash2, Send, Stethoscope, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";

const PrescriptionForm = ({
  appointmentId,
  onSuccess,
}) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Only appointmentId is needed
  if (!appointmentId) {
    return toast.error(
      "Missing appointment context."
    );
  }

  if (!diagnosis.trim()) {
    return toast.error(
      "Please enter a diagnosis"
    );
  }

  setSubmitting(true);

  try {
    const payload = {
      appointment: appointmentId,
      diagnosis,
      medicines,
      advice: notes,
    };

    const response = await API.post(
      "/prescription",
      payload
    );

    toast.success(
      "Prescription created successfully!"
    );

    console.log(
      "Created prescription:",
      response.data
    );

    // Reset form
    setDiagnosis("");

    setMedicines([
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ]);

    setNotes("");

    if (onSuccess) {
      onSuccess(response.data);
    }
  } catch (err) {
    console.error(
      "Create prescription error:",
      err
    );

    toast.error(
      err.response?.data?.message ||
        "Failed to create prescription"
    );
  } finally {
    setSubmitting(false);
  }
};
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5"
    >
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-sky-600" />
          New Prescription
        </h3>
        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
          Active Entry
        </span>
      </div>

      {/* Diagnosis Input */}
      <div>
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
          Diagnosis <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="e.g. Health Issue"
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
          required
        />
      </div>

      {/* Medications List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide">
            Medications
          </label>
          <button
            type="button"
            onClick={addMedicine}
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-2 py-1 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Medicine
          </button>
        </div>

        {medicines.map((med, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-all"
          >
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Medicine (e.g. XXXXXXXXXX)"
                value={med.name}
                onChange={(e) => handleMedChange(idx, "name", e.target.value)}
                className="col-span-12 sm:col-span-6 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:border-sky-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Dosage (XXX mg)"
                value={med.dosage}
                onChange={(e) => handleMedChange(idx, "dosage", e.target.value)}
                className="col-span-4 sm:col-span-6 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-12 gap-2 items-center">
              <input
                type="text"
                placeholder="Freq (XXX)"
                value={med.frequency}
                onChange={(e) => handleMedChange(idx, "frequency", e.target.value)}
                className="col-span-5 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:border-sky-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Duration (XX Days)"
                value={med.duration}
                onChange={(e) => handleMedChange(idx, "duration", e.target.value)}
                className="col-span-5 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:border-sky-500 focus:outline-none"
              />
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeMedicine(idx)}
                  disabled={medicines.length === 1}
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-30 transition-all"
                  title="Remove Medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Advice */}
      <div>
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">
          Advice / Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. XXXXXXXXXXXXXXXXXXXXXXXX."
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
          rows={2}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
      >
        <Send className="w-4 h-4" />
        {submitting ? "Saving Prescription..." : "Save & Issue Prescription"}
      </button>
    </form>
  );
};

export default PrescriptionForm;