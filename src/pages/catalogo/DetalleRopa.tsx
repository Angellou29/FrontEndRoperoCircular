// src/pages/catalogo/DetalleRopa.tsx
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { imagenDe, type RopaItem } from '../../api/ropa';

interface DetalleRopaProps {
  ropa: RopaItem | null;
  show: boolean;
  onHide: () => void;

  // ✅ NUEVO: props opcionales para moderar
  isAdmin?: boolean;
  onAprobar?: () => void | Promise<void>;
  onRechazar?: () => void | Promise<void>;
}

const ESTADO_TXT: Record<number, string> = {
  1: 'Nuevo',
  2: 'Casi nuevo',
  3: 'Bueno',
  4: 'Regular',
};

function estadoTexto(estado: unknown): string {
  const n = Number(estado);
  return ESTADO_TXT[n] ?? String(estado ?? '');
}

function DetalleRopa({ ropa, show, onHide, isAdmin, onAprobar, onRechazar }: DetalleRopaProps) {
  const [mainIndex, setMainIndex] = useState<number>(0);
  const [zoom, setZoom] = useState<boolean>(false);

  if (!ropa) return null;

  // hasta 3 imágenes servidas por backend
  const imgUrls = [0, 1, 2].map((i) => imagenDe(ropa.id, i));

  const onErrImg = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).src =
      'https://via.placeholder.com/600x600?text=Imagen+no+disponible';
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      scrollable
      contentClassName="rcd-content"
      id="detalle-ropa-modal"
    >
      <Modal.Header closeButton className="rcd-header">
        <Modal.Title className="rcd-title">
          {ropa.categoria} · {ropa.talla}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="rcd-body">
        <div className="row g-4">
          {/* Galería */}
          <div className="col-md-6">
            <div className="rcd-mainimg-wrap">
              <img
                key={mainIndex}
                src={imgUrls[mainIndex]}
                alt={`${ropa.categoria}-${mainIndex}`}
                className="rcd-mainimg"
                onError={onErrImg}
                onClick={() => setZoom(true)}
              />
              <span className="rcd-estado">{estadoTexto(ropa.estado)}</span>
            </div>

            <div className="rcd-thumbs">
              {imgUrls.map((u, i) => (
                <button
                  key={i}
                  type="button"
                  className={`rcd-thumb ${i === mainIndex ? 'on' : ''}`}
                  onClick={() => setMainIndex(i)}
                >
                  <img src={u} alt={`thumb-${i}`} onError={onErrImg} />
                </button>
              ))}
            </div>

            {/* Zoom */}
            <Modal show={zoom} onHide={() => setZoom(false)} centered size="lg">
              <Modal.Body className="text-center p-0">
                <img
                  src={imgUrls[mainIndex]}
                  alt="zoom"
                  className="img-fluid"
                  style={{ maxHeight: '80vh', objectFit: 'contain' }}
                  onError={onErrImg}
                />
              </Modal.Body>
            </Modal>
          </div>

          {/* Detalles */}
          <div className="col-md-6">
            <h6 className="rcd-subtitle">Descripción</h6>
            <p className="rcd-text">{ropa.descripcion}</p>

            {ropa.estadoPub === 'RECHAZADA' && (
              <div className="alert alert-danger py-2">
                <strong>Motivo de rechazo:</strong>{' '}
                {ropa.motivoRechazo || 'No especificado.'}
              </div>
            )}
            {ropa.estadoPub === 'PENDIENTE' && (
              <div className="alert alert-warning py-2">
                Esta prenda está en revisión por el equipo.
              </div>
            )}

            <div className="rcd-grid">
              <div>
                <span className="rcd-label">Categoría</span>
                <span className="rcd-badge">{ropa.categoria}</span>
              </div>
              <div>
                <span className="rcd-label">Estado</span>
                <span className="rcd-badge success">{estadoTexto(ropa.estado)}</span>
              </div>
              <div>
                <span className="rcd-label">Talla</span>
                <span className="rcd-badge muted">{ropa.talla}</span>
              </div>
              <div>
                <span className="rcd-label">Estilo</span>
                <span className="rcd-badge primary">{ropa.estilo}</span>
              </div>
              {ropa.genero && (
                <div>
                  <span className="rcd-label">Género</span>
                  <span className="rcd-badge info">{ropa.genero}</span>
                </div>
              )}
              {ropa.material && (
                <div>
                  <span className="rcd-label">Material</span>
                  <span className="rcd-badge">{ropa.material}</span>
                </div>
              )}
            </div>

            <div className="rcd-colors">
              <span className="rcd-label">Colores</span>
              <div className="rcd-colorlist">
                {(ropa.colores ?? []).map((c) => (
                  <span key={c} className="rcd-colorpill">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="rcd-footer">
        {/* ✅ Botones de moderación solo para admin y cuando está PENDIENTE */}
        {isAdmin && ropa?.estadoPub === 'PENDIENTE' && (
          <>
            <button type="button" className="btn btn-success" onClick={onAprobar}>
              Aprobar
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={onRechazar}>
              Rechazar
            </button>
            <div className="flex-spacer" />
          </>
        )}
        <button type="button" className="btn btn-secondary" onClick={onHide}>
          Cerrar
        </button>
      </Modal.Footer>

      {/* estilos locales */}
      <style>{`
        .rcd-content { border-radius: 14px; }
        .rcd-header { border-bottom: 0; }
        .rcd-title { font-weight: 700; }
        .rcd-body { padding-top: 0; }

        .rcd-mainimg-wrap { position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,.08); }
        .rcd-mainimg { width:100%; height: 420px; object-fit: cover; cursor: zoom-in; display:block; background:#f7f7f7; }
        .rcd-estado { position:absolute; left:12px; top:12px; background:#111; color:#fff; font-size:.85rem; padding:.25rem .5rem; border-radius:999px; }
        .rcd-thumbs { display:flex; gap:.5rem; margin-top:.75rem; }
        .rcd-thumb { width:82px; height:82px; border-radius:10px; overflow:hidden; padding:0; border:2px solid transparent; background:#fff; box-shadow: 0 4px 12px rgba(0,0,0,.06); }
        .rcd-thumb.on { border-color:#6b4eff; }
        .rcd-thumb img { width:100%; height:100%; object-fit:cover; display:block; }

        .rcd-subtitle { font-weight:700; margin-bottom:.25rem; }
        .rcd-text { color:#444; }
        .rcd-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; margin:1rem 0; }
        .rcd-label { display:block; font-size:.8rem; color:#6b7280; margin-bottom:.15rem; }
        .rcd-badge { display:inline-block; padding:.25rem .5rem; border-radius:999px; background:#f3f4f6; }
        .rcd-badge.primary { background:#eaf1ff; color:#1d4ed8; }
        .rcd-badge.success { background:#e8f7ee; color:#0f766e; }
        .rcd-badge.info { background:#e7f5ff; color:#0369a1; }
        .rcd-badge.muted { background:#eee; color:#374151; }

        .rcd-colors { margin-top:.5rem; }
        .rcd-colorlist { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.25rem; }
        .rcd-colorpill { background:#f1f5f9; border:1px solid #e5e7eb; padding:.25rem .5rem; border-radius:999px; font-size:.85rem; }

        .rcd-footer { border-top:0; }
        .flex-spacer { flex: 1 1 auto; }
      `}</style>
    </Modal>
  );
}

export default DetalleRopa;
