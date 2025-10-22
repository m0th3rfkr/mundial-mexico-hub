import streamlit as st
from supabase import create_client, Client
import os
from datetime import datetime

def add_transfermarkt_section():
    """
    Sección para importar jugadores desde Transfermarkt
    """
    st.subheader("🔍 Importar desde Transfermarkt")
    st.info("🔄 Próximamente: Importación automática desde Transfermarkt API")
    
    tm_url = st.text_input(
        "URL de Transfermarkt",
        placeholder="https://www.transfermarkt.com/lionel-messi/profil/spieler/28003",
        key="tm_url_input"
    )
    
    if st.button("🔍 Importar Jugador", key="tm_import_button"):
        st.warning("⚠️ Feature en desarrollo. Por ahora usa el formulario manual.")
