const API_BASE_URL = '/api';

async function request(endpoint, options = {}) {
    const { body, ...customConfig } = options;
    const headers = { 'Content-Type': 'application/json' };

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error en la petición');
        }
        if (response.status === 204 || response.headers.get('Content-Length') === '0') {
            return; // No content
        }
        return await response.json();
    } catch (error) {
        console.error('Error en el servicio API:', error);
        throw error;
    }
}

export const apiService = {
    getTorneos: () => request('/torneos'),
    getTorneoById: (id) => request(`/torneos/${id}`),
    createTorneo: (torneo) => request('/torneos', { body: torneo }),
    deleteTorneo: (torneoId) => request(`/torneos/${torneoId}`, { method: 'DELETE' }),
    getTablaDePosiciones: (torneoId) => request(`/torneos/${torneoId}/equipos`),
    addEquipo: (torneoId, equipo) => request(`/torneos/${torneoId}/equipos`, { body: equipo }),
    registrarResultado: (resultado) => request('/partidos/resultado', { body: resultado }),
    generarPartidos: (torneoId) => request(`/torneos/${torneoId}/generar-partidos`, { method: 'POST' }),
    getPartidos: (torneoId) => request(`/torneos/${torneoId}/partidos`),
};