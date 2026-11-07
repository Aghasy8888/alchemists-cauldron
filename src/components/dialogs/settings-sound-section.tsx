import { applySoundSettings } from '../../audio';
import { usePlayerSettings } from '../../hooks/use-player-settings';

function volumePercentLabel(volume: number): string {
  return `${Math.round(volume * 100)}%`;
}

export function SettingsSoundSection() {
  const { muted, volume, musicVolume } = usePlayerSettings();

  return (
    <section className="settings-dialog__sound" aria-labelledby="settings-sound-title">
      <h3 id="settings-sound-title" className="settings-dialog__section-title">
        Sound
      </h3>
      <button
        type="button"
        className={
          muted
            ? 'settings-dialog__option settings-dialog__option--selected'
            : 'settings-dialog__option'
        }
        aria-pressed={muted}
        onClick={() => {
          applySoundSettings({ muted: !muted });
        }}
      >
        {muted ? 'Muted' : 'Sound on'}
      </button>
      <label className="settings-dialog__volume" htmlFor="settings-volume">
        <span className="settings-dialog__volume-label">Volume {volumePercentLabel(volume)}</span>
        <input
          id="settings-volume"
          className="settings-dialog__volume-range"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          disabled={muted}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(volume * 100)}
          aria-valuetext={volumePercentLabel(volume)}
          onChange={(event) => {
            applySoundSettings({ volume: Number(event.target.value) });
          }}
        />
      </label>
      <label className="settings-dialog__volume" htmlFor="settings-music-volume">
        <span className="settings-dialog__volume-label">
          Music {volumePercentLabel(musicVolume)}
        </span>
        <input
          id="settings-music-volume"
          className="settings-dialog__volume-range"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={musicVolume}
          disabled={muted}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(musicVolume * 100)}
          aria-valuetext={volumePercentLabel(musicVolume)}
          onChange={(event) => {
            applySoundSettings({ musicVolume: Number(event.target.value) });
          }}
        />
      </label>
    </section>
  );
}
