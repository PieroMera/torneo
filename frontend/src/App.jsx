import { useState, useEffect } from 'react';
import { apiService } from './services/apiService';
import './App.css';
import TorneoPage from './components/TorneoPage';

function App() {
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [creando, setCreando] = useState(false);

    const [nuevoTorneoNombre, setNuevoTorneoNombre] = useState('');
    const [nuevoTorneoTipo, setNuevoTorneoTipo] = useState('Selecciones');

    const [selectedTorneoId, setSelectedTorneoId] = useState(null);

    const fetchTorneos = async () => {
        try {
            setLoading(true);
            const data = await apiService.getTorneos();
            setTorneos(data);
            setError(null);
        } catch (err) {
            setError('No se pudo conectar con el servidor. Verifica que el backend esté funcionando en el puerto 8080.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTorneos();
    }, []);

    const handleCrearTorneo = async (e) => {
        e.preventDefault();
        if (!nuevoTorneoNombre.trim()) return;
        try {
            setCreando(true);
            const nuevoTorneo = { name: nuevoTorneoNombre.trim(), type: nuevoTorneoTipo };
            const torneoCreado = await apiService.createTorneo(nuevoTorneo);
            setTorneos((prev) => [...prev, torneoCreado]);
            setNuevoTorneoNombre('');
        } catch (err) {
            setError('Error al crear el torneo.');
            console.error(err);
        } finally {
            setCreando(false);
        }
    };

    if (selectedTorneoId) {
        return (
            <TorneoPage
                torneoId={selectedTorneoId}
                onBack={() => {
                    setSelectedTorneoId(null);
                    fetchTorneos();
                }}
            />
        );
    }

    return (
        <div className="container">
            <header>
                <h1>🏆 TorneoPRO</h1>
                <p className="subtitle">Crea torneos de fútbol, únete con tu equipo y sigue la fase de grupos en vivo</p>
            </header>

            {error && (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={fetchTorneos}>Reintentar</button>
                </div>
            )}

            <main>
                <div className="card">
                    <h2>Crear Nuevo Torneo</h2>
                    <form onSubmit={handleCrearTorneo} className="form-crear-torneo">
                        <input
                            type="text"
                            value={nuevoTorneoNombre}
                            onChange={(e) => setNuevoTorneoNombre(e.target.value)}
                            placeholder="Nombre del torneo (ej. Copa Verano 2026)"
                            required
                        />
                        <select value={nuevoTorneoTipo} onChange={(e) => setNuevoTorneoTipo(e.target.value)}>
                            <option value="Selecciones">Selecciones / Países</option>
                            <option value="Clubes">Clubes</option>
                        </select>
                        <button type="submit" disabled={creando}>
                            {creando ? 'Creando…' : 'Crear Torneo'}
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h2>Torneos Disponibles</h2>
                    <p className="hint">Haz clic en un torneo para unirte con tu equipo o ver la tabla de posiciones.</p>

                    {loading ? (
                        <p className="hint">Cargando torneos…</p>
                    ) : torneos.length > 0 ? (
                        <ul className="lista-torneos">
                            {torneos.map((torneo) => (
                                <li key={torneo.id} onClick={() => setSelectedTorneoId(torneo.id)}>
                                    <div className="torneo-info">
                                        <span className="torneo-nombre">{torneo.name}</span>
                                        <span className="torneo-tipo">{torneo.type}</span>
                                    </div>
                                    <span className="badge">{torneo.status}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="hint">No hay torneos creados todavía. ¡Crea el primero!</p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
