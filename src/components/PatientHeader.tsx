import React, { useEffect, useState } from 'react';
import { User} from 'lucide-react';

const PatientHeader = () => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        // const response = await fetch('/api/users'); // Your API endpoint
        // if (!response.ok) {
        //   throw new Error('Failed to fetch users');
        // }
        // const data = await response.json();
        const data = {
            name: "Sarah Johnson",
            id: "MRN-2024-001",
            gender: "Female",
            dob: "1985-03-15"
          };
        setPatient(data);
      } 
      catch {
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);
  if (loading) {
    return ("Loading"
    );
  }
  return (
          <div className="w-full rounded-lg p-6 mb-6 bg-green-900">
            <div className="flex items-center gap-8 flex-nowrap">
              <div className="rounded-full p-2 flex-shrink-0 bg-green-800">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-white">
                  {patient?.name}
                </h1>
                <p className="text-sm text-white">ID: {patient?.id}</p>
              </div>
              <div className="flex-grow flex items-center gap-4 flex-nowrap">
                <div className="flex-shrink-0">
                  <p className="text-sm text-white opacity-80">Gender</p>
                  <p className="font-medium text-white">{patient?.gender}</p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-sm text-white opacity-80">Date of Birth</p>
                  <p className="font-medium text-white">{patient?.dob}</p>
                </div>
              </div>
            </div>
          </div>
  );
};

export default PatientHeader;