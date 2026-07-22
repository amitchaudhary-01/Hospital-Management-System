import { useEffect, useState } from "react";
import { FileText, Pill, Stethoscope, CalendarDays, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api/axios";

const PatientPrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);

      const response = await API.get("/patient/prescriptions");

      setPrescriptions(response.data.prescriptions || []);
    } catch (error) {
      console.error("Fetch prescriptions error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch prescriptions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-slate-500 font-medium">
          Loading prescriptions...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-100 rounded-xl">
            <FileText className="w-6 h-6 text-sky-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Prescriptions
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              View prescriptions issued by your doctors.
            </p>
          </div>
        </div>
      </div>

      {/* No Prescription */}
      {prescriptions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />

          <h2 className="text-lg font-bold text-slate-800">
            No prescriptions yet
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your prescriptions will appear here after your doctor issues one.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Prescription Header */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-sky-600" />
                      Doctor Prescription
                    </h2>

                    {prescription.doctor && (
                      <p className="text-sm text-slate-500 mt-1">
                        Dr. {prescription.doctor.name}
                        {prescription.doctor.specialization &&
                          ` • ${prescription.doctor.specialization}`}
                      </p>
                    )}
                  </div>

                  {prescription.createdAt && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="w-4 h-4" />

                      {new Date(
                        prescription.createdAt
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Diagnosis */}
              {prescription.diagnosis && (
                <div className="p-5 border-b border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                    Diagnosis
                  </p>

                  <p className="text-sm font-semibold text-slate-800">
                    {prescription.diagnosis}
                  </p>
                </div>
              )}

              {/* Medicines */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="w-5 h-5 text-sky-600" />

                  <h3 className="font-bold text-slate-900">
                    Medicines
                  </h3>
                </div>

                <div className="space-y-3">
                  {prescription.medicines?.map((medicine, index) => (
                    <div
                      key={medicine._id || index}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="font-bold text-slate-800">
                          {medicine.name}
                        </p>

                        {medicine.dosage && (
                          <span className="text-sm text-sky-700 font-semibold">
                            {medicine.dosage}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                        {medicine.frequency && (
                          <span>
                            Frequency:{" "}
                            <strong className="text-slate-700">
                              {medicine.frequency}
                            </strong>
                          </span>
                        )}

                        {medicine.duration && (
                          <span>
                            Duration:{" "}
                            <strong className="text-slate-700">
                              {medicine.duration}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              {prescription.advice && (
                <div className="px-5 pb-5">
                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-sky-700 mb-1">
                      Doctor's Advice
                    </p>

                    <p className="text-sm text-slate-700">
                      {prescription.advice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescription;