/**
 * Side-effect-only barrel: importing this once (from PreloadScene) guarantees every
 * GameElement type below has self-registered into GameElementRegistry before any level
 * JSON is parsed/instantiated. Add new elements here as they're created.
 */
import './blocks/GEColorBlock';
import './blocks/GEArbol';
import './blocks/GERamaAlamo';
import './blocks/GEMesaComida';
import './blocks/GECocheSeatIbiza';
import './blocks/GEToyotaPickup';
import './blocks/GEBarbacoaHumeante';
import './blocks/GEAguaRio';
import './blocks/GEFloor';
import './characters/GEPenista';
import './interactive/GESwitch';
import './collectibles/GECervezaEstrella';
