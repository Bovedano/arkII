export const LEVEL_03_TEXT = `{
  "id": "level-mrxhqjwz",
  "title": "La vida en la alameda",
  "config": {
    "width": 12573,
    "height": 1240,
    "gravity": 600,
    "background": "#52f3ff",
    "camera": {
      "marginX": 100
    }
  },
  "sublevels": [],
  "elements": [
    {
      "id": "CervezaEstrella-ms7qtwjl",
      "type": "CervezaEstrella",
      "x": 318.36710750529363,
      "y": 1153.4531674562186,
      "params": {
        "zIndex": 5,
        "behavior": "sensor",
        "scale": 0.9999999999999957
      }
    },
    {
      "id": "Arbol-ms7rzahe",
      "type": "Arbol",
      "x": 1828.8543969228267,
      "y": 852.1767304382229,
      "params": {
        "zIndex": 5,
        "behavior": "background",
        "scale": 2.8679387727297065
      }
    },
    {
      "id": "Penista-ms96tayh",
      "type": "Penista",
      "x": 3941.6719095015496,
      "y": 1131.1874853707034,
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
      "x": 12833.826280529682,
      "y": 1203.2159090909097,
      "params": {
        "centerCount": 400,
        "theme": "green",
        "height": 64,
        "zIndex": 0,
        "behavior": "solid"
      }
    },
    {
      "id": "CervezaEstrella-msa5zonj",
      "type": "CervezaEstrella",
      "x": 3540.781484029757,
      "y": 1041.7623966942149,
      "params": {
        "zIndex": 5,
        "behavior": "sensor",
        "scale": 1
      }
    },
    {
      "id": "AguaRio-msboz478",
      "type": "AguaRio",
      "x": 2161.906764410922,
      "y": 1221.5757083825267,
      "params": {
        "zIndex": 5,
        "behavior": "background",
        "scale": 1.529501878057256
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
      "x": 12565.319036803776,
      "y": 308.73863636363643,
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
      "x": 1636.3178471057106,
      "y": 1058.1834893048126,
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
      "x": 4619.398076953434,
      "y": 784.3149350649351,
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
      "id": "PajaroBlanco-msetmgxc",
      "type": "PajaroBlanco",
      "x": 3260.2686698244142,
      "y": 914.9943181818182,
      "params": {
        "scale": 1,
        "rotation": 0,
        "flipX": false,
        "flipY": false,
        "zIndex": 8,
        "behavior": "damage",
        "patrolDistance": 240,
        "speed": 150,
        "startDirection": "east",
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
          "x": 32.84134799181169,
          "y": 9.852224603459945,
          "params": {
            "zIndex": 5,
            "behavior": "sensor",
            "scale": 0.3858713731425526
          }
        },
        {
          "id": "ColorBlock-msek7r1m",
          "type": "ColorBlock",
          "x": 0,
          "y": 0,
          "params": {
            "scale": 1,
            "width": 65,
            "height": 54,
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
    }
  ],
  "groupInstances": [
    {
      "id": "group-msa5xm8x-inst-msa5xm8x",
      "groupId": "group-msa5xm8x",
      "x": 667.7138714628561,
      "y": 1088.5539267849379
    },
    {
      "id": "group-msa5xm8x-inst-msa5yk1p",
      "groupId": "group-msa5xm8x",
      "x": 1545.833856374626,
      "y": 1092.550914994097
    },
    {
      "id": "group-msa5xm8x-inst-msa5zcai",
      "groupId": "group-msa5xm8x",
      "x": 2671.244924429432,
      "y": 1078.2175324675325
    },
    {
      "id": "group-msekh6qu-inst-msekh6qu",
      "groupId": "group-msekh6qu",
      "x": 426.2843905732688,
      "y": 1126.3846007006825
    },
    {
      "id": "group-mseq0wci-inst-mseq0wci",
      "groupId": "group-mseq0wci",
      "x": 3165.267104256336,
      "y": 1004.5112387612388
    },
    {
      "id": "group-mseqqblu-inst-mser1k3b",
      "groupId": "group-mseqqblu",
      "x": 4640.274563241794,
      "y": 791.3068181818187
    },
    {
      "id": "group-msa5xm8x-inst-mser4wow",
      "groupId": "group-msa5xm8x",
      "x": 4128.69378306917,
      "y": 1085.5605076741408
    },
    {
      "id": "group-msekh6qu-inst-mser55ka",
      "groupId": "group-msekh6qu",
      "x": 4509.448291881095,
      "y": 1123.0575560802833
    }
  ]
}`;
