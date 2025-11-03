import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
interface ScoreDonutChartProps {
  score: number;
  size?: number;
}
const getScoreColor = (score: number) => {
  if (score >= 90) return '#10b981'; // Green
  if (score >= 60) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
};
export function ScoreDonutChart({ score, size = 40 }: ScoreDonutChartProps) {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  const color = getScoreColor(score);
  return (
    <div style={{ width: size, height: size }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={450}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}