import { InlineMath } from 'react-katex';

export default function CoefficientSlider({
  id,
  label,
  value,
  color,
  onChange,
}) {
  return (
    <label
      className="time-vector-slider"
      htmlFor={id}
      style={{ '--slider-color': color }}
    >
      <span className="time-vector-slider__header">
        <span>
          <InlineMath math={label} />
        </span>

        <output htmlFor={id}>
          {value.toFixed(1)}
        </output>
      </span>

      <input
        id={id}
        type="range"
        min="-3"
        max="3"
        step="0.1"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
      />
    </label>
  );
}
