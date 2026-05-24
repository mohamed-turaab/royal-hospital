import React from 'react';
import { Pill } from 'lucide-react';

const PrintablePrescription = React.forwardRef(({ prescription }, ref) => {
  if (!prescription) return null;

  const pName = prescription.patientName || prescription.patient?.name || "Unknown Patient";
  const pAge = prescription.patient?.age || "-";
  const pGender = prescription.patient?.gender || "-";
  const dName = prescription.doctor?.name || "Doctor";
  const dSpec = prescription.doctor?.specialization || "Medical Officer";
  const dateStr = new Date(prescription.createdAt).toLocaleDateString();

  return (
    <div ref={ref} className="print-only hidden print:block bg-white w-full max-w-4xl mx-auto p-10 text-navyBlue-900 border border-gray-200 shadow-sm relative">
      {/* Background Watermark Logo */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqykqsQ3Ydc0V7iapxH1evrePjLpqaUbQNtg&s" alt="watermark" className="w-96 h-96 object-contain filter grayscale" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center border-b-[6px] border-royalBlue pb-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-royalBlue p-0.5 bg-white">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqykqsQ3Ydc0V7iapxH1evrePjLpqaUbQNtg&s" alt="Royal Hospital Logo" className="w-full h-full object-cover scale-[1.08] rounded-full" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-black uppercase tracking-widest text-navyBlue-950">Royal</h1>
              <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-royalBlue mt-[-4px]">Hospital</h1>
            </div>
          </div>
        <div className="text-right text-xs text-navyBlue-600 font-medium">
          <p>Mogadishu, Somalia</p>
          <p>Tel: +252 61 0000000</p>
          <p>Email: info@royalhospital.com</p>
          <p className="mt-2 font-bold text-navyBlue-900">Date: {dateStr}</p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-6 bg-royalBlue-50/30 p-6 rounded-2xl mb-8 border border-royalBlue-100">
        <div>
          <p className="text-[10px] uppercase font-bold text-royalBlue-400 tracking-widest mb-1">Patient Name</p>
          <p className="text-lg font-black text-royalBlue-900">{pName}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-royalBlue-400 tracking-widest mb-1">Age</p>
            <p className="font-semibold text-navyBlue-800">{pAge} yrs</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-royalBlue-400 tracking-widest mb-1">Gender</p>
            <p className="font-semibold text-navyBlue-800">{pGender}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-royalBlue-400 tracking-widest mb-1">Prescribed By</p>
          <p className="font-black text-royalBlue-900">Dr. {dName}</p>
          <p className="text-xs font-semibold text-royalBlue-600">{dSpec}</p>
        </div>
      </div>

      {/* Prescription Symbol (Rx) */}
      <div className="text-4xl font-serif italic font-black text-royalBlue-900 mb-6">Rx</div>

      {/* Medicines List */}
      <div className="space-y-6 mb-12 min-h-[200px]">
        {(prescription.medicines || []).map((m, i) => (
          <div key={i} className="border-b border-gray-100 pb-4">
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-xl font-black text-navyBlue-900">{i + 1}. {m.name}</h3>
              <span className="font-bold text-sm bg-gray-100 px-3 py-1 rounded-lg text-navyBlue-800">{m.dosage || 'N/A'}</span>
            </div>
            <div className="flex gap-8 text-sm text-navyBlue-700 font-medium ml-6 mb-2">
              <p><span className="text-royalBlue-500 font-bold">Freq:</span> {m.frequency || '-'}</p>
              <p><span className="text-royalBlue-500 font-bold">Duration:</span> {m.duration || '-'}</p>
            </div>
            {m.instructions && (
              <p className="text-sm italic text-navyBlue-600 ml-6"><span className="font-bold not-italic text-royalBlue-500">Sig:</span> {m.instructions}</p>
            )}
          </div>
        ))}
      </div>

      {/* Notes */}
      {prescription.notes && (
        <div className="mb-12">
          <p className="text-xs uppercase font-bold text-royalBlue-400 tracking-widest mb-2">Doctor's Advice / Notes</p>
          <p className="text-sm font-medium text-navyBlue-800 bg-gray-50 p-4 rounded-xl border border-gray-100">
            {prescription.notes}
          </p>
        </div>
      )}

      {/* Footer / Signatures */}
      <div className="mt-16 flex justify-between items-end">
        {/* Hospital Stamp */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-royalBlue/80 flex items-center justify-center text-royalBlue/80 -rotate-12 transform opacity-70">
            <div className="w-28 h-28 rounded-full border border-royalBlue/80 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black uppercase tracking-widest mb-1">Royal Hospital</span>
              <span className="text-xl font-black uppercase tracking-wider">{prescription.status === 'Pending Payment' ? 'VALID' : 'PAID & DISPENSED'}</span>
              <span className="text-[8px] font-bold mt-1">Official Stamp</span>
            </div>
          </div>
        </div>

        {/* Doctor Signature */}
        <div className="text-center">
          <div className="mb-2 border-b border-navyBlue-300 pb-1 px-8 inline-block">
            {/* Fake cursive signature */}
            <span className="font-serif text-3xl text-navyBlue-800 italic" style={{ fontFamily: "'Brush Script MT', cursive" }}>{dName}</span>
          </div>
          <p className="text-xs font-bold text-navyBlue-600 uppercase tracking-widest">Doctor's Signature</p>
          <p className="text-[10px] text-navyBlue-400 mt-1">Reg No. {prescription.doctor?._id?.toString().slice(-6).toUpperCase() || "DOC123"}</p>
        </div>
      </div>
      
      {/* Very bottom footer */}
      <div className="mt-12 pt-4 border-t border-gray-200 text-center text-[10px] text-gray-400 font-medium">
        This is an officially generated prescription from Royal Hospital's digital system. Keep this slip for your medical records.
      </div>
      </div>
    </div>
  );
});

export default PrintablePrescription;
