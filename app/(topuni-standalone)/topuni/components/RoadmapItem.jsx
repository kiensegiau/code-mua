"use client";

const colorMap = {
  blue: {
    container: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-500 hover:shadow-blue-100",
    title: "text-blue-700",
    icon: "text-blue-500",
    bullet: "bg-blue-500"
  },
  green: {
    container: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 hover:shadow-green-100",
    title: "text-green-700",
    icon: "text-green-500",
    bullet: "bg-green-500"
  },
  red: {
    container: "bg-gradient-to-br from-red-50 to-rose-50 border-red-500 hover:shadow-red-100",
    title: "text-red-700",
    icon: "text-red-500",
    bullet: "bg-red-500"
  }
};

const RoadmapItem = ({ title, description, color = "blue" }) => {
  const colorClass = colorMap[color] || colorMap.blue;
  
  // Tách description thành nhiều dòng nếu có xuống dòng
  const descLines = description.split('\n');
  
  return (
    <div className={`rounded-xl p-8 border-l-4 shadow-lg ${colorClass.container} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
      <div className="flex items-start gap-4 mb-6">
        {color === 'blue' && (
          <div className="text-blue-500 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {color === 'green' && (
          <div className="text-green-500 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
          </div>
        )}
        {color === 'red' && (
          <div className="text-red-500 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <h3 className={`text-2xl font-bold ${colorClass.title}`}>{title}</h3>
      </div>
      <div className="space-y-4 pl-12">
        {descLines.map((line, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`${colorClass.bullet} w-2 h-2 rounded-full mt-2 flex-shrink-0`}></div>
            <p className="text-gray-700 font-medium">{line}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapItem; 