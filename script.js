// Lógica principal de la aplicación encapsulada en un objeto
        const app = {
            currentUser: null,
            tournaments: [],
            currentTournamentId: null,

            // Equipos por defecto para generar torneos
            teamsData: {
                selecciones: ["Perú", "Argentina", "Brasil", "Colombia", "Uruguay", "Chile", "Ecuador", "Venezuela"],
                clubes: ["Real Madrid", "Barcelona", "Manchester City", "Bayern Munich", "PSG", "Juventus", "Liverpool", "AC Milan"]
            },

            // Navegación entre pantallas
            navigate(viewId) {
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                document.getElementById(viewId).classList.add('active');
            },

            login() {
                const username = document.getElementById('username').value.trim();
                if (username === '') {
                    alert('Por favor ingresa un nombre.');
                    return;
                }
                this.currentUser = username;
                document.getElementById('display-user').innerText = this.currentUser;
                this.renderDashboard();
                this.navigate('view-dashboard');
            },

            logout() {
                this.currentUser = null;
                document.getElementById('username').value = '';
                this.navigate('view-login');
            },

            renderDashboard() {
                const list = document.getElementById('tournament-list');
                list.innerHTML = '';

                if (this.tournaments.length === 0) {
                    list.innerHTML = `
                        <div class="empty-state">
                            <i class="fa-solid fa-futbol"></i>
                            <p>Aún no has creado ningún torneo.</p>
                        </div>
                    `;
                    return;
                }

                this.tournaments.forEach(t => {
                    const statusText = t.userTeam ? `Tu equipo: ${t.userTeam}` : 'Pendiente de elección';
                    const iconColor = t.userTeam ? 'var(--primary)' : 'var(--text-muted)';
                    
                    list.innerHTML += `
                        <div class="tournament-card" onclick="app.openTournament(${t.id})">
                            <h3>${t.name}</h3>
                            <div class="status">
                                <i class="fa-solid fa-shield-halved" style="color: ${iconColor};"></i> ${statusText}
                            </div>
                        </div>
                    `;
                });
            },

            showCreateTournament() {
                document.getElementById('tourney-name').value = '';
                this.navigate('view-create');
            },

            createTournament() {
                const name = document.getElementById('tourney-name').value.trim();
                const type = document.getElementById('tourney-type').value;
                
                if (name === '') {
                    alert('Dale un nombre a tu torneo.');
                    return;
                }

                // Generar un ID único
                const newId = Date.now();
                
                // Cargar lista de equipos iniciales con estadísticas en 0
                const initialTeams = this.teamsData[type].map(teamName => ({
                    name: teamName, v: 0, e: 0, d: 0, gf: 0, gc: 0
                }));

                // Guardar el torneo
                this.tournaments.push({
                    id: newId,
                    name: name,
                    type: type,
                    userTeam: null, // Aún no ha elegido equipo
                    teams: initialTeams
                });

                this.renderDashboard();
                this.navigate('view-dashboard');
            },

            openTournament(id) {
                const tourney = this.tournaments.find(t => t.id === id);
                this.currentTournamentId = id;

                if (!tourney.userTeam) {
                    // Si no tiene equipo, mostrar pantalla de selección
                    document.getElementById('join-tourney-name').innerText = tourney.name;
                    const select = document.getElementById('team-select');
                    select.innerHTML = '<option value="">-- Selecciona --</option>';
                    
                    tourney.teams.forEach(team => {
                        select.innerHTML += `<option value="${team.name}">${team.name}</option>`;
                    });
                    
                    this.navigate('view-join');
                } else {
                    // Si ya tiene equipo, mostrar la tabla
                    this.renderStandings(tourney);
                }
            },

            joinTournament() {
                const team = document.getElementById('team-select').value;
                if (team === '') {
                    alert('Debes elegir un equipo para participar.');
                    return;
                }

                const tourney = this.tournaments.find(t => t.id === this.currentTournamentId);
                tourney.userTeam = team;

                // Simulador: Como elegimos equipo, vamos a generar algunos partidos aleatorios 
                // a los otros equipos para que la tabla no esté en ceros (solo como prototipo visual)
                tourney.teams.forEach(t => {
                    if (t.name !== team) {
                        t.v = Math.floor(Math.random() * 4);
                        t.e = Math.floor(Math.random() * 3);
                        t.d = Math.floor(Math.random() * 3);
                        t.gf = Math.floor(Math.random() * 12);
                        t.gc = Math.floor(Math.random() * 10);
                    } else {
                        // Al equipo del usuario le ponemos un par de partidos ganados para empezar bien :)
                        t.v = 2; t.e = 1; t.d = 0; t.gf = 5; t.gc = 1;
                    }
                });

                this.renderStandings(tourney);
                this.renderDashboard(); // Actualizar dashboard en el fondo
            },

            renderStandings(tourney) {
                document.getElementById('standings-tourney-name').innerText = tourney.name;
                const tbody = document.getElementById('table-body');
                tbody.innerHTML = '';

                // 1. Calcular campos dinámicos
                tourney.teams.forEach(team => {
                    team.pj = team.v + team.e + team.d;
                    team.df = team.gf - team.gc;
                    team.pts = (team.v * 3) + (team.e * 1) + (team.d * 0);
                });

                // 2. Ordenar (1ro Puntos, 2do Diferencia de Goles, 3ro Goles a Favor)
                tourney.teams.sort((a, b) => b.pts - a.pts || b.df - a.df || b.gf - a.gf);

                // 3. Renderizar filas
                tourney.teams.forEach((team, index) => {
                    const isMyTeam = team.name === tourney.userTeam;
                    const rowClass = isMyTeam ? 'my-team-row' : '';
                    const flagIcon = tourney.type === 'selecciones' ? 'fa-flag' : 'fa-shield';
                    
                    const tr = document.createElement('tr');
                    tr.className = rowClass;
                    tr.innerHTML = `
                        <td style="color: var(--text-muted);">${index + 1}</td>
                        <td class="team-cell">
                            <i class="fa-solid ${flagIcon}" style="color: ${isMyTeam ? 'var(--primary)' : 'var(--text-muted)'};"></i> 
                            ${team.name} ${isMyTeam ? '(Tú)' : ''}
                        </td>
                        <td>${team.pj}</td>
                        <td>${team.v}</td>
                        <td>${team.e}</td>
                        <td>${team.d}</td>
                        <td>${team.gf}</td>
                        <td>${team.gc}</td>
                        <td>${team.df > 0 ? '+'+team.df : team.df}</td>
                        <td class="pts-col">${team.pts}</td>
                    `;
                    tbody.appendChild(tr);
                });

                this.navigate('view-standings');
            }
        };

        // Permitir login presionando "Enter"
        document.getElementById('username').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') app.login();
        });