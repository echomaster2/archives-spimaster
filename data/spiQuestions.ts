
export interface SPIQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

export const spiQuestions: SPIQuestion[] = [
  {
    id: 'spi_01',
    category: 'Physics Principles',
    question: 'What happens to the period of a wave if the frequency is doubled?',
    options: [
      'It doubles',
      'It is halved',
      'It quadruples',
      'It remains unchanged'
    ],
    correctAnswer: 1,
    explanation: 'Frequency and period are inversely related (f = 1/T). If frequency doubles, the period must be halved.'
  },
  {
    id: 'spi_02',
    category: 'Transducers',
    question: 'Which of the following is the most common piezoelectric material used in ultrasound transducers?',
    options: [
      'Quartz',
      'Tourmaline',
      'Lead Zirconate Titanate (PZT)',
      'Barium Titanate'
    ],
    correctAnswer: 2,
    explanation: 'Lead Zirconate Titanate (PZT) is the most common synthetic piezoelectric material used in modern ultrasound transducers.'
  },
  {
    id: 'spi_03',
    category: 'Doppler',
    question: 'What is the Doppler shift if the transmitted frequency is 5 MHz and the received frequency is 5.002 MHz?',
    options: [
      '2 kHz',
      '5 kHz',
      '0.002 MHz',
      'Both A and C'
    ],
    correctAnswer: 3,
    explanation: 'The Doppler shift is the difference between the received and transmitted frequencies. 5.002 MHz - 5 MHz = 0.002 MHz, which is equal to 2 kHz.'
  },
  {
    id: 'spi_04',
    category: 'Artifacts',
    question: 'Which artifact is caused by the sound beam bouncing between two strong reflectors?',
    options: [
      'Shadowing',
      'Enhancement',
      'Reverberation',
      'Mirror Image'
    ],
    correctAnswer: 2,
    explanation: 'Reverberation occurs when sound bounces back and forth between two strong reflectors, creating multiple equally spaced echoes.'
  },
  {
    id: 'spi_05',
    category: 'Safety',
    question: 'Which index is most relevant when considering the potential for bioeffects due to cavitation?',
    options: [
      'Thermal Index (TI)',
      'Mechanical Index (MI)',
      'Spatial Peak Temporal Average (SPTA)',
      'Duty Factor'
    ],
    correctAnswer: 1,
    explanation: 'The Mechanical Index (MI) is related to the likelihood of cavitation (bubble formation) in the tissues.'
  },
  {
    id: 'spi_06',
    category: 'Resolution',
    question: 'Axial resolution is primarily determined by:',
    options: [
      'Beam width',
      'Spatial pulse length',
      'Transducer diameter',
      'Focusing'
    ],
    correctAnswer: 1,
    explanation: 'Axial resolution = SPL / 2. Therefore, it is determined by the spatial pulse length.'
  },
  {
    id: 'spi_07',
    category: 'Hemodynamics',
    question: 'According to Poiseuille\'s equation, if the radius of a vessel is doubled, the flow rate increases by a factor of:',
    options: [
      '2',
      '4',
      '8',
      '16'
    ],
    correctAnswer: 3,
    explanation: 'Flow rate is proportional to the radius to the fourth power (r^4). 2^4 = 16.'
  },
  {
    id: 'spi_08',
    category: 'Instrumentation',
    question: 'Which component of the ultrasound system is responsible for adjusting the signal to compensate for attenuation?',
    options: [
      'Pulser',
      'Receiver (TGC)',
      'Scan Converter',
      'Display'
    ],
    correctAnswer: 1,
    explanation: 'Time Gain Compensation (TGC) in the receiver compensates for the effects of attenuation as sound travels deeper into the body.'
  },
  {
    id: 'spi_09',
    category: 'Waves',
    question: 'Sound is a __________, __________ wave.',
    options: [
      'Transverse, Electromagnetic',
      'Longitudinal, Mechanical',
      'Transverse, Mechanical',
      'Longitudinal, Electromagnetic'
    ],
    correctAnswer: 1,
    explanation: 'Sound is a mechanical wave (requires a medium) and a longitudinal wave (particles move parallel to the direction of wave travel).'
  },
  {
    id: 'spi_10',
    category: 'Transducers',
    question: 'The thickness of the matching layer is typically:',
    options: [
      '1/2 wavelength',
      '1/4 wavelength',
      '1 wavelength',
      '2 wavelengths'
    ],
    correctAnswer: 1,
    explanation: 'The matching layer is designed to be 1/4 of the wavelength thick to minimize reflections at the transducer-skin interface.'
  },
  {
    id: 'spi_11',
    category: 'Doppler',
    question: 'Aliasing occurs when the Doppler shift exceeds:',
    options: [
      'The Pulse Repetition Frequency (PRF)',
      'Half the PRF (Nyquist Limit)',
      'Twice the PRF',
      'The operating frequency'
    ],
    correctAnswer: 1,
    explanation: 'Aliasing occurs when the Doppler shift frequency exceeds the Nyquist limit, which is PRF / 2.'
  },
  {
    id: 'spi_12',
    category: 'Artifacts',
    question: 'A "comet tail" artifact is a form of:',
    options: [
      'Shadowing',
      'Enhancement',
      'Reverberation',
      'Refraction'
    ],
    correctAnswer: 2,
    explanation: 'Comet tail artifact is a type of reverberation artifact caused by very closely spaced reflectors.'
  },
  {
    id: 'spi_13',
    category: 'Safety',
    question: 'The ALARA principle stands for:',
    options: [
      'As Low As Reasonably Achievable',
      'Always Low And Right Always',
      'As Long As Reasonably Allowed',
      'A Low Acoustic Radiation Area'
    ],
    correctAnswer: 0,
    explanation: 'ALARA (As Low As Reasonably Achievable) is the fundamental principle of ultrasound safety, emphasizing the use of minimum power and time necessary.'
  },
  {
    id: 'spi_14',
    category: 'Resolution',
    question: 'Lateral resolution is equal to:',
    options: [
      'SPL / 2',
      'Beam diameter',
      'Wavelength / 2',
      'Pulse duration'
    ],
    correctAnswer: 1,
    explanation: 'Lateral resolution is determined by the width or diameter of the sound beam.'
  },
  {
    id: 'spi_15',
    category: 'Hemodynamics',
    question: 'The Reynold\'s number predicts the onset of:',
    options: [
      'Laminar flow',
      'Turbulent flow',
      'Plug flow',
      'Parabolic flow'
    ],
    correctAnswer: 1,
    explanation: 'The Reynold\'s number is used to predict whether blood flow will be laminar or turbulent. A value over 2000 typically indicates turbulence.'
  },
  {
    id: 'spi_16',
    category: 'Instrumentation',
    question: 'Which process converts the negative voltages of a signal into positive voltages?',
    options: [
      'Smoothing',
      'Rectification',
      'Compression',
      'Rejection'
    ],
    correctAnswer: 1,
    explanation: 'Rectification is the first step of demodulation, converting all negative voltages into positive ones.'
  },
  {
    id: 'spi_17',
    category: 'Waves',
    question: 'The propagation speed of sound in soft tissue is approximately:',
    options: [
      '330 m/s',
      '1450 m/s',
      '1540 m/s',
      '3500 m/s'
    ],
    correctAnswer: 2,
    explanation: 'The average propagation speed of sound in human soft tissue is 1,540 m/s (or 1.54 mm/µs).'
  },
  {
    id: 'spi_18',
    category: 'Transducers',
    question: 'Focusing improves __________ resolution.',
    options: [
      'Axial',
      'Lateral',
      'Temporal',
      'Contrast'
    ],
    correctAnswer: 1,
    explanation: 'Focusing narrows the beam width in the focal zone, thereby improving lateral resolution.'
  },
  {
    id: 'spi_19',
    category: 'Doppler',
    question: 'The Doppler equation states that the Doppler shift is directly proportional to:',
    options: [
      'Velocity of the reflector',
      'Cosine of the Doppler angle',
      'Transmitted frequency',
      'All of the above'
    ],
    correctAnswer: 3,
    explanation: 'The Doppler shift (Δf) = (2 * f * v * cosθ) / c. It is proportional to frequency, velocity, and the cosine of the angle.'
  },
  {
    id: 'spi_20',
    category: 'Artifacts',
    question: 'An anechoic structure with bright echoes posterior to it is an example of:',
    options: [
      'Shadowing',
      'Enhancement',
      'Edge shadowing',
      'Ghost image'
    ],
    correctAnswer: 1,
    explanation: 'Enhancement occurs when sound travels through a low-attenuating structure (like a cyst), resulting in brighter echoes behind it.'
  },
  {
    id: 'spi_21',
    category: 'Safety',
    question: 'Which intensity is most commonly used to describe the risk of thermal bioeffects?',
    options: [
      'SPTP',
      'SATA',
      'SPTA',
      'SATp'
    ],
    correctAnswer: 2,
    explanation: 'SPTA (Spatial Peak Temporal Average) is the intensity most closely correlated with tissue heating.'
  },
  {
    id: 'spi_22',
    category: 'Resolution',
    question: 'Temporal resolution is improved by:',
    options: [
      'Increasing frame rate',
      'Increasing line density',
      'Using multiple focal zones',
      'Increasing imaging depth'
    ],
    correctAnswer: 0,
    explanation: 'Temporal resolution is determined by frame rate. Higher frame rates lead to better temporal resolution.'
  },
  {
    id: 'spi_23',
    category: 'Hemodynamics',
    question: 'The Bernoulli principle describes the relationship between:',
    options: [
      'Pressure and flow',
      'Velocity and pressure',
      'Resistance and viscosity',
      'Radius and flow'
    ],
    correctAnswer: 1,
    explanation: 'The Bernoulli principle states that as the velocity of a fluid increases, the pressure exerted by the fluid decreases.'
  },
  {
    id: 'spi_24',
    category: 'Instrumentation',
    question: 'A 6-bit memory system can display how many shades of gray?',
    options: [
      '6',
      '12',
      '32',
      '64'
    ],
    correctAnswer: 3,
    explanation: 'The number of shades of gray is 2^n, where n is the number of bits. 2^6 = 64.'
  },
  {
    id: 'spi_25',
    category: 'Waves',
    question: 'If the power of a beam is tripled, the intensity is:',
    options: [
      'Tripled',
      'Halved',
      'Increased by 9 times',
      'Unchanged'
    ],
    correctAnswer: 0,
    explanation: 'Intensity is directly proportional to power (I = P/A). If power triples, intensity triples.'
  },
  {
    id: 'spi_26',
    category: 'Transducers',
    question: 'The range of frequencies contained within an ultrasound pulse is called:',
    options: [
      'Quality factor',
      'Bandwidth',
      'Duty factor',
      'Resonant frequency'
    ],
    correctAnswer: 1,
    explanation: 'Bandwidth is the range of frequencies between the highest and lowest frequencies in a pulse.'
  },
  {
    id: 'spi_27',
    category: 'Doppler',
    question: 'To eliminate aliasing, one should:',
    options: [
      'Increase the PRF',
      'Decrease the Doppler angle',
      'Use a higher frequency transducer',
      'Increase the imaging depth'
    ],
    correctAnswer: 0,
    explanation: 'Increasing the PRF (scale) raises the Nyquist limit, which can help eliminate aliasing.'
  },
  {
    id: 'spi_28',
    category: 'Artifacts',
    question: 'Which artifact results in the lateral displacement of a reflector?',
    options: [
      'Refraction',
      'Mirror image',
      'Side lobes',
      'Speed error'
    ],
    correctAnswer: 0,
    explanation: 'Refraction can cause a reflector to appear laterally displaced from its true position.'
  },
  {
    id: 'spi_29',
    category: 'Safety',
    question: 'The Mechanical Index is inversely proportional to the square root of:',
    options: [
      'Power',
      'Frequency',
      'Intensity',
      'Depth'
    ],
    correctAnswer: 1,
    explanation: 'MI = Peak Rarefactional Pressure / √f. It is inversely proportional to the square root of the frequency.'
  },
  {
    id: 'spi_30',
    category: 'Instrumentation',
    question: 'Which receiver function reduces the dynamic range of the signal?',
    options: [
      'Amplification',
      'Compensation',
      'Compression',
      'Demodulation'
    ],
    correctAnswer: 2,
    explanation: 'Compression reduces the range between the largest and smallest signals to a level the system can handle.'
  }
];
