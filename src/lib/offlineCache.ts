// src/lib/offlineCache.ts
// Utilidad para manejo de cache offline

interface CacheData {
  data: any[];
  timestamp: number;
  version: string;
}

const CACHE_VERSION = '1.0';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Guardar datos en localStorage con timestamp
 */
export const saveToCache = async (key: string, data: any[]): Promise<boolean> => {
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION
    };
    
    localStorage.setItem(key, JSON.stringify(cacheData));
    console.log(`✅ Cache guardado: ${key} (${data.length} items)`);
    return true;
  } catch (error) {
    console.error('❌ Error guardando cache:', error);
    return false;
  }
};

/**
 * Cargar datos del cache si no han expirado
 */
export const loadFromCache = async (key: string): Promise<any[] | null> => {
  try {
    const cached = localStorage.getItem(key);
    
    if (!cached) {
      console.log(`ℹ️ No hay cache para: ${key}`);
      return null;
    }
    
    const cacheData: CacheData = JSON.parse(cached);
    
    // Verificar versión
    if (cacheData.version !== CACHE_VERSION) {
      console.log(`⚠️ Cache obsoleto, limpiando: ${key}`);
      await clearCache(key);
      return null;
    }
    
    // Verificar expiración
    const age = Date.now() - cacheData.timestamp;
    if (age > CACHE_DURATION) {
      console.log(`⏰ Cache expirado (${Math.round(age / 1000 / 60)} min): ${key}`);
      return null;
    }
    
    console.log(`✅ Cache válido: ${key} (${cacheData.data.length} items)`);
    return cacheData.data;
    
  } catch (error) {
    console.error('❌ Error leyendo cache:', error);
    return null;
  }
};

/**
 * Limpiar cache específico
 */
export const clearCache = async (key: string): Promise<void> => {
  try {
    localStorage.removeItem(key);
    console.log(`🗑️ Cache eliminado: ${key}`);
  } catch (error) {
    console.error('❌ Error limpiando cache:', error);
  }
};

/**
 * Limpiar todo el cache
 */
export const clearAllCache = async (): Promise<void> => {
  try {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('tourism-') || key.startsWith('locations-')
    );
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log(`🗑️ Todo el cache eliminado (${keys.length} items)`);
  } catch (error) {
    console.error('❌ Error limpiando todo el cache:', error);
  }
};

/**
 * Obtener información del cache
 */
export const getCacheInfo = async (key: string): Promise<{
  exists: boolean;
  age?: number;
  itemCount?: number;
  isExpired?: boolean;
} | null> => {
  try {
    const cached = localStorage.getItem(key);
    
    if (!cached) {
      return { exists: false };
    }
    
    const cacheData: CacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;
    
    return {
      exists: true,
      age,
      itemCount: cacheData.data.length,
      isExpired: age > CACHE_DURATION
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo info de cache:', error);
    return null;
  }
};

/**
 * Guardar ubicación del usuario
 */
export const saveUserLocation = async (lat: number, lng: number): Promise<void> => {
  try {
    const location = { lat, lng, timestamp: Date.now() };
    localStorage.setItem('user-location', JSON.stringify(location));
  } catch (error) {
    console.error('❌ Error guardando ubicación:', error);
  }
};

/**
 * Cargar última ubicación del usuario
 */
export const loadUserLocation = async (): Promise<{ lat: number; lng: number } | null> => {
  try {
    const cached = localStorage.getItem('user-location');
    if (!cached) return null;
    
    const location = JSON.parse(cached);
    
    // Ubicación válida por 1 hora
    const age = Date.now() - location.timestamp;
    if (age > 60 * 60 * 1000) {
      return null;
    }
    
    return { lat: location.lat, lng: location.lng };
  } catch (error) {
    console.error('❌ Error cargando ubicación:', error);
    return null;
  }
};
