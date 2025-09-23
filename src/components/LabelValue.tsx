export default function LabelValue({ label, value }: { label: string; value: string; }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
