"use client";
import SummaryDashboard from '@/components/pages/SummaryDashboard'
import FhirClientProvider from "@/components/FhirClientProvider";
import { useState, useEffect } from 'react';


export default function Home() {
  const [testData, setData] = useState(null);

  useEffect(() => {
    fetch('/data.json')
        .then(res => res.json())
        .then(data => setData(data));
}, []);


    if (!testData) return <div>Loading...</div>;
  return (
    <main>
      <FhirClientProvider>
          <SummaryDashboard documents={testData.documents} sections={testData.sections} />
      </FhirClientProvider>
    </main>
  )
}