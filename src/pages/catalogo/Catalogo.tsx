import { useEffect, useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/catalogo.css';
import { listarRopa, crearRopaMultipart, imagenDe, type RopaItem, moderarRopa } from '../../api/ropa';
import DetalleRopa from './DetalleRopa'; // 👈 corrige la ruta si tu archivo está en /components
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext'; // 👈 para saber si es ADMIN

type Filtros = {
  q: string;
  categoria: string;
  talla: string;
  genero: string;
  estilo: string;
  color: string;
  estado: string;
};

const PLACE = {
  categoria: 'Categoría',
  talla: 'Talla',
  genero: 'Género',
  estilo: 'Estilo',
  color: 'Color',
  estado: 'Estado (1–4)',
};

// Enums estáticos alineados con tu schema.prisma
const CATEGORIAS = ['POLO', 'PANTALON', 'VESTIDO', 'CASACA', 'FALDA', 'ACCESORIO', 'OTRO'];
const TALLAS = ['XS', 'S', 'M', 'L', 'XL'];
const GENEROS = ['MUJER', 'HOMBRE', 'UNISEX'];
const ESTILOS = ['CASUAL', 'FORMAL', 'DEPORTIVO', 'VINTAGE', 'ELEGANTE', 'STREET', 'OTRO'];
const COLORES = ['NEGRO','BLANCO','AZUL','ROJO','VERDE','AMARILLO','ROSA','MORADO','MARRON','GRIS','NARANJA','BEIGE','MULTICOLOR','OTRO'];
const MATERIALES = ['ALGODON', 'POLIESTER', 'LANA', 'DENIM', 'MEZCLILLA', 'SEDA', 'LINO', 'CUERO', 'OTRO'];

// Estado 1–4
const ESTADOS = [
  { label: '1 - Nuevo', value: '1' },
  { label: '2 - Casi nuevo', value: '2' },
  { label: '3 - Bueno', value: '3' },
  { label: '4 - Regular', value: '4' },
];

export default function Catalogo() {
  const { isAuthenticated, usuario } = useUser();
  const isAdmin = isAuthenticated && usuario?.role === 'ADMIN';

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prendas, setPrendas] = useState<RopaItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  // 👇 Estado para ver detalle
  const [detalle, setDetalle] = useState<RopaItem | null>(null);

  // 👇 Modo admin (solo visible si isAdmin)
  const [modoAdmin, setModoAdmin] = useState(false);

  const [f, setF] = useState<Filtros>({
    q: '',
    categoria: '',
    talla: '',
    genero: '',
    estilo: '',
    color: '',
    estado: '',
  });

  // Publicación (form modal)
  const [form, setForm] = useState({
    categoria: '',
    talla: '',
    genero: '',
    estado: '1',
    colores: [] as string[],
    estilo: '',
    material: '',
    descripcion: '',
    imagenFiles: [] as File[],
  });

  // ======== Data fetching ========
  async function cargar() {
    try {
      setCargando(true);
      setError(null);
      const data = await listarRopa({
        q: f.q || undefined,
        categoria: f.categoria || undefined,
        talla: f.talla || undefined,
        genero: f.genero || undefined,
        estilo: f.estilo || undefined,
        color: f.color || undefined,
        estado: f.estado || undefined,
        scope: (isAdmin && modoAdmin) ? 'moderacion' : undefined, // 👈 solo si es admin
      });
      setPrendas(data ?? []);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.error || 'No se pudo cargar el catálogo.');
      setPrendas([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { cargar(); /* recarga al cambiar switch */ }, [modoAdmin]);

  // Acción rápida de moderación desde la card
  const onAprobar = async (id: number) => {
    try {
      await moderarRopa(id, 'APROBAR');
      await cargar();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'No se pudo aprobar.');
    }
  };
  const onRechazar = async (id: number) => {
    const motivo = window.prompt('Motivo de rechazo (opcional):') || undefined;
    try {
      await moderarRopa(id, 'RECHAZAR', motivo);
      await cargar();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'No se pudo rechazar.');
    }
  };


  // Carga inicial
  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, []);
  // Recarga al cambiar modoAdmin
  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [modoAdmin]);

  // ======== Filtrado client-side adicional ========
  const prendasFiltradas = useMemo(() => {
    return prendas.filter((p) => {
      if (f.categoria && p.categoria !== f.categoria) return false;
      if (f.talla && p.talla !== f.talla) return false;
      if (f.genero && (p.genero || '') !== f.genero) return false;
      if (f.estilo && p.estilo !== f.estilo) return false;
      if (f.estado && String(p.estado) !== f.estado) return false;
      if (f.color && !p.colores?.includes(f.color)) return false;
      if (f.q) {
        const q = f.q.toLowerCase();
        const hay = [
          p.descripcion,
          p.categoria,
          p.estilo,
          p.material ?? '',
          p.colores?.join(' ') ?? '',
        ].join(' ').toLowerCase().includes(q);
        if (!hay) return false;
      }
      return true;
    });
  }, [prendas, f]);

  // ======== Handlers filtros ========
  const set = (k: keyof Filtros, v: string) => setF((s) => ({ ...s, [k]: v }));
  const limpiar = () => setF({ q: '', categoria: '', talla: '', genero: '', estilo: '', color: '', estado: '' });

  // ======== Crear prenda ========
  async function publicar() {
    try {
      await crearRopaMultipart({
        categoria: form.categoria,
        talla: form.talla,
        estado: form.estado,
        colores: form.colores,
        estilo: form.estilo,
        descripcion: form.descripcion,
        genero: form.genero || undefined,
        material: form.material || undefined,
        imagenFiles: form.imagenFiles,
      });
      setShowModal(false);
      // reset form
      setForm({
        categoria: '',
        talla: '',
        genero: '',
        estado: '1',
        colores: [],
        estilo: '',
        material: '',
        descripcion: '',
        imagenFiles: [],
      });
      await cargar();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'No se pudo publicar la prenda.');
    }
  }

  // ======== Detalle ========
  const abrirDetalle = (item: RopaItem) => setDetalle(item);
  const cerrarDetalle = () => setDetalle(null);

  return (
    <div className="catalogo-container">
      <div className="container py-4">
        {/* Header + acción */}
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
          <h1 className="titulo">Catálogo</h1>
          <div className="d-flex align-items-center gap-3">
            {/* 👇 el switch solo lo ve ADMIN */}
              {isAdmin && (
                <div className="form-check form-switch ms-auto mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="modoAdmin"
                    checked={modoAdmin}
                    onChange={(e) => setModoAdmin(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="modoAdmin">
                    Modo admin (revisión)
                  </label>
                </div>
              )}

            <button className="btn btn-primary btn-pill" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-lg me-1" /> Publicar prenda
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="filtros card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-4">
                <div className="searchbox">
                  <i className="bi bi-search" />
                  <input
                    value={f.q}
                    onChange={(e) => set('q', e.target.value)}
                    placeholder="Buscar por categoría, estilo, descripción o colores"
                  />
                </div>
              </div>

              <div className="col-6 col-md-2">
                <select className="select" value={f.categoria} onChange={(e) => set('categoria', e.target.value)}>
                  <option value="">{PLACE.categoria}</option>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-6 col-md-2">
                <select className="select" value={f.talla} onChange={(e) => set('talla', e.target.value)}>
                  <option value="">{PLACE.talla}</option>
                  {TALLAS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="col-6 col-md-2">
                <select className="select" value={f.genero} onChange={(e) => set('genero', e.target.value)}>
                  <option value="">{PLACE.genero}</option>
                  {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="col-6 col-md-2">
                <select className="select" value={f.estilo} onChange={(e) => set('estilo', e.target.value)}>
                  <option value="">{PLACE.estilo}</option>
                  {ESTILOS.map((e2) => <option key={e2} value={e2}>{e2}</option>)}
                </select>
              </div>

              <div className="col-6 col-md-2">
                <select className="select" value={f.color} onChange={(e) => set('color', e.target.value)}>
                  <option value="">{PLACE.color}</option>
                  {COLORES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-6 col-md-2">
                <select className="select" value={f.estado} onChange={(e) => set('estado', e.target.value)}>
                  <option value="">{PLACE.estado}</option>
                  {ESTADOS.map((e2) => <option key={e2.value} value={e2.value}>{e2.label}</option>)}
                </select>
              </div>

              <div className="col-12 col-md-2">
                <button className="btn btn-outline-secondary w-100" onClick={async () => { limpiar(); await cargar(); }}>
                  Limpiar
                </button>
              </div>
              <div className="col-12 col-md-2">
                <button className="btn btn-primary w-100" onClick={cargar}>
                  Aplicar
                </button>
              </div>
            </div>

            {/* Chips activos */}
            <div className="mt-3 d-flex flex-wrap gap-2">
              {Object.entries(f).map(([k, v]) =>
                v ? (
                  <span key={k} className="chip">
                    {k}: <strong className="ms-1">{v}</strong>
                    <button onClick={() => set(k as keyof Filtros, '')} aria-label="Quitar filtro">
                      <i className="bi bi-x-lg" />
                    </button>
                  </span>
                ) : null
              )}
              <span className="badge bg-light text-dark ms-auto">
                {cargando ? 'Cargando…' : `${prendasFiltradas.length} prendas`}
              </span>
            </div>
          </div>
        </div>

        {/* Grid */}
        {error && <div className="alert alert-danger">{error}</div>}

        {cargando ? (
          /* skeletons */
          <div className="row g-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card skeleton">
                  <div className="sk-img" />
                  <div className="sk-line" />
                  <div className="sk-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : prendasFiltradas.length === 0 ? (
          <div className="empty">
            <i className="bi bi-emoji-frown" />
            <p>No encontramos prendas con esos filtros.</p>
          </div>
        ) : (
          <div className="row g-3">
            {prendasFiltradas.map((p) => (
              <div key={p.id} className="col-6 col-md-3">
                <div
                  className="card item-card h-100 clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => abrirDetalle(p)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && abrirDetalle(p)}
                >
                  <div className="thumb">
                    <img
                      src={imagenDe(p.id, 0)}
                      alt={p.descripcion}
                      onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = 'hidden')}
                    />
                    <span className={`estado estado-${String(p.estado).toLowerCase()}`}>{p.estado}</span>

                    {/* Badges de moderación */}
                    {p.estadoPub === 'PENDIENTE' && (
                      <span className="badge bg-warning text-dark estado-overlay">En revisión</span>
                    )}
                    {p.estadoPub === 'RECHAZADA' && (
                      <span
                        className="badge bg-danger estado-overlay"
                        title={p.motivoRechazo || 'Motivo no especificado'}
                      >
                        Rechazada
                      </span>
                    )}

                    {/* Acciones rápidas (solo ADMIN en modo admin y si está pendiente) */}
                    {isAdmin && modoAdmin && p.estadoPub === 'PENDIENTE' && (
                      <div className="acciones-overlay">
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={(e) => { e.stopPropagation(); onAprobar(p.id); }}
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => { e.stopPropagation(); onRechazar(p.id); }}
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body">
                    <div className="tit">{p.categoria} · {p.talla}</div>
                    <div className="txt muted">{p.estilo}{p.genero ? ` · ${p.genero}` : ''}</div>
                    <div className="colors mt-2">
                      {p.colores?.slice(0, 3).map((c) => (
                        <span key={c} className="color-pill">{c}</span>
                      ))}
                      {p.colores?.length > 3 && <span className="color-pill more">+{p.colores.length - 3}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Publicar */}
      {showModal && (
        <div className="rc-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="rc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rc-modal-header">
              <h5>Publicar prenda</h5>
              <button className="btn-close" onClick={() => setShowModal(false)} />
            </div>
            <div className="rc-modal-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Categoría*</label>
                  <select className="select w-100"
                          value={form.categoria}
                          onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                    <option value="">Selecciona</option>
                    {CATEGORIAS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label">Talla*</label>
                  <select className="select w-100"
                          value={form.talla}
                          onChange={(e) => setForm({ ...form, talla: e.target.value })}>
                    <option value="">Selecciona</option>
                    {TALLAS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label">Género</label>
                  <select className="select w-100"
                          value={form.genero}
                          onChange={(e) => setForm({ ...form, genero: e.target.value })}>
                    <option value="">—</option>
                    {GENEROS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Estado (1–4)*</label>
                  <select className="select w-100"
                          value={form.estado}
                          onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                    {ESTADOS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Colores*</label>
                  <div className="chips">
                    {COLORES.map((c) => {
                      const on = form.colores.includes(c);
                      return (
                        <button
                          type="button"
                          key={c}
                          className={`chip-btn ${on ? 'on' : ''}`}
                          onClick={() => {
                            setForm((s) => ({
                              ...s,
                              colores: on ? s.colores.filter(x => x !== c) : [...s.colores, c],
                            }));
                          }}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Estilo*</label>
                  <select className="select w-100"
                          value={form.estilo}
                          onChange={(e) => setForm({ ...form, estilo: e.target.value })}>
                    <option value="">Selecciona</option>
                    {ESTILOS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {/* MATERIAL */}
                <div className="col-12 col-md-6">
                  <label className="form-label">Material</label>
                  <select
                    className="select w-100"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                  >
                    <option value="">—</option>
                    {MATERIALES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Imágenes (0–3)</label>
                  <input
                    type="file" multiple accept="image/*"
                    className="form-control"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setForm({ ...form, imagenFiles: files.slice(0, 3) });
                    }}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción*</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Detalles relevantes: uso, cuidados, medidas, etc."
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="rc-modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                onClick={publicar}
                disabled={!form.categoria || !form.talla || !form.estilo || !form.descripcion || form.colores.length === 0}
              >
                Publicar prenda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {detalle && (
        <DetalleRopa
          ropa={detalle}
          show={!!detalle}
          onHide={cerrarDetalle}
          // 👇 pasa permisos y handlers para moderar desde el modal
          isAdmin={isAdmin && modoAdmin}
          onAprobar={() => onAprobar(detalle.id)}
          onRechazar={() => onRechazar(detalle.id)}
        />
      )}


      <Footer />
    </div>
  );
}
