import streamlit as st
from supabase import create_client, Client
import os
from datetime import datetime

# ============================================
# CONFIGURACIÓN DE SUPABASE
# ============================================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    st.error("⚠️ Faltan variables de entorno: SUPABASE_URL y SUPABASE_KEY")
    st.stop()

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ============================================
# FUNCIÓN: Obtener equipos de Supabase
# ============================================
@st.cache_data(ttl=300)  # Cache por 5 minutos
def get_teams():
    """Obtiene todos los equipos de la tabla teams"""
    try:
        response = supabase.table("teams").select("id, name, code, confederation").order("name").execute()
        return response.data
    except Exception as e:
        st.error(f"Error al obtener equipos: {str(e)}")
        return []

# ============================================
# FUNCIÓN: Crear jugador en Supabase
# ============================================
def create_player(player_data):
    """Inserta un nuevo jugador en la tabla players"""
    try:
        response = supabase.table("players").insert(player_data).execute()
        return True, response.data
    except Exception as e:
        return False, str(e)

# ============================================
# INTERFAZ DE STREAMLIT
# ============================================
st.title("⚽ Admin Panel - Mundial 2026")
st.markdown("### Agregar Nuevo Jugador")

# Obtener equipos
teams = get_teams()

if not teams:
    st.warning("No hay equipos disponibles. Primero agrega equipos a la tabla 'teams'.")
    st.stop()

# Crear diccionario para el selectbox: nombre -> datos completos
team_options = {f"{team['name']} ({team['code']}) - {team['confederation']}": team for team in teams}

# ============================================
# FORMULARIO DE JUGADOR
# ============================================
with st.form("player_form"):
    st.subheader("📋 Información del Jugador")
    
    # DROPDOWN DE EQUIPOS (LO MÁS IMPORTANTE)
    selected_team_label = st.selectbox(
        "🏆 Equipo *",
        options=list(team_options.keys()),
        help="Selecciona el equipo del jugador"
    )
    
    # Obtener el team_id del equipo seleccionado
    selected_team = team_options[selected_team_label]
    team_id = selected_team['id']
    
    # Mostrar info del equipo seleccionado
    st.info(f"✅ Equipo seleccionado: **{selected_team['name']}** ({selected_team['code']}) - UUID: `{team_id[:8]}...`")
    
    # Resto de campos del formulario
    col1, col2 = st.columns(2)
    
    with col1:
        name = st.text_input("👤 Nombre Completo *", placeholder="Lionel Messi")
        number = st.number_input("🔢 Número de Camiseta *", min_value=1, max_value=99, value=10)
        position = st.selectbox(
            "📍 Posición *",
            ["Portero", "Defensa", "Mediocampista", "Delantero", "Extremo derecho", "Extremo izquierdo"]
        )
        birth_date = st.date_input("🎂 Fecha de Nacimiento")
    
    with col2:
        club = st.text_input("🏟️ Club Actual", placeholder="Inter Miami CF")
        height = st.number_input("📏 Altura (cm)", min_value=150, max_value=220, value=170)
        weight = st.number_input("⚖️ Peso (kg)", min_value=50, max_value=120, value=70)
        photo_url = st.text_input("📸 URL de Foto", placeholder="https://...")
    
    # Estadísticas (opcional)
    with st.expander("📊 Estadísticas (Opcional)"):
        col3, col4, col5 = st.columns(3)
        with col3:
            goals = st.number_input("⚽ Goles", min_value=0, value=0)
            assists = st.number_input("🎯 Asistencias", min_value=0, value=0)
        with col4:
            yellow_cards = st.number_input("🟨 Tarjetas Amarillas", min_value=0, value=0)
            red_cards = st.number_input("🟥 Tarjetas Rojas", min_value=0, value=0)
        with col5:
            minutes_played = st.number_input("⏱️ Minutos Jugados", min_value=0, value=0)
    
    # Botón de envío
    submitted = st.form_submit_button("✅ Agregar Jugador", use_container_width=True)
    
    if submitted:
        # Validaciones
        if not name:
            st.error("❌ El nombre del jugador es obligatorio")
        elif not number:
            st.error("❌ El número de camiseta es obligatorio")
        else:
            # Preparar datos para insertar
            player_data = {
                "team_id": team_id,  # 🎯 AQUÍ SE ASIGNA AUTOMÁTICAMENTE EL UUID
                "name": name,
                "number": number,
                "position": position,
                "birth_date": birth_date.isoformat() if birth_date else None,
                "height": height if height > 0 else None,
                "weight": weight if weight > 0 else None,
                "club": club if club else None,
                "photo_url": photo_url if photo_url else None,
                "goals": goals,
                "assists": assists,
                "yellow_cards": yellow_cards,
                "red_cards": red_cards,
                "minutes_played": minutes_played
            }
            
            # Insertar en Supabase
            with st.spinner("Guardando jugador..."):
                success, result = create_player(player_data)
            
            if success:
                st.success(f"✅ ¡Jugador **{name}** agregado exitosamente!")
                st.balloons()
                st.json(result)
            else:
                st.error(f"❌ Error al guardar: {result}")

# ============================================
# VISTA PREVIA DE EQUIPOS
# ============================================
st.markdown("---")
st.subheader("🏆 Equipos Disponibles")

# Mostrar tabla de equipos
if st.checkbox("Ver todos los equipos"):
    st.dataframe(
        teams,
        column_config={
            "name": "Equipo",
            "code": "Código FIFA",
            "confederation": "Confederación",
            "id": st.column_config.TextColumn("ID", width="small")
        },
        hide_index=True,
        use_container_width=True
    )
    st.caption(f"Total de equipos: {len(teams)}")

# ============================================
# INSTRUCCIONES
# ============================================
with st.expander("ℹ️ Cómo usar este panel"):
    st.markdown("""
    ### Pasos para agregar un jugador:
    
    1. **Selecciona el equipo** del dropdown (los 31 equipos clasificados)
    2. **Llena los campos obligatorios** (nombre, número, posición)
    3. **Opcionalmente** agrega foto, estadísticas, etc.
    4. Click en **"Agregar Jugador"**
    
    ### ✅ Ventajas de este formulario:
    - ✓ El `team_id` se asigna **automáticamente** al seleccionar el equipo
    - ✓ No hay errores de UUID manual
    - ✓ Validación de campos obligatorios
    - ✓ Vista previa del equipo seleccionado
    
    ### 🔧 Variables de entorno necesarias:
    ```bash
    SUPABASE_URL=tu_url_aqui
    SUPABASE_KEY=tu_key_aqui
    ```
    """)
