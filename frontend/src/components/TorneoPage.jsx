import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

function agruparPorGrupo(equipos) {
    const grupos = {};
    for (const equipo of equipos) {
        const clave = equipo.grupo || 'Sin grupo';
        if (!grupos[clave]) grupos[clave] = [];
        grupos[clave].push(equipo);
    }
    return Object.keys(grupos)
        .sort()
        .map((nombre) => ({ nombre, equipos: grupos[nombre] }));
}

function TorneoPage({ torneoId, onBack }) {
    const [torneo, setTorneo] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);

    const [nuevoEquipoNombre, setNuevoEquipoNombre] = useState('');
    const [uniendo, setUniendo] = useState(false);
    const [ultimoGrupoAsignado, setUltimoGrupoAsignado] = useState(null);

    const [equipoLocalId, setEquipoLocalId] = useState('');
    const [equipoVisitanteId, setEquipoVisitanteId] = useState('');
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);
    const [registrando, setRegistrando] = useState(false);

    const cargarDatos = useCallback(async () => {
        try {
            setLoading(true);
            const [torneoData, equiposData] = await Promise.all([
                apiService.getTorneoById(torneoId),
                apiService.getTablaDePosiciones(torneoId),
            ]);
            setTorneo(torneoData);
            setEquipos(equiposData);
            setError(null);
        } catch (err) {
            setError('Error al cargar el torneo. Asegúrate de que el backend esté funcionando.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [torneoId]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const handleUnirseTorneo = async (e) => {
        e.preventDefault();
        if (!nuevoEquipoNombre.trim()) return;
        try {
            setUniendo(true);
            setActionError(null);
            const nuevoEquipo = { name: nuevoEquipoNombre.trim() };
            const equipoCreado = await apiService.addEquipo(torneoId, nuevoEquipo);
            setUltimoGrupoAsignado(equipoCreado.grupo);
            setNuevoEquipoNombre('');
            await cargarDatos();
        } catch (err) {
            setActionError('Error al unirse al torneo con ese equipo.');
            console.error(err);
        } finally {
            setUniendo(false);
        }
    };

    const handleRegistrarResultado = async (e) => {
        e.preventDefault();
        if (!equipoLocalId || !equipoVisitanteId || equipoLocalId === equipoVisitanteId) {
            setActionError('Selecciona dos equipos diferentes.');
            return;
        }
        const resultado = {
            equipoLocalId: parseInt(equipoLocalId, 10),
            equipoVisitanteId: parseInt(equipoVisitanteId, 10),
            golesLocal: parseInt(golesLocal, 10) || 0,
            golesVisitante: parseInt(golesVisitante, 10) || 0,
        };
        try {
            setRegistrando(true);
            setActionError(null);
            await apiService.registrarResultado(resultado);
            setEquipoLocalId('');
            setEquipoVisitanteId('');
            setGolesLocal(0);
            setGolesVisitante(0);
            await cargarDatos();
        } catch (err) {
            setActionError('Error al registrar el resultado del partido.');
            console.error(err);
        } finally {
            setRegistrando(false);
        }
    };

    if (loading && !torneo) {
        return (
            <div className="container">
                <p className="hint">Cargando torneo…</p>
            </div>
        );
    }

    if (error && !torneo) {
        return (
            <div className="container">
                <button onClick={onBack} className="back-button">← Volver</button>
                <div className="error-container"><p>{error}</p></div>
            </div>
        );
    }

    const gruposDePosiciones = agruparPorGrupo(equipos);

    return (
        <div className="container">
            <header className="torneo-header">
                <button onClick={onBack} className="back-button">← Volver</button>
                <div>
                    <h1>{torneo?.name}</h1>
                    <p className="subtitle">{torneo?.type} · {torneo?.status} · Fase de grupos (4 equipos por grupo)</p>
                </div>
            </header>

            {actionError && <div className="error-container"><p>{actionError}</p></div>}

            <div className="torneo-grid">
                <div className="card">
                    <h2>Tabla de Posiciones por Grupo</h2>
                    {gruposDePosiciones.length === 0 ? (
                        <p className="hint">Todavía no hay equipos inscritos. ¡Sé el primero en unirte!</p>
                    ) : (
                        gruposDePosiciones.map((grupo) => (
                            <div key={grupo.nombre} className="grupo-bloque">
                                <h3>Grupo {grupo.nombre}</h3>
                                <div className="table-responsive">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Equipo</th>
                                                <th>PJ</th>
                                                <th>PTS</th>
                                                <th>V</th>
                                                <th>E</th>
                                                <th>D</th>
                                                <th>GF</th>
                                                <th>GC</th>
                                                <th>DF</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {grupo.equipos.map((equipo) => (
                                                <tr key={equipo.id}>
                                                    <td>{equipo.name}</td>
                                                    <td>{equipo.v + equipo.e + equipo.d}</td>
                                                    <td><strong>{equipo.pts}</strong></td>
                                                    <td>{equipo.v}</td>
                                                    <td>{equipo.e}</td>
                                                    <td>{equipo.d}</td>
                                                    <td>{equipo.gf}</td>
                                                    <td>{equipo.gc}</td>
                                                    <td>{equipo.df}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {grupo.equipos.length < 4 && (
                                    <p className="hint small">Faltan {4 - grupo.equipos.length} equipo(s) para completar este grupo.</p>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="management-forms">
                    <div className="card">
                        <h2>Unirse al Torneo</h2>
                        <p className="hint">Ingresa el nombre de tu equipo/selección. Se te asignará automáticamente a un grupo con cupo disponible.</p>
                        <form onSubmit={handleUnirseTorneo}>
                            <input
                                type="text"
                                value={nuevoEquipoNombre}
                                onChange={(e) => setNuevoEquipoNombre(e.target.value)}
                                placeholder="Nombre del equipo o país"
                                required
                            />
                            <button type="submit" disabled={uniendo}>
                                {uniendo ? 'Uniéndose…' : 'Unirme al Torneo'}
                            </button>
                        </form>
                        {ultimoGrupoAsignado && (
                            <p className="hint success">¡Te uniste al Grupo {ultimoGrupoAsignado}!</p>
                        )}
                    </div>

                    <div className="card">
                        <h2>Registrar Resultado</h2>
                        <form onSubmit={handleRegistrarResultado} className="form-partido">
                            <div className="partido-equipos">
                                <select value={equipoLocalId} onChange={(e) => setEquipoLocalId(e.target.value)} required>
                                    <option value="">-- Equipo Local --</option>
                                    {equipos.map((e) => (
                                        <option key={e.id} value={e.id}>{e.name} (Grupo {e.grupo})</option>
                                    ))}
                                </select>
                                <input type="number" value={golesLocal} onChange={(e) => setGolesLocal(e.target.value)} min="0" />
                            </div>
                            <div className="vs">vs</div>
                            <div className="partido-equipos">
                                <input type="number" value={golesVisitante} onChange={(e) => setGolesVisitante(e.target.value)} min="0" />
                                <select value={equipoVisitanteId} onChange={(e) => setEquipoVisitanteId(e.target.value)} required>
                                    <option value="">-- Equipo Visitante --</option>
                                    {equipos.map((e) => (
                                        <option key={e.id} value={e.id}>{e.name} (Grupo {e.grupo})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" disabled={registrando || equipos.length < 2}>
                                {registrando ? 'Registrando…' : 'Registrar Resultado'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TorneoPage;
