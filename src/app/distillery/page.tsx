"use client";
import { useState, useEffect, useRef, useContext } from 'react';
import SummaryDashboard from "@/components/pages/SummaryDashboard";
import FhirClientProvider from "@/components/FhirClientProvider";
import { FhirClientContext } from "@/FhirClientContext";
import WebSocketComponent from '@/components/WebSocket';

export default function DistilleryPage() {
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(-1);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);
  const [selectedReports, setSelectedReports] = useState(['testReport1']); // Example report ID
  const [reports, setReports] = useState([
    // Example report for testing
    {
      id: 'testReport1',
      category: 'test',
      url: 'test-binary-id',
      code: 'TEST',
      date_time: new Date().toISOString()
    }
  ]);
  const [wsStatus, setWsStatus] = useState('connecting');
  const webSocketRef = useRef(null);

  // Log WebSocket readiness
  useEffect(() => {
    console.log('WebSocket Status:', wsStatus);
    console.log('WebSocket Ref:', webSocketRef.current);
  }, [wsStatus]);

  const handleStatusChange = (status) => {
    console.log('WebSocket status changed to:', status);
    setWsStatus(status);
    if (status === 'error') {
      setError('WebSocket connection error');
    } else if (status === 'closed') {
      setError('WebSocket connection closed');
    } else if (status === 'open') {
      setError(null);
      // Send a test message when connection is established
      webSocketRef.current?.sendMessage({
        rows: 'dummy_row',
          sections: ["ALL"]
      });
    }
  };

  const handleWebSocketMessage = (event) => {
    console.log('Received WebSocket message:', event.data);
    try {
      const message = JSON.parse(event.data);
      
      if (message.progress) {
        console.log("Progress:", message.progress);
        setFetching(message.progress);
      } else {
        // Update the dashboard with the received data
        setData({
          documents: message.documents || [],
          sections: message.sections || []
        });
        setRunning(false);
        setFetching(-1);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
      setError("Error processing server response");
    }
  };

  const handleReportSelect = async () => {
    if (wsStatus !== 'open') {
      setError('WebSocket is not connected');
      return;
    }

    console.log('Starting report processing...');
    setFetching(0);
    setError(null);
    setRunning(true);

    try {
      // For testing, send a simple message
      const testData = {
        rows: [
          {
            category: 'test',
            content_type: 'text/plain',
            data: 'Test report content',
            date: new Date().toISOString()
          }
        ],
        sections: ["ALL"]
      };

      console.log('Sending data to WebSocket:', testData);
      webSocketRef.current?.sendMessage(testData);

    } catch (error) {
      console.error('Error in handleReportSelect:', error);
      setError("Error processing reports");
      setRunning(false);
    }
  };

  // // Test WebSocket connection periodically
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (wsStatus === 'open') {
  //       console.log('Sending ping...');
  //       webSocketRef.current?.sendMessage({
  //         rows: 'dummy_row',
  //         sections: ["ALL"]
  //       });
  //     }
  //   }, 30000); // Every 30 seconds

  //   return () => clearInterval(interval);
  // }, [wsStatus]);

  return (
    <FhirClientProvider>
      <div className="relative p-4">
        <WebSocketComponent
          ref={webSocketRef}
          url="http://localhost:3000/ws/distill"
          token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYWRjZDgzMS03ZmU3LTRjZmYtOWJlMS01MWYxNmE1OGE2OGMiLCJpYXQiOjE3MjQwNzk4MDl9.67IRCchygZiTuKmq9dGUsyEoooa9GP78MkIF8JikwL8"
          onMessage={handleWebSocketMessage}
          onStatusChange={handleStatusChange}
        />

        {/* Debug Information */}
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Debug Info:</h2>
          <p>WebSocket Status: {wsStatus}</p>
          <p>Running: {running ? 'Yes' : 'No'}</p>
          <p>Fetching: {fetching}</p>
        </div>

        {/* Test Button */}
        <button
          onClick={handleReportSelect}
          disabled={wsStatus !== 'open'}
          className={`mb-4 px-4 py-2 rounded ${
            wsStatus === 'open' 
              ? 'bg-blue-500 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Process Reports
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {wsStatus !== 'open' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">
              WebSocket Status: {wsStatus}
              {wsStatus === 'connecting' && '... attempting to connect'}
            </span>
          </div>
        )}

        {fetching >= 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${fetching}%` }}
              ></div>
            </div>
          </div>
        )}

        {!data && running && (
          <div className="flex items-center justify-center p-4">
            <div className="text-gray-600">Processing...</div>
          </div>
        )}

        {data && (
          <SummaryDashboard 
            documents={data.documents} 
            sections={data.sections}
          />
        )}
      </div>
    </FhirClientProvider>
  );
}