"use client";
import { useState, useRef } from 'react';
import SummaryDashboard from "@/components/pages/SummaryDashboard";
import FhirClientProvider from "@/components/FhirClientProvider";
import WebSocketComponent from '@/components/WebSocket';
import LoadingDashboard from '@/components/pages/LoadingDashboard';

export default function DistilleryPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const webSocketRef = useRef(null);

  const handleStatusChange = (status) => {
    if (status === 'error') {
      setError('Unable to connect to server');
      setIsLoading(false);
    } else if (status === 'closed') {
      setError('Connection closed');
      setIsLoading(false);
    } else if (status === 'open') {
      setError(null);
      // Send request as soon as connection is established
      webSocketRef.current?.sendMessage({
        rows: [
          {
            category: 'test',
            content_type: 'text/plain',
            data: 'Test report content',
            date: new Date().toISOString()
          },
          {
            category: 'test',
            content_type: 'text/plain',
            data: 'Test report content',
            date: new Date().toISOString()
          },
          {
            category: 'test',
            content_type: 'text/plain',
            data: 'Test report content',
            date: new Date().toISOString()
          }
        ],
        sections: ["ALL"]
      });
    }
  };

  const handleWebSocketMessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      
      if (message.progress) {
        setProgress(message.progress);
      } else {
        setData({
          documents: message.documents || [],
          sections: message.sections || []
        });
        setIsLoading(false);
        setProgress(0); // Reset progress when done
      }
    } catch (error) {
      setError("Error processing server response");
      setIsLoading(false);
    }
  };

  return (
    <FhirClientProvider>
      <div>
        <WebSocketComponent
          ref={webSocketRef}
          url="http://localhost:3000/ws/distill"
          token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYWRjZDgzMS03ZmU3LTRjZmYtOWJlMS01MWYxNmE1OGE2OGMiLCJpYXQiOjE3MjQwNzk4MDl9.67IRCchygZiTuKmq9dGUsyEoooa9GP78MkIF8JikwL8"
          onMessage={handleWebSocketMessage}
          onStatusChange={handleStatusChange}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading ? (
          <LoadingDashboard progress={progress} />
        ) : data && (
          <SummaryDashboard 
            documents={data.documents} 
            sections={data.sections}
          />
        )}
      </div>
    </FhirClientProvider>
  );
}