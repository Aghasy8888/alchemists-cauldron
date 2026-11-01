import type { ParamIconId } from '../../assets/param-icons';
import type { IRecipeRange } from '../../data/types';
import { expandRecipeRange, isInRange } from '../../logic/brew-check';
import { BAR_SCALE, BAR_SCALE_TICKS, toPercent } from '../../utils/bar-scale';
import { ParamIcon } from '../icons';
import { formatBarValue, type BarKey } from './bar-config';

type ParamBarProps = {
  barKey: BarKey;
  param: ParamIconId;
  label: string;
  value: number;
  range: IRecipeRange | null;
  tolerance: number;
};

export function ParamBar({ barKey, param, label, value, range, tolerance }: ParamBarProps) {
  const inZone = range !== null && isInRange(value, range);
  const expanded = range === null ? null : expandRecipeRange(range, tolerance);
  const inTolerance = !inZone && expanded !== null && isInRange(value, expanded);
  const displayValue = formatBarValue(value);

  const rowClassName = [
    'param-bar',
    inZone ? 'param-bar--in-zone' : '',
    inTolerance ? 'param-bar--in-tolerance' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const zeroPct = toPercent(0);
  const valuePct = toPercent(value);
  const fillStyle =
    value >= 0
      ? { left: `${zeroPct}%`, width: `${valuePct - zeroPct}%` }
      : { left: `${valuePct}%`, width: `${zeroPct - valuePct}%` };

  const toleranceStyle =
    expanded === null
      ? undefined
      : {
          left: `${toPercent(expanded.min)}%`,
          width: `${Math.max(0, toPercent(expanded.max) - toPercent(expanded.min))}%`,
        };

  const zoneStyle =
    range === null
      ? undefined
      : {
          left: `${toPercent(range.min)}%`,
          width: `${Math.max(0, toPercent(range.max) - toPercent(range.min))}%`,
        };

  return (
    <div className={rowClassName} data-bar={barKey}>
      <div className="param-bar__heading">
        <span className={`param-bar__label param-label param-label--${param}`}>{label}</span>
        <span className={`param-bar__value param-label param-label--${param}`}>{displayValue}</span>
      </div>

      <div className="param-bar__body">
        <ParamIcon id={param} />
        <div className="param-bar__meter">
          <div
            className={`param-bar__track param-bar__track--${param}`}
            role="meter"
            aria-label={label}
            aria-valuemin={BAR_SCALE.min}
            aria-valuemax={BAR_SCALE.max}
            aria-valuenow={Number(displayValue)}
          >
            <span className="param-bar__zero" style={{ left: `${zeroPct}%` }} aria-hidden="true" />
            <span
              className="param-bar__tolerance"
              hidden={expanded === null}
              style={toleranceStyle}
              aria-hidden="true"
            />
            <span
              className="param-bar__zone"
              hidden={range === null}
              style={zoneStyle}
              aria-hidden="true"
            />
            <span className="param-bar__fill" style={fillStyle} aria-hidden="true" />
            <span
              className="param-bar__marker"
              style={{ left: `${valuePct}%` }}
              aria-hidden="true"
            />
          </div>

          <div className="param-bar__scale" aria-hidden="true">
            {BAR_SCALE_TICKS.map((tick) => {
              const tickClassName =
                tick === 0 ? 'param-bar__tick param-bar__tick--zero' : 'param-bar__tick';
              return (
                <span key={tick} className={tickClassName} style={{ left: `${toPercent(tick)}%` }}>
                  <span className="param-bar__tick-label">{tick}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
