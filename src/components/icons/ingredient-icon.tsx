import { getIngredientIconMarkup, type IngredientIconId } from '../../assets/ingredient-icons';
import { SvgIcon } from './svg-icon';

type IngredientIconProps = {
  id: IngredientIconId;
  className?: string;
  label?: string;
};

/** SVG files already carry `.ingredient-icon` / modifier classes. */
export function IngredientIcon({ id, className, label }: IngredientIconProps) {
  return <SvgIcon className={className} markup={getIngredientIconMarkup(id)} label={label} />;
}
