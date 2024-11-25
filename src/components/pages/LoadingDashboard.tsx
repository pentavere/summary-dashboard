import { Card } from '@/components/ui/card';
import PatientHeader from '@/components/PatientHeader';

const LoadingDashboard = ({ progress = 0 }) => {
  const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_5s_linear_infinite] before:bg-[linear-gradient(-60deg,transparent_0%,transparent_15%,rgba(255,255,255,0.3)_25%,rgba(255,255,255,0.8)_35%,rgba(255,255,255,0.3)_45%,transparent_55%,transparent_70%,rgba(255,255,255,0.3)_80%,rgba(255,255,255,0.8)_90%,rgba(255,255,255,0.3)_95%,transparent_100%)] before:top-[-50%] before:left-[-50%] before:w-[200%] before:h-[200%]";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-[1440px] mx-auto flex flex-col h-full">
          <PatientHeader />
          
          {/* Progress Bar Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
            <div className="text-lg font-medium text-gray-600 mb-4">Processing Reports</div>
            <div className="w-96 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-800 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex gap-6 flex-1">
            {/* Left side - Summary Section */}
            <div className="w-[640px]">
              <Card className={`h-[calc(100vh-200px)] bg-gray-100 ${shimmerClass}`}>
                <div className="h-full"></div>
              </Card>
            </div>

            {/* Right side - Documents Tab */}
            <div className="w-[900px]">
              <Card className="h-[calc(100vh-200px)] flex flex-col rounded-lg overflow-hidden">
                <div className={`flex-1 bg-gray-100 ${shimmerClass}`}>
                  <div className="h-full"></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDashboard;