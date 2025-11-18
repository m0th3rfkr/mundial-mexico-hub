export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string | null
          category: string | null
          content: string
          cover_image_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          slug: string
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug: string
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      corredores_turisticos: {
        Row: {
          activo: boolean | null
          color_hex: string | null
          created_at: string | null
          descripcion: string | null
          descripcion_corta: string | null
          destacado: boolean | null
          icono: string | null
          id: string
          imagen_portada_url: string | null
          latitud: number | null
          longitud: number | null
          nombre: string
          numero_corredor: number
          orden: number | null
          slug: string
          updated_at: string | null
          zoom_level: number | null
        }
        Insert: {
          activo?: boolean | null
          color_hex?: string | null
          created_at?: string | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          icono?: string | null
          id?: string
          imagen_portada_url?: string | null
          latitud?: number | null
          longitud?: number | null
          nombre: string
          numero_corredor: number
          orden?: number | null
          slug: string
          updated_at?: string | null
          zoom_level?: number | null
        }
        Update: {
          activo?: boolean | null
          color_hex?: string | null
          created_at?: string | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          icono?: string | null
          id?: string
          imagen_portada_url?: string | null
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          numero_corredor?: number
          orden?: number | null
          slug?: string
          updated_at?: string | null
          zoom_level?: number | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      estacionamientos: {
        Row: {
          abierto_24_horas: boolean | null
          accesible_silla_ruedas: boolean | null
          acepta_autos: boolean | null
          acepta_camionetas: boolean | null
          acepta_efectivo: boolean | null
          acepta_motos: boolean | null
          acepta_tarjetas: boolean | null
          activo: boolean | null
          alcaldia: string | null
          altura_maxima_metros: number | null
          camaras_seguridad: boolean | null
          capacidad_total: number | null
          codigo_postal: string | null
          corredor_id: string
          created_at: string | null
          descripcion: string | null
          descripcion_corta: string | null
          destacado: boolean | null
          direccion: string | null
          email: string | null
          espacios_discapacitados: number | null
          espacios_disponibles: number | null
          horarios: Json | null
          id: string
          imagen_principal_url: string | null
          imagenes_galeria: Json | null
          latitud: number
          lavado_autos: boolean | null
          longitud: number
          nombre: string
          numero_reviews: number | null
          operador: string | null
          orden: number | null
          primer_hora_gratis: boolean | null
          rating: number | null
          sitio_web: string | null
          tarifas: Json | null
          techado: boolean | null
          telefono: string | null
          tipo: string | null
          updated_at: string | null
          valet_parking: boolean | null
          vigilancia_24h: boolean | null
        }
        Insert: {
          abierto_24_horas?: boolean | null
          accesible_silla_ruedas?: boolean | null
          acepta_autos?: boolean | null
          acepta_camionetas?: boolean | null
          acepta_efectivo?: boolean | null
          acepta_motos?: boolean | null
          acepta_tarjetas?: boolean | null
          activo?: boolean | null
          alcaldia?: string | null
          altura_maxima_metros?: number | null
          camaras_seguridad?: boolean | null
          capacidad_total?: number | null
          codigo_postal?: string | null
          corredor_id: string
          created_at?: string | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          direccion?: string | null
          email?: string | null
          espacios_discapacitados?: number | null
          espacios_disponibles?: number | null
          horarios?: Json | null
          id?: string
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud: number
          lavado_autos?: boolean | null
          longitud: number
          nombre: string
          numero_reviews?: number | null
          operador?: string | null
          orden?: number | null
          primer_hora_gratis?: boolean | null
          rating?: number | null
          sitio_web?: string | null
          tarifas?: Json | null
          techado?: boolean | null
          telefono?: string | null
          tipo?: string | null
          updated_at?: string | null
          valet_parking?: boolean | null
          vigilancia_24h?: boolean | null
        }
        Update: {
          abierto_24_horas?: boolean | null
          accesible_silla_ruedas?: boolean | null
          acepta_autos?: boolean | null
          acepta_camionetas?: boolean | null
          acepta_efectivo?: boolean | null
          acepta_motos?: boolean | null
          acepta_tarjetas?: boolean | null
          activo?: boolean | null
          alcaldia?: string | null
          altura_maxima_metros?: number | null
          camaras_seguridad?: boolean | null
          capacidad_total?: number | null
          codigo_postal?: string | null
          corredor_id?: string
          created_at?: string | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          direccion?: string | null
          email?: string | null
          espacios_discapacitados?: number | null
          espacios_disponibles?: number | null
          horarios?: Json | null
          id?: string
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud?: number
          lavado_autos?: boolean | null
          longitud?: number
          nombre?: string
          numero_reviews?: number | null
          operador?: string | null
          orden?: number | null
          primer_hora_gratis?: boolean | null
          rating?: number | null
          sitio_web?: string | null
          tarifas?: Json | null
          techado?: boolean | null
          telefono?: string | null
          tipo?: string | null
          updated_at?: string | null
          valet_parking?: boolean | null
          vigilancia_24h?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "estacionamientos_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "corredores_turisticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estacionamientos_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "vista_resumen_corredores"
            referencedColumns: ["id"]
          },
        ]
      }
      estaciones_ecobici: {
        Row: {
          accesible_silla_ruedas: boolean | null
          activa: boolean | null
          alcaldia: string | null
          bicicletas_disponibles: number | null
          capacidad_total: number
          codigo_postal: string | null
          corredor_id: string
          created_at: string | null
          descripcion: string | null
          destacado: boolean | null
          direccion: string | null
          disponible_24_horas: boolean | null
          en_mantenimiento: boolean | null
          espacios_vacios: number | null
          fecha_ultimo_mantenimiento: string | null
          horarios: Json | null
          id: string
          iluminada: boolean | null
          imagen_principal_url: string | null
          imagenes_galeria: Json | null
          latitud: number
          longitud: number
          nombre: string
          numero_estacion: string | null
          orden: number | null
          rampas_disponibles: boolean | null
          referencias: string | null
          techada: boolean | null
          tiene_bomba_aire: boolean | null
          tiene_kit_reparacion: boolean | null
          tipo_estacion: string | null
          ultima_actualizacion: string | null
          updated_at: string | null
        }
        Insert: {
          accesible_silla_ruedas?: boolean | null
          activa?: boolean | null
          alcaldia?: string | null
          bicicletas_disponibles?: number | null
          capacidad_total: number
          codigo_postal?: string | null
          corredor_id: string
          created_at?: string | null
          descripcion?: string | null
          destacado?: boolean | null
          direccion?: string | null
          disponible_24_horas?: boolean | null
          en_mantenimiento?: boolean | null
          espacios_vacios?: number | null
          fecha_ultimo_mantenimiento?: string | null
          horarios?: Json | null
          id?: string
          iluminada?: boolean | null
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud: number
          longitud: number
          nombre: string
          numero_estacion?: string | null
          orden?: number | null
          rampas_disponibles?: boolean | null
          referencias?: string | null
          techada?: boolean | null
          tiene_bomba_aire?: boolean | null
          tiene_kit_reparacion?: boolean | null
          tipo_estacion?: string | null
          ultima_actualizacion?: string | null
          updated_at?: string | null
        }
        Update: {
          accesible_silla_ruedas?: boolean | null
          activa?: boolean | null
          alcaldia?: string | null
          bicicletas_disponibles?: number | null
          capacidad_total?: number
          codigo_postal?: string | null
          corredor_id?: string
          created_at?: string | null
          descripcion?: string | null
          destacado?: boolean | null
          direccion?: string | null
          disponible_24_horas?: boolean | null
          en_mantenimiento?: boolean | null
          espacios_vacios?: number | null
          fecha_ultimo_mantenimiento?: string | null
          horarios?: Json | null
          id?: string
          iluminada?: boolean | null
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud?: number
          longitud?: number
          nombre?: string
          numero_estacion?: string | null
          orden?: number | null
          rampas_disponibles?: boolean | null
          referencias?: string | null
          techada?: boolean | null
          tiene_bomba_aire?: boolean | null
          tiene_kit_reparacion?: boolean | null
          tipo_estacion?: string | null
          ultima_actualizacion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estaciones_ecobici_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "corredores_turisticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estaciones_ecobici_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "vista_resumen_corredores"
            referencedColumns: ["id"]
          },
        ]
      }
      hoteles: {
        Row: {
          accesible_silla_ruedas: boolean | null
          acepta_efectivo: boolean | null
          acepta_mascotas: boolean | null
          acepta_tarjetas: boolean | null
          activo: boolean | null
          alberca: boolean | null
          alcaldia: string | null
          ascensores: boolean | null
          bar: boolean | null
          booking_url: string | null
          cadena: string | null
          categoria_estrellas: number | null
          centro_negocios: boolean | null
          certificaciones: Json | null
          checkin_24_horas: boolean | null
          codigo_postal: string | null
          corredor_id: string
          created_at: string | null
          desayuno_incluido: boolean | null
          descripcion: string | null
          descripcion_corta: string | null
          destacado: boolean | null
          direccion: string | null
          edad_minima_checkin: number | null
          email: string | null
          estacionamiento: boolean | null
          estacionamiento_gratis: boolean | null
          gimnasio: boolean | null
          habitaciones_accesibles: number | null
          hora_checkin: string | null
          hora_checkout: string | null
          id: string
          imagen_principal_url: string | null
          imagenes_galeria: Json | null
          latitud: number
          longitud: number
          nombre: string
          numero_habitaciones: number | null
          numero_reviews: number | null
          orden: number | null
          politica_cancelacion: string | null
          precio_promedio_noche: Json | null
          premios: Json | null
          rango_precios: string | null
          rating: number | null
          rating_limpieza: number | null
          rating_precio_calidad: number | null
          rating_servicio: number | null
          rating_ubicacion: number | null
          recomendado_familias: boolean | null
          recomendado_negocios: boolean | null
          recomendado_parejas: boolean | null
          restaurante: boolean | null
          room_service: boolean | null
          salas_reuniones: boolean | null
          servicio_lavanderia: boolean | null
          sitio_web: string | null
          spa: boolean | null
          tarjetas_aceptadas: Json | null
          telefono: string | null
          telefono_reservaciones: string | null
          tipo_alojamiento: string | null
          tipos_habitaciones: Json | null
          updated_at: string | null
          video_tour_url: string | null
          wifi_gratis: boolean | null
        }
        Insert: {
          accesible_silla_ruedas?: boolean | null
          acepta_efectivo?: boolean | null
          acepta_mascotas?: boolean | null
          acepta_tarjetas?: boolean | null
          activo?: boolean | null
          alberca?: boolean | null
          alcaldia?: string | null
          ascensores?: boolean | null
          bar?: boolean | null
          booking_url?: string | null
          cadena?: string | null
          categoria_estrellas?: number | null
          centro_negocios?: boolean | null
          certificaciones?: Json | null
          checkin_24_horas?: boolean | null
          codigo_postal?: string | null
          corredor_id: string
          created_at?: string | null
          desayuno_incluido?: boolean | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          direccion?: string | null
          edad_minima_checkin?: number | null
          email?: string | null
          estacionamiento?: boolean | null
          estacionamiento_gratis?: boolean | null
          gimnasio?: boolean | null
          habitaciones_accesibles?: number | null
          hora_checkin?: string | null
          hora_checkout?: string | null
          id?: string
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud: number
          longitud: number
          nombre: string
          numero_habitaciones?: number | null
          numero_reviews?: number | null
          orden?: number | null
          politica_cancelacion?: string | null
          precio_promedio_noche?: Json | null
          premios?: Json | null
          rango_precios?: string | null
          rating?: number | null
          rating_limpieza?: number | null
          rating_precio_calidad?: number | null
          rating_servicio?: number | null
          rating_ubicacion?: number | null
          recomendado_familias?: boolean | null
          recomendado_negocios?: boolean | null
          recomendado_parejas?: boolean | null
          restaurante?: boolean | null
          room_service?: boolean | null
          salas_reuniones?: boolean | null
          servicio_lavanderia?: boolean | null
          sitio_web?: string | null
          spa?: boolean | null
          tarjetas_aceptadas?: Json | null
          telefono?: string | null
          telefono_reservaciones?: string | null
          tipo_alojamiento?: string | null
          tipos_habitaciones?: Json | null
          updated_at?: string | null
          video_tour_url?: string | null
          wifi_gratis?: boolean | null
        }
        Update: {
          accesible_silla_ruedas?: boolean | null
          acepta_efectivo?: boolean | null
          acepta_mascotas?: boolean | null
          acepta_tarjetas?: boolean | null
          activo?: boolean | null
          alberca?: boolean | null
          alcaldia?: string | null
          ascensores?: boolean | null
          bar?: boolean | null
          booking_url?: string | null
          cadena?: string | null
          categoria_estrellas?: number | null
          centro_negocios?: boolean | null
          certificaciones?: Json | null
          checkin_24_horas?: boolean | null
          codigo_postal?: string | null
          corredor_id?: string
          created_at?: string | null
          desayuno_incluido?: boolean | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          direccion?: string | null
          edad_minima_checkin?: number | null
          email?: string | null
          estacionamiento?: boolean | null
          estacionamiento_gratis?: boolean | null
          gimnasio?: boolean | null
          habitaciones_accesibles?: number | null
          hora_checkin?: string | null
          hora_checkout?: string | null
          id?: string
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud?: number
          longitud?: number
          nombre?: string
          numero_habitaciones?: number | null
          numero_reviews?: number | null
          orden?: number | null
          politica_cancelacion?: string | null
          precio_promedio_noche?: Json | null
          premios?: Json | null
          rango_precios?: string | null
          rating?: number | null
          rating_limpieza?: number | null
          rating_precio_calidad?: number | null
          rating_servicio?: number | null
          rating_ubicacion?: number | null
          recomendado_familias?: boolean | null
          recomendado_negocios?: boolean | null
          recomendado_parejas?: boolean | null
          restaurante?: boolean | null
          room_service?: boolean | null
          salas_reuniones?: boolean | null
          servicio_lavanderia?: boolean | null
          sitio_web?: string | null
          spa?: boolean | null
          tarjetas_aceptadas?: Json | null
          telefono?: string | null
          telefono_reservaciones?: string | null
          tipo_alojamiento?: string | null
          tipos_habitaciones?: Json | null
          updated_at?: string | null
          video_tour_url?: string | null
          wifi_gratis?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hoteles_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "corredores_turisticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hoteles_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "vista_resumen_corredores"
            referencedColumns: ["id"]
          },
        ]
      }
      imperdibles: {
        Row: {
          corredor_id: string | null
          created_at: string | null
          descripcion: string | null
          direccion: string | null
          horario: string | null
          id: string
          latitud: number | null
          longitud: number | null
          nombre: string
        }
        Insert: {
          corredor_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          horario?: string | null
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre: string
        }
        Update: {
          corredor_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          horario?: string | null
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "imperdibles_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "corredores_turisticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imperdibles_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "vista_resumen_corredores"
            referencedColumns: ["id"]
          },
        ]
      }
      imperdibles_turisticos: {
        Row: {
          accesible_silla_ruedas: boolean | null
          activo: boolean | null
          alcaldia: string | null
          codigo_postal: string | null
          corredor_id: string
          created_at: string | null
          descripcion: string | null
          descripcion_corta: string | null
          destacado: boolean | null
          direccion: string | null
          email: string | null
          estacionamiento_disponible: boolean | null
          guias_disponibles: boolean | null
          historia: string | null
          horarios: Json | null
          id: string
          imagen_principal_url: string | null
          imagenes_galeria: Json | null
          latitud: number
          longitud: number
          nombre: string
          numero_reviews: number | null
          orden: number | null
          popularidad: number | null
          precio_entrada: Json | null
          rating: number | null
          sitio_web: string | null
          telefono: string | null
          tiempo_visita_minutos: number | null
          tipo: string | null
          updated_at: string | null
          wifi_disponible: boolean | null
        }
        Insert: {
          accesible_silla_ruedas?: boolean | null
          activo?: boolean | null
          alcaldia?: string | null
          codigo_postal?: string | null
          corredor_id: string
          created_at?: string | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          direccion?: string | null
          email?: string | null
          estacionamiento_disponible?: boolean | null
          guias_disponibles?: boolean | null
          historia?: string | null
          horarios?: Json | null
          id?: string
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud: number
          longitud: number
          nombre: string
          numero_reviews?: number | null
          orden?: number | null
          popularidad?: number | null
          precio_entrada?: Json | null
          rating?: number | null
          sitio_web?: string | null
          telefono?: string | null
          tiempo_visita_minutos?: number | null
          tipo?: string | null
          updated_at?: string | null
          wifi_disponible?: boolean | null
        }
        Update: {
          accesible_silla_ruedas?: boolean | null
          activo?: boolean | null
          alcaldia?: string | null
          codigo_postal?: string | null
          corredor_id?: string
          created_at?: string | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          direccion?: string | null
          email?: string | null
          estacionamiento_disponible?: boolean | null
          guias_disponibles?: boolean | null
          historia?: string | null
          horarios?: Json | null
          id?: string
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud?: number
          longitud?: number
          nombre?: string
          numero_reviews?: number | null
          orden?: number | null
          popularidad?: number | null
          precio_entrada?: Json | null
          rating?: number | null
          sitio_web?: string | null
          telefono?: string | null
          tiempo_visita_minutos?: number | null
          tipo?: string | null
          updated_at?: string | null
          wifi_disponible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "imperdibles_turisticos_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "corredores_turisticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imperdibles_turisticos_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "vista_resumen_corredores"
            referencedColumns: ["id"]
          },
        ]
      }
      match_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          extra_time: number | null
          id: string
          match_id: string | null
          minute: number
          player_id: string | null
          team_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          extra_time?: number | null
          id?: string
          match_id?: string | null
          minute: number
          player_id?: string | null
          team_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          extra_time?: number | null
          id?: string
          match_id?: string | null
          minute?: number
          player_id?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_with_age"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          attendance: number | null
          away_penalties: number | null
          away_score: number | null
          away_team_id: string | null
          city: string
          created_at: string | null
          home_penalties: number | null
          home_score: number | null
          home_team_id: string | null
          id: string
          match_date: string
          phase: string
          referee: string | null
          stadium: string
          status: string | null
          updated_at: string | null
          weather: string | null
        }
        Insert: {
          attendance?: number | null
          away_penalties?: number | null
          away_score?: number | null
          away_team_id?: string | null
          city: string
          created_at?: string | null
          home_penalties?: number | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          match_date: string
          phase: string
          referee?: string | null
          stadium: string
          status?: string | null
          updated_at?: string | null
          weather?: string | null
        }
        Update: {
          attendance?: number | null
          away_penalties?: number | null
          away_score?: number | null
          away_team_id?: string | null
          city?: string
          created_at?: string | null
          home_penalties?: number | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          match_date?: string
          phase?: string
          referee?: string | null
          stadium?: string
          status?: string | null
          updated_at?: string | null
          weather?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string | null
          categories: string[] | null
          content: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          link: string
          published_at: string
          source: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          author?: string | null
          categories?: string[] | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          link: string
          published_at: string
          source?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          author?: string | null
          categories?: string[] | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          link?: string
          published_at?: string
          source?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      players: {
        Row: {
          assists: number | null
          birth_date: string | null
          club: string | null
          created_at: string | null
          goals: number | null
          height: number | null
          id: string
          minutes_played: number | null
          name: string
          nationality: string | null
          number: number | null
          photo_url: string | null
          position: string | null
          red_cards: number | null
          team_id: string | null
          updated_at: string | null
          weight: number | null
          yellow_cards: number | null
        }
        Insert: {
          assists?: number | null
          birth_date?: string | null
          club?: string | null
          created_at?: string | null
          goals?: number | null
          height?: number | null
          id?: string
          minutes_played?: number | null
          name: string
          nationality?: string | null
          number?: number | null
          photo_url?: string | null
          position?: string | null
          red_cards?: number | null
          team_id?: string | null
          updated_at?: string | null
          weight?: number | null
          yellow_cards?: number | null
        }
        Update: {
          assists?: number | null
          birth_date?: string | null
          club?: string | null
          created_at?: string | null
          goals?: number | null
          height?: number | null
          id?: string
          minutes_played?: number | null
          name?: string
          nationality?: string | null
          number?: number | null
          photo_url?: string | null
          position?: string | null
          red_cards?: number | null
          team_id?: string | null
          updated_at?: string | null
          weight?: number | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          created_at: string | null
          id: string
          match_id: string | null
          points_earned: number | null
          predicted_away_score: number
          predicted_home_score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          points_earned?: number | null
          predicted_away_score: number
          predicted_home_score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string | null
          points_earned?: number | null
          predicted_away_score?: number
          predicted_home_score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurantes: {
        Row: {
          accesible_silla_ruedas: boolean | null
          acepta_apps_pago: boolean | null
          acepta_efectivo: boolean | null
          acepta_reservaciones: boolean | null
          acepta_tarjetas: boolean | null
          activo: boolean | null
          alcaldia: string | null
          ambiente: string | null
          capacidad_personas: number | null
          codigo_postal: string | null
          corredor_id: string
          created_at: string | null
          descripcion: string | null
          descripcion_corta: string | null
          destacado: boolean | null
          direccion: string | null
          email: string | null
          especialidad: string | null
          estacionamiento: boolean | null
          horarios: Json | null
          id: string
          imagen_principal_url: string | null
          imagenes_galeria: Json | null
          latitud: number
          longitud: number
          mejor_para: string | null
          menu_url: string | null
          nombre: string
          numero_reviews: number | null
          orden: number | null
          platillos_recomendados: Json | null
          popularidad: number | null
          precio_promedio_persona: Json | null
          rango_precios: string | null
          rating: number | null
          sitio_web: string | null
          telefono: string | null
          telefono_reservaciones: string | null
          terraza: boolean | null
          tipo_cocina: string | null
          updated_at: string | null
          valet_parking: boolean | null
          wifi_disponible: boolean | null
        }
        Insert: {
          accesible_silla_ruedas?: boolean | null
          acepta_apps_pago?: boolean | null
          acepta_efectivo?: boolean | null
          acepta_reservaciones?: boolean | null
          acepta_tarjetas?: boolean | null
          activo?: boolean | null
          alcaldia?: string | null
          ambiente?: string | null
          capacidad_personas?: number | null
          codigo_postal?: string | null
          corredor_id: string
          created_at?: string | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          direccion?: string | null
          email?: string | null
          especialidad?: string | null
          estacionamiento?: boolean | null
          horarios?: Json | null
          id?: string
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud: number
          longitud: number
          mejor_para?: string | null
          menu_url?: string | null
          nombre: string
          numero_reviews?: number | null
          orden?: number | null
          platillos_recomendados?: Json | null
          popularidad?: number | null
          precio_promedio_persona?: Json | null
          rango_precios?: string | null
          rating?: number | null
          sitio_web?: string | null
          telefono?: string | null
          telefono_reservaciones?: string | null
          terraza?: boolean | null
          tipo_cocina?: string | null
          updated_at?: string | null
          valet_parking?: boolean | null
          wifi_disponible?: boolean | null
        }
        Update: {
          accesible_silla_ruedas?: boolean | null
          acepta_apps_pago?: boolean | null
          acepta_efectivo?: boolean | null
          acepta_reservaciones?: boolean | null
          acepta_tarjetas?: boolean | null
          activo?: boolean | null
          alcaldia?: string | null
          ambiente?: string | null
          capacidad_personas?: number | null
          codigo_postal?: string | null
          corredor_id?: string
          created_at?: string | null
          descripcion?: string | null
          descripcion_corta?: string | null
          destacado?: boolean | null
          direccion?: string | null
          email?: string | null
          especialidad?: string | null
          estacionamiento?: boolean | null
          horarios?: Json | null
          id?: string
          imagen_principal_url?: string | null
          imagenes_galeria?: Json | null
          latitud?: number
          longitud?: number
          mejor_para?: string | null
          menu_url?: string | null
          nombre?: string
          numero_reviews?: number | null
          orden?: number | null
          platillos_recomendados?: Json | null
          popularidad?: number | null
          precio_promedio_persona?: Json | null
          rango_precios?: string | null
          rating?: number | null
          sitio_web?: string | null
          telefono?: string | null
          telefono_reservaciones?: string | null
          terraza?: boolean | null
          tipo_cocina?: string | null
          updated_at?: string | null
          valet_parking?: boolean | null
          wifi_disponible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurantes_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "corredores_turisticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurantes_corredor_id_fkey"
            columns: ["corredor_id"]
            isOneToOne: false
            referencedRelation: "vista_resumen_corredores"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          coach_name: string | null
          code: string
          confederation: string | null
          created_at: string | null
          fifa_ranking: number | null
          flag_url: string | null
          group_letter: string | null
          id: string
          name: string
          stadium_home: string | null
          updated_at: string | null
        }
        Insert: {
          coach_name?: string | null
          code: string
          confederation?: string | null
          created_at?: string | null
          fifa_ranking?: number | null
          flag_url?: string | null
          group_letter?: string | null
          id?: string
          name: string
          stadium_home?: string | null
          updated_at?: string | null
        }
        Update: {
          coach_name?: string | null
          code?: string
          confederation?: string | null
          created_at?: string | null
          fifa_ranking?: number | null
          flag_url?: string | null
          group_letter?: string | null
          id?: string
          name?: string
          stadium_home?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          description: string | null
          icon_url: string | null
          id: string
          points: number | null
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          description?: string | null
          icon_url?: string | null
          id?: string
          points?: number | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          points?: number | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          favorite_team_id: string | null
          full_name: string | null
          id: string
          level: number | null
          points: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          favorite_team_id?: string | null
          full_name?: string | null
          id: string
          level?: number | null
          points?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          favorite_team_id?: string | null
          full_name?: string | null
          id?: string
          level?: number | null
          points?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_favorite_team_id_fkey"
            columns: ["favorite_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      players_with_age: {
        Row: {
          age: number | null
          assists: number | null
          birth_date: string | null
          club: string | null
          confederation: string | null
          created_at: string | null
          display_nationality: string | null
          goals: number | null
          height: number | null
          id: string | null
          minutes_played: number | null
          name: string | null
          nationality: string | null
          number: number | null
          photo_url: string | null
          position: string | null
          red_cards: number | null
          team_code: string | null
          team_flag: string | null
          team_id: string | null
          team_name: string | null
          updated_at: string | null
          weight: number | null
          yellow_cards: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      vista_resumen_corredores: {
        Row: {
          activo: boolean | null
          icono: string | null
          id: string | null
          nombre: string | null
          numero_corredor: number | null
          slug: string | null
          total_estacionamientos: number | null
          total_estaciones_ecobici: number | null
          total_hoteles: number | null
          total_imperdibles: number | null
          total_restaurantes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_age: { Args: { birth_date: string }; Returns: number }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
