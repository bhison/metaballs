const Time = ({ timeLeftPercent }: { timeLeftPercent: number }) => {
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          left: "10px",
          bottom: 0,
          height: `${timeLeftPercent * 100}%`,
          backgroundColor: "green",
          width: "20px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "10px",
          top: `${timeLeftPercent * 100}%`,
          height: `${(1 - timeLeftPercent) * 100}%`,
          backgroundColor: "red",
          width: "20px",
        }}
      />
    </div>
  );
};

export default Time;
