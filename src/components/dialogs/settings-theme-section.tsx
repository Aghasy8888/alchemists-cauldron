import { playUiClick } from '../../audio';
import { THEME, themeLabel, type Theme } from '../../data/theme';
import { usePlayerSettings } from '../../hooks/use-player-settings';
import { updateSettings } from '../../storage/settings';

const { classic, ember } = THEME;

const THEME_ORDER: readonly Theme[] = [classic, ember];

export function SettingsThemeSection() {
  const { theme: current } = usePlayerSettings();

  return (
    <section className="settings-dialog__theme" aria-labelledby="settings-theme-title">
      <h3 id="settings-theme-title" className="settings-dialog__section-title">
        Theme
      </h3>
      <div className="settings-dialog__list" role="group" aria-label="Theme">
        {THEME_ORDER.map((theme) => {
          const selected = theme === current;
          return (
            <button
              key={theme}
              type="button"
              className={
                selected
                  ? 'settings-dialog__option settings-dialog__option--selected'
                  : 'settings-dialog__option'
              }
              aria-pressed={selected}
              onClick={() => {
                if (theme === current) {
                  return;
                }
                updateSettings({ theme });
                playUiClick();
              }}
            >
              {themeLabel(theme)}
            </button>
          );
        })}
      </div>
    </section>
  );
}
