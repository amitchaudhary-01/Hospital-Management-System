import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilePlus2, Pill } from "lucide-react";

import PrescriptionForm from "../../components/PrescriptionForm";
import PrescriptionCard from "../../components/PrescriptionCard";
import Pagination from "../../components/Pagination";
import API from "../../api/axios";

const Prescriptions = () => {
  // =========================================
  // GET APPOINTMENT ID FROM URL
  // Example: /doctor/prescriptions?appointmentId=123
  // =========================================
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  // =========================================
  // STATES
  // =========================================
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    pageSize: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // =========================================
  // FETCH ALL DOCTOR PRESCRIPTIONS (PAGINATED)
  // =========================================
  const fetchPrescriptions = async (page = 1) => {
    try {
      setLoading(true);

      // ALWAYS fetch all prescriptions for the doctor regardless of appointmentId filter
      const res = await API.get(`/prescription?page=${page}&limit=5`);
      setPrescriptions(res.data.prescriptions || []);

      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Fetch prescriptions error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchPrescriptions(newPage);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchPrescriptions(1);
  }, [appointmentId]);

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* =================================
            PAGE HEADER
        ================================= */}
        <div
          data-aos="fade-down"
          className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Pill className="w-6 h-6" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Prescriptions Management
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 ml-11">
            Create, view, and issue medical prescriptions to patients.
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
            <div className="lg:col-span-5" data-aos="fade-right" data-aos-delay="100">
              <PrescriptionForm
                appointmentId={appointmentId}
                onSuccess={() => fetchPrescriptions(currentPage)}
              />
            </div>
          )}

          {/* =================================
              RIGHT: PRESCRIPTION LIST
          ================================= */}
          <div
            data-aos="fade-left"
            data-aos-delay="200"
            className={
              appointmentId ? "lg:col-span-7" : "lg:col-span-12"
            }
          >
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FilePlus2 className="w-4 h-4 text-sky-600" />
                  All Prescriptions
                </h2>

                <span className="text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full">
                  {pagination.totalCount || prescriptions.length} Records
                </span>
              </div>

              {/* Loading State */}
              {loading && prescriptions.length === 0 ? (
                <div className="py-12 text-center text-sm font-semibold text-slate-500">
                  Loading prescriptions...
                </div>
              ) : prescriptions.length === 0 ? (
                /* Empty State */
                <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <p className="text-sm font-bold text-slate-600">
                    No prescriptions found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Select an appointment to generate a new prescription.
                  </p>
                </div>
              ) : (
                /* Prescription Grid & Pagination */
                <>
                  <div
                    className={`grid gap-4 ${
                      appointmentId
                        ? "grid-cols-1"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
                    {prescriptions.map((prescription) => (
                      <PrescriptionCard
                        key={prescription._id}
                        prescription={prescription}
                        downloadingId={downloadingId}
                        setDownloadingId={setDownloadingId}
                      />
                    ))}
                  </div>

                  {/* Reusable Pagination Component */}
                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      hasPrevPage={pagination.hasPrevPage}
                      hasNextPage={pagination.hasNextPage}
                      loading={loading}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;