export const LEVEL_03_TEXT = `{
  "id": "level-mrxhqjwz",
  "title": "La vida en la alameda",
  "config": {
    "width": 20582,
    "height": 1240,
    "gravity": 600,
    "background": "#52f3ff",
    "camera": {
      "marginX": 100
    },
    "timeLimitSec": 1200
  },
  "sublevels": [],
  "elements": [
    {
      "id": "CervezaEstrella-ms7qtwjl",
      "type": "CervezaEstrella",
      "x": 45.130819085353494,
      "y": 1156.439402815581,
      "params": {
        "zIndex": 5,
        "behavior": "sensor",
        "scale": 0.9999999999999957
      }
    },
    {
      "id": "Arbol-ms7rzahe",
      "type": "Arbol",
      "x": 2254.6351705899647,
      "y": 785.9818466390234,
      "params": {
        "zIndex": 5,
        "behavior": "background",
        "scale": 3.56793877272971,
        "variant": "arbol-3.png"
      }
    },
    {
      "id": "Penista-ms96tayh",
      "type": "Penista",
      "x": 258.1755911874552,
      "y": 1133.1605822047316,
      "params": {
        "abilities": [
          "run",
          "jump"
        ],
        "zIndex": 10,
        "behavior": "solid"
      }
    },
    {
      "id": "Floor-ms98kzzp",
      "type": "Floor",
      "x": 3445.709563572679,
      "y": 1212.8623535936238,
      "params": {
        "centerCount": 80,
        "theme": "green",
        "height": 64,
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "ColorBlock-msepmlqw",
      "type": "ColorBlock",
      "x": -34.184200715917655,
      "y": 375.81419716646985,
      "params": {
        "scale": 1,
        "width": 54,
        "height": 820,
        "color": "#4a3728",
        "zIndex": 0,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "ColorBlock-msepvabs",
      "type": "ColorBlock",
      "x": 20572.881147259694,
      "y": 410.79635362451165,
      "params": {
        "scale": 1,
        "width": 49,
        "height": 904,
        "color": "#4a3728",
        "zIndex": 0,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "CervezaEstrella-mseqn31u",
      "type": "CervezaEstrella",
      "x": 1090.6918572072857,
      "y": 1065.6175967626737,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "zIndex": 4,
        "behavior": "sensor"
      }
    },
    {
      "id": "CervezaEstrella-mser8c0a",
      "type": "CervezaEstrella",
      "x": 4882.285631876387,
      "y": 793.2264197322048,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "zIndex": 4,
        "behavior": "sensor"
      }
    },
    {
      "id": "FixedBackground-mszvq2nb",
      "type": "FixedBackground",
      "x": 6030,
      "y": 500,
      "params": {
        "scale": 2.3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "zIndex": -50,
        "behavior": "background",
        "image": "panoramica.jpg",
        "parallaxX": 30,
        "parallaxY": 50,
        "repeatX": 5
      }
    },
    {
      "id": "Arbol-mt1gljb1",
      "type": "Arbol",
      "x": 5565.135983424889,
      "y": 891.6863932226263,
      "params": {
        "scale": 2.6,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-3.png"
      }
    },
    {
      "id": "CervezaEstrella-mt2qhzp0",
      "type": "CervezaEstrella",
      "x": 8953.21860626391,
      "y": 1111.1455761496436,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "sensor"
      }
    },
    {
      "id": "Floor-mt2xiixb",
      "type": "Floor",
      "x": 278.14371455777365,
      "y": 1212.8623535936238,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "centerCount": 8,
        "theme": "green",
        "height": 64,
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "Arbol-mt2xk4s8",
      "type": "Arbol",
      "x": 121.76931558263567,
      "y": 828.0574679458234,
      "params": {
        "scale": 3.2,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 12,
        "behavior": "background",
        "variant": "arbol-4.png"
      }
    },
    {
      "id": "AguaRio-mt2xmaia",
      "type": "AguaRio",
      "x": 707.5483386943193,
      "y": 1273.5870607808715,
      "params": {
        "scale": 2.2,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background"
      }
    },
    {
      "id": "PajaroBlanco-mt2xo8cs",
      "type": "PajaroBlanco",
      "x": 535.7831266381556,
      "y": 913.8898828748991,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 14,
        "behavior": "damage",
        "patrolDistance": 240,
        "speed": 90,
        "startDirection": "east",
        "bobAmplitude": 8,
        "bobFrequency": 1.6
      }
    },
    {
      "id": "Arbol-mt2xpy67",
      "type": "Arbol",
      "x": 1508.3523808666741,
      "y": 816.7845845163438,
      "params": {
        "scale": 3.3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-6.png"
      }
    },
    {
      "id": "RamaAlamo-mt2xttiq",
      "type": "RamaAlamo",
      "x": 1584.8342673337625,
      "y": 980.6858226486079,
      "params": {
        "scale": 1.6,
        "rotation": 0,
        "flipX": true,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background"
      }
    },
    {
      "id": "CervezaEstrella-mt2xuh3u",
      "type": "CervezaEstrella",
      "x": 1573.219789541274,
      "y": 952.4086214003595,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "ColorBlock-mt2xvekq",
      "type": "ColorBlock",
      "x": 1552.927819790264,
      "y": 975.4309740007293,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 63,
        "height": 15,
        "color": "#4a3728",
        "zIndex": 0,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "Arbol-mt2xy38e",
      "type": "Arbol",
      "x": 2642.0652018304772,
      "y": 846.9095556972193,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 7,
        "behavior": "background",
        "variant": "arbol-2.png"
      }
    },
    {
      "id": "RamaAlamo-mt2xyz7c",
      "type": "RamaAlamo",
      "x": 2583.792834167203,
      "y": 997.1605874741055,
      "params": {
        "scale": 1.9,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background"
      }
    },
    {
      "id": "RamaAlamo-mt4kcuxo",
      "type": "RamaAlamo",
      "x": 3406.5145372428883,
      "y": 815.9603992396203,
      "params": {
        "scale": 1.9,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background"
      }
    },
    {
      "id": "RamaAlamo-mt4kdqxw",
      "type": "RamaAlamo",
      "x": 4230.721480741868,
      "y": 740.2127795678273,
      "params": {
        "scale": 1.9,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "background"
      }
    },
    {
      "id": "RamaAlamo-mt2y99om",
      "type": "RamaAlamo",
      "x": 2206.970627333506,
      "y": 837.894701641445,
      "params": {
        "scale": 1.7,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background"
      }
    },
    {
      "id": "RamaAlamo-mt2y50tr",
      "type": "RamaAlamo",
      "x": 2308.998749603247,
      "y": 952.3670570836697,
      "params": {
        "scale": 1.9,
        "rotation": 0,
        "flipX": true,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background"
      }
    },
    {
      "id": "RamaAlamo-mt4kd5v9",
      "type": "RamaAlamo",
      "x": 3486.6929138460837,
      "y": 696.9044966219366,
      "params": {
        "scale": 1.9,
        "rotation": 0,
        "flipX": true,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "background"
      }
    },
    {
      "id": "RamaAlamo-mt2y9l89",
      "type": "RamaAlamo",
      "x": 2270.6112898106408,
      "y": 708.4911694024082,
      "params": {
        "scale": 1.5,
        "rotation": 0,
        "flipX": true,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background"
      }
    },
    {
      "id": "ColorBlock-mt2y1q2b",
      "type": "ColorBlock",
      "x": 2545.051140695607,
      "y": 985.3967651952179,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 81,
        "height": 23,
        "color": "#4a3728",
        "zIndex": 6,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "ColorBlock-mt4jivh1",
      "type": "ColorBlock",
      "x": 3368.6713523423673,
      "y": 802.7113295161878,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 81,
        "height": 23,
        "color": "#4a3728",
        "zIndex": 6,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "ColorBlock-mt4jk4t0",
      "type": "ColorBlock",
      "x": 3446.70087149578,
      "y": 686.8620288416809,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 81,
        "height": 23,
        "color": "#4a3728",
        "zIndex": 8,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "ColorBlock-mt4k3zes",
      "type": "ColorBlock",
      "x": 4188.570170338529,
      "y": 728.4489572889396,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 81,
        "height": 23,
        "color": "#4a3728",
        "zIndex": 9,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "ColorBlock-mt2y2gzx",
      "type": "ColorBlock",
      "x": 2265.219976570914,
      "y": 939.3589700717145,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 81,
        "height": 23,
        "color": "#4a3728",
        "zIndex": 6,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "ColorBlock-mt2y3ol8",
      "type": "ColorBlock",
      "x": 2165.8043945085674,
      "y": 827.375144095625,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 75,
        "height": 21,
        "color": "#4a3728",
        "zIndex": 12,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "ColorBlock-mt2y82ij",
      "type": "ColorBlock",
      "x": 2238.094676753834,
      "y": 696.7273471235208,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 62,
        "height": 22,
        "color": "#4a3728",
        "zIndex": 12,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "CervezaEstrella-mt2yarrh",
      "type": "CervezaEstrella",
      "x": 2283.069055277599,
      "y": 680.0836772589621,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "EsporaDienteLeon-mt4jbaj8",
      "type": "EsporaDienteLeon",
      "x": 3185.1272128403393,
      "y": 1153.3612896485167,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "solid",
        "groundDelaySec": 1,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 2,
        "flight1DirectionDeg": 290,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 0,
        "appearDelaySec": 0
      }
    },
    {
      "id": "EsporaDienteLeon-mtek5b8v",
      "type": "EsporaDienteLeon",
      "x": 2835.0659466728785,
      "y": 718.3694443274115,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 6,
        "behavior": "solid",
        "groundDelaySec": 0,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 8,
        "flight1DirectionDeg": 360,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 0,
        "appearDelaySec": 0,
        "initialDelaySec": 0
      }
    },
    {
      "id": "EsporaDienteLeon-mtek8zdz",
      "type": "EsporaDienteLeon",
      "x": 2838.3062461963636,
      "y": 718.3694443274115,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 6,
        "behavior": "solid",
        "groundDelaySec": 0,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 8,
        "flight1DirectionDeg": 360,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 4,
        "appearDelaySec": 0,
        "initialDelaySec": 0
      }
    },
    {
      "id": "EsporaDienteLeon-mt4kma84",
      "type": "EsporaDienteLeon",
      "x": 5976.853362796579,
      "y": 1144.02544856852,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "solid",
        "groundDelaySec": 2,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 5,
        "flight1DirectionDeg": 350,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 0,
        "appearDelaySec": 0,
        "initialDelaySec": 2
      }
    },
    {
      "id": "EsporaDienteLeon-mtea98r2",
      "type": "EsporaDienteLeon",
      "x": 5976.916898081353,
      "y": 1144.02544856852,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "solid",
        "groundDelaySec": 2,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 5,
        "flight1DirectionDeg": 350,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 3.5,
        "appearDelaySec": 0,
        "initialDelaySec": 2
      }
    },
    {
      "id": "EsporaDienteLeon-mt4kzjwr",
      "type": "EsporaDienteLeon",
      "x": 6577.001179581564,
      "y": 1144.02544856852,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "solid",
        "groundDelaySec": 3,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 4,
        "flight1DirectionDeg": 350,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 4,
        "appearDelaySec": 0,
        "initialDelaySec": 2
      }
    },
    {
      "id": "EsporaDienteLeon-mtea9htq",
      "type": "EsporaDienteLeon",
      "x": 6577.064714866338,
      "y": 1142.2101461362984,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "solid",
        "groundDelaySec": 3,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 4,
        "flight1DirectionDeg": 350,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 7.5,
        "appearDelaySec": 0,
        "initialDelaySec": 2
      }
    },
    {
      "id": "EsporaDienteLeon-mt4l6ti3",
      "type": "EsporaDienteLeon",
      "x": 8387.301675545777,
      "y": 1144.02544856852,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "solid",
        "groundDelaySec": 0,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 7,
        "flight1DirectionDeg": 180,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 0,
        "appearDelaySec": 0,
        "initialDelaySec": 0
      }
    },
    {
      "id": "EsporaDienteLeon-mt4lgk0z",
      "type": "EsporaDienteLeon",
      "x": 8387.624538523507,
      "y": 1146.3594088385194,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "solid",
        "groundDelaySec": 0,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 7,
        "flight1DirectionDeg": 180,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 2,
        "appearDelaySec": 0,
        "initialDelaySec": 0
      }
    },
    {
      "id": "EsporaDienteLeon-mt4lhtk3",
      "type": "EsporaDienteLeon",
      "x": 8385.613452264633,
      "y": 1145.19242870352,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "solid",
        "groundDelaySec": 0,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 150,
        "flight1DurationSec": 7,
        "flight1DirectionDeg": 180,
        "flight2Speed": 0,
        "flight2DurationSec": 0,
        "flight2DirectionDeg": 0,
        "flight3Speed": 0,
        "flight3DurationSec": 0,
        "flight3DirectionDeg": 0,
        "flight4Speed": 0,
        "flight4DurationSec": 0,
        "flight4DirectionDeg": 0,
        "flight5Speed": 0,
        "flight5DurationSec": 0,
        "flight5DirectionDeg": 0,
        "initialAppearDelaySec": 4,
        "appearDelaySec": 0,
        "initialDelaySec": 0
      }
    },
    {
      "id": "DienteLeonFlor-mt4j9mnh",
      "type": "DienteLeonFlor",
      "x": 3187.0246325502385,
      "y": 1166.385455814986,
      "params": {
        "scale": 0.3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 15,
        "behavior": "background"
      }
    },
    {
      "id": "DienteLeonFlor-mt4km550",
      "type": "DienteLeonFlor",
      "x": 5974.082884033269,
      "y": 1164.051495544987,
      "params": {
        "scale": 0.3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 15,
        "behavior": "background"
      }
    },
    {
      "id": "DienteLeonFlor-mt4kretf",
      "type": "DienteLeonFlor",
      "x": 8388.876232277946,
      "y": 1168.7194160849854,
      "params": {
        "scale": 0.3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 15,
        "behavior": "background"
      }
    },
    {
      "id": "DienteLeonFlor-mt4lbkv7",
      "type": "DienteLeonFlor",
      "x": 6574.553563795983,
      "y": 1167.552435949986,
      "params": {
        "scale": 0.3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 15,
        "behavior": "background"
      }
    },
    {
      "id": "Arbol-mt4jefs6",
      "type": "Arbol",
      "x": 3461.7539894009224,
      "y": 754.022810727695,
      "params": {
        "scale": 3.9,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-3.png"
      }
    },
    {
      "id": "CervezaEstrella-mt4jkpwl",
      "type": "CervezaEstrella",
      "x": 3507.282257565443,
      "y": 665.9968262290572,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "Arbol-mt4jmamd",
      "type": "Arbol",
      "x": 4309.297171854694,
      "y": 762.796637994572,
      "params": {
        "scale": 3.8,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-5.png"
      }
    },
    {
      "id": "PajaroBlanco-mt4jprbp",
      "type": "PajaroBlanco",
      "x": 3101.9738226375393,
      "y": 709.3313743481091,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "patrolDistance": 100,
        "speed": 90,
        "startDirection": "east",
        "bobAmplitude": 8,
        "bobFrequency": 1.6
      }
    },
    {
      "id": "CervezaEstrella-mt4k7nql",
      "type": "CervezaEstrella",
      "x": 4250.435484869113,
      "y": 709.747619671793,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "Respawn-mt4kfu5w",
      "type": "Respawn",
      "x": 3646.2848302140337,
      "y": 1123.8361350045232,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "Floor-mt4kpkes",
      "type": "Floor",
      "x": 6576.636487406398,
      "y": 1210.5283933236244,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "centerCount": 0,
        "theme": "green",
        "height": 64,
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "Floor-mt4l6g5w",
      "type": "Floor",
      "x": 7250.3037051444135,
      "y": 1211.695373458624,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "centerCount": 3,
        "theme": "green",
        "height": 64,
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "Floor-mt4kw5ss",
      "type": "Floor",
      "x": 13164.022756005055,
      "y": 1211.695373458624,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "centerCount": 150,
        "theme": "green",
        "height": 64,
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "Respawn-mt4l81vo",
      "type": "Respawn",
      "x": 5839.181756296801,
      "y": 1121.5197485049755,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "Respawn-mt4lk8o4",
      "type": "Respawn",
      "x": 8796.649421375085,
      "y": 1127.1707417549949,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "PajaroBlanco-mt4lkj30",
      "type": "PajaroBlanco",
      "x": 7673.950111835067,
      "y": 857.829258245005,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "patrolDistance": 640,
        "speed": 90,
        "startDirection": "east",
        "bobAmplitude": 8,
        "bobFrequency": 1.6
      }
    },
    {
      "id": "Arbol-mt4lngur",
      "type": "Arbol",
      "x": 8576.248273850044,
      "y": 844.335841079997,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-2.png"
      }
    },
    {
      "id": "Arbol-mt4lqnyb",
      "type": "Arbol",
      "x": 9366.612953418264,
      "y": 843.1688609449975,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-4.png"
      }
    },
    {
      "id": "Arbol-mt4lyi6b",
      "type": "Arbol",
      "x": 10375.201886608966,
      "y": 840.8349006749984,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-5.png"
      }
    },
    {
      "id": "Arbol-mt4lz197",
      "type": "Arbol",
      "x": 11044.201205873771,
      "y": 836.166980135,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-6.png"
      }
    },
    {
      "id": "Arbol-mt4m3bd7",
      "type": "Arbol",
      "x": 11875.409997082563,
      "y": 840.8349006749985,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-1.png"
      }
    },
    {
      "id": "Arbol-mtekuusf",
      "type": "Arbol",
      "x": 12413.70815909754,
      "y": 840.8349006749985,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-2.png"
      }
    },
    {
      "id": "Arbol-mtel4h26",
      "type": "Arbol",
      "x": 13395.845667606729,
      "y": 840.8349006749984,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-3.png"
      }
    },
    {
      "id": "Arbol-mtel7kqu",
      "type": "Arbol",
      "x": 14176.485558689097,
      "y": 842.65020310722,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-5.png"
      }
    },
    {
      "id": "Arbol-mtelbr0e",
      "type": "Arbol",
      "x": 14776.049888164931,
      "y": 835.8428189863889,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-6.png"
      }
    },
    {
      "id": "Arbol-mteljyfx",
      "type": "Arbol",
      "x": 15558.051249635319,
      "y": 842.65020310722,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-4.png"
      }
    },
    {
      "id": "Arbol-mtelpjr1",
      "type": "Arbol",
      "x": 16251.55703588447,
      "y": 840.1367074318364,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-2.png"
      }
    },
    {
      "id": "Arbol-mtem7l5x",
      "type": "Arbol",
      "x": 16970.47693604331,
      "y": 840.1367074318364,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-3.png"
      }
    },
    {
      "id": "Arbol-mtembvgd",
      "type": "Arbol",
      "x": 17549.619209698856,
      "y": 847.397917160723,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-5.png"
      }
    },
    {
      "id": "Arbol-mtemglpp",
      "type": "Arbol",
      "x": 19130.05783007553,
      "y": 841.3214049996147,
      "params": {
        "scale": 3,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "background",
        "variant": "arbol-2.png"
      }
    },
    {
      "id": "CervezaEstrella-mt4lrk9v",
      "type": "CervezaEstrella",
      "x": 10100.979675192064,
      "y": 1044.5122252649849,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "PajaroBlanco-mt4lrowr",
      "type": "PajaroBlanco",
      "x": 9852.831177671887,
      "y": 937.8367814849958,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "patrolDistance": 220,
        "speed": 160,
        "startDirection": "east",
        "bobAmplitude": 8,
        "bobFrequency": 1.6
      }
    },
    {
      "id": "CervezaEstrella-mt4lx1d0",
      "type": "CervezaEstrella",
      "x": 10895.500923854906,
      "y": 1030.523510124971,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "PajaroBlanco-mt4ly2fn",
      "type": "PajaroBlanco",
      "x": 11303.029563356997,
      "y": 996.1782649949856,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "patrolDistance": 240,
        "speed": 90,
        "startDirection": "east",
        "bobAmplitude": 8,
        "bobFrequency": 1.6
      }
    },
    {
      "id": "PajaroBlanco-mt4lznzu",
      "type": "PajaroBlanco",
      "x": 11233.333949236605,
      "y": 895.8179733850191,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "patrolDistance": 240,
        "speed": 90,
        "startDirection": "west",
        "bobAmplitude": 8,
        "bobFrequency": 1.6
      }
    },
    {
      "id": "Avispa-mtejv72o",
      "type": "Avispa",
      "x": 13928.686181075562,
      "y": 1031.732455622001,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "roamWidth": 220,
        "roamHeight": 140,
        "speed": 200,
        "turnSharpness": 0.1,
        "hoverTime": 0.4,
        "buzzAmplitude": 3,
        "buzzFrequency": 14
      }
    },
    {
      "id": "Avispa-mtelcs3y",
      "type": "Avispa",
      "x": 14825.051055139553,
      "y": 1019.4791642045051,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 20,
        "behavior": "damage",
        "roamWidth": 220,
        "roamHeight": 140,
        "speed": 130,
        "turnSharpness": 0.2,
        "hoverTime": 0.4,
        "buzzAmplitude": 3,
        "buzzFrequency": 14
      }
    },
    {
      "id": "Avispa-mteliiba",
      "type": "Avispa",
      "x": 15317.059223961882,
      "y": 1129.953283651135,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "roamWidth": 220,
        "roamHeight": 140,
        "speed": 130,
        "turnSharpness": 0.2,
        "hoverTime": 0.4,
        "buzzAmplitude": 3,
        "buzzFrequency": 14
      }
    },
    {
      "id": "Avispa-mteljm05",
      "type": "Avispa",
      "x": 15432.134591072649,
      "y": 1074.1327338603203,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "roamWidth": 220,
        "roamHeight": 140,
        "speed": 130,
        "turnSharpness": 0.2,
        "hoverTime": 0.4,
        "buzzAmplitude": 3,
        "buzzFrequency": 14
      }
    },
    {
      "id": "Avispa-mtem7v0t",
      "type": "Avispa",
      "x": 16784.592045123023,
      "y": 1048.7184998092177,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "roamWidth": 220,
        "roamHeight": 140,
        "speed": 130,
        "turnSharpness": 0.2,
        "hoverTime": 0.4,
        "buzzAmplitude": 3,
        "buzzFrequency": 14
      }
    },
    {
      "id": "Avispa-mtem8qf4",
      "type": "Avispa",
      "x": 17169.497876754518,
      "y": 1026.9348706225583,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "roamWidth": 220,
        "roamHeight": 140,
        "speed": 160,
        "turnSharpness": 0.1,
        "hoverTime": 0.2,
        "buzzAmplitude": 3,
        "buzzFrequency": 14
      }
    },
    {
      "id": "Avispa-mtemcsrh",
      "type": "Avispa",
      "x": 17545.327239132555,
      "y": 1106.8081776403096,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "roamWidth": 220,
        "roamHeight": 140,
        "speed": 140,
        "turnSharpness": 0.1,
        "hoverTime": 0.01,
        "buzzAmplitude": 3,
        "buzzFrequency": 14
      }
    },
    {
      "id": "Avispa-mteljszq",
      "type": "Avispa",
      "x": 15563.742098609358,
      "y": 1140.6506015552982,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "roamWidth": 220,
        "roamHeight": 140,
        "speed": 130,
        "turnSharpness": 0.2,
        "hoverTime": 0.4,
        "buzzAmplitude": 3,
        "buzzFrequency": 14
      }
    },
    {
      "id": "Avispa-mteldf8m",
      "type": "Avispa",
      "x": 14750.68754254595,
      "y": 1084.830051764483,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 20,
        "behavior": "damage",
        "roamWidth": 220,
        "roamHeight": 100,
        "speed": 250,
        "turnSharpness": 0.1,
        "hoverTime": 0.2,
        "buzzAmplitude": 3,
        "buzzFrequency": 14
      }
    },
    {
      "id": "CorazonCristalNaranja-mtekmg2v",
      "type": "CorazonCristalNaranja",
      "x": 7347.558202859089,
      "y": 1123.1688609449975,
      "params": {
        "scale": 0.4,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "sensor"
      }
    },
    {
      "id": "Respawn-mtekvs9b",
      "type": "Respawn",
      "x": 13279.281824370322,
      "y": 1118.4590729666488,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "PajaroBlanco-mtekwqni",
      "type": "PajaroBlanco",
      "x": 12236.675289312458,
      "y": 1014.5646819675233,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "patrolDistance": 240,
        "speed": 90,
        "startDirection": "east",
        "bobAmplitude": 8,
        "bobFrequency": 1.6
      }
    },
    {
      "id": "CorazonCristalNaranja-mtel14ae",
      "type": "CorazonCristalNaranja",
      "x": 12818.974132062629,
      "y": 1166.2690334932754,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "ColorBlock-mtelgqk6",
      "type": "ColorBlock",
      "x": 14728.324905183312,
      "y": 1014.154510060814,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 49,
        "height": 19,
        "color": "#4a3728",
        "zIndex": 7,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "ColorBlock-mtelh4qu",
      "type": "ColorBlock",
      "x": 14815.941456773315,
      "y": 964.1688609449974,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 54,
        "height": 15,
        "color": "#4a3728",
        "zIndex": 7,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "CervezaEstrella-mtelk5ty",
      "type": "CervezaEstrella",
      "x": 15421.38549061558,
      "y": 1157.7504702024996,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "RamaAlamo-mtell253",
      "type": "RamaAlamo",
      "x": 14752.543226684818,
      "y": 1023.6728673741934,
      "params": {
        "scale": 1.4,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 13,
        "behavior": "background"
      }
    },
    {
      "id": "RamaAlamo-mtelm18l",
      "type": "RamaAlamo",
      "x": 14840.389186035203,
      "y": 971.1587612992109,
      "params": {
        "scale": 1.4,
        "rotation": 0,
        "flipX": true,
        "flipY": false,
        "carry": false,
        "zIndex": 13,
        "behavior": "background"
      }
    },
    {
      "id": "Respawn-mtelp88v",
      "type": "Respawn",
      "x": 16055.840416220948,
      "y": 1121.5065828349918,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "CervezaEstrella-mtelrxva",
      "type": "CervezaEstrella",
      "x": 12985.690070990957,
      "y": 1024.3734572799503,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "Floor-mtema5nq",
      "type": "Floor",
      "x": 18308.09167233946,
      "y": 1211.695373458624,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "centerCount": 0,
        "theme": "green",
        "height": 64,
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "Floor-mtembc46",
      "type": "Floor",
      "x": 19830.56379858886,
      "y": 1211.695373458624,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "centerCount": 35,
        "theme": "green",
        "height": 64,
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "PajaroBlanco-mtemcmwt",
      "type": "PajaroBlanco",
      "x": 17602.432947583387,
      "y": 981.8547994421726,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "patrolDistance": 240,
        "speed": 120,
        "startDirection": "east",
        "bobAmplitude": 8,
        "bobFrequency": 1.6
      }
    },
    {
      "id": "CervezaEstrella-mtemhw9x",
      "type": "CervezaEstrella",
      "x": 19965.105173128737,
      "y": 1158.9340978010202,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "Respawn-mtemn9dh",
      "type": "Respawn",
      "x": 18775.630587701384,
      "y": 1118.2295364833242,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 5,
        "behavior": "sensor"
      }
    },
    {
      "id": "PajaroBlanco-mtemod85",
      "type": "PajaroBlanco",
      "x": 18515.83526208305,
      "y": 946.9049802633134,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 8,
        "behavior": "damage",
        "patrolDistance": 240,
        "speed": 90,
        "startDirection": "east",
        "bobAmplitude": 8,
        "bobFrequency": 1.6
      }
    },
    {
      "id": "CorazonCristalNaranja-mtemoynp",
      "type": "CorazonCristalNaranja",
      "x": 19773.077752804576,
      "y": 1163.0651025099687,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "sensor"
      }
    },
    {
      "id": "CorazonCristalNaranja-mtietbuc",
      "type": "CorazonCristalNaranja",
      "x": 20181.673378498686,
      "y": 1163.0651025099687,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "sensor"
      }
    },
    {
      "id": "Puente-mtiephqt",
      "type": "Puente",
      "x": 19847.523641935055,
      "y": 1091.9695135741551,
      "params": {
        "scale": 6.1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": -4,
        "behavior": "background"
      }
    },
    {
      "id": "ColorBlock-mtieug7h",
      "type": "ColorBlock",
      "x": 20392.335920634356,
      "y": 1342.268284659461,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 45,
        "height": 99,
        "color": "#4a3728",
        "zIndex": 0,
        "behavior": "solid",
        "hidden": true
      }
    },
    {
      "id": "ColorBlock-mtievg9s",
      "type": "ColorBlock",
      "x": 19281.252644884713,
      "y": 1006,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "width": 1330,
        "height": 18,
        "color": "#4a3728",
        "zIndex": 0,
        "behavior": "semisolid",
        "hidden": true
      }
    }
  ],
  "groups": [
    {
      "id": "group-msa5xm8x",
      "name": "PicnicMesa",
      "elements": [
        {
          "id": "MesaComida-ms96umbc",
          "type": "MesaComida",
          "x": 108.99144389515038,
          "y": 21.14684177461436,
          "params": {
            "zIndex": 5,
            "behavior": "solid",
            "hidden": false
          }
        },
        {
          "id": "ColorBlock-ms98nsns",
          "type": "ColorBlock",
          "x": 44.80265225253129,
          "y": 0,
          "params": {
            "width": 123,
            "height": 109,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-ms992kde",
          "type": "ColorBlock",
          "x": 0,
          "y": 34.7049648915679,
          "params": {
            "width": 215,
            "height": 43,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-msekh6qu",
      "name": "brabacoa",
      "elements": [
        {
          "id": "BarbacoaHumeante-msa6gkgk",
          "type": "BarbacoaHumeante",
          "x": 61.29634363483791,
          "y": 60.61872087147273,
          "params": {
            "zIndex": 5,
            "behavior": "sensor",
            "scale": 0.485871373142553
          }
        },
        {
          "id": "ColorBlock-msek7r1m",
          "type": "ColorBlock",
          "x": 18.649642400362936,
          "y": 34.844626662336125,
          "params": {
            "scale": 1,
            "width": 85,
            "height": 86,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "damage",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mseq0wci",
      "name": "Pickup",
      "elements": [
        {
          "id": "ToyotaPickup-msbq0i6a",
          "type": "ToyotaPickup",
          "x": 258.3687976903234,
          "y": 78.01807851239687,
          "params": {
            "zIndex": 17,
            "behavior": "background",
            "scale": 2.5
          }
        },
        {
          "id": "ColorBlock-msepyitq",
          "type": "ColorBlock",
          "x": 319.73521263796647,
          "y": 61.46428571428555,
          "params": {
            "scale": 1,
            "width": 202,
            "height": 121,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-msepzbsx",
          "type": "ColorBlock",
          "x": -14.61045389502076,
          "y": 57.990259740259525,
          "params": {
            "scale": 1,
            "width": 338,
            "height": 127,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-msepzqf1",
          "type": "ColorBlock",
          "x": 153.59763402207454,
          "y": 0,
          "params": {
            "scale": 1,
            "width": 193,
            "height": 86,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mseq6kzt",
          "type": "ColorBlock",
          "x": 32.57470425275933,
          "y": 44.56818181818181,
          "params": {
            "scale": 1,
            "width": 200,
            "height": 40,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mseq811v",
          "type": "ColorBlock",
          "x": 510.4675548727847,
          "y": 44.11157024793391,
          "params": {
            "scale": 1,
            "width": 13,
            "height": 135,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mseqqblu",
      "name": "CervezaEnAlamo",
      "elements": [
        {
          "id": "Arbol-ms7rz2zj",
          "type": "Arbol",
          "x": 81.7031173484018,
          "y": -33.916364326909274,
          "params": {
            "zIndex": 5,
            "behavior": "solid",
            "scale": 3.72733129935098,
            "hidden": false
          }
        },
        {
          "id": "RamaAlamo-msa6dhjk",
          "type": "RamaAlamo",
          "x": 13.42556703993322,
          "y": 266.66279667858845,
          "params": {
            "zIndex": 4,
            "behavior": "background",
            "scale": 1.7390835075801523
          }
        },
        {
          "id": "ColorBlock-msa6dps5",
          "type": "ColorBlock",
          "x": -21.22780719919659,
          "y": 258.3462035123966,
          "params": {
            "width": 75,
            "height": 19,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mseqgpdu",
          "type": "ColorBlock",
          "x": -12.242194237292722,
          "y": 141.1407362400446,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "width": 98,
            "height": 22,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "RamaAlamo-mseqhy3c",
          "type": "RamaAlamo",
          "x": 30.260824819173706,
          "y": 151.99491220242217,
          "params": {
            "scale": 2.2,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "zIndex": 3,
            "behavior": "background"
          }
        },
        {
          "id": "RamaAlamo-mseqlps5",
          "type": "RamaAlamo",
          "x": 6.098327010398037,
          "y": 25.51298701298704,
          "params": {
            "scale": 2,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "zIndex": 4,
            "behavior": "background"
          }
        },
        {
          "id": "ColorBlock-mseqmi8u",
          "type": "ColorBlock",
          "x": -24.879917161617044,
          "y": 16.36925574425572,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "width": 157,
            "height": 20,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "RamaAlamo-mseqr7o1",
          "type": "RamaAlamo",
          "x": 97.18794606470976,
          "y": 28.43603271728272,
          "params": {
            "scale": 1.8,
            "rotation": 0,
            "flipX": true,
            "flipY": false,
            "zIndex": 4,
            "behavior": "background"
          }
        }
      ]
    },
    {
      "id": "group-mt2nq33d",
      "name": "IbizaBlanco",
      "elements": [
        {
          "id": "ColorBlock-mt2nogm2",
          "type": "ColorBlock",
          "x": 0,
          "y": 31.68344620147741,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 162,
            "height": 105,
            "color": "#4a3728",
            "zIndex": 6,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2npbeo",
          "type": "ColorBlock",
          "x": 32.7982173066751,
          "y": 2.239676519521794,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 100,
            "height": 55,
            "color": "#4a3728",
            "zIndex": 7,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "CocheSeatIbiza-mt2nxgj3",
          "type": "CocheSeatIbiza",
          "x": 82.1926045392249,
          "y": 61.91250978806019,
          "params": {
            "scale": 0.8,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "color": "blanco",
            "zIndex": 5,
            "behavior": "background"
          }
        }
      ]
    },
    {
      "id": "group-mt2obiwk",
      "name": "CocheInsignia",
      "elements": [
        {
          "id": "CocheOpelInsigniaNegro-mszzpat1",
          "type": "CocheOpelInsigniaNegro",
          "x": 188.35905585578712,
          "y": 58.58625572034816,
          "params": {
            "scale": 1.7,
            "rotation": 0,
            "flipX": true,
            "flipY": false,
            "zIndex": 5,
            "behavior": "background"
          }
        },
        {
          "id": "ColorBlock-mt2ntdmf",
          "type": "ColorBlock",
          "x": 0,
          "y": 33.927337306773325,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 394,
            "height": 81,
            "color": "#4a3728",
            "zIndex": 8,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2nu7rj",
          "type": "ColorBlock",
          "x": 53.647728640718015,
          "y": 16.117632892427082,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 209,
            "height": 35,
            "color": "#4a3728",
            "zIndex": 7,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2nuvwf",
          "type": "ColorBlock",
          "x": 95.10620603063126,
          "y": 0,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 146,
            "height": 35,
            "color": "#4a3728",
            "zIndex": 6,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mt2oddol",
      "name": "CocheMercedes",
      "elements": [
        {
          "id": "CocheMercedesAzul-mt000yqv",
          "type": "CocheMercedesAzul",
          "x": 85.01921400533593,
          "y": 68.84037621789025,
          "params": {
            "scale": 0.7,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "zIndex": 5,
            "behavior": "background"
          }
        },
        {
          "id": "ColorBlock-mt2oc3bn",
          "type": "ColorBlock",
          "x": 0,
          "y": 27.396988295292886,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 175,
            "height": 109,
            "color": "#4a3728",
            "zIndex": 8,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2ocfot",
          "type": "ColorBlock",
          "x": 26.53949039228246,
          "y": 0,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 114,
            "height": 48,
            "color": "#4a3728",
            "zIndex": 8,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mt2oesl3",
      "name": "CocheIbizaNegro",
      "elements": [
        {
          "id": "CocheSeatIbiza-mt002q0w",
          "type": "CocheSeatIbiza",
          "x": 79.74539213892513,
          "y": 56.93126925622346,
          "params": {
            "scale": 0.8,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "color": "negro",
            "zIndex": 5,
            "behavior": "background"
          }
        },
        {
          "id": "ColorBlock-mt2odihj",
          "type": "ColorBlock",
          "x": 0,
          "y": 29.68276632388529,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 162,
            "height": 106,
            "color": "#4a3728",
            "zIndex": 5,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2odtqs",
          "type": "ColorBlock",
          "x": 22.53949039228337,
          "y": 0,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 115,
            "height": 63,
            "color": "#4a3728",
            "zIndex": 5,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mt2oh7rv",
      "name": "CocheVolvo",
      "elements": [
        {
          "id": "VolvoXc40-mt2of9w9",
          "type": "VolvoXc40",
          "x": 77.4277067652747,
          "y": 57.793530390435535,
          "params": {
            "scale": 0.7,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "zIndex": 5,
            "behavior": "background"
          }
        },
        {
          "id": "ColorBlock-mt2ofu2y",
          "type": "ColorBlock",
          "x": 0,
          "y": 26.158839938132132,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 157,
            "height": 103,
            "color": "#4a3728",
            "zIndex": 8,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2og99k",
          "type": "ColorBlock",
          "x": 22.301034877814345,
          "y": 0,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 112,
            "height": 47,
            "color": "#4a3728",
            "zIndex": 7,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mt2pe7g1",
      "name": "CocheDacia",
      "elements": [
        {
          "id": "CocheDaciaLodgyGris-mt2paht6",
          "type": "CocheDaciaLodgyGris",
          "x": 156.39897630959968,
          "y": 51.199537885031305,
          "params": {
            "scale": 1.5,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "zIndex": 12,
            "behavior": "background"
          }
        },
        {
          "id": "ColorBlock-mt2pb2i9",
          "type": "ColorBlock",
          "x": -8.168822328114345,
          "y": 44.33092972127821,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 289,
            "height": 71,
            "color": "#4a3728",
            "zIndex": 8,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2pbuwd",
          "type": "ColorBlock",
          "x": 98.00745798191639,
          "y": -2.450658283499166,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 219,
            "height": 127,
            "color": "#4a3728",
            "zIndex": 6,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mt2pixb8",
      "name": "Valla",
      "elements": [
        {
          "id": "VallaTroncos-mt2phuvz",
          "type": "VallaTroncos",
          "x": 74.46913993183352,
          "y": 31.287529291028704,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "zIndex": 5,
            "behavior": "background"
          }
        },
        {
          "id": "ColorBlock-mt2pi325",
          "type": "ColorBlock",
          "x": 0,
          "y": 0,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 153,
            "height": 77,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mt2ploh9",
      "name": "BBQApagada",
      "elements": [
        {
          "id": "BarbacoaLadrillo-mt2pjn7z",
          "type": "BarbacoaLadrillo",
          "x": 49.5811288520963,
          "y": 32.571109857035935,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "zIndex": 5,
            "behavior": "background",
            "encendido": false
          }
        },
        {
          "id": "ColorBlock-mt2pl0j0",
          "type": "ColorBlock",
          "x": 0,
          "y": 0,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 97,
            "height": 83,
            "color": "#4a3728",
            "zIndex": 6,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mt2ppr1u",
      "name": "BBQEncendida",
      "elements": [
        {
          "id": "BarbacoaLadrillo-mt2pnu1k",
          "type": "BarbacoaLadrillo",
          "x": 49.70199144372782,
          "y": 49.82543223810717,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "zIndex": 5,
            "behavior": "background",
            "encendido": true
          }
        },
        {
          "id": "ColorBlock-mt2potad",
          "type": "ColorBlock",
          "x": 7.83874597926058,
          "y": 1.119838259760897,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 81,
            "height": 25,
            "color": "#4a3728",
            "zIndex": 0,
            "behavior": "damage",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2pxxgp",
          "type": "ColorBlock",
          "x": -3.1063849176862846,
          "y": 25.408895713150798,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 100,
            "height": 73,
            "color": "#4a3728",
            "zIndex": 8,
            "behavior": "solid",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mt2ptc6z",
      "name": "Espino",
      "elements": [
        {
          "id": "MatorralConEspinas-mt0025v5",
          "type": "MatorralConEspinas",
          "x": 55.83089409292006,
          "y": 42.38027971043141,
          "params": {
            "scale": 0.9,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "zIndex": 5,
            "behavior": "background"
          }
        },
        {
          "id": "ColorBlock-mt2prt8j",
          "type": "ColorBlock",
          "x": 6.53505786249147,
          "y": 26.018233650593714,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 97,
            "height": 72,
            "color": "#4a3728",
            "zIndex": 7,
            "behavior": "damage",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2ps8n4",
          "type": "ColorBlock",
          "x": 26.74543780988236,
          "y": 5.718202661498111,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 42,
            "height": 42,
            "color": "#4a3728",
            "zIndex": 7,
            "behavior": "damage",
            "hidden": true
          }
        }
      ]
    },
    {
      "id": "group-mt4kp9o4",
      "name": "Agua_2",
      "elements": [
        {
          "id": "AguaRio-mt4kl4c4",
          "type": "AguaRio",
          "x": 0,
          "y": 0,
          "params": {
            "scale": 2.2,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "zIndex": -6,
            "behavior": "background"
          }
        },
        {
          "id": "AguaRio-mt4knkqk",
          "type": "AguaRio",
          "x": 223.7159389283279,
          "y": 0,
          "params": {
            "scale": 2.2,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "zIndex": -6,
            "behavior": "background"
          }
        }
      ]
    }
  ],
  "groupInstances": [
    {
      "id": "group-msa5xm8x-inst-msa5xm8x",
      "groupId": "group-msa5xm8x",
      "x": 996.1946553556803,
      "y": 1097.512632863025
    },
    {
      "id": "group-msa5xm8x-inst-msa5yk1p",
      "groupId": "group-msa5xm8x",
      "x": 1723.5120985711994,
      "y": 1095.5371503534593
    },
    {
      "id": "group-msa5xm8x-inst-msa5zcai",
      "groupId": "group-msa5xm8x",
      "x": 2655.8162815496175,
      "y": 1100.1165917695234
    },
    {
      "id": "group-msekh6qu-inst-msekh6qu",
      "groupId": "group-msekh6qu",
      "x": 1243.44560996646,
      "y": 1070.400023507945
    },
    {
      "id": "group-mseqqblu-inst-mser1k3b",
      "groupId": "group-mseqqblu",
      "x": 4899.12718306191,
      "y": 796.5635239750111
    },
    {
      "id": "group-msekh6qu-inst-mser55ka",
      "groupId": "group-msekh6qu",
      "x": 3925.5698586503227,
      "y": 1070.4499137939158
    },
    {
      "id": "group-mt2ptc6z-inst-mt2ptc6z",
      "groupId": "group-mt2ptc6z",
      "x": 5231.945973159647,
      "y": 1087.449624504542
    },
    {
      "id": "group-mt2ptc6z-inst-mt2ptjil",
      "groupId": "group-mt2ptc6z",
      "x": 5637.158533255177,
      "y": 1088.558038513322
    },
    {
      "id": "group-msekh6qu-inst-mt2yco1t",
      "groupId": "group-msekh6qu",
      "x": 2381.4833869431923,
      "y": 1069.0917642709173
    },
    {
      "id": "group-msekh6qu-inst-mt4kc2rg",
      "groupId": "group-msekh6qu",
      "x": 4716.409616931741,
      "y": 1069.2950511091008
    },
    {
      "id": "group-msa5xm8x-inst-mt4kc8v8",
      "groupId": "group-msa5xm8x",
      "x": 4431.269323596757,
      "y": 1097.426237222725
    },
    {
      "id": "group-mt4kp9o4-inst-mt4kp9o4",
      "groupId": "group-mt4kp9o4",
      "x": 6176.314263035466,
      "y": 1266.585179970874
    },
    {
      "id": "group-mt4kp9o4-inst-mt4ksfp8",
      "groupId": "group-mt4kp9o4",
      "x": 6753.608771759214,
      "y": 1266.585179970874
    },
    {
      "id": "group-mt2ptc6z-inst-mt4kzr4j",
      "groupId": "group-mt2ptc6z",
      "x": 6527.571136827774,
      "y": 1083.5272717449661
    },
    {
      "id": "group-mt4kp9o4-inst-mt4l8ryz",
      "groupId": "group-mt4kp9o4",
      "x": 7518.662355343771,
      "y": 1270.1857882349764
    },
    {
      "id": "group-mt4kp9o4-inst-mt4l997w",
      "groupId": "group-mt4kp9o4",
      "x": 7962.636487406399,
      "y": 1270.1857882349764
    },
    {
      "id": "group-msa5xm8x-inst-mt4lozyz",
      "groupId": "group-msa5xm8x",
      "x": 8935.122629582806,
      "y": 1094.0282121499652
    },
    {
      "id": "group-mseq0wci-inst-mt4lqgil",
      "groupId": "group-mseq0wci",
      "x": 9719.534182631527,
      "y": 1012.6622781100054
    },
    {
      "id": "group-mt2ptc6z-inst-mt4ltdt6",
      "groupId": "group-mt2ptc6z",
      "x": 9474.451424681512,
      "y": 1088.0297924355643
    },
    {
      "id": "group-mt2ptc6z-inst-mt4lue57",
      "groupId": "group-mt2ptc6z",
      "x": 10436.106389186036,
      "y": 1087.1296644594445
    },
    {
      "id": "group-mt2ptc6z-inst-mt4luhya",
      "groupId": "group-mt2ptc6z",
      "x": 10660.115238743558,
      "y": 1086.2088475733499
    },
    {
      "id": "group-mt2nq33d-inst-mt4lwq43",
      "groupId": "group-mt2nq33d",
      "x": 10774.69376641058,
      "y": 1048.0206889099743
    },
    {
      "id": "group-mt2obiwk-inst-mt4lxpmb",
      "groupId": "group-mt2obiwk",
      "x": 11085.29884275017,
      "y": 1067.4990595950007
    },
    {
      "id": "group-mt2ptc6z-inst-mt4m3lbm",
      "groupId": "group-mt2ptc6z",
      "x": 11880.507601542999,
      "y": 1084.324556220011
    },
    {
      "id": "group-mt2oddol-inst-mt4m6e5f",
      "groupId": "group-mt2oddol",
      "x": 11550.560731304093,
      "y": 1046.3245562200107
    },
    {
      "id": "group-mt2ptc6z-inst-mt4m70oq",
      "groupId": "group-mt2ptc6z",
      "x": 11744.70410710234,
      "y": 1083.9223971716942
    },
    {
      "id": "group-mt2pe7g1-inst-mt4m8vle",
      "groupId": "group-mt2pe7g1",
      "x": 12437.562384518136,
      "y": 1060.575966827509
    },
    {
      "id": "group-mt2oh7rv-inst-mt4m938j",
      "groupId": "group-mt2oh7rv",
      "x": 11997.297967519207,
      "y": 1056.8273774350073
    },
    {
      "id": "group-mt2oesl3-inst-mt4mg98y",
      "groupId": "group-mt2oesl3",
      "x": 12879.88291354663,
      "y": 1048.8591013307491
    },
    {
      "id": "group-mt2ploh9-inst-mt4mvdwz",
      "groupId": "group-mt2ploh9",
      "x": 13999.232422444813,
      "y": 1100
    },
    {
      "id": "group-mt2ppr1u-inst-mt4mvhp6",
      "groupId": "group-mt2ppr1u",
      "x": 13889.88330253817,
      "y": 1083
    },
    {
      "id": "group-mt2pixb8-inst-mt4mvotm",
      "groupId": "group-mt2pixb8",
      "x": 13524.727414178742,
      "y": 1101.630999935843
    },
    {
      "id": "group-msa5xm8x-inst-mtejtcig",
      "groupId": "group-msa5xm8x",
      "x": 7148.850011345587,
      "y": 1095.461743919446
    },
    {
      "id": "group-mt2ptc6z-inst-mtekynpq",
      "groupId": "group-mt2ptc6z",
      "x": 12177.594281824371,
      "y": 1085.7335429125203
    },
    {
      "id": "group-mt2ptc6z-inst-mtekys5i",
      "groupId": "group-mt2ptc6z",
      "x": 12308.100748808713,
      "y": 1086.4407544850733
    },
    {
      "id": "group-mt2pixb8-inst-mtel5spq",
      "groupId": "group-mt2pixb8",
      "x": 13688.095302927162,
      "y": 1102
    },
    {
      "id": "group-mt2ploh9-inst-mtel74yu",
      "groupId": "group-mt2ploh9",
      "x": 14218.968232357613,
      "y": 1100
    },
    {
      "id": "group-mt2ptc6z-inst-mtel7c2e",
      "groupId": "group-mt2ptc6z",
      "x": 14104.324710687542,
      "y": 1083.878648923346
    },
    {
      "id": "group-mt2ppr1u-inst-mtel8f0t",
      "groupId": "group-mt2ppr1u",
      "x": 14329.96119809394,
      "y": 1083
    },
    {
      "id": "group-mt2ppr1u-inst-mtel8jou",
      "groupId": "group-mt2ppr1u",
      "x": 14444.151803948263,
      "y": 1083
    },
    {
      "id": "group-mt2ploh9-inst-mtel8z8w",
      "groupId": "group-mt2ploh9",
      "x": 14554.815293850692,
      "y": 1100
    },
    {
      "id": "group-mt2ppr1u-inst-mtelcbcu",
      "groupId": "group-mt2ppr1u",
      "x": 14875.491490810075,
      "y": 1083
    },
    {
      "id": "group-mt2ppr1u-inst-mteliqau",
      "groupId": "group-mt2ppr1u",
      "x": 15023.744724302247,
      "y": 1083
    },
    {
      "id": "group-msa5xm8x-inst-mtelkkja",
      "groupId": "group-msa5xm8x",
      "x": 15724.665863748234,
      "y": 1094.3852317583378
    },
    {
      "id": "group-mt4kp9o4-inst-mtem1pjq",
      "groupId": "group-mt4kp9o4",
      "x": 18131.420694349898,
      "y": 1273.9123076559436
    },
    {
      "id": "group-mt2pixb8-inst-mtem4jbh",
      "groupId": "group-mt2pixb8",
      "x": 16396.540503744043,
      "y": 1104.8596449760087
    },
    {
      "id": "group-mt2pixb8-inst-mtem5d0t",
      "groupId": "group-mt2pixb8",
      "x": 16561.78942591332,
      "y": 1104.2928829744487
    },
    {
      "id": "group-mt2pixb8-inst-mtem5sl2",
      "groupId": "group-mt2pixb8",
      "x": 16875.05763557976,
      "y": 1103.6120972888648
    },
    {
      "id": "group-mt2ploh9-inst-mtem772t",
      "groupId": "group-mt2ploh9",
      "x": 17045.172906739277,
      "y": 1100.0633464911243
    },
    {
      "id": "group-mt2ppr1u-inst-mtem7e4t",
      "groupId": "group-mt2ppr1u",
      "x": 16751.35647832993,
      "y": 1085.2163708133405
    },
    {
      "id": "group-mt2ppr1u-inst-mtem8e25",
      "groupId": "group-mt2ppr1u",
      "x": 17157.757658270933,
      "y": 1083.878648923346
    },
    {
      "id": "group-mt2pixb8-inst-mtem8jw6",
      "groupId": "group-mt2pixb8",
      "x": 17276.024733378716,
      "y": 1105.0316732455624
    },
    {
      "id": "group-mt4kp9o4-inst-mtemayed",
      "groupId": "group-mt4kp9o4",
      "x": 18580.311776718856,
      "y": 1273.9123076559436
    },
    {
      "id": "group-mt2pixb8-inst-mtemc3xh",
      "groupId": "group-mt2pixb8",
      "x": 17619.095302927162,
      "y": 1108.878648923346
    },
    {
      "id": "group-mt2pixb8-inst-mtemc8lh",
      "groupId": "group-mt2pixb8",
      "x": 17777.158838211937,
      "y": 1108.7704635166758
    },
    {
      "id": "group-mt2pixb8-inst-mtemcd3h",
      "groupId": "group-mt2pixb8",
      "x": 17707.974132062627,
      "y": 1026.9683267544378
    },
    {
      "id": "group-mt4kp9o4-inst-mtemgd2c",
      "groupId": "group-mt4kp9o4",
      "x": 19365.967097798955,
      "y": 1279.0633464911245
    },
    {
      "id": "group-mt2pixb8-inst-mtiey4lj",
      "groupId": "group-mt2pixb8",
      "x": 20566.176429310115,
      "y": 1103.3414644175673
    }
  ]
}`;
