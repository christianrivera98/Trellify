import React, { useEffect, useRef, useState } from "react";

interface SlideProps {
  videoUrl: string;
  title: string;

}

const slides: SlideProps[] = [
  {
    videoUrl:
      "https://res.cloudinary.com/ma-cloud/video/upload/v1729820018/findy/personaliza_tableros_m3m0m0.mp4",
    title: "Personaliza tú tablero con distintos fondos",
  },
  {
    videoUrl:
      "https://res.cloudinary.com/ma-cloud/video/upload/v1729819659/findy/crea_tasks_tdzarg.mp4",
    title: "Crea tus tareas y organiza tu día de manera efectiva",
  },
  {
    videoUrl:
      "https://res.cloudinary.com/ma-cloud/video/upload/v1729819660/findy/gest_tasks_cl6yw3.mp4",
    title: "Organízalas según tus necesidades",
  },
];

const VideoSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]); 

  // useEffect para que los videos se reproduzcan automaticamente al terminar
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.play();
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleVideoEnd = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-auto max-w-6xl max-h-full  mx-auto ">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div>
                <video
                  ref={(el) => (videoRefs.current[index] = el)} 
                  src={slide.videoUrl}
                  className="w-full h-auto object-cover"
                  onEnded={handleVideoEnd} 
                  autoPlay
                  muted
                />
              </div>

              <div className="p-4 bg-black h-24 bg-opacity-50 font-medium text-white italic text-center flex justify-center items-center">
                <h3 className="text-2xl font-bold">{slide.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
      >
        &#8249;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
      >
        &#8250;
      </button>

      {/* Indicadores */}
      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoSlider;
