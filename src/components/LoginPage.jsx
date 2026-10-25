import { useState } from 'react';
import { apiService } from '../services/apiService';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [celular, setCelular] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const normalizedEmail = email.trim();
        if (!normalizedEmail || !password) return setError('Ingresa tu correo y contraseña para continuar.');
        if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return setError('Ingresa un correo electrónico válido.');
        if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
        if (isRegistering && (!nombre.trim() || !apellido.trim() || !celular.trim())) return setError('Completa tus datos personales para crear la cuenta.');
        if (isRegistering && password !== passwordConfirmation) return setError('Las contraseñas no coinciden.');

        try {
            setSubmitting(true);
            setError('');
            const credentials = isRegistering
                ? { nombre: nombre.trim(), apellido: apellido.trim(), celular: celular.trim(), email: normalizedEmail, password }
                : { email: normalizedEmail, password };
            const user = isRegistering ? await apiService.register(credentials) : await apiService.login(credentials);
            onLogin(user.email);
        } catch (requestError) {
            setError(requestError.message || 'No se pudo procesar la solicitud.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-brand" aria-label="TorneoPRO">
                <div className="brand-mark" aria-hidden="true">⚽</div>
                <p className="brand-kicker">GESTIÓN DEPORTIVA</p>
                <h1>Torneo<span>PRO</span></h1>
                <p className="brand-copy">Organiza cada partido, sigue la tabla y vive tu torneo de principio a fin.</p>
                <div className="brand-features"><span>✓ Torneos organizados</span><span>✓ Resultados en vivo</span><span>✓ Tablas actualizadas</span></div>
            </section>
            <section className="login-panel">
                <form className="login-card" onSubmit={handleSubmit} noValidate>
                    <div className="login-heading"><p className="eyebrow">{isRegistering ? 'NUEVA CUENTA' : 'BIENVENIDO DE VUELTA'}</p><h2>{isRegistering ? 'Crea tu cuenta' : 'Inicia sesión'}</h2><p>{isRegistering ? 'Regístrate para comenzar a administrar tus torneos.' : 'Ingresa tus datos para administrar tus torneos.'}</p></div>
                    {error && <p className="login-error" role="alert">{error}</p>}
                    {isRegistering && <>
                        <div className="registration-row">
                            <div><label htmlFor="nombre">Nombre</label><input id="nombre" type="text" value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Tu nombre" autoComplete="given-name" /></div>
                            <div><label htmlFor="apellido">Apellido</label><input id="apellido" type="text" value={apellido} onChange={(event) => setApellido(event.target.value)} placeholder="Tu apellido" autoComplete="family-name" /></div>
                        </div>
                        <label htmlFor="celular">Número de celular</label>
                        <input id="celular" type="tel" value={celular} onChange={(event) => setCelular(event.target.value)} placeholder="Ej. 999 999 999" autoComplete="tel" />
                    </>}
                    <label htmlFor="email">Correo electrónico</label>
                    <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@correo.com" autoComplete="email" />
                    <div className="password-label"><label htmlFor="password">Contraseña</label><button type="button" onClick={() => setShowPassword((current) => !current)}>{showPassword ? 'Ocultar' : 'Mostrar'}</button></div>
                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ingresa tu contraseña" autoComplete="current-password" />
                    {isRegistering && <><label htmlFor="passwordConfirmation">Confirma tu contraseña</label><input id="passwordConfirmation" type={showPassword ? 'text' : 'password'} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Vuelve a escribir tu contraseña" autoComplete="new-password" /></>}
                    {!isRegistering && <div className="login-options"><label className="remember-me"><input type="checkbox" defaultChecked /> Recordarme</label><button type="button" className="text-button">¿Olvidaste tu contraseña?</button></div>}
                    <button className="login-submit" type="submit" disabled={submitting}>{submitting ? 'Procesando...' : isRegistering ? 'Crear cuenta' : 'Entrar a TorneoPRO'} <span aria-hidden="true">→</span></button>
                    <p className="login-footer">{isRegistering ? '¿Ya tienes una cuenta?' : '¿Aún no tienes una cuenta?'} <button type="button" className="text-button" onClick={() => { setIsRegistering((current) => !current); setError(''); }}>{isRegistering ? 'Iniciar sesión' : 'Crear cuenta'}</button></p>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;
