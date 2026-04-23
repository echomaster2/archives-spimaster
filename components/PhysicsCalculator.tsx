
import React, { useState } from 'react';
import { Calculator, X, Zap, Target } from 'lucide-react';

interface PhysicsCalculatorProps {
  defaultTab?: '13us' | 'snell' | 'axial';
  onClose?: () => void;
}

export const PhysicsCalculator: React.FC<PhysicsCalculatorProps> = ({ defaultTab = '13us', onClose }) => {
  const [activeTab, setActiveTab] = useState<'13us' | 'snell' | 'axial' | 'doppler' | 'intensity' | 'duty'>(defaultTab);
  
  // 13us Rule
  const [distance, setDistance] = useState<string>('');
  const [time, setTime] = useState<string>('');

  // Snell's Law
  const [c1, setC1] = useState<string>('');
  const [c2, setC2] = useState<string>('');
  const [theta1, setTheta1] = useState<string>('');

  // Axial Resolution
  const [spl, setSpl] = useState<string>('');
  const [wavelength, setWavelength] = useState<string>('');
  const [cycles, setCycles] = useState<string>('');

  // Doppler Shift
  const [velocity, setVelocity] = useState<string>('');
  const [freq, setFreq] = useState<string>('');
  const [angle, setAngle] = useState<string>('');

  // Intensity
  const [power, setPower] = useState<string>('');
  const [area, setArea] = useState<string>('');

  // Duty Factor
  const [pd, setPd] = useState<string>('');
  const [prp, setPrp] = useState<string>('');

  const calculate13us = () => {
    if (distance) return `Time: ${parseFloat(distance) * 13} µs`;
    if (time) return `Reflector Depth: ${parseFloat(time) / 13} cm`;
    return 'Enter a value';
  };

  const calculateSnell = () => {
    const v1 = parseFloat(c1);
    const v2 = parseFloat(c2);
    const t1 = parseFloat(theta1);
    if (!v1 || !v2 || !t1) return 'Missing values';
    if (v2 > v1) return `Refraction: Angle > ${t1}° (Away from normal)`;
    if (v2 < v1) return `Refraction: Angle < ${t1}° (Toward normal)`;
    return 'No refraction (v1 = v2)';
  };

  const calculateAxial = () => {
    if (spl) return `Axial Res: ${(parseFloat(spl) / 2).toFixed(2)} mm`;
    if (wavelength && cycles) return `Axial Res: ${(parseFloat(wavelength) * parseFloat(cycles) / 2).toFixed(2)} mm`;
    return 'Enter SPL or λ + Cycles';
  };

  const calculateDoppler = () => {
    const v = parseFloat(velocity);
    const f0 = parseFloat(freq);
    const theta = parseFloat(angle) * (Math.PI / 180);
    const c = 1540;
    if (!v || !f0 || isNaN(theta)) return 'Missing values';
    const shift = (2 * v * f0 * Math.cos(theta)) / c;
    return `Shift: ${shift.toFixed(2)} kHz`;
  };

  const calculateIntensity = () => {
    const p = parseFloat(power);
    const a = parseFloat(area);
    if (!p || !a) return 'Missing values';
    return `Intensity: ${(p / a).toFixed(2)} W/cm²`;
  };

  const calculateDuty = () => {
    const pulseDur = parseFloat(pd);
    const repetitionP = parseFloat(prp);
    if (!pulseDur || !repetitionP) return 'Missing values';
    const df = (pulseDur / (repetitionP * 1000)); // assuming prp in ms or pd/prp unit consistency
    return `Duty Factor: ${(df * 100).toFixed(2)}%`;
  };

  return (
    <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 text-white shadow-2xl animate-in slide-in-from-top duration-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none hidden md:block">
        <Calculator size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <Calculator className="text-indigo-400 md:w-6 md:h-6" size={16} />
            <h3 className="font-black text-xs md:text-xl uppercase tracking-widest leading-none">Physics Lab Calculator</h3>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {(['13us', 'snell', 'axial', 'doppler', 'intensity', 'duty'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[7px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'
                  }`}
                >
                  {tab === '13us' ? '13µs Rule' : 
                   tab === 'snell' ? "Snell's Law" : 
                   tab === 'axial' ? 'Axial Res' :
                   tab === 'doppler' ? 'Doppler' :
                   tab === 'intensity' ? 'Intensity' : 'Duty Factor'}
                </button>
              ))}
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1.5 md:p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X size={12} className="md:w-4 md:h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl md:rounded-3xl p-4 md:p-8 border border-white/10">
          {activeTab === '13us' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="space-y-4">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Reflector Depth (cm)</label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => { setDistance(e.target.value); setTime(''); }}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 md:px-5 md:py-3 text-white text-[10px] md:text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 2"
                  />
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="h-px bg-slate-700 flex-1"></div>
                  <span className="text-[6px] md:text-[10px] font-black text-slate-500">OR</span>
                  <div className="h-px bg-slate-700 flex-1"></div>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Go-Return Time (µs)</label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => { setTime(e.target.value); setDistance(''); }}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 md:px-5 md:py-3 text-white text-[10px] md:text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. 26"
                  />
                </div>
              </div>
              <div className="text-center lg:border-l border-white/10 lg:pl-8 py-2 md:py-0">
                <p className="text-[7px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 md:mb-2">Calculated Lab Result</p>
                <p className="text-xl md:text-3xl font-black italic text-white tracking-tight leading-none">{calculate13us()}</p>
                <div className="mt-3 md:mt-4 flex items-center justify-center gap-2 text-slate-500 text-[7px] md:text-[10px] font-bold">
                  <Zap size={10} className="md:w-3 md:h-3"/> Every 1cm depth = 13µs round trip
                </div>
              </div>
            </div>
          )}

          {activeTab === 'snell' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">v1 (m/s)</label>
                    <input
                      type="number"
                      value={c1}
                      onChange={(e) => setC1(e.target.value)}
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                      placeholder="1540"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">v2 (m/s)</label>
                    <input
                      type="number"
                      value={c2}
                      onChange={(e) => setC2(e.target.value)}
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                      placeholder="3500"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident Angle (θ1)</label>
                  <input
                    type="number"
                    value={theta1}
                    onChange={(e) => setTheta1(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                    placeholder="Angle in degrees"
                  />
                </div>
              </div>
              <div className="text-center lg:border-l border-white/10 lg:pl-8 py-2 md:py-0">
                <p className="text-[7px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 md:mb-2">Refraction Prediction</p>
                <p className="text-base md:text-xl font-black italic text-white leading-tight">{calculateSnell()}</p>
                <p className="text-[6px] md:text-[9px] text-slate-500 mt-3 md:mt-4 leading-relaxed italic">
                  {"If v2 > v1, transmitted angle > incident angle. If v2 < v1, transmitted angle < incident angle."}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'axial' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="space-y-4">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Spatial Pulse Length (mm)</label>
                  <input
                    type="number"
                    value={spl}
                    onChange={(e) => { setSpl(e.target.value); setWavelength(''); setCycles(''); }}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                    placeholder="e.g. 0.3"
                  />
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="h-px bg-slate-700 flex-1"></div>
                  <span className="text-[6px] md:text-[10px] font-black text-slate-500">OR</span>
                  <div className="h-px bg-slate-700 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Wavelength (λ)</label>
                    <input
                      type="number"
                      value={wavelength}
                      onChange={(e) => { setWavelength(e.target.value); setSpl(''); }}
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                      placeholder="mm"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest"># Cycles</label>
                    <input
                      type="number"
                      value={cycles}
                      onChange={(e) => { setCycles(e.target.value); setSpl(''); }}
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                      placeholder="e.g. 2"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center lg:border-l border-white/10 lg:pl-8 py-2 md:py-0">
                <p className="text-[7px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 md:mb-2">Resolution Depth</p>
                <p className="text-xl md:text-3xl font-black italic text-white tracking-tight leading-none">{calculateAxial()}</p>
                <div className="mt-3 md:mt-4 flex flex-col items-center gap-2 text-slate-500 text-[7px] md:text-[9px] font-bold">
                  <div className="flex items-center gap-2">
                    <Target size={10} className="text-indigo-400 md:w-3 md:h-3"/> LARRD: Longitudinal, Axial, Range, Radial, Depth
                  </div>
                  <p className="italic">Lower value = Superior Quality</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doppler' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Velocity (m/s)</label>
                    <input
                      type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)}
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                      placeholder="e.g. 0.8"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Frequency (MHz)</label>
                    <input
                      type="number" value={freq} onChange={(e) => setFreq(e.target.value)}
                      className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Incident Angle (θ)</label>
                  <input
                    type="number" value={angle} onChange={(e) => setAngle(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                    placeholder="Angle (0-60° typical)"
                  />
                </div>
              </div>
              <div className="text-center lg:border-l border-white/10 lg:pl-8 py-2 md:py-0">
                <p className="text-[7px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 md:mb-2">Doppler Shift Result</p>
                <p className="text-xl md:text-3xl font-black italic text-white tracking-tight leading-none">{calculateDoppler()}</p>
                <p className="text-[6px] md:text-[9px] text-slate-500 mt-3 md:mt-4 leading-relaxed italic">
                  {"Shift = (2 * v * f * cosθ) / c. Assume c = 1540 m/s."}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'intensity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="space-y-4">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Power (Watts)</label>
                  <input
                    type="number" value={power} onChange={(e) => setPower(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                    placeholder="e.g. 0.05"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Beam Area (cm²)</label>
                  <input
                    type="number" value={area} onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                    placeholder="e.g. 0.2"
                  />
                </div>
              </div>
              <div className="text-center lg:border-l border-white/10 lg:pl-8 py-2 md:py-0">
                <p className="text-[7px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 md:mb-2">Intensity Calculation</p>
                <p className="text-xl md:text-3xl font-black italic text-white tracking-tight leading-none">{calculateIntensity()}</p>
                <p className="text-[6px] md:text-[9px] text-slate-500 mt-3 md:mt-4 leading-relaxed italic">
                  {"I = P / A. Directly proportional to power, inversely proportional to area."}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'duty' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="space-y-4">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Pulse Duration (µs)</label>
                  <input
                    type="number" value={pd} onChange={(e) => setPd(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                    placeholder="e.g. 2"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">PRP (ms)</label>
                  <input
                    type="number" value={prp} onChange={(e) => setPrp(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg md:rounded-2xl px-4 py-2 text-white text-[10px] focus:outline-none"
                    placeholder="e.g. 1"
                  />
                </div>
              </div>
              <div className="text-center lg:border-l border-white/10 lg:pl-8 py-2 md:py-0">
                <p className="text-[7px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 md:mb-2">Duty Factor Result</p>
                <p className="text-xl md:text-3xl font-black italic text-white tracking-tight leading-none">{calculateDuty()}</p>
                <p className="text-[6px] md:text-[9px] text-slate-500 mt-3 md:mt-4 leading-relaxed italic">
                  {"DF = (Pulse Duration / PRP) * 100. Continuous wave DF is 100 PERCENT."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
