
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PrescriptionForm from "../../components/PrescriptionForm";
import PrescriptionCard from "../../components/PrescriptionCard";

import API from "../../api/axios";

import {
  FilePlus2,
  Pill,
} from "lucide-react";

const Prescriptions = () => {
  // =========================================
  // GET APPOINTMENT ID FROM URL
  // Example:
  // /doctor/prescriptions?appointmentId=123
  // =========================================
  const [searchParams] =
    useSearchParams();

  const appointmentId =
    searchParams.get("appointmentId");

  // =========================================
  // STATES
  // =========================================
  const [
    prescriptions,
    setPrescriptions,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    downloadingId,
    setDownloadingId,
  ] = useState(null);

  // =========================================
  // FETCH DOCTOR PRESCRIPTIONS
  // =========================================
const fetchPrescriptions = async () => {
  try {
    setLoading(true);

    if (!appointmentId) {
      setPrescriptions([]);
      return;
    }

    const res = await API.get(
      `/prescription/appointment/${appointmentId}`
    );

    setPrescriptions(
      res.data.prescriptions || []
    );
  } catch (err) {
    console.error(
      "Fetch prescriptions error:",
      err
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchPrescriptions();
}, [appointmentId]);

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* =================================
            PAGE HEADER
        ================================= */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">

          <div className="flex items-center gap-2.5">

            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Pill className="w-6 h-6" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Prescriptions Management
            </h1>

          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 ml-11">
            Create, view, and issue medical
            prescriptions to patients.
          </p>

        </div>

        {/* =================================
            LAYOUT
        ================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* =================================
              LEFT: PRESCRIPTION FORM
          ================================= */}
          {appointmentId && (
            <div className="lg:col-span-5">

              <PrescriptionForm
                appointmentId={
                  appointmentId
                }
                onSuccess={
                  fetchPrescriptions
                }
              />

            </div>
          )}

          {/* =================================
              RIGHT: PRESCRIPTION LIST
          ================================= */}
          <div
            className={
              appointmentId
                ? "lg:col-span-7"
                : "lg:col-span-12"
            }
          >

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">

                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">

                  <FilePlus2 className="w-4 h-4 text-sky-600" />

                  Recent Prescriptions

                </h2>

                <span className="text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full">

                  {prescriptions.length} Records

                </span>

              </div>

              {/* Loading */}
              {loading ? (

                <div className="py-12 text-center text-sm font-semibold text-slate-500">

                  Loading prescriptions...

                </div>

              ) : prescriptions.length === 0 ? (

                /* Empty */
                <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">

                  <p className="text-sm font-bold text-slate-600">
                    No prescriptions found
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Select an appointment to
                    generate a new prescription.
                  </p>

                </div>

              ) : (

                /* Prescription Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {prescriptions.map(
                    (prescription) => (

                      <PrescriptionCard
                        key={
                          prescription._id
                        }
                        prescription={
                          prescription
                        }
                        downloadingId={
                          downloadingId
                        }
                        setDownloadingId={
                          setDownloadingId
                        }
                      />

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Prescriptions;

