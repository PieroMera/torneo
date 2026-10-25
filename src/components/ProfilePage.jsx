import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

function ProfilePage({ email, onBack }) {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        apiService.getProfile(email)
            .then(setProfile)
            .catch(() => setError('No se pudo cargar tu perfil.'));
    }, [email]);

    return (
        <main className="profile-page">
            <section className="profile-card">
                <button type="button" className="profile-back" onClick={onBack}>← Volver a torneos</button>
                {error && <p className="login-error" role="alert">{error}</p>}
                {!profile && !error && <p className="hint">Cargando perfil...</p>}
                {profile && <>
                    <div className="profile-avatar">{profile.nombre.charAt(0)}{profile.apellido.charAt(0)}</div>
                    <p className="eyebrow">MI PERFIL</p>
                    <h1>{profile.nombre} {profile.apellido}</h1>
                    <p className="profile-description">Tu información de cuenta en TorneoPRO.</p>
                    <dl className="profile-details">
                        <div><dt>Correo electrónico</dt><dd>{profile.email}</dd></div>
                        <div><dt>Número de celular</dt><dd>{profile.celular}</dd></div>
                    </dl>
                </>}
            </section>
        </main>
    );
}

export default ProfilePage;
