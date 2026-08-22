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
    "timeLimitSec": 600
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
      "x": 243.96985482628796,
      "y": 1135.0858510276644,
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
      "x": 3445.5248574233715,
      "y": 1210.5283933236244,
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
      "x": 20551.881147259694,
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
      "x": 4030,
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
        "repeatX": 3
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
        "zIndex": 5,
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
      "id": "EsporaDienteLeon-mt2yims9",
      "type": "EsporaDienteLeon",
      "x": 3020.7683205526687,
      "y": 1150.6377611223188,
      "params": {
        "scale": 0.5,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "carry": false,
        "zIndex": 11,
        "behavior": "solid",
        "groundDelaySec": 5,
        "swayAmplitudeDeg": 12,
        "flight1Speed": 152,
        "flight1DurationSec": 2.8,
        "flight1DirectionDeg": 275,
        "flight2Speed": 149,
        "flight2DurationSec": 7,
        "flight2DirectionDeg": 360,
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
        "appearDelaySec": 2
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
        "groundDelaySec": 5,
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
        "initialAppearDelaySec": 3,
        "appearDelaySec": 2
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
        "groundDelaySec": 0,
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
        "initialDelaySec": 1
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
        "groundDelaySec": 0,
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
        "initialAppearDelaySec": 0,
        "appearDelaySec": 0,
        "initialDelaySec": 0
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
      "id": "DienteLeonFlor-mt2z10uo",
      "type": "DienteLeonFlor",
      "x": 3018.4569863421207,
      "y": 1165.0648526123691,
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
      "id": "CervezaEstrella-mt4lmxgb",
      "type": "CervezaEstrella",
      "x": 7178.812700573762,
      "y": 1159.840543104991,
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
            "zIndex": 5,
            "behavior": "background"
          }
        },
        {
          "id": "ColorBlock-mt2pb2i9",
          "type": "ColorBlock",
          "x": 0,
          "y": 37.79584096528038,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 281,
            "height": 77,
            "color": "#4a3728",
            "zIndex": 8,
            "behavior": "solid",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2pbuwd",
          "type": "ColorBlock",
          "x": 89.02175342099054,
          "y": 0,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 227,
            "height": 126,
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
          "x": 47.66207176480566,
          "y": 39.11273533243252,
          "params": {
            "scale": 1,
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
          "x": 0,
          "y": 29.28577802859263,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 100,
            "height": 77,
            "color": "#4a3728",
            "zIndex": 7,
            "behavior": "damage",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2ps8n4",
          "type": "ColorBlock",
          "x": 12.85843985208794,
          "y": 0,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 46,
            "height": 47,
            "color": "#4a3728",
            "zIndex": 7,
            "behavior": "damage",
            "hidden": true
          }
        },
        {
          "id": "ColorBlock-mt2pshzd",
          "type": "ColorBlock",
          "x": 46.27125835691095,
          "y": 14.11098716662491,
          "params": {
            "scale": 1,
            "rotation": 0,
            "flipX": false,
            "flipY": false,
            "carry": false,
            "width": 50,
            "height": 44,
            "color": "#4a3728",
            "zIndex": 8,
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
      "x": 5231.038326234301,
      "y": 1080.1884147756557
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
      "x": 9469.005543129437,
      "y": 1083.4915363550103
    },
    {
      "id": "group-mt2ptc6z-inst-mt4lue57",
      "groupId": "group-mt2ptc6z",
      "x": 10446.998152290189,
      "y": 1083.4990595950012
    },
    {
      "id": "group-mt2ptc6z-inst-mt4luhya",
      "groupId": "group-mt2ptc6z",
      "x": 10651.946416415443,
      "y": 1083.4858939250175
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
      "x": 11881.415248468345,
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
      "x": 11746.519400953031,
      "y": 1078.4764898750293
    },
    {
      "id": "group-mt2pe7g1-inst-mt4m8vle",
      "groupId": "group-mt2pe7g1",
      "x": 12302.77681610425,
      "y": 1056.4915363550106
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
      "x": 12733.524846834582,
      "y": 1050.9013165669985
    },
    {
      "id": "group-mt2ploh9-inst-mt4mvdwz",
      "groupId": "group-mt2ploh9",
      "x": 13277.65311679471,
      "y": 1091.3189137900179
    },
    {
      "id": "group-mt2ppr1u-inst-mt4mvhp6",
      "groupId": "group-mt2ppr1u",
      "x": 13492.333949236605,
      "y": 1079.322675410013
    },
    {
      "id": "group-mt2pixb8-inst-mt4mvotm",
      "groupId": "group-mt2pixb8",
      "x": 13037.321015267918,
      "y": 1102.9924767600094
    }
  ]
}`;
