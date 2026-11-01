import { getUiIconMarkup, type UiIconId } from '../../assets/ui-icons';
import { SvgIcon } from './svg-icon';

type UiIconProps = {
  id: UiIconId;
  className?: string;
  label?: string;
};

export function UiIcon({ id, className, label }: UiIconProps) {
  const classes =
    className === undefined ? `ui-icon ui-icon--${id}` : `ui-icon ui-icon--${id} ${className}`;

  return <SvgIcon className={classes} markup={getUiIconMarkup(id)} label={label} />;
}
