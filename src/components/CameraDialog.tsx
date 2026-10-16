import { useEffect, useRef, useState } from 'react';
import { type Lang } from '../i18n';
import { P } from '../lib/pdf-i18n';
import { Icon } from './Icons';

type Facing = 'environment' | 'user';

/** Opens the laptop webcam or the phone camera. If that is not possible, falls back to the device camera app. */
export default function CameraDialog({ lang, open, onClose, onShot }: { lang: Lang; open: boolean; onClose: () => void; onShot: (f: File) => void }) {
  const p = P[lang];
  const dlg = useRef<HTMLDialogElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<Facing>('environment');
  const [err, setErr] = useState(false);
  const [shots, setShots] = useState(0);

  const stop = () => { stream.current?.getTracks().forEach((x) => x.stop()); stream.current = null; };
  async function start(f: Facing) {
    stop(); setErr(false);
    if (!navigator.mediaDevices?.getUserMedia) { setErr(true); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: f }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      stream.current = s;
      if (vid.current) { vid.current.srcObject = s; await vid.current.play(); }
    } catch { setErr(true); }
  }
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); setShots(0); start(facing); }
    if (!open) { if (d.open) d.close(); stop(); }
  }, [open]);
  useEffect(() => { if (open) start(facing); }, [facing]);
  useEffect(() => stop, []);

  function shoot() {
    const v = vid.current;
    if (!v || !v.videoWidth) return;
    const cv = document.createElement('canvas');
    cv.width = v.videoWidth; cv.height = v.videoHeight;
    cv.getContext('2d')!.drawImage(v, 0, 0);
    cv.toBlob((b) => {
      if (!b) return;
      onShot(new File([b], `scan-${Date.now()}.jpg`, { type: 'image/jpeg' }));
      setShots((n) => n + 1);
    }, 'image/jpeg', 0.92);
  }

  return (
    <dialog ref={dlg} className="sheet cam" aria-labelledby="cam-t" onClose={onClose}>
      <h2 id="cam-t" className="h2">{p.takePhoto}</h2>
      {err ? (
        <>
          <p className="err" role="alert">{p.camErr}</p>
          <label className="btn">
            <input type="file" accept="image/*" capture="environment" className="vh"
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) { onShot(f); setShots((n) => n + 1); } }} />
            <Icon name="camera" />{p.takePhoto}
          </label>
        </>
      ) : <video ref={vid} className="camvid" playsInline muted autoPlay />}
      <div className="actions">
        {!err && <button type="button" className="btn" onClick={shoot}><Icon name="camera" />{p.capture}</button>}
        {!err && <button type="button" className="btn ghost" onClick={() => setFacing(facing === 'environment' ? 'user' : 'environment')}><Icon name="reset" />{p.switchCam}</button>}
        <button type="button" className="btn ghost" onClick={onClose}>{p.doneBtn}</button>
      </div>
      {shots > 0 && <p className="hint" aria-live="polite">{p.shotsN.replace('{n}', String(shots))}</p>}
    </dialog>
  );
}
