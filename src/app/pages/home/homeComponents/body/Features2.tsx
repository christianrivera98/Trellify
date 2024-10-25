import VideoSlider from "./components/VideoSlider";

export const Features2 = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="relative isolate overflow-hidden  sm:py-20">
      <img
        alt=""
        src="https://res.cloudinary.com/ma-cloud/image/upload/v1729813629/findy/fetures_r70phu.jpg"
        className="absolute inset-0 -z-50 h-auto w-full object-cover object-right md:object-center"
      />

      <div className="w-full lg:mx-0 left-20">
        <h2 className="ml-96 mb-20  tracking-tight  text-8xlxl md:text-4xl lg:text-5xl leading-tight font-medium text-white italic">
          Caracteristicas principales:
        </h2>
      </div>
      <div className=" h-auto w-full mt-10 ">
        <VideoSlider />
      </div>
    </div>
  );
};
