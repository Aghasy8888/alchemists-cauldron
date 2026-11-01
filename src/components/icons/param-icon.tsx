import { getParamIconMarkup, type ParamIconId } from '../../assets/param-icons';
import { SvgIcon } from './svg-icon';

type ParamIconProps = {
  id: ParamIconId;
  className?: string;
  label?: string;
};

export function ParamIcon({ id, className, label }: ParamIconProps) {
  const classes =
    className === undefined
      ? `param-icon param-icon--${id}`
      : `param-icon param-icon--${id} ${className}`;

  return <SvgIcon className={classes} markup={getParamIconMarkup(id)} label={label} />;
}
