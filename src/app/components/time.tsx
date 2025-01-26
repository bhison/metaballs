import useTimeStore from "../stores/timeStore";

const Time = () => {
  const { timeLeftPercentage } = useTimeStore();

  return (
    <div className="absolute left-5 bottom-10 top-10 h-[80vh] mt-[10vh] flex flex-col gap-0 opacity-70 ">
      <div
        className={`bg-red-400 rounded-t-lg w-5 ${
          timeLeftPercentage < 0.01 ? "rounded-b-lg" : ""
        }`}
        style={{
          height: `${(1 - timeLeftPercentage) * 100}%`,
          top: `${timeLeftPercentage * 100}%`,
        }}
      />
      <div
        className={`bg-green-500 w-5 rounded-b-lg transition-transform duration-1000`}
        style={{
          height: `${timeLeftPercentage * 100}%`,
        }}
      />
    </div>
  );
};

export default Time;
