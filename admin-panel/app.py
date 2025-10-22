import streamlit as st
from supabase import create_client, Client
import os
from datetime import datetime
from transfermarkt_integration import add_transfermarkt_section
from dotenv import load_dotenv  # 👈 AGREGAR ESTA LÍNEA

# Cargar variables de entorno del archivo .env
load_dotenv()  # 👈 AGREGAR ESTA LÍNEA

# ============================================
# ESTILOS CSS MEJORADOS - AGREGAR AQUÍ
# ============================================
st.markdown("""
<style>
    /* === BASE: Todo negro por defecto === */
    body, .main, .main *, 
    [data-testid="stMarkdownContainer"] *:not(strong):not(em):not(p):not(br),
    div, span, p:not([style*="color"]) {
        color: #000000 !important;
    }
    
    /* Respetar estilos inline en markdown */
    [style*="color"] {
        /* No forzar color si ya tiene style inline */
    }
    
    /* === HEADER: Títulos === */
    .header-title {
        margin: 0 !important;
        font-size: 2.5em !important;
        color: #003366 !important;
        text-shadow: none !important;
        border: none !important;
        padding: 0 !important;
    }
    
    .header-subtitle {
        margin: 10px 0 0 0 !important;
        color: #003366 !important;
        font-weight: 300 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
    }
    
    /* === SIDEBAR: Fondo negro, texto blanco === */
    [data-testid="stSidebar"],
    [data-testid="stSidebar"] > div,
    section[data-testid="stSidebar"] {
        background-color: #000000 !important;
    }
    
    [data-testid="stSidebar"] *,
    [data-testid="stSidebar"] div,
    [data-testid="stSidebar"] span,
    [data-testid="stSidebar"] p,
    [data-testid="stSidebar"] label {
        color: #FFFFFF !important;
    }
    

    
    /* === RADIO BUTTONS: Punto azul === */
    [data-testid="stSidebar"] [role="radio"][aria-checked="true"]::before {
        background-color: #4A90E2 !important;
        border-color: #4A90E2 !important;
    }
    
    [data-testid="stSidebar"] [role="radio"]::before {
        border-color: #4A90E2 !important;
    }
    
    /* Radio button SVG circles */
    [data-testid="stSidebar"] svg circle {
        stroke: #4A90E2 !important;
        fill: #4A90E2 !important;
    }
    /* === INPUTS Y CAMPOS: Fondo oscuro === */
    .stTextInput > div > div > input,
    .stNumberInput > div > div > input,
    .stTextArea textarea,
    .stDateInput > div > div > input,
    .stTimeInput > div > div > input,
    input, textarea, select {
        background-color: #1E1E1E !important;
        color: #FFFFFF !important;
        border: 2px solid #4A90E2 !important;
    }
    
    /* === LABELS: Azul visible === */
    .stTextInput label,
    .stSelectbox label,
    .stDateInput label,
    .stTimeInput label,
    .stNumberInput label,
    .stTextArea label,
    label {
        color: #4A90E2 !important;
        font-weight: bold !important;
    }
    
    /* === SELECTBOX/DROPDOWN === */
    /* Fondo del selectbox */
    div[data-baseweb="select"] > div,
    div[data-baseweb="select"] input,
    div[data-baseweb="select"] span {
        background-color: #1E1E1E !important;
        color: #FFFFFF !important;
    }
    
    /* Menu desplegable */
    div[data-baseweb="popover"],
    ul[role="listbox"] {
        background-color: #1E1E1E !important;
        border: 2px solid #4A90E2 !important;
    }
    
    /* Opciones del menu */
    li[role="option"],
    li[role="option"] span,
    li[role="option"] div {
        background-color: #1E1E1E !important;
        color: #FFFFFF !important;
    }
    
    /* Hover en opciones */
    li[role="option"]:hover,
    li[role="option"]:hover span {
        background-color: #2D2D2D !important;
        color: #4A90E2 !important;
    }
    
    /* Texto seleccionado en el dropdown */
    [data-baseweb="select"] [class*="singleValue"],
    [data-baseweb="select"] [class*="placeholder"] {
        color: #FFFFFF !important;
    }
    

    
    /* === TEXTO VISIBLE EN SELECTBOX (antes de abrir) === */
    [data-baseweb="select"] div,
    [data-baseweb="select"] span,
    div[data-baseweb="select"] * {
        color: #FFFFFF !important;
    }
    
    /* Asegurar que el input interno también sea blanco */
    div[data-baseweb="select"] input[readonly] {
        color: #FFFFFF !important;
    }
    /* === HEADER TOOLBAR: Negro con iconos blancos === */
    header[data-testid="stHeader"] {
        background-color: #000000 !important;
    }
    
    header[data-testid="stHeader"] *,
    header[data-testid="stHeader"] svg,
    header[data-testid="stHeader"] button {
        color: #FFFFFF !important;
        fill: #FFFFFF !important;
    }
    
    /* === METRICAS === */
    [data-testid="metric-container"] {
        background-color: #FFFFFF !important;
        border: 3px solid #003366 !important;
        padding: 15px !important;
        border-radius: 8px !important;
    }
    
    /* === TITULOS PRINCIPALES === */
    .main h1, .main h2 {
        color: #003366 !important;
    }
    
    /* === TABS === */
    .stTabs [data-baseweb="tab-list"] button {
        color: #003366 !important;
        font-weight: 600 !important;
    }
    
    .stTabs [data-baseweb="tab-list"] button[aria-selected="true"] {
        border-bottom-color: #003366 !important;
    }

    
    /* === RADIO BUTTONS AZULES === */
    [data-testid="stSidebar"] [data-baseweb="radio"] > div > div {
        background-color: #000000 !important;
    }
    
    [data-testid="stSidebar"] [data-baseweb="radio"] [aria-checked="true"] > div:first-child {
        background-color: #4A90E2 !important;
        border-color: #4A90E2 !important;
    }
    
    [data-testid="stSidebar"] [data-baseweb="radio"] > div:first-child {
        border-color: #FFFFFF !important;
    }
    
    [data-testid="stSidebar"] input[type="radio"]:checked + div {
        background-color: #4A90E2 !important;
    }
</style>
""", unsafe_allow_html=True)

st.markdown("""
""", unsafe_allow_html=True)


# Configuración de la página
st.set_page_config(
    page_title="FIFA World Cup 2026 - Admin Panel",
    page_icon="🏆",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personalizado estilo FIFA
st.markdown("""
""", unsafe_allow_html=True)

# Conectar con Supabase
@st.cache_resource
def init_supabase() -> Client:
    url = os.getenv("SUPABASE_URL", "https://ksiiidnvtktlowlhtebs.supabase.co")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    return create_client(url, key)

supabase = init_supabase()

# Header WC26 con logo
st.markdown("""
<div style="text-align: center; padding: 20px; background: url('https://ksiiidnvtktlowlhtebs.supabase.co/storage/v1/object/public/images_streamlite/header_verde.png'); background-size: cover; background-position: center;">
    <h1 class="header-title">
        🏆 WC26
    </h1>
    <h3 class="header-subtitle">
        WORLD CUP 2026™ - ADMIN PANEL
    </h3>
</div>
""", unsafe_allow_html=True)

# Sidebar para navegación con estilo FIFA negro minimalista
st.sidebar.markdown("""
<div style='text-align: center; padding: 20px 0;'>
</div>
""", unsafe_allow_html=True)

# Logo en el sidebar (desde Supabase CDN)
st.sidebar.markdown(f"""
<div style='text-align: center; padding: 10px 0; margin-bottom: 20px;'>
    <img src='https://ksiiidnvtktlowlhtebs.supabase.co/storage/v1/object/public/images_streamlite/logo_wc26.jpg' 
         style='width: 180px; border-radius: 10px;' />
</div>
""", unsafe_allow_html=True)

page = st.sidebar.radio(
    "",
    ["DASHBOARD", "SELECCIONES", "JUGADORES", "PARTIDOS", "ARTÍCULOS"],
    index=0
)

# ============================================
# PÁGINA: DASHBOARD
# ============================================
if page == "DASHBOARD":
    st.markdown("""
    <div style="text-align: center; margin-bottom: 30px;">
        <h1>📊 CENTRO DE CONTROL FIFA</h1>
        <p style="font-size: 1.2em; color: #003366;">Panel de administración del Mundial 2026</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Métricas principales con estilo FIFA
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        teams_count = supabase.table('teams').select('id', count='exact').execute()
        st.markdown(f"<div style='border: 3px solid #003366; padding: 15px; border-radius: 8px; background: white;'><h3 style='color: #003366; margin:0;'>🏆 EQUIPOS</h3><h1 style='color: #1a1a1a; margin:5px 0;'>{teams_count.count}</h1><p style='color: #003366; margin:0;'>↑ 48 máximo</p></div>", unsafe_allow_html=True)
    
    with col2:
        players_count = supabase.table('players').select('id', count='exact').execute()
        st.markdown(f"<div style='border: 3px solid #003366; padding: 15px; border-radius: 8px; background: white;'><h3 style='color: #003366; margin:0;'>👤 JUGADORES</h3><h1 style='color: #1a1a1a; margin:5px 0;'>{players_count.count}</h1><p style='color: #003366; margin:0;'>↑ +26 por equipo</p></div>", unsafe_allow_html=True)
    
    with col3:
        matches_count = supabase.table('matches').select('id', count='exact').execute()
        st.markdown(f"<div style='border: 3px solid #003366; padding: 15px; border-radius: 8px; background: white;'><h3 style='color: #003366; margin:0;'>⚽ PARTIDOS</h3><h1 style='color: #1a1a1a; margin:5px 0;'>{matches_count.count}</h1><p style='color: #003366; margin:0;'>↑ 104 total</p></div>", unsafe_allow_html=True)
    
    with col4:
        articles_count = supabase.table('articles').select('id', count='exact').execute()
        st.markdown(f"<div style='border: 3px solid #003366; padding: 15px; border-radius: 8px; background: white;'><h3 style='color: #003366; margin:0;'>📰 ARTÍCULOS</h3><h1 style='color: #1a1a1a; margin:5px 0;'>{articles_count.count}</h1><p style='color: #003366; margin:0;'>↑ Contenido editorial</p></div>", unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Información del Mundial con estilo FIFA
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        <div style="background: linear-gradient(45deg, rgba(255,215,0,0.1), rgba(0,166,81,0.1)); 
                    border: 2px solid #4A90E2; border-radius: 0px; padding: 20px; margin-bottom: 20px;">
            <h3>🎯 PRÓXIMOS PASOS</h3>
            <ul style="color: #1a1a1a; font-size: 1.1em;">
                <li>✅ Base de datos FIFA configurada</li>
                <li>✅ Panel de administración activo</li>
                <li>📝 Cargar las 48 selecciones clasificadas</li>
                <li>📝 Registrar plantillas completas (26 jugadores c/u)</li>
                <li>📝 Calendario oficial de 104 partidos</li>
                <li>📝 Contenido editorial y noticias</li>
                <li>🚀 Integración con app móvil</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
        with col2:
            # Usar componentes nativos de Streamlit
            st.markdown("### 🏟️ SEDES EN MÉXICO")
            
            st.markdown("**🏟️ Estadio Azteca**")
            st.write("Ciudad de México")
            st.caption("5 partidos programados")
            st.divider()
            
            st.markdown("**🏟️ Estadio Akron**")
            st.write("Guadalajara, Jalisco")
            st.caption("4 partidos programados")
            st.divider()
            
            st.markdown("**🏟️ Estadio BBVA**")
            st.write("Monterrey, N.L.")
            st.caption("4 partidos programados")

# ============================================
elif page == "SELECCIONES":
    st.markdown("""
    <div style="text-align: center; margin-bottom: 30px;">
        <h1>🏆 GESTIÓN DE SELECCIONES FIFA</h1>
        <p style="font-size: 1.2em; color: #003366;">48 equipos clasificados al Mundial 2026</p>
    </div>
    """, unsafe_allow_html=True)

    tab1, tab2, tab3 = st.tabs(["📋 VER SELECCIONES", "➕ AGREGAR SELECCIÓN", "✏️ EDITAR SELECCIÓN"])

    # ============================================
    # TAB 1: VER SELECCIONES
    # ============================================
    with tab1:
        teams = supabase.table('teams').select('*').order('name').execute()

        if teams.data:
            # Agrupar por confederación
            confederations = {}
            for team in teams.data:
                conf = team.get('confederation', 'Sin confederación')
                if conf not in confederations:
                    confederations[conf] = []
                confederations[conf].append(team)

            for conf, teams_list in confederations.items():
                st.markdown(f"""
                <div style="background: linear-gradient(90deg, rgba(255,215,0,0.2), rgba(0,166,81,0.1));
                            border-left: 5px solid #4A90E2; padding: 15px; margin: 20px 0; border-radius: 0px;">
                    <h3 style="margin: 0; color: #003366;">🌍 {conf}</h3>
                    <p style="margin: 5px 0 0 0; color: #1a1a1a;">{len(teams_list)} equipos registrados</p>
                </div>
                """, unsafe_allow_html=True)

                cols = st.columns(3)
                for i, team in enumerate(teams_list):
                    with cols[i % 3]:
                        with st.expander(f"🏆 {team['name']} ({team['code']})"):
                            col1, col2 = st.columns(2)
                            with col1:
                                st.write(f"**🌍 Confederación:** {team.get('confederation', 'N/A')}")
                                st.write(f"**📊 Grupo:** {team.get('group_letter', 'Por definir')}")
                                st.write(f"**🏅 Ranking FIFA:** #{team.get('fifa_ranking', 'N/A')}")
                            with col2:
                                st.write(f"**👨‍💼 Entrenador:** {team.get('coach_name', 'Por confirmar')}")
                                st.write(f"**🏟️ Estadio:** {team.get('stadium_home', 'N/A')}")
                                if team.get('flag_url'):
                                    st.image(team['flag_url'], width=50)
        else:
            st.info("🏆 No hay selecciones registradas. ¡Comienza agregando las 48 clasificadas!")

    # ============================================
    # TAB 2: AGREGAR SELECCIÓN (SIN st.form())
    # ============================================
    with tab2:
        st.markdown("""
        <div style="background: linear-gradient(45deg, rgba(255,215,0,0.1), rgba(0,166,81,0.1));
                    border: 2px solid #4A90E2; border-radius: 0px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #003366; margin-top: 0;">➕ REGISTRAR NUEVA SELECCIÓN</h3>
            <p style="color: #1a1a1a;">Agrega una de las 48 selecciones clasificadas al Mundial FIFA 2026</p>
        </div>
        """, unsafe_allow_html=True)

        col1, col2 = st.columns(2)

        with col1:
            name = st.text_input("🏆 Nombre de la selección*", placeholder="Ej: México", key="add_team_name")
            code = st.text_input("🔤 Código FIFA (3 letras)*", max_chars=3, placeholder="MEX", key="add_team_code")
            confederation = st.selectbox(
                "🌍 Confederación*",
                ["CONCACAF", "CONMEBOL", "UEFA", "CAF", "AFC", "OFC"],
                key="add_team_conf"
            )
            group_letter = st.selectbox(
                "📊 Grupo (Fase de grupos)",
                ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
                key="add_team_group"
            )

        with col2:
            coach_name = st.text_input("👨‍💼 Director técnico", placeholder="Ej: Javier Aguirre", key="add_team_coach")
            stadium_home = st.text_input("🏟️ Estadio principal", placeholder="Ej: Estadio Azteca", key="add_team_stadium")
            fifa_ranking = st.number_input("🏅 Ranking FIFA", min_value=1, max_value=211, value=1, key="add_team_ranking")
            flag_url = st.text_input("🏴 URL de la bandera", placeholder="https://...", key="add_team_flag")

        # BOTÓN NORMAL - NO st.form_submit_button()
        if st.button("🏆 REGISTRAR SELECCIÓN", use_container_width=True, type="primary"):
            if name and code and confederation:
                try:
                    data = {
                        "name": name,
                        "code": code.upper(),
                        "confederation": confederation,
                        "group_letter": group_letter if group_letter else None,
                        "coach_name": coach_name if coach_name else None,
                        "stadium_home": stadium_home if stadium_home else None,
                        "fifa_ranking": fifa_ranking if fifa_ranking else None,
                        "flag_url": flag_url if flag_url else None
                    }
                    supabase.table('teams').insert(data).execute()
                    st.success(f"🏆 ¡Selección {name} registrada exitosamente en FIFA!")
                    st.balloons()
                    st.rerun()
                except Exception as e:
                    st.error(f"❌ Error al registrar: {str(e)}")
            else:
                st.error("⚠️ Por favor completa los campos obligatorios (*)")

    # ============================================
    # TAB 3: EDITAR SELECCIÓN (SIN st.form())
    # ============================================
    with tab3:
        st.subheader("✏️ Editar Selección Existente")

        try:
            teams_response = supabase.table("teams").select("*").order("name").execute()
            all_teams = teams_response.data

            if all_teams:
                # Dropdown para seleccionar equipo
                team_names = {f"{t['name']} ({t['code']})": t for t in all_teams}
                selected_team_name = st.selectbox(
                    "Selecciona una selección para editar:",
                    options=list(team_names.keys()),
                    key="edit_team_select"
                )

                if selected_team_name:
                    team = team_names[selected_team_name]

                    st.info(f"Editando: **{team['name']}** (Código: {team['code']})")

                    col1, col2 = st.columns(2)

                    with col1:
                        edit_name = st.text_input("🏆 Nombre*", value=team['name'], key="edit_team_name")
                        edit_code = st.text_input("🔤 Código FIFA*", value=team['code'], max_chars=3, key="edit_team_code")

                        confederations = ["CONCACAF", "CONMEBOL", "UEFA", "CAF", "AFC", "OFC"]
                        conf_idx = confederations.index(team['confederation']) if team.get('confederation') in confederations else 0
                        edit_conf = st.selectbox(
                            "🌍 Confederación*",
                            confederations,
                            index=conf_idx,
                            key="edit_team_conf"
                        )

                        groups = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
                        group_idx = groups.index(team.get('group_letter', '')) if team.get('group_letter') in groups else 0
                        edit_group = st.selectbox(
                            "📊 Grupo",
                            groups,
                            index=group_idx,
                            key="edit_team_group"
                        )

                    with col2:
                        edit_coach = st.text_input("👨‍💼 Director técnico", value=team.get('coach_name', ''), key="edit_team_coach")
                        edit_stadium = st.text_input("🏟️ Estadio", value=team.get('stadium_home', ''), key="edit_team_stadium")
                        edit_ranking = st.number_input("🏅 Ranking FIFA", min_value=1, max_value=211, value=team.get('fifa_ranking', 1), key="edit_team_ranking")
                        edit_flag = st.text_input("🏴 URL bandera", value=team.get('flag_url', ''), key="edit_team_flag")

                    # BOTONES NORMALES - NO st.form_submit_button()
                    col_btn1, col_btn2 = st.columns(2)
                    with col_btn1:
                        update_btn = st.button("💾 GUARDAR CAMBIOS", use_container_width=True, type="primary", key="update_team_btn")
                    with col_btn2:
                        delete_btn = st.button("🗑️ ELIMINAR SELECCIÓN", use_container_width=True, key="delete_team_btn")

                    if update_btn:
                        updated_data = {
                            "name": edit_name,
                            "code": edit_code.upper(),
                            "confederation": edit_conf,
                            "group_letter": edit_group if edit_group else None,
                            "coach_name": edit_coach if edit_coach else None,
                            "stadium_home": edit_stadium if edit_stadium else None,
                            "fifa_ranking": edit_ranking if edit_ranking else None,
                            "flag_url": edit_flag if edit_flag else None
                        }

                        try:
                            supabase.table("teams").update(updated_data).eq("id", team['id']).execute()
                            st.success(f"✅ Selección {edit_name} actualizada exitosamente!")
                            st.balloons()
                            st.rerun()
                        except Exception as e:
                            st.error(f"❌ Error al actualizar: {str(e)}")

                    if delete_btn:
                        try:
                            supabase.table("teams").delete().eq("id", team['id']).execute()
                            st.success(f"🗑️ Selección {team['name']} eliminada")
                            st.rerun()
                        except Exception as e:
                            st.error(f"❌ Error al eliminar: {str(e)}")
            else:
                st.info("📭 No hay selecciones para editar. Agrega algunas primero.")

        except Exception as e:
            st.error(f"❌ Error: {str(e)}")

# ============================================
# PÁGINA: JUGADORES
# ============================================
# ============================================
# PÁGINA: JUGADORES (CÓDIGO ACTUALIZADO)
# Reemplaza la sección "elif page == "JUGADORES":" con este código
# ============================================
elif page == "JUGADORES":
    st.title("👤 Gestión de Jugadores")
    
    tab1, tab2, tab3, tab4 = st.tabs(["📋 VER JUGADORES", "➕ AGREGAR MANUAL", "✏️ EDITAR JUGADOR", "🔍 IMPORTAR TRANSFERMARKT"])
    
    with tab1:
        teams = supabase.table('teams').select('id, name, code').order('name').execute()
        
        if teams.data:
            selected_team = st.selectbox(
                "Filtrar por equipo",
                options=[t['id'] for t in teams.data],
                format_func=lambda x: next((t['name'] for t in teams.data if t['id'] == x), "")
            )
            
            # Usar la vista con edad calculada
            players = supabase.table('players_with_age').select('*').eq('team_id', selected_team).order('number').execute()
            
            if players.data:
                for player in players.data:
                    # Mostrar edad si existe
                    age_text = f" ({player['age']} años)" if player.get('age') else ""
                    nationality_flag = f" 🌍 {player.get('display_nationality', '')}" if player.get('display_nationality') else ""
                    
                    with st.expander(f"#{player['number']} - {player['name']}{age_text}{nationality_flag}"):
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            st.write(f"**Posición:** {player.get('position', 'N/A')}")
                            st.write(f"**Club:** {player.get('club', 'N/A')}")
                            st.write(f"**Nacionalidad:** {player.get('display_nationality', 'N/A')}")
                        with col2:
                            if player.get('age'):
                                st.write(f"**🎂 Edad:** {player['age']} años")
                            if player.get('birth_date'):
                                st.write(f"**Nacimiento:** {player['birth_date']}")
                            st.write(f"**Altura:** {player.get('height', 'N/A')} cm")
                        with col3:
                            st.write(f"**⚽ Goles:** {player.get('goals', 0)}")
                            st.write(f"**🎯 Asistencias:** {player.get('assists', 0)}")
                            st.write(f"**🟨 Amarillas:** {player.get('yellow_cards', 0)}")
                            st.write(f"**🟥 Rojas:** {player.get('red_cards', 0)}")
            else:
                st.info("No hay jugadores registrados para este equipo")
        else:
            st.warning("Primero debes agregar equipos")
    
    # ============================================
    # TAB 2: AGREGAR MANUAL (SIN st.form())
    # ============================================
    with tab2:
        st.subheader("➕ Agregar Nuevo Jugador")

        teams = supabase.table('teams').select('id, name, code, confederation').order('name').execute()

        if teams.data:
            # Crear diccionario de equipos para selectbox
            team_options = {f"{t['name']} ({t['code']}) - {t['confederation']}": t for t in teams.data}

            col1, col2 = st.columns(2)

            with col1:
                # EQUIPO
                selected_team_label = st.selectbox(
                    "🏆 Equipo*",
                    options=list(team_options.keys()),
                    key="add_team"
                )
                selected_team = team_options[selected_team_label]
                team_id = selected_team['id']

                st.info(f"✅ Equipo: **{selected_team['name']}** ({selected_team['code']})")

                name = st.text_input("👤 Nombre completo*", key="add_name")
                number = st.number_input("🔢 Número*", min_value=1, max_value=99, key="add_number", value=10)
                position = st.selectbox(
                    "📍 Posición*",
                    ["Portero", "Defensa", "Medio", "Delantero", "Extremo derecho", "Extremo izquierdo"],
                    key="add_position"
                )
                birth_date = st.date_input("🎂 Fecha de nacimiento", key="add_birth")

                # Calcular edad automáticamente
                if birth_date:
                    from datetime import date
                    today = date.today()
                    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                    st.success(f"🎂 Edad calculada: **{age} años**")

            with col2:
                # NACIONALIDAD - Dropdown con los mismos equipos
                nationality_label = st.selectbox(
                    "🌍 Nacionalidad*",
                    options=list(team_options.keys()),
                    help="País de origen del jugador (puede ser diferente al equipo actual)",
                    key="add_nationality"
                )
                nationality_code = team_options[nationality_label]['code']

                club = st.text_input("🏟️ Club actual", key="add_club")
                height = st.number_input("📏 Altura (cm)", min_value=150, max_value=220, value=175, key="add_height")
                weight = st.number_input("⚖️ Peso (kg)", min_value=50, max_value=120, value=70, key="add_weight")
                photo_url = st.text_input("📸 URL de la foto", key="add_photo")

            # Estadísticas
            st.markdown("### 📊 Estadísticas (Opcional)")
            col3, col4, col5, col6 = st.columns(4)
            with col3:
                goals = st.number_input("⚽ Goles", min_value=0, value=0, key="add_goals")
            with col4:
                assists = st.number_input("🎯 Asistencias", min_value=0, value=0, key="add_assists")
            with col5:
                yellow_cards = st.number_input("🟨 T. Amarillas", min_value=0, value=0, key="add_yellow")
            with col6:
                red_cards = st.number_input("🟥 T. Rojas", min_value=0, value=0, key="add_red")

            minutes_played = st.number_input("⏱️ Minutos Jugados", min_value=0, value=0, key="add_minutes")

            # BOTÓN NORMAL - NO st.form_submit_button()
            if st.button("➕ AGREGAR JUGADOR", use_container_width=True, type="primary"):
                if name and number and position:
                    try:
                        data = {
                            "team_id": team_id,
                            "name": name,
                            "number": number,
                            "position": position,
                            "nationality": nationality_code,
                            "club": club if club else None,
                            "birth_date": str(birth_date) if birth_date else None,
                            "height": height if height > 0 else None,
                            "weight": weight if weight > 0 else None,
                            "photo_url": photo_url if photo_url else None,
                            "goals": goals,
                            "assists": assists,
                            "yellow_cards": yellow_cards,
                            "red_cards": red_cards,
                            "minutes_played": minutes_played
                        }
                        supabase.table('players').insert(data).execute()
                        st.success(f"✅ Jugador {name} agregado exitosamente")
                        st.balloons()
                        st.rerun()
                    except Exception as e:
                        st.error(f"❌ Error: {str(e)}")
                else:
                    st.error("⚠️ Por favor completa los campos obligatorios (*)")
        else:
            st.warning("⚠️ Primero debes agregar equipos")

    # ============================================
    # TAB 3: EDITAR JUGADOR (SIN st.form())
    # ============================================
    with tab3:
        st.subheader("✏️ Editar Jugador Existente")

        # Obtener todos los jugadores
        try:
            players_response = supabase.table("players").select("*").order("name").execute()
            all_players = players_response.data

            if all_players:
                # Dropdown para seleccionar jugador
                player_names = {f"{p['name']} (#{p['number']})": p for p in all_players}
                selected_player_name = st.selectbox(
                    "Selecciona un jugador para editar:",
                    options=list(player_names.keys()),
                    key="edit_player_select"
                )

                if selected_player_name:
                    player = player_names[selected_player_name]

                    st.info(f"Editando: **{player['name']}** (ID: `{player['id'][:8]}...`)")

                    # Obtener equipos para dropdowns
                    teams = supabase.table('teams').select('id, name, code, confederation').order('name').execute()
                    team_options = {f"{t['name']} ({t['code']}) - {t['confederation']}": t for t in teams.data}

                    col1, col2 = st.columns(2)

                    with col1:
                        edit_name = st.text_input("Nombre Completo*", value=player['name'], key="edit_name")

                        # Dropdown de equipos - encontrar el actual
                        current_team_label = "Sin equipo"
                        if player.get('team_id'):
                            for label, team_data in team_options.items():
                                if team_data['id'] == player['team_id']:
                                    current_team_label = label
                                    break

                        team_options_list = ["Sin equipo"] + list(team_options.keys())
                        edit_team_idx = team_options_list.index(current_team_label) if current_team_label in team_options_list else 0
                        edit_team = st.selectbox(
                            "Equipo*",
                            options=team_options_list,
                            index=edit_team_idx,
                            key="edit_team"
                        )

                        # Dropdown de nacionalidad
                        current_nationality = "Sin nacionalidad"
                        if player.get('nationality'):
                            for label, team_data in team_options.items():
                                if team_data['code'] == player['nationality']:
                                    current_nationality = label
                                    break

                        nationality_options = ["Sin nacionalidad"] + list(team_options.keys())
                        edit_nat_idx = nationality_options.index(current_nationality) if current_nationality in nationality_options else 0
                        edit_nationality = st.selectbox(
                            "Nacionalidad*",
                            options=nationality_options,
                            index=edit_nat_idx,
                            key="edit_nationality"
                        )

                        positions = ["Portero", "Defensa", "Medio", "Delantero", "Extremo derecho", "Extremo izquierdo"]
                        edit_pos_idx = positions.index(player['position']) if player.get('position') in positions else 0
                        edit_position = st.selectbox(
                            "Posición*",
                            positions,
                            index=edit_pos_idx,
                            key="edit_position"
                        )

                        # Fecha de nacimiento
                        from datetime import datetime as dt
                        current_birth = dt.strptime(player['birth_date'], "%Y-%m-%d").date() if player.get('birth_date') else dt(1995, 1, 1).date()
                        edit_birth = st.date_input(
                            "Fecha de Nacimiento*",
                            value=current_birth,
                            min_value=dt(1980, 1, 1),
                            max_value=dt(2010, 12, 31),
                            key="edit_birth"
                        )

                        # Mostrar edad calculada
                        if edit_birth:
                            from datetime import date
                            today = date.today()
                            age = today.year - edit_birth.year - ((today.month, today.day) < (edit_birth.month, edit_birth.day))
                            st.success(f"🎂 Edad calculada: {age} años")

                    with col2:
                        edit_number = st.number_input("Número*", min_value=1, max_value=99, value=player.get('number', 10), key="edit_number")
                        edit_height = st.number_input("Altura (cm)", min_value=150, max_value=220, value=player.get('height', 175), key="edit_height")

                        # Fix para weight - convertir a int si es float
                        weight_value = player.get('weight', 70)
                        if weight_value is not None:
                            weight_value = int(weight_value)
                        else:
                            weight_value = 70
                        edit_weight = st.number_input("Peso (kg)", min_value=50, max_value=120, value=weight_value, key="edit_weight")

                        edit_club = st.text_input("Club Actual", value=player.get('club', ''), key="edit_club")
                        edit_photo = st.text_input("URL de Foto", value=player.get('photo_url', ''), key="edit_photo")

                    # Estadísticas
                    st.markdown("### 📊 Estadísticas")
                    col3, col4, col5, col6 = st.columns(4)
                    with col3:
                        edit_goals = st.number_input("Goles", min_value=0, value=player.get('goals', 0), key="edit_goals")
                    with col4:
                        edit_assists = st.number_input("Asistencias", min_value=0, value=player.get('assists', 0), key="edit_assists")
                    with col5:
                        edit_yellow = st.number_input("T. Amarillas", min_value=0, value=player.get('yellow_cards', 0), key="edit_yellow")
                    with col6:
                        edit_red = st.number_input("T. Rojas", min_value=0, value=player.get('red_cards', 0), key="edit_red")

                    edit_minutes = st.number_input("Minutos Jugados", min_value=0, value=player.get('minutes_played', 0), key="edit_minutes")

                    # BOTONES NORMALES - NO st.form_submit_button()
                    col_btn1, col_btn2 = st.columns(2)
                    with col_btn1:
                        update_btn = st.button("💾 GUARDAR CAMBIOS", use_container_width=True, type="primary")
                    with col_btn2:
                        delete_btn = st.button("🗑️ ELIMINAR JUGADOR", use_container_width=True)

                    if update_btn:
                        # Extraer team_id
                        new_team_id = None if edit_team == "Sin equipo" else team_options[edit_team]['id']

                        # Extraer código de nacionalidad
                        new_nationality = None if edit_nationality == "Sin nacionalidad" else team_options[edit_nationality]['code']

                        updated_data = {
                            "name": edit_name,
                            "team_id": new_team_id,
                            "nationality": new_nationality,
                            "position": edit_position,
                            "birth_date": edit_birth.strftime("%Y-%m-%d"),
                            "number": edit_number,
                            "height": edit_height,
                            "weight": edit_weight,
                            "club": edit_club if edit_club else None,
                            "photo_url": edit_photo if edit_photo else None,
                            "goals": edit_goals,
                            "assists": edit_assists,
                            "yellow_cards": edit_yellow,
                            "red_cards": edit_red,
                            "minutes_played": edit_minutes
                        }

                        try:
                            supabase.table("players").update(updated_data).eq("id", player['id']).execute()
                            st.success(f"✅ Jugador {edit_name} actualizado exitosamente!")
                            st.balloons()
                            st.rerun()
                        except Exception as e:
                            st.error(f"❌ Error al actualizar: {str(e)}")

                    if delete_btn:
                        try:
                            supabase.table("players").delete().eq("id", player['id']).execute()
                            st.success(f"🗑️ Jugador {player['name']} eliminado")
                            st.rerun()
                        except Exception as e:
                            st.error(f"❌ Error al eliminar: {str(e)}")
            else:
                st.info("📭 No hay jugadores para editar. Agrega algunos primero.")

        except Exception as e:
            st.error(f"❌ Error: {str(e)}")

    with tab4:
        # Sección de Transfermarkt
        add_transfermarkt_section()

# ============================================
# PÁGINA: PARTIDOS
# ============================================
elif page == "PARTIDOS":
    st.title("⚽ Gestión de Partidos")

    tab1, tab2, tab3 = st.tabs(["📋 VER PARTIDOS", "➕ AGREGAR PARTIDO", "✏️ EDITAR PARTIDO"])

    # ============================================
    # TAB 1: VER PARTIDOS
    # ============================================
    with tab1:
        matches = supabase.table('matches').select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)').order('match_date').execute()

        if matches.data:
            for match in matches.data:
                home = match.get('home_team', {}).get('name', 'TBD')
                away = match.get('away_team', {}).get('name', 'TBD')
                date = match.get('match_date', 'TBD')
                status = match.get('status', 'scheduled')

                status_emoji = {'scheduled': '📅', 'live': '🔴', 'finished': '✅', 'postponed': '⏸️'}

                with st.expander(f"{status_emoji.get(status, '📅')} {home} vs {away} - {date}"):
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.write(f"**Fase:** {match.get('phase', 'N/A')}")
                        st.write(f"**Estado:** {status}")
                    with col2:
                        st.write(f"**Estadio:** {match.get('stadium', 'N/A')}")
                        st.write(f"**Ciudad:** {match.get('city', 'N/A')}")
                    with col3:
                        if status == 'finished':
                            st.write(f"**Resultado:** {match.get('home_score', 0)} - {match.get('away_score', 0)}")
        else:
            st.info("📅 No hay partidos registrados")

    # ============================================
    # TAB 2: AGREGAR PARTIDO (SIN st.form())
    # ============================================
    with tab2:
        st.subheader("➕ Agregar Nuevo Partido")

        teams = supabase.table('teams').select('id, name').order('name').execute()

        if teams.data:
            team_options = {t['name']: t['id'] for t in teams.data}

            col1, col2 = st.columns(2)

            with col1:
                home_team_name = st.selectbox(
                    "🏠 Equipo Local*",
                    options=list(team_options.keys()),
                    key="add_match_home"
                )
                away_team_name = st.selectbox(
                    "✈️ Equipo Visitante*",
                    options=list(team_options.keys()),
                    key="add_match_away"
                )
                match_date = st.date_input("📅 Fecha del partido*", key="add_match_date")
                match_time = st.time_input("🕐 Hora del partido*", key="add_match_time")

            with col2:
                stadium = st.selectbox(
                    "🏟️ Estadio*",
                    ["Estadio Azteca", "Estadio Akron", "Estadio BBVA"],
                    key="add_match_stadium"
                )
                city = st.selectbox(
                    "🌆 Ciudad*",
                    ["Ciudad de México", "Guadalajara", "Monterrey"],
                    key="add_match_city"
                )
                phase = st.selectbox(
                    "🏆 Fase*",
                    ["Grupos", "Dieciseisavos", "Octavos", "Cuartos", "Semifinal", "Final"],
                    key="add_match_phase"
                )
                referee = st.text_input("👨‍⚖️ Árbitro", key="add_match_referee")

            # BOTÓN NORMAL - NO st.form_submit_button()
            if st.button("⚽ AGREGAR PARTIDO", use_container_width=True, type="primary"):
                home_team_id = team_options[home_team_name]
                away_team_id = team_options[away_team_name]

                if home_team_id != away_team_id:
                    try:
                        match_datetime = datetime.combine(match_date, match_time)
                        data = {
                            "home_team_id": home_team_id,
                            "away_team_id": away_team_id,
                            "match_date": match_datetime.isoformat(),
                            "stadium": stadium,
                            "city": city,
                            "phase": phase,
                            "referee": referee if referee else None,
                            "status": "scheduled"
                        }
                        supabase.table('matches').insert(data).execute()
                        st.success("✅ Partido agregado exitosamente")
                        st.balloons()
                        st.rerun()
                    except Exception as e:
                        st.error(f"❌ Error: {str(e)}")
                else:
                    st.error("⚠️ Los equipos deben ser diferentes")
        else:
            st.warning("⚠️ Primero debes agregar equipos")

    # ============================================
    # TAB 3: EDITAR PARTIDO (SIN st.form())
    # ============================================
    with tab3:
        st.subheader("✏️ Editar Partido Existente")

        try:
            matches_response = supabase.table('matches').select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)').order('match_date').execute()
            all_matches = matches_response.data

            if all_matches:
                # Dropdown para seleccionar partido
                match_options = {}
                for m in all_matches:
                    home = m.get('home_team', {}).get('name', 'TBD')
                    away = m.get('away_team', {}).get('name', 'TBD')
                    date = m.get('match_date', '')[:10] if m.get('match_date') else 'TBD'
                    label = f"{home} vs {away} - {date}"
                    match_options[label] = m

                selected_match_label = st.selectbox(
                    "Selecciona un partido para editar:",
                    options=list(match_options.keys()),
                    key="edit_match_select"
                )

                if selected_match_label:
                    match = match_options[selected_match_label]

                    st.info(f"Editando: **{selected_match_label}**")

                    # Obtener equipos
                    teams = supabase.table('teams').select('id, name').order('name').execute()
                    team_options = {t['name']: t['id'] for t in teams.data}
                    team_names = list(team_options.keys())

                    # Encontrar equipos actuales
                    home_current = match.get('home_team', {}).get('name', '')
                    away_current = match.get('away_team', {}).get('name', '')
                    home_idx = team_names.index(home_current) if home_current in team_names else 0
                    away_idx = team_names.index(away_current) if away_current in team_names else 0

                    col1, col2 = st.columns(2)

                    with col1:
                        edit_home = st.selectbox(
                            "🏠 Equipo Local*",
                            options=team_names,
                            index=home_idx,
                            key="edit_match_home"
                        )
                        edit_away = st.selectbox(
                            "✈️ Equipo Visitante*",
                            options=team_names,
                            index=away_idx,
                            key="edit_match_away"
                        )

                        # Fecha y hora actuales
                        from datetime import datetime as dt
                        current_datetime = dt.fromisoformat(match['match_date'].replace('Z', '+00:00')) if match.get('match_date') else dt.now()

                        edit_date = st.date_input("📅 Fecha*", value=current_datetime.date(), key="edit_match_date")
                        edit_time = st.time_input("🕐 Hora*", value=current_datetime.time(), key="edit_match_time")

                        statuses = ["scheduled", "live", "finished", "postponed"]
                        status_idx = statuses.index(match.get('status', 'scheduled'))
                        edit_status = st.selectbox(
                            "📊 Estado*",
                            statuses,
                            index=status_idx,
                            key="edit_match_status"
                        )

                    with col2:
                        stadiums = ["Estadio Azteca", "Estadio Akron", "Estadio BBVA"]
                        stadium_idx = stadiums.index(match.get('stadium')) if match.get('stadium') in stadiums else 0
                        edit_stadium = st.selectbox("🏟️ Estadio*", stadiums, index=stadium_idx, key="edit_match_stadium")

                        cities = ["Ciudad de México", "Guadalajara", "Monterrey"]
                        city_idx = cities.index(match.get('city')) if match.get('city') in cities else 0
                        edit_city = st.selectbox("🌆 Ciudad*", cities, index=city_idx, key="edit_match_city")

                        phases = ["Grupos", "Dieciseisavos", "Octavos", "Cuartos", "Semifinal", "Final"]
                        phase_idx = phases.index(match.get('phase')) if match.get('phase') in phases else 0
                        edit_phase = st.selectbox("🏆 Fase*", phases, index=phase_idx, key="edit_match_phase")

                        edit_referee = st.text_input("👨‍⚖️ Árbitro", value=match.get('referee', ''), key="edit_match_referee")

                    # Resultado (si está finished)
                    if edit_status == "finished":
                        st.markdown("### 🎯 Resultado del Partido")
                        col3, col4 = st.columns(2)
                        with col3:
                            edit_home_score = st.number_input("🏠 Goles Local", min_value=0, value=match.get('home_score', 0), key="edit_match_home_score")
                        with col4:
                            edit_away_score = st.number_input("✈️ Goles Visitante", min_value=0, value=match.get('away_score', 0), key="edit_match_away_score")

                    # BOTONES NORMALES - NO st.form_submit_button()
                    col_btn1, col_btn2 = st.columns(2)
                    with col_btn1:
                        update_btn = st.button("💾 GUARDAR CAMBIOS", use_container_width=True, type="primary", key="update_match_btn")
                    with col_btn2:
                        delete_btn = st.button("🗑️ ELIMINAR PARTIDO", use_container_width=True, key="delete_match_btn")

                    if update_btn:
                        home_id = team_options[edit_home]
                        away_id = team_options[edit_away]

                        if home_id != away_id:
                            match_datetime = datetime.combine(edit_date, edit_time)
                            updated_data = {
                                "home_team_id": home_id,
                                "away_team_id": away_id,
                                "match_date": match_datetime.isoformat(),
                                "stadium": edit_stadium,
                                "city": edit_city,
                                "phase": edit_phase,
                                "referee": edit_referee if edit_referee else None,
                                "status": edit_status
                            }

                            # Agregar scores si está finished
                            if edit_status == "finished":
                                updated_data["home_score"] = edit_home_score
                                updated_data["away_score"] = edit_away_score

                            try:
                                supabase.table("matches").update(updated_data).eq("id", match['id']).execute()
                                st.success(f"✅ Partido actualizado exitosamente!")
                                st.balloons()
                                st.rerun()
                            except Exception as e:
                                st.error(f"❌ Error al actualizar: {str(e)}")
                        else:
                            st.error("⚠️ Los equipos deben ser diferentes")

                    if delete_btn:
                        try:
                            supabase.table("matches").delete().eq("id", match['id']).execute()
                            st.success(f"🗑️ Partido eliminado")
                            st.rerun()
                        except Exception as e:
                            st.error(f"❌ Error al eliminar: {str(e)}")
            else:
                st.info("📭 No hay partidos para editar. Agrega algunos primero.")

        except Exception as e:
            st.error(f"❌ Error: {str(e)}")

# ============================================
# PÁGINA: ARTÍCULOS
# ============================================
elif page == "ARTÍCULOS":
    st.title("📰 Gestión de Artículos")

    tab1, tab2, tab3 = st.tabs(["📋 VER ARTÍCULOS", "➕ CREAR ARTÍCULO", "✏️ EDITAR ARTÍCULO"])

    # ============================================
    # TAB 1: VER ARTÍCULOS
    # ============================================
    with tab1:
        articles = supabase.table('articles').select('*').order('created_at', desc=True).execute()

        if articles.data:
            for article in articles.data:
                published = "✅" if article.get('published_at') else "📝"
                featured = "⭐" if article.get('is_featured') else ""

                with st.expander(f"{published} {featured} {article['title']}"):
                    col1, col2 = st.columns([3, 1])
                    with col1:
                        st.write(f"**Autor:** {article.get('author', 'N/A')}")
                        st.write(f"**Categoría:** {article.get('category', 'N/A')}")
                        st.write(f"**Excerpt:** {article.get('excerpt', 'N/A')}")
                        st.write(f"**Slug:** {article.get('slug', 'N/A')}")
                    with col2:
                        st.write(f"**Vistas:** {article.get('views', 0)}")
                        st.write(f"**Estado:** {'Publicado' if article.get('published_at') else 'Borrador'}")
                        st.write(f"**Destacado:** {'Sí' if article.get('is_featured') else 'No'}")
        else:
            st.info("📭 No hay artículos registrados")

    # ============================================
    # TAB 2: CREAR ARTÍCULO (SIN st.form())
    # ============================================
    with tab2:
        st.subheader("✍️ Crear Nuevo Artículo")

        col1, col2 = st.columns(2)

        with col1:
            title = st.text_input("📰 Título*", key="add_article_title")
            slug = st.text_input("🔗 Slug (URL)*", help="Ejemplo: mundial-2026-mexico", key="add_article_slug")
            author = st.text_input("✍️ Autor*", key="add_article_author")
            category = st.selectbox(
                "📁 Categoría*",
                ["Noticias", "Análisis", "Entrevistas", "Opinión", "Galería"],
                key="add_article_category"
            )

        with col2:
            cover_image_url = st.text_input("🖼️ URL imagen de portada", key="add_article_cover")
            is_featured = st.checkbox("⭐ Artículo destacado", key="add_article_featured")
            publish_now = st.checkbox("📤 Publicar inmediatamente", key="add_article_publish")

        excerpt = st.text_area("📝 Resumen (excerpt)", key="add_article_excerpt")
        content = st.text_area("📄 Contenido (Markdown)*", height=300, key="add_article_content")

        # BOTÓN NORMAL - NO st.form_submit_button()
        if st.button("📰 CREAR ARTÍCULO", use_container_width=True, type="primary"):
            if title and slug and content and author:
                try:
                    data = {
                        "title": title,
                        "slug": slug,
                        "author": author,
                        "category": category,
                        "excerpt": excerpt if excerpt else None,
                        "content": content,
                        "cover_image_url": cover_image_url if cover_image_url else None,
                        "is_featured": is_featured,
                        "published_at": datetime.now().isoformat() if publish_now else None
                    }
                    supabase.table('articles').insert(data).execute()
                    st.success("✅ Artículo creado exitosamente")
                    st.balloons()
                    st.rerun()
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")
            else:
                st.error("⚠️ Por favor completa los campos obligatorios (*)")

    # ============================================
    # TAB 3: EDITAR ARTÍCULO (SIN st.form())
    # ============================================
    with tab3:
        st.subheader("✏️ Editar Artículo Existente")

        try:
            articles_response = supabase.table('articles').select('*').order('created_at', desc=True).execute()
            all_articles = articles_response.data

            if all_articles:
                # Dropdown para seleccionar artículo
                article_options = {f"{a['title']} ({a['slug']})": a for a in all_articles}
                selected_article_label = st.selectbox(
                    "Selecciona un artículo para editar:",
                    options=list(article_options.keys()),
                    key="edit_article_select"
                )

                if selected_article_label:
                    article = article_options[selected_article_label]

                    st.info(f"Editando: **{article['title']}**")

                    col1, col2 = st.columns(2)

                    with col1:
                        edit_title = st.text_input("📰 Título*", value=article['title'], key="edit_article_title")
                        edit_slug = st.text_input("🔗 Slug*", value=article['slug'], key="edit_article_slug")
                        edit_author = st.text_input("✍️ Autor*", value=article['author'], key="edit_article_author")

                        categories = ["Noticias", "Análisis", "Entrevistas", "Opinión", "Galería"]
                        cat_idx = categories.index(article['category']) if article.get('category') in categories else 0
                        edit_category = st.selectbox(
                            "📁 Categoría*",
                            categories,
                            index=cat_idx,
                            key="edit_article_category"
                        )

                    with col2:
                        edit_cover = st.text_input("🖼️ URL imagen", value=article.get('cover_image_url', ''), key="edit_article_cover")
                        edit_featured = st.checkbox("⭐ Destacado", value=article.get('is_featured', False), key="edit_article_featured")

                        # Estado de publicación
                        is_published = bool(article.get('published_at'))
                        edit_published = st.checkbox("📤 Publicado", value=is_published, key="edit_article_published")

                        edit_views = st.number_input("👁️ Vistas", min_value=0, value=article.get('views', 0), key="edit_article_views")

                    edit_excerpt = st.text_area("📝 Excerpt", value=article.get('excerpt', ''), key="edit_article_excerpt")
                    edit_content = st.text_area("📄 Contenido*", value=article['content'], height=300, key="edit_article_content")

                    # BOTONES NORMALES - NO st.form_submit_button()
                    col_btn1, col_btn2 = st.columns(2)
                    with col_btn1:
                        update_btn = st.button("💾 GUARDAR CAMBIOS", use_container_width=True, type="primary", key="update_article_btn")
                    with col_btn2:
                        delete_btn = st.button("🗑️ ELIMINAR ARTÍCULO", use_container_width=True, key="delete_article_btn")

                    if update_btn:
                        # Determinar published_at
                        if edit_published and not is_published:
                            # Cambió de borrador a publicado
                            new_published_at = datetime.now().isoformat()
                        elif not edit_published:
                            # Cambió a borrador
                            new_published_at = None
                        else:
                            # Mantener el valor actual
                            new_published_at = article.get('published_at')

                        updated_data = {
                            "title": edit_title,
                            "slug": edit_slug,
                            "author": edit_author,
                            "category": edit_category,
                            "excerpt": edit_excerpt if edit_excerpt else None,
                            "content": edit_content,
                            "cover_image_url": edit_cover if edit_cover else None,
                            "is_featured": edit_featured,
                            "published_at": new_published_at,
                            "views": edit_views
                        }

                        try:
                            supabase.table("articles").update(updated_data).eq("id", article['id']).execute()
                            st.success(f"✅ Artículo '{edit_title}' actualizado exitosamente!")
                            st.balloons()
                            st.rerun()
                        except Exception as e:
                            st.error(f"❌ Error al actualizar: {str(e)}")

                    if delete_btn:
                        try:
                            supabase.table("articles").delete().eq("id", article['id']).execute()
                            st.success(f"🗑️ Artículo '{article['title']}' eliminado")
                            st.rerun()
                        except Exception as e:
                            st.error(f"❌ Error al eliminar: {str(e)}")
            else:
                st.info("📭 No hay artículos para editar. Crea algunos primero.")

        except Exception as e:
            st.error(f"❌ Error: {str(e)}")

# Footer FIFA
st.sidebar.markdown("---")
st.sidebar.markdown("""
<div style="background: #4A90E2; 
             padding: 15px; text-align: center;">
    <h4 style="color: #003366; margin: 0;">🏆 FIFA WORLD CUP 2026™</h4>
    <p style="color: #1a1a1a; margin: 5px 0; font-size: 0.9em;">
        <strong>SEDES MÉXICO:</strong><br>
        🏟️ CDMX • Guadalajara • Monterrey
    </p>
    <p style="color: #003366; margin: 10px 0 0 0; font-size: 0.8em;">
        🚀 Admin Panel v2.0 FIFA Style
    </p>
</div>
""", unsafe_allow_html=True)
