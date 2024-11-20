import SummaryDashboard from "@/components/pages/SummaryDashboard";
import { useState, useEffect } from 'react';

export default function DistilleryPage() {
    const [testData, setData] = useState(null);

  useEffect(() => {
    fetch('/data.json')
        .then(res => res.json())
        .then(data => setData(data));
}, []);


    if (!testData) return <div>Loading...</div>;
  return <SummaryDashboard documents={testData.documents} sections={testData.sections} />;
}