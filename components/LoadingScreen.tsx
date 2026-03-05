export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <span className="text-4xl font-bold text-white">D</span>
          </div>
          {/* Spinning Ring */}
          <div className="absolute inset-0 border-4 border-blue-300 border-t-blue-600 rounded-2xl animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
        <p className="text-sm text-gray-600">Mohon tunggu sebentar</p>
        
        {/* Loading Dots */}
        <div className="flex gap-2 justify-center mt-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
