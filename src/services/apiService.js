const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\\/+$/, '');
const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

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
        const contentType = response.headers.get('Content-Type') || '';
        return contentType.includes('application/json') ? await response.json() : await response.text();
    } catch (error) {
        console.error('Error en el servicio API:', error);
        throw error;
    }
}

export const apiService = {
    register: (credentials) => request('/auth/register', { body: credentials }),
    login: (credentials) => request('/auth/login', { body: credentials }),
    getProfile: (email) => request(`/auth/profile?email=${encodeURIComponent(email)}`),
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
