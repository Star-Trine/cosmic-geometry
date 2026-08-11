export default function NatalChart() {
  const size = 500;
  const center = size / 2;

  const outerRadius = 220;
  const innerRadius = 170;

  const ascAngle = 180;
  const ascRadian = (ascAngle * Math.PI) / 180;

  const ascX = center + innerRadius * Math.cos(ascRadian);
  const ascY = center + innerRadius * Math.sin(ascRadian);


  const divisions = Array.from({ length: 12 }, (_, index) => {
    const angle = index * 30 - 90;
    const radian = (angle * Math.PI) / 180;

    return {
      x1: center + innerRadius * Math.cos(radian),
      y1: center + innerRadius * Math.sin(radian),
      x2: center + outerRadius * Math.cos(radian),
      y2: center + outerRadius * Math.sin(radian),
    };
  });
  
  return (
    <section>
      <h2>Natal Chart</h2>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        style={{ maxWidth: '600px' }}
      >
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="currentColor"
        />

        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="currentColor"
        />        
        
        <circle
          cx={ascX}
          cy={ascY}
          r={6}
          fill="red"
        />

        {divisions.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
          />
        ))}
      </svg>
    </section>
  );
}