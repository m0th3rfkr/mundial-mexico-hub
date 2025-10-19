import streamlit as st
from supabase import create_client, Client
import os
from datetime import datetime

# Configuración de la página
st.set_page_config(
    page_title="WC2026 Admin Panel",
    page_icon="⚽",
    layout="wide"
)

# Conectar con Supabase
@st.cache_resource
def init_supabase() -> Client:
    url = os.getenv("SUPABASE_URL", "https://ksiiidnvtktlowlhtebs.supabase.co")
    key = os.getenv("SUPABASE_SERVICE_KEY", "")
    return create_client(url, key)

supabase = init_supabase()

# Sidebar para navegación
st.sidebar.title("⚽ WC2026 Admin")
st.sidebar.markdown("---")
page = st.sidebar.radio(
    "Navegación",
    ["🏠 Dashboard", "🏆 Equipos", "👤 Jugadores", "⚽ Partidos", "📰 Artículos"]
)

# ============================================
# PÁGINA: DASHBOARD
# ============================================
if page == "🏠 Dashboard":
    st.title("📊 Dashboard - Mundial 2026")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        teams_count = supabase.table('teams').select('id', count='exact').execute()
        st.metric("Equipos", teams_count.count)
    
    with col2:
        players_count = supabase.table('players').select('id', count='exact').execute()
        st.metric("Jugadores", players_count.count)
    
    with col3:
        matches_count = supabase.table('matches').select('id', count='exact').execute()
        st.metric("Partidos", matches_count.count)
    
    with col4:
        articles_count = supabase.table('articles').select('id', count='exact').execute()
        st.metric("Artículos", articles_count.count)
    
    st.markdown("---")
    st.subheader("🎯 Próximos pasos")
    st.info("""
    - ✅ Base de datos configurada
    - ✅ Admin panel funcional
    - 📝 Agregar más equipos y jugadores
    - 📝 Cargar calendario completo de partidos
    - 📝 Crear contenido editorial
    """)

# ============================================
# PÁGINA: EQUIPOS
# ============================================
elif page == "🏆 Equipos":
    st.title("🏆 Gestión de Equipos")
    
    tab1, tab2 = st.tabs(["📋 Ver Equipos", "➕ Agregar Equipo"])
    
    with tab1:
        teams = supabase.table('teams').select('*').order('name').execute()
        
        if teams.data:
            for team in teams.data:
                with st.expander(f"{team['name']} ({team['code']})"):
                    col1, col2 = st.columns(2)
                    with col1:
                        st.write(f"**Confederación:** {team.get('confederation', 'N/A')}")
                        st.write(f"**Grupo:** {team.get('group_letter', 'N/A')}")
                        st.write(f"**Ranking FIFA:** {team.get('fifa_ranking', 'N/A')}")
                    with col2:
                        st.write(f"**Entrenador:** {team.get('coach_name', 'N/A')}")
                        st.write(f"**Estadio:** {team.get('stadium_home', 'N/A')}")
        else:
            st.info("No hay equipos registrados")
    
    with tab2:
        with st.form("add_team"):
            st.subheader("Agregar Nuevo Equipo")
            
            col1, col2 = st.columns(2)
            
            with col1:
                name = st.text_input("Nombre del equipo*")
                code = st.text_input("Código FIFA (3 letras)*", max_chars=3)
                confederation = st.selectbox(
                    "Confederación*",
                    ["CONCACAF", "CONMEBOL", "UEFA", "CAF", "AFC", "OFC"]
                )
                group_letter = st.selectbox(
                    "Grupo",
                    ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
                )
            
            with col2:
                coach_name = st.text_input("Nombre del entrenador")
                stadium_home = st.text_input("Estadio local")
                fifa_ranking = st.number_input("Ranking FIFA", min_value=1, max_value=211)
                flag_url = st.text_input("URL de la bandera")
            
            submitted = st.form_submit_button("➕ Agregar Equipo")
            
            if submitted:
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
                        st.success(f"✅ Equipo {name} agregado exitosamente")
                        st.rerun()
                    except Exception as e:
                        st.error(f"Error: {str(e)}")
                else:
                    st.error("Por favor completa los campos obligatorios (*)")

# ============================================
# PÁGINA: JUGADORES
# ============================================
elif page == "👤 Jugadores":
    st.title("👤 Gestión de Jugadores")
    
    tab1, tab2 = st.tabs(["📋 Ver Jugadores", "➕ Agregar Jugador"])
    
    with tab1:
        teams = supabase.table('teams').select('id, name, code').order('name').execute()
        
        if teams.data:
            selected_team = st.selectbox(
                "Filtrar por equipo",
                options=[t['id'] for t in teams.data],
                format_func=lambda x: next((t['name'] for t in teams.data if t['id'] == x), "")
            )
            
            players = supabase.table('players').select('*').eq('team_id', selected_team).order('number').execute()
            
            if players.data:
                for player in players.data:
                    with st.expander(f"#{player['number']} - {player['name']}"):
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            st.write(f"**Posición:** {player.get('position', 'N/A')}")
                            st.write(f"**Club:** {player.get('club', 'N/A')}")
                        with col2:
                            st.write(f"**Goles:** {player.get('goals', 0)}")
                            st.write(f"**Asistencias:** {player.get('assists', 0)}")
                        with col3:
                            st.write(f"**🟨 Amarillas:** {player.get('yellow_cards', 0)}")
                            st.write(f"**🟥 Rojas:** {player.get('red_cards', 0)}")
            else:
                st.info("No hay jugadores registrados para este equipo")
        else:
            st.warning("Primero debes agregar equipos")
    
    with tab2:
        teams = supabase.table('teams').select('id, name').order('name').execute()
        
        if teams.data:
            with st.form("add_player"):
                st.subheader("Agregar Nuevo Jugador")
                
                team_id = st.selectbox(
                    "Equipo*",
                    options=[t['id'] for t in teams.data],
                    format_func=lambda x: next((t['name'] for t in teams.data if t['id'] == x), "")
                )
                
                col1, col2 = st.columns(2)
                
                with col1:
                    name = st.text_input("Nombre completo*")
                    number = st.number_input("Número*", min_value=1, max_value=99)
                    position = st.selectbox("Posición*", ["Portero", "Defensa", "Medio", "Delantero"])
                    club = st.text_input("Club actual")
                
                with col2:
                    birth_date = st.date_input("Fecha de nacimiento")
                    height = st.number_input("Altura (cm)", min_value=150, max_value=220)
                    weight = st.number_input("Peso (kg)", min_value=50, max_value=120)
                    photo_url = st.text_input("URL de la foto")
                
                submitted = st.form_submit_button("➕ Agregar Jugador")
                
                if submitted:
                    if name and number and position:
                        try:
                            data = {
                                "team_id": team_id,
                                "name": name,
                                "number": number,
                                "position": position,
                                "club": club if club else None,
                                "birth_date": str(birth_date) if birth_date else None,
                                "height": height if height else None,
                                "weight": weight if weight else None,
                                "photo_url": photo_url if photo_url else None
                            }
                            supabase.table('players').insert(data).execute()
                            st.success(f"✅ Jugador {name} agregado exitosamente")
                            st.rerun()
                        except Exception as e:
                            st.error(f"Error: {str(e)}")
                    else:
                        st.error("Por favor completa los campos obligatorios (*)")
        else:
            st.warning("Primero debes agregar equipos")

# ============================================
# PÁGINA: PARTIDOS
# ============================================
elif page == "⚽ Partidos":
    st.title("⚽ Gestión de Partidos")
    
    tab1, tab2 = st.tabs(["📋 Ver Partidos", "➕ Agregar Partido"])
    
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
            st.info("No hay partidos registrados")
    
    with tab2:
        teams = supabase.table('teams').select('id, name').order('name').execute()
        
        if teams.data:
            with st.form("add_match"):
                st.subheader("Agregar Nuevo Partido")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    home_team_id = st.selectbox(
                        "Equipo Local*",
                        options=[t['id'] for t in teams.data],
                        format_func=lambda x: next((t['name'] for t in teams.data if t['id'] == x), "")
                    )
                    away_team_id = st.selectbox(
                        "Equipo Visitante*",
                        options=[t['id'] for t in teams.data],
                        format_func=lambda x: next((t['name'] for t in teams.data if t['id'] == x), "")
                    )
                    match_date = st.date_input("Fecha del partido*")
                    match_time = st.time_input("Hora del partido*")
                
                with col2:
                    stadium = st.selectbox("Estadio*", ["Estadio Azteca", "Estadio Akron", "Estadio BBVA"])
                    city = st.selectbox("Ciudad*", ["Ciudad de México", "Guadalajara", "Monterrey"])
                    phase = st.selectbox("Fase*", ["Grupos", "Dieciseisavos", "Octavos", "Cuartos", "Semifinal", "Final"])
                
                submitted = st.form_submit_button("➕ Agregar Partido")
                
                if submitted:
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
                                "status": "scheduled"
                            }
                            supabase.table('matches').insert(data).execute()
                            st.success("✅ Partido agregado exitosamente")
                            st.rerun()
                        except Exception as e:
                            st.error(f"Error: {str(e)}")
                    else:
                        st.error("Los equipos deben ser diferentes")
        else:
            st.warning("Primero debes agregar equipos")

# ============================================
# PÁGINA: ARTÍCULOS
# ============================================
elif page == "📰 Artículos":
    st.title("📰 Gestión de Artículos")
    
    tab1, tab2 = st.tabs(["📋 Ver Artículos", "➕ Crear Artículo"])
    
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
                    with col2:
                        st.write(f"**Vistas:** {article.get('views', 0)}")
                        st.write(f"**Estado:** {'Publicado' if article.get('published_at') else 'Borrador'}")
        else:
            st.info("No hay artículos registrados")
    
    with tab2:
        with st.form("add_article"):
            st.subheader("Crear Nuevo Artículo")
            
            title = st.text_input("Título*")
            slug = st.text_input("Slug (URL)*", help="Ejemplo: mundial-2026-mexico")
            author = st.text_input("Autor*")
            category = st.selectbox("Categoría*", ["Noticias", "Análisis", "Entrevistas", "Opinión", "Galería"])
            excerpt = st.text_area("Resumen (excerpt)")
            content = st.text_area("Contenido (Markdown)*", height=300)
            
            col1, col2 = st.columns(2)
            with col1:
                cover_image_url = st.text_input("URL imagen de portada")
                is_featured = st.checkbox("Artículo destacado")
            with col2:
                publish_now = st.checkbox("Publicar inmediatamente")
            
            submitted = st.form_submit_button("📝 Crear Artículo")
            
            if submitted:
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
                        st.rerun()
                    except Exception as e:
                        st.error(f"Error: {str(e)}")
                else:
                    st.error("Por favor completa los campos obligatorios (*)")

# Footer
st.sidebar.markdown("---")
st.sidebar.markdown("### 🏆 Mundial 2026")
st.sidebar.markdown("**Sedes en México:**")
st.sidebar.markdown("- 🏟️ CDMX (5 partidos)")
st.sidebar.markdown("- 🏟️ Guadalajara (4 partidos)")
st.sidebar.markdown("- 🏟️ Monterrey (4 partidos)")
st.sidebar.markdown("")
st.sidebar.info("🚀 Admin Panel v1.0")
