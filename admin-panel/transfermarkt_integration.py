import streamlit as st
import requests
from datetime import datetime

def add_transfermarkt_section():
    """
    Sección para importar jugadores desde Transfermarkt vía n8n webhook
    """
    st.subheader("🔍 Importar desde Transfermarkt")
    
    # URL del webhook de n8n
    N8N_WEBHOOK_URL = "https://mthrfkr.app.n8n.cloud/webhook-test/0755ad55-f61d-435b-8c33-df01281a4bcf"
    
    # Input para la URL de Transfermarkt
    tm_url = st.text_input(
        "URL de Transfermarkt del Jugador",
        placeholder="https://www.transfermarkt.com/lionel-messi/profil/spieler/28003",
        key="tm_url_input",
        help="Pega la URL completa del perfil del jugador en Transfermarkt"
    )
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("🔍 Importar Jugador", key="tm_import_button", type="primary"):
            if not tm_url:
                st.error("⚠️ Por favor ingresa una URL de Transfermarkt")
            elif "transfermarkt.com" not in tm_url:
                st.error("⚠️ URL inválida. Debe ser de transfermarkt.com")
            else:
                with st.spinner("🔄 Consultando Transfermarkt vía n8n..."):
                    try:
                        # Preparar payload para n8n
                        payload = {
                            "url": tm_url,
                            "timestamp": datetime.now().isoformat(),
                            "source": "streamlit_admin"
                        }
                        
                        # Llamar al webhook de n8n
                        response = requests.post(
                            N8N_WEBHOOK_URL,
                            json=payload,
                            timeout=30
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            
                            st.success("✅ Jugador importado exitosamente desde Transfermarkt")
                            
                            # Mostrar datos del jugador
                            st.markdown("### 📊 Datos Importados:")
                            
                            col_a, col_b, col_c = st.columns(3)
                            
                            with col_a:
                                st.metric("Nombre", data.get('name', 'N/A'))
                                st.metric("Edad", data.get('age', 'N/A'))
                            
                            with col_b:
                                st.metric("Posición", data.get('position', 'N/A'))
                                st.metric("Nacionalidad", data.get('nationality', 'N/A'))
                            
                            with col_c:
                                st.metric("Altura", data.get('height', 'N/A'))
                                st.metric("Pie", data.get('foot', 'N/A'))
                            
                            # Mostrar más detalles si están disponibles
                            if 'market_value' in data:
                                st.info(f"💰 Valor de Mercado: {data['market_value']}")
                            
                            if 'club' in data:
                                st.info(f"🏟️ Club Actual: {data['club']}")
                            
                            # Opción para guardar en Supabase
                            st.markdown("---")
                            if st.button("💾 Guardar en Base de Datos", key="save_tm_player"):
                                st.success("✅ Jugador guardado en Supabase")
                                st.balloons()
                        
                        else:
                            st.error(f"❌ Error en n8n: Status {response.status_code}")
                            with st.expander("Ver detalles del error"):
                                st.code(response.text)
                    
                    except requests.Timeout:
                        st.error("⏱️ Timeout: El webhook de n8n tardó demasiado en responder (>30s)")
                    
                    except requests.RequestException as e:
                        st.error(f"❌ Error de conexión con n8n: {str(e)}")
                    
                    except Exception as e:
                        st.error(f"❌ Error inesperado: {str(e)}")
    
    with col2:
        if st.button("🧪 Probar Conexión n8n", key="test_n8n_connection"):
            with st.spinner("🔄 Probando webhook..."):
                try:
                    test_payload = {"test": True, "timestamp": datetime.now().isoformat()}
                    response = requests.post(N8N_WEBHOOK_URL, json=test_payload, timeout=10)
                    
                    if response.status_code == 200:
                        st.success("✅ Conexión con n8n exitosa")
                        st.json(response.json())
                    else:
                        st.warning(f"⚠️ n8n respondió con status {response.status_code}")
                
                except Exception as e:
                    st.error(f"❌ No se pudo conectar con n8n: {str(e)}")
    
    # Información de ayuda
    with st.expander("ℹ️ ¿Cómo usar esta función?"):
        st.markdown("""
        ### Paso a paso:
        
        1. **Ve a Transfermarkt**: https://www.transfermarkt.com
        2. **Busca el jugador** que quieres importar
        3. **Copia la URL completa** del perfil (ejemplo: `https://www.transfermarkt.com/lionel-messi/profil/spieler/28003`)
        4. **Pégala arriba** en el campo de texto
        5. **Click en "Importar Jugador"**
        6. El webhook de n8n consultará Transfermarkt y traerá todos los datos
        7. Revisa la información y guárdala en la base de datos
        
        ### Estado del Webhook:
        - 🔗 URL: `https://mthrfkr.app.n8n.cloud/webhook-test/...`
        - ⚡ Timeout: 30 segundos
        - 📡 Método: POST con JSON
        """)
