/**
 * Notes
 */
export const notesNames = {
	'A':  'A',
	'Bb': 'B♭',
	'B':  'B',
	'C':  'C',
	'Db': 'D♭',
	'D':  'D',
	'Eb': 'E♭',
	'E':  'E',
	'F':  'F',
	'Gb': 'G♭',
	'G':  'G',
	'Ab': 'A♭',
};
export const notes = Object.keys(notesNames);

/**
 * Intervals
 */
export const intervalsNames = [
	'Root',
	'Minor second',
	'Major second',
	'Minor third',
	'Major third',
	'Perfect fourth',
	'Diminished fifth',
	'Perfect fifth',
	'Minor sixth',
	'Major sixth',
	'Minor seventh',
	'Major seventh',
];

export const intervalsShorthands = [
	'R',
	'm2',
	'M2',
	'm3',
	'M3',
	'P4',
	'd5',
	'P5',
	'm6',
	'M6',
	'm7',
	'M7',
];

export const degrees = [
	 '1',
	'♭2',
	 '2',
	'♭3',
	 '3',
	 '4',
	'♭5',
	 '5',
	'♭6',
	 '6',
	'♭7',
	 '7',
];

/**
 * Models (scales & arpeggios)
 */
export const models = {

	// SCALES

	// Pentatonics
	'maj5':            { intervals: [2,  4,  7,  9],                             name: 'major pentatonic'              , positions: [[-1, 3], [1, 5], [3, 7], [6, 10], [9, 12]] },
	'min5':            { intervals: [3,  5,  7, 10],                             name: 'minor pentatonic'              , positions: [[ 0, 3], [2, 6], [4, 8], [7, 11], [9, 13]] },
	'bmaj5':           { intervals: [2,  5,  7,  9],                             name: 'pentatonic blues major'                                                                 },
	'bmin5':           { intervals: [3,  5,  8, 10],                             name: 'pentatonic blues minor'                                                                 },
	'egyp':            { intervals: [2,  5,  7, 10],                             name: 'egyptian'                                                                               },
	'in':              { intervals: [1,  5,  7,  8],                             name: 'in'                                                                                     },
	'hira':            { intervals: [4,  6,  7, 11],                             name: 'hirajoshi'                                                                              },
	'iwa':             { intervals: [1,  5,  6, 10],                             name: 'iwato'                                                                                  },
	'ins':             { intervals: [1,  5,  7, 10],                             name: 'insen'                                                                                  },

	// Custom
	'custom': { name: 'custom' },

	// Hexatonics
	'maj6':            { intervals: [2,  4,  5,  7,  9],                         name: 'major hexatonic'                                                                        },
	'min6':            { intervals: [2,  3,  5,  7,  8],                         name: 'minor hexatonic'                                                                        },
	'bmaj':            { intervals: [2,  3,  4,  7,  9],                         name: 'blues major'                   , positions: [[-1, 3], [1, 5], [3, 7], [6, 10], [9, 12]] },
	'bmin':            { intervals: [3,  5,  6,  7, 10],                         name: 'blues (minor)'                   , positions: [[ 0, 3], [2, 6], [4, 8], [7, 11], [9, 13]], useFlatFifth: true },
	'aug':             { intervals: [3,  4,  7,  8, 11],                         name: 'augmented'                                                                              },
	'wtone':           { intervals: [2,  4,  6,  8, 10],                         name: 'whole tone'                                                                             },
	'tri':             { intervals: [1,  4,  6,  7, 10],                         name: 'tritone'                                                                                },
	'2tri':            { intervals: [1,  2,  6,  7,  8],                         name: 'two-semitone tritone'                                                                   },
	'prom':            { intervals: [2,  4,  6,  9, 10],                         name: 'prometheus'                                                                             },

	// Heptatonics
	'ion':             { intervals: [2,  4,  5,  7,  9, 11],                     name: 'ionian'                        , positions: [[-1, 3], [1, 5], [3, 7], [6, 10], [8, 12]] },
	'dor':             { intervals: [2,  3,  5,  7,  9, 10],                     name: 'dorian'                                                                                 },
	'phry':            { intervals: [1,  3,  5,  7,  8, 10],                     name: 'phrygian'                                                                               },
	'lyd':             { intervals: [2,  4,  6,  7,  9, 11],                     name: 'lydian'                                                                                 },
	'mix':             { intervals: [2,  4,  5,  7,  9, 10],                     name: 'mixolydian'                                                                             },
	'aeo':             { intervals: [2,  3,  5,  7,  8, 10],                     name: 'aeolian'                       , positions: [[-1, 3], [2, 6], [4, 8], [7, 10], [9, 13]] },
	'locr':            { intervals: [1,  3,  5,  6,  8, 10],                     name: 'locrian'                                                                                },

	'harmaj':          { intervals: [2,  4,  5,  7,  8, 11],                     name: 'harmonic major'                                                                         },
	'dharmaj':         { intervals: [1,  4,  5,  7,  8, 11],                     name: 'double harmonic major'                                                                  },
	'harmmin':         { intervals: [2,  3,  5,  7,  8, 11],                     name: 'harmonic minor'                , positions: [[-1, 3], [2, 6], [3, 7], [6, 10], [9, 13]] },
	'dharmmin':        { intervals: [2,  3,  6,  7,  8, 11],                     name: 'double harmonic minor'         , positions: [[-1, 3], [2, 6], [3, 7], [6, 10], [9, 13]] },
	'amel':            { intervals: [2,  3,  5,  7,  9, 11],                     name: 'ascending melodic minor'       , positions: [[-1, 3], [1, 5], [3, 7], [6, 10], [9, 13]] },
	'dmel':            { intervals: [2,  3,  5,  7,  8, 10],                     name: 'descending melodic minor'                                                               },

	'dorf2':           { intervals: [1,  3,  5,  7,  9, 10],                     name: 'dorian ♭2'                                                                              },
	'lydaug':          { intervals: [2,  4,  6,  8,  9, 11],                     name: 'lydian augmented'                                                                       },
	'lyddom':          { intervals: [2,  4,  6,  7,  9, 10],                     name: 'lydian dominant'                                                                        },
	'locrs2':          { intervals: [2,  3,  5,  6,  8, 10],                     name: 'locrian ♯2'                                                                             },
	'alt':             { intervals: [1,  3,  4,  6,  8, 10],                     name: 'altered'                                                                                },
	'phrydom':         { intervals: [1,  4,  5,  7,  8, 10],                     name: 'phrygian dominant'                                                                      },
	'ultphry':         { intervals: [1,  3,  4,  7,  8,  9],                     name: 'ultraphrygian'                                                                          },
	'aeodom':          { intervals: [2,  4,  5,  7,  8, 10],                     name: 'aeolian dominant'                                                                       },

	'majneap':         { intervals: [1,  3,  5,  7,  9, 11],                     name: 'major neapolitan'                                                                       },
	'minneap':         { intervals: [1,  3,  5,  7,  8, 11],                     name: 'minor neapolitan'                                                                       },
	'pers':            { intervals: [1,  4,  5,  6,  8, 11],                     name: 'persian'                                                                                },
	'hungmaj':         { intervals: [3,  4,  6,  7,  9, 10],                     name: 'hungarian major'                                                                        },
	'hungmin':         { intervals: [2,  3,  6,  7,  8, 11],                     name: 'hungarian minor'                                                                        },
	'gypsy':           { intervals: [2,  3,  6,  7,  8, 10],                     name: 'gypsy'                                                                                  },
	'ukrdor':          { intervals: [2,  3,  6,  7,  9, 10],                     name: 'ukranian dorian'                                                                        },
	'eni':             { intervals: [1,  4,  6,  8, 10, 11],                     name: 'enigmatic'                                                                              },

	// Octatonics
	'dimhw':           { intervals: [1,  3,  4,  6,  7,  9, 10],                 name: 'diminished (half/whole)'                                                                },
	'dimwh':           { intervals: [2,  3,  5,  6,  8,  9, 11],                 name: 'diminished (whole/half)'                                                                },

	'bebdom':          { intervals: [2,  4,  5,  7,  9, 10, 11],                 name: 'bebop dominant'                                                                         },
	'bebmaj':          { intervals: [2,  4,  5,  7,  8,  9, 11],                 name: 'bebop major'                                                                            },
	'bebdor':          { intervals: [2,  3,  4,  5,  7,  9, 10],                 name: 'bebop dorian'                                                                           },
	'bebdoralt':       { intervals: [2,  3,  5,  7,  9, 10, 11],                 name: 'bebop dorian (alt.)'                                                                    },
	'bebharmin':       { intervals: [2,  3,  5,  7,  8, 10, 11],                 name: 'bebop harmonic minor'                                                                   },
	'bebmel':          { intervals: [2,  3,  5,  7,  8,  9, 11],                 name: 'bebop melodic minor'                                                                    },

	// Chromatic
	'chro':            { intervals: [1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11], name: 'chromatic'                                                                              },

	// ARPEGGIOS

	// Powerchord
	'arp-pow':         { intervals: [7],                                         name: 'fifth (powerchord)'                                                                     },

	// Triads
	'arp-maj':         { intervals: [4,  7],                                     name: 'major'                                                                                  },
	'arp-majf5':       { intervals: [4,  6],                                     name: 'major flat 5th'                                                                         },
	'arp-min':         { intervals: [3,  7],                                     name: 'minor'                                                                                  },
	'arp-aug':         { intervals: [4,  8],                                     name: 'augmented'                                                                              },
	'arp-dim':         { intervals: [3,  6],                                     name: 'diminished', useFlatFifth: true,                                                                             },
	'arp-sus2':        { intervals: [2,  7],                                     name: 'suspended 2nd'                                                                          },
	'arp-sus4':        { intervals: [5,  7],                                     name: 'suspended 4th'                                                                          },

	// Sixth chords
	'arp-maj6':        { intervals: [4,  7,  9],                                 name: 'major 6th'                                                                              },
	'arp-min6':        { intervals: [3,  7,  9],                                 name: 'minor 6th'                                                                              },
	'arp-minf6':       { intervals: [3,  7,  8],                                 name: 'minor flat 6th'                                                                         },

	// Seventh chords
	'arp-dom7':        { intervals: [4,  7, 10],                                 name: 'dominant 7th'                                                                           },
	'arp-dom7f5':      { intervals: [4,  6, 10],                                 name: 'dominant 7th flat 5th'                                                                  },
	'arp-maj7':        { intervals: [4,  7, 11],                                 name: 'major 7th'                                                                              },
	'arp-min7':        { intervals: [3,  7, 10],                                 name: 'minor 7th'                                                                              },
	'arp-minmaj7':     { intervals: [3,  7, 11],                                 name: 'minor-major 7th'                                                                        },
	'arp-aug7':        { intervals: [4,  8, 10],                                 name: 'augmented 7th'                                                                          },
	'arp-augmaj7':     { intervals: [4,  8, 11],                                 name: 'augmented major 7th'                                                                    },
	'arp-hdim7':       { intervals: [3,  6, 10],                                 name: 'half-diminished 7th', useFlatFifth: true,                                                                    },
	'arp-dimmaj7':     { intervals: [3,  6, 11],                                 name: 'diminished major 7th', useFlatFifth: true,                                                                   },
	'arp-dim7':        { intervals: [3,  6,  9],                                 name: 'diminished 7th', useFlatFifth: true                                                                         },
	'arp-dom7s9':      { intervals: [4,  7, 10,  3],                             name: '7th♯9 (Hendrix chord)'                                                                  },

	// Ninth chords
	'arp-majadd9':     { intervals: [4,  7,  2],                                 name: 'major added 9th'                                                                        },
	'arp-dom9':        { intervals: [4,  7, 10,  2],                             name: 'dominant 9th'                                                                           },
	'arp-dommin9':     { intervals: [4,  7, 10,  1],                             name: 'dominant minor 9th'                                                                     },
	'arp-domaug9':     { intervals: [4,  7, 10,  3],                             name: 'dominant augmented 9th'                                                                 },
	'arp-maj9':        { intervals: [4,  7, 11,  2],                             name: 'major 9th'                                                                              },
	'arp-min9':        { intervals: [3,  7, 10,  2],                             name: 'minor 9th'                                                                              },
	'arp-minmaj9':     { intervals: [3,  7, 11,  2],                             name: 'minor-major 9th'                                                                        },
	'arp-aug9':        { intervals: [4,  7, 10,  3],                             name: 'augmented 9th'                                                                          },
	'arp-augmaj9':     { intervals: [4,  7, 11,  3],                             name: 'augmented major 9th'                                                                    },
	'arp-hdim9':       { intervals: [3,  6, 10,  2],                             name: 'half-diminished 9th', useFlatFifth: true,                                                                    },
	'arp-hdimmin9':    { intervals: [3,  6, 10,  1],                             name: 'half-diminished minor 9th', useFlatFifth: true,                                                              },
	'arp-dim9':        { intervals: [3,  6,  9,  2],                             name: 'diminished 9th', useFlatFifth: true,                                                                         },
	'arp-dimmin9':     { intervals: [3,  6,  9,  1],                             name: 'diminished minor 9th', useFlatFifth: true,                                                                   },
	'arp-69':          { intervals: [4,  7,  9,  2],                             name: '6/9'                                                                                    },
	'arp-min69':       { intervals: [3,  7,  9,  2],                             name: 'minor 6/9'                                                                              },
	'arp-minf69':      { intervals: [3,  7,  8,  2],                             name: 'minor ♭6/9'                                                                             },

	// Eleventh chords
	'arp-dom11':       { intervals: [4,  7, 10,  5],                             name: 'dominant 11th'                                                                          },
	'arp-maj11':       { intervals: [4,  7, 11,  5],                             name: 'major 11th'                                                                             },
	'arp-majaug11':    { intervals: [4,  7, 11,  6],                             name: 'major augmented 11th'                                                                   },
	'arp-min11':       { intervals: [3,  7, 10,  5],                             name: 'minor 11th'                                                                             },
	'arp-dom911':      { intervals: [4,  7, 10,  2,  5],                         name: 'dominant 9th 11th'                                                                      },
	'arp-maj911':      { intervals: [4,  7, 11,  2,  5],                         name: 'major 9th 11th'                                                                         },
	'arp-minmaj11':    { intervals: [3,  7, 11,  2,  5],                         name: 'minor-major 9th 11th'                                                                   },
	'arp-min911':      { intervals: [3,  7, 10,  2,  5],                         name: 'minor 9th 11th'                                                                         },
	'arp-aug911':      { intervals: [4,  8, 10,  2,  5],                         name: 'augmented 9th 11th'                                                                     },
	'arp-augmaj911':   { intervals: [4,  8, 11,  2,  5],                         name: 'augmented major 9th 11th'                                                               },
	'arp-hdim911':     { intervals: [3,  6, 10,  2,  5],                         name: 'half-diminished 9th 11th', useFlatFifth: true,                                                               },
	'arp-dim911':      { intervals: [3,  6,  9,  2,  5],                         name: 'diminished 9th 11th', useFlatFifth: true                                                                    },

	// Thirteenth chords
	'arp-dom13':       { intervals: [4,  7, 10,  9],                             name: 'dominant 13th'                                                                          },
	'arp-maj13':       { intervals: [4,  7, 11,  9],                             name: 'major 13th'                                                                             },
	'arp-min13':       { intervals: [3,  7, 10,  9],                             name: 'minor 13th'                                                                             },
	'arp-dom91113':    { intervals: [4,  7, 10,  2,  5,  9],                     name: 'dominant 9th 11th 13th'                                                                 },
	'arp-maj91113':    { intervals: [4,  7, 11,  2,  5,  9],                     name: 'major 9th 11th 13th'                                                                    },
	'arp-min91113':    { intervals: [3,  7, 10,  2,  5,  9],                     name: 'minor 9th 11th 13th'                                                                    },
	'arp-minmaj91113': { intervals: [3,  7, 11,  2,  5,  9],                     name: 'minor-major 9th 11th 13th'                                                              },
	'arp-aug91113':    { intervals: [4,  8, 10,  2,  5,  9],                     name: 'augmented 9th 11th 13th'                                                                },
	'arp-augmaj91113': { intervals: [4,  8, 11,  2,  5,  9],                     name: 'augmented major 9th 11th 13th'                                                          },
	'arp-hdim91113':   { intervals: [3,  6, 10,  2,  5,  9],                     name: 'half-diminished 9th 11th 13th', useFlatFifth: true,                                                          },

	// Ragas -- Pentatonic
	'raag-bairagi': { intervals: [ 1, 5, 7, 10], name: 'raag bairagi'},
	'raag-malkauna': { intervals: [ 3, 5, 8, 10], name: 'raag malkauna'},
	'raag-chandrakauna': { intervals: [ 3, 5, 8, 11], name: 'raag chandrakauns'},
	'raag-gunkali':  { intervals: [ 1, 5, 7, 8 ], name: 'raag gunkali'},
	'raag-durga': { intervals: [ 2, 5, 7, 9 ], name: 'raag durga'},
	'raag-kalawati': { intervals: [4, 7, 9, 10], name: 'raag kalawati'},
	'raag-madhukauns': { intervals: [3, 6, 7, 10], name: 'raag madhukauns'},
	'raag-madhymadi-sarang': { intervals: [2, 5, 7, 10], name: 'raag madhhymadi sarang'},
	'raag-hansdhwni': { intervals: [2,4,7,11], name: 'raag hansdhwni'},

	// Ragas -- Hexatonic
	'raag-puriya': { intervals: [ 1, 4, 6, 9, 11 ], name: 'raag puriya'},
	'raag-parmeshwari': { intervals: [1,3,5,9,10], name: 'raag parmeshwari'},
	'raag-salag-varali': { intervals: [1,3,7,9,10], name: 'raag salag varali'},
	'raag-saraswati': { intervals: [2,6,7,9,10], name: 'raag saraswati'},

	'raag-rageshree-ascending': { intervals: [2, 5, 9, 10], name: 'raag rageshree ascending'},
	'raag-rageshree-descending': { intervals: [2,4,5,9,10], name: 'raag rageshree descending'},
	'raag-bageshree-ascending': { intervals: [3, 5, 9, 10], name: 'raag bageshree ascending'},
	'raag-bageshree-descending': { intervals: [2, 3, 5, 9, 10], name: 'raag bageshree descending'},

	// Ragas -- Heptatonic
	'raag-todi': { intervals: [1,3,6,7,8,11], name: 'raag todi'},
	'raag-poorya-kalyan-ascending': { intervals: [1,4,6,9,11], name: 'raag poorya kalyan ascending'},
	'raag-poorya-kalyan-descending': { intervals: [1,4,6,7,9,11], name: 'raag poorya kalyan descending'}
};
// Aliases. Use for consistency in <select>.
models['natmaj'] = {...models['ion'], name: 'major'};
models['natmin'] = {...models['aeo'], name: 'natural minor'};

/** Map of mode name to mode interval from major scale in semi-tones. */
const MODE_LOOKUP = {
	'minor': 9,
	'ionian': 0,
	'dorian': 2,
	'phrygian': 4,
	'lydian': 5,
	'mixolydian': 7,
	'aeolian': 9,
	'locrian': 12
};

/** Assign a mode to a model, in terms of semitones from the major scale.
 *  Used to resolve sharps and flats.
 */
function assignMode(model) {
	for (const [name,semitones] of Object.entries(MODE_LOOKUP)) {
		if (model.name.includes(name)) return semitones;
	}

	return 0;
}

for (const model of Object.values(models)) {
	model.mode = assignMode(model);
}
window.models = models;

/**
 * Instruments
 */
export const instruments = {
	'guitar':    { name: 'Guitar',            nbStrings:  6 },
	'bass':      { name: 'Bass',              nbStrings:  4 },
	'bass-5':    { name: '5-string bass',     nbStrings:  5 },
	'bass-6':    { name: '6-string bass',     nbStrings:  6 },
	'ukulele':   { name: 'Ukulele',           nbStrings:  4 },
	'banjo-4':   { name: '4-string banjo',    nbStrings:  4 },
	'banjo-5':   { name: '5-string banjo',    nbStrings:  5 },
	// While a mandolin has 8 strings, we say it has 4 for music theory
	// purposes, as each string is dobled.
	'mandolin':  { name: 'Mandolin',          nbStrings:  4 },
	'guitar-7':  { name: '7-string guitar',   nbStrings:  7 },
	'guitar-8':  { name: '8-string guitar',   nbStrings:  8 },
	'guitar-9':  { name: '9-string guitar',   nbStrings:  9 },
	'guitar-10': { name: '10-string guitar',  nbStrings: 10 },
	// 'guitar-11': { name: '11-string guitar',  nbStrings: 11 },
	'guitar-12': { name: '12-string guitar',  nbStrings: 12 },
	
	'cigar-box-4': {name: '4-string cigar box', nbStrings: 4 }
};

/**
 * Tunings
 */
export const tunings = {
	'guitar': {
		'standard':       ['E',  'A',  'D',  'G',  'B',  'E' ],
		'hstep-down':     ['Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'],
		'lower-d':        ['D',  'G',  'C',  'F',  'A',  'D' ],
		'drop-d':         ['D',  'A',  'D',  'G',  'B',  'E' ],
		'ddrop-d':        ['D',  'A',  'D',  'G',  'B',  'D' ],
		'drop-c':         ['C',  'G',  'C',  'F',  'A',  'D' ],
		'ddrop-c':        ['C',  'G',  'C',  'F',  'A',  'C' ],
		'higher-f':       ['F',  'Bb', 'Eb', 'Ab', 'C',  'F' ],
		'higher-fs':      ['Gb', 'B',  'E',  'A',  'Db', 'Gb'],
		'min-thirds':     ['C',  'Eb', 'Gb', 'A',  'C',  'Eb'],
		'maj-thirds':     ['Ab', 'C',  'E',  'Ab', 'C',  'E' ],
		'all-fourths':    ['E',  'A',  'D',  'G',  'C',  'F' ],
		'aug-fourths':    ['B',  'F',  'B',  'F',  'B',  'F' ],
		'all-fifths':     ['C',  'G',  'D',  'A',  'E',  'B' ],
		'nst':            ['C',  'G',  'D',  'A',  'E',  'G' ],
		'open-a':         ['E',  'A',  'E',  'A',  'Db', 'E' ],
		'open-b':         ['B',  'Gb', 'B',  'Gb', 'B',  'Eb'],
		'open-c':         ['C',  'G',  'C',  'G',  'C',  'E' ],
		'open-csus2':     ['C',  'G',  'C',  'D',  'G',  'C' ],
		'open-d':         ['D',  'A',  'D',  'Gb', 'A',  'D' ],
		'open-dm911':     ['D',  'F',  'A',  'C',  'E',  'G' ],
		'open-d6':        ['D',  'A',  'D',  'Gb', 'A',  'B' ],
		'open-d6sus2':    ['D',  'A',  'D',  'E',  'A',  'B' ],
		'open-d7':        ['D',  'A',  'D',  'Gb', 'A',  'C' ],
		'open-d7sus2':    ['D',  'A',  'D',  'E',  'A',  'C' ],
		'open-dm':        ['D',  'A',  'D',  'F',  'A',  'D' ],
		'open-dm6':       ['D',  'A',  'D',  'F',  'A',  'B' ],
		'open-dm7':       ['D',  'A',  'D',  'F',  'A',  'C' ],
		'open-dsus4':     ['D',  'A',  'D',  'G',  'A',  'D' ],
		'open-e':         ['E',  'B',  'E',  'Ab', 'B',  'E' ],
		'open-f':         ['F',  'A',  'C',  'F',  'C',  'F' ],
		'open-g':         ['D',  'G',  'D',  'G',  'B',  'D' ],
	},
	'guitar-7': {
		'standard':       ['B',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'lower-bf':       ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'],
		'lower-a':        ['A',  'D',  'G',  'C',  'F',  'A',  'D' ],
		'higher-c':       ['C',  'F',  'Bb', 'Eb', 'Ab', 'C',  'F' ],
		'higher-cs':      ['Db', 'Gb', 'B',  'E',  'A',  'Db', 'Gb'],
		'drop-a':         ['A',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'maj-thirds':     ['E',  'Ab', 'C',  'E',  'Ab', 'C',  'E' ],
		'all-fourths':    ['B',  'E',  'A',  'D',  'G',  'C',  'F' ],
		'choro':          ['C',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'treble':         ['E',  'A',  'D',  'G',  'B',  'E',  'A' ],
		'russian':        ['D',  'G',  'B',  'D',  'G',  'B',  'D' ],
		'russian-var':    ['C',  'G',  'B',  'D',  'G',  'B',  'D' ],
		'big-guitar':     ['G',  'C',  'E',  'G',  'C',  'E',  'G' ],
	},
	'guitar-8': {
		'standard':       ['Gb', 'B',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'lower-f':        ['F',  'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'],
		'lower-e':        ['E',  'A',  'D',  'G',  'C',  'F',  'A',  'D' ],
		'maj-thirds':     ['E',  'Ab', 'C',  'E',  'Ab', 'C',  'E',  'Ab'],
		'all-fourths':    ['Gb', 'B',  'E',  'A',  'D',  'G',  'C',  'F' ],
		'af-dropped':     ['E',  'B',  'E',  'A',  'D',  'G',  'C',  'F' ],
		'drop-e':         ['E',  'B',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'e6':             ['E',  'C',  'A',  'G',  'E',  'C',  'A',  'F' ],
		'e13':            ['E',  'Db', 'B',  'Ab', 'Gb', 'E',  'D',  'B' ],
	},
	'guitar-9': {
		'standard':       ['Db', 'Gb', 'B',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'lower-b':        ['B',  'E',  'A',  'D',  'G',  'C',  'F',  'A',  'D' ],
	},
	'guitar-10': {
		'standard':       ['Ab',  'Db',  'Gb',  'B',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'yepes-low':      ['Gb', 'Ab', 'Bb', 'C',  'E',  'A',  'D',  'G',  'B',  'E' ],
		'yepes-high':     ['E',  'A',  'D',  'G',  'B',  'E',  'C',  'Bb', 'A',  'Gb'],
		'baroque':        ['E',  'B',  'G',  'D',  'A',  'E',  'B',  'G',  'D',  'A' ],
		'english':        ['C',  'E',  'G',  'G',  'C',  'C',  'E',  'E',  'G',  'G' ],
	},
	'guitar-11': {
		'standard':       ['Bb', 'C',  'D',  'Eb', 'F',  'G',  'C',  'F',  'Bb', 'D',  'G' ],
	},
	'guitar-12': {
		'standard':       ['E',  'E',  'A',  'A',  'D',  'D',  'G',  'G',  'B',  'B',  'E',  'E'  ],
	},
	'bass': {
		'standard':       ['E',  'A',  'D',  'G' ],
		'drop-d':         ['D',  'A',  'D',  'G' ],
		'hstep-down':     ['Eb', 'Ab', 'Db', 'Gb'],
		'lower-d':        ['D',  'G',  'C',  'F' ],
		'lower-d-drop-c': ['C',  'G',  'C',  'F' ],
		'all-fifths':     ['C',  'G',  'D',  'A' ],
	},
	'bass-5': {
		'standard':       ['B',  'E',  'A',  'D',  'G' ],
		'drop-a':         ['A', 'E', 'A', 'D', 'G', 'C']
	},
	'bass-6': {
		'standard':       ['B',  'E',  'A',  'D',  'G',  'C' ],
	},
	'banjo-4': {
		'standard':       ['C',  'G',  'B',  'D' ],
		'chicago':        ['D',  'G',  'B',  'E' ],
		'irish':          ['G',  'D',  'A',  'E' ],
		'open-d':         ['A',  'D',  'A',  'D' ],
		'open-g':         ['D',  'G',  'D',  'G' ],
		'fifths':         ['C',  'G',  'D',  'A' ],
		'all-fourths':    ['E',  'A',  'D',  'G' ],
	},
	'banjo-5': {
		// the first string is actually tuned 5 semitones down due to assymetry
		//                 [ ] 
		'standard':       ['D',  'D',  'G',  'B',  'D' ],
		'open-a':         ['E',  'E',  'A',  'Db', 'E' ],
		'open-d':         ['Db', 'D',  'Gb', 'A',  'D' ],
		'open-g':         ['D',  'D',  'G',  'B',  'D' ],
		'double-c':       ['D',  'C',  'G',  'C',  'D' ],
		'double-d':       ['E',  'D',  'A',  'D',  'E' ],
		'sawmill':        ['D',  'D',  'G',  'C',  'D' ],
	},
	'cigar-box-4': {
		'open-g': ['D','G','B','D'],
		'standard': ['D', 'G', 'B', 'E']
	},
	'ukulele': {
		'standard':       ['G',  'C',  'E',  'A' ],
		'd-tuning':       ['A',  'D',  'Gb', 'B' ],
		'baritone':       ['D',  'G',  'B',  'E' ],
		'dorota':         ['E',  'B',  'E',  'A' ],
	},
	'mandolin': {
		'standard':       ['G', 'D',  'A', 'E' ],
	},
};
// Add custom tunings to all instruments.
for (const [instrumentName,instrumentTunings] of Object.entries(tunings)) {
	// The actual value used here does not matter.
	// We only need to ensure that the key exists.
	// This is necessary because the keys of each instrumentTunings
	// object populate the options in the <select> in the UI.
	tunings[instrumentName] = Object.assign(
		{standard:null, custom:[]}, 
		instrumentTunings
	);
}

export const tuningsNames = {
	'standard':       'Standard tuning',
	'custom':         'Custom',

	// Guitar
	'hstep-down':     'Half-step down',
	'lower-d':        'Lower D',
	'drop-d':         'Drop D',
	'drop-c':         'Drop C',
	'ddrop-d':        'Double drop D',
	'ddrop-c':        'Double drop C',
	'higher-f':       'Higher F',
	'higher-fs':      'Higher F♯',
	'min-thirds':     'Minor thirds',
	'maj-thirds':     'Major thirds',
	'all-fourths':    'All-fourths',
	'aug-fourths':    'Augmented fourths',
	'all-fifths':     'All-fifths',
	'nst':            'New standard tuning',
	'open-a':         'Open A',
	'open-b':         'Open B',
	'open-c':         'Open C',
	'open-csus2':     'Open Csus2',
	'open-d':         'Open D',
	'open-dm911':     'Open Dm9/11',
	'open-d6':        'Open D6',
	'open-d6sus2':    'Open D6sus2',
	'open-d7':        'Open D7',
	'open-d7sus2':    'Open D7sus2',
	'open-dm':        'Open Dm',
	'open-dm6':       'Open Dm6',
	'open-dm7':       'Open Dm7',
	'open-dsus4':     'Open Dsus4',
	'open-e':         'Open E',
	'open-g':         'Open G',
	'open-f':         'Open F',

	// 7-string guitar
	'drop-a':         'Drop A',
	'lower-bf':       'Lower B♭',
	'lower-a':        'Lower A',
	'higher-c':       'Higher C',
	'higher-cs':      'Higher C♯',
	'choro':          'Choro',
	'treble':         'Treble string',
	'russian':        'Russian guitar (Gypsy guitar)',
	'russian-var':    'Russian guitar (variant)',
	'big-guitar':     'Big guitar',

	// 8-string guitar
	'lower-f':        'Lower F',
	'lower-e':        'Lower E',
	'drop-e':         'Drop E',
	'af-dropped':     'All-fourths + Drop E',
	'e6':             'E6',
	'e13':            'E13',

	// 9-string guitar
	'lower-b':        'Lower B',

	// 10-string guitar
	'yepes-low':      'Yepes tuning (low)',
	'yepes-high':     'Yepes tuning (high)',
	'baroque':        'Baroque tuning',
	'english':        'English guitar',

	// Bass
	'lower-d-drop-c': 'Lower D + Drop C',
	'std-low':        'Standard Low',

	// Banjo
	'chicago':        'Chicago tuning',
	'irish':          'Irish tuning',
	'double-c':       'Double C',
	'double-d':       'Double D',
	'sawmill':        'Sawmill (Mountain modal)',

	// Ukulele
	'd-tuning':       'D tuning',
	'baritone':       'Baritone',
	'dorota':         'Dorota',
};
