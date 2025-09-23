export default function LabelValue({ label, value, className }: { label: string; value: string; className?: string; }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className={`value ${className || ''}`}>{value}</div>
    </div>
  );
}
