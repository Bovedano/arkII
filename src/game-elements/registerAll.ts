/**
 * Side-effect-only barrel: importing this once (from PreloadScene) guarantees every
 * GameElement type below has self-registered into GameElementRegistry before any level
 * JSON is parsed/instantiated. Add new elements here as they're created.
 */
import './backgrounds/GEFixedBackground';
import './blocks/GEColorBlock';
import './blocks/GEArbol';
import './blocks/GEMatorralConEspinas';
import './blocks/GEDienteLeonFlor';
import './blocks/GERamaAlamo';
import './blocks/GEMesaComida';
import './blocks/GECocheSeatIbiza';
import './blocks/GECocheMercedesAzul';
import './blocks/GECocheOpelInsigniaNegro';
import './blocks/GECocheDaciaLodgyGris';
import './blocks/GEToyotaPickup';
import './blocks/GEVolvoXc40';
import './blocks/GEVallaTroncos';
import './blocks/GEPuente';
import './blocks/GEBarbacoaHumeante';
import './blocks/GEBarbacoaLadrillo';
import './blocks/GEAguaRio';
import './blocks/GEFloor';
import './characters/GEPenista';
import './interactive/GESwitch';
import './interactive/GEEsporaDienteLeon';
import './interactive/GERespawn';
import './interactive/GECorazonCristalNaranja';
import './collectibles/GECervezaEstrella';
import './enemies/GEPajaroBlanco';
import './enemies/GEAvispa';
