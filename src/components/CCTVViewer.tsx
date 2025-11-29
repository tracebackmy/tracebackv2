"use client";

import React, { useState } from 'react';
import { Camera, Search } from 'lucide-react';
import Image from 'next/image';

const MOCK_CAMERAS = [
  { id: 'cam-01', name: 'Entrance A - Ticketing', img: 'https://images.unsplash.com/photo-1574347209378-d5ae354dc54b?auto=format&fit=crop&w=600&h=400' },
  { id: 'cam-02', name: 'Platform 2 - North', img: 'https://images.unsplash.com/photo-1518621845118-23e97028ce25?auto=format&fit=crop&w=600&h=400' },
  { id: 'cam-03', name: 'Escalator B', img: 'https://images.unsplash.com/photo-1532454593417-66440263666d?auto=format&fit=crop&w=600&h=400' },
];

export default function CCTVViewer() {
  const [selectedCam, setSelectedCam] = useState(MOCK_CAMERAS[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden relative shadow-lg">
        <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-0.5 text-xs font-bold rounded animate-pulse z-10">
          LIVE
        </div>
        <Image 
          src={selectedCam.img} 
          alt="CCTV Feed" 
          width={800} 
          height={500} 
          className="w-full h-[400px] object-cover opacity-80"
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h3 className="font-mono text-lg">{selectedCam.name}</h3>
          <p className="font-mono text-xs opacity-70">REC: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Camera size={20} className="text-brand" /> 
          Camera Control
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted mb-1 block">Select Feed</label>
            <select 
              className="w-full p-2 border border-border rounded-lg"
              onChange={(e) => setSelectedCam(MOCK_CAMERAS.find(c => c.id === e.target.value) || MOCK_CAMERAS[0])}
            >
              {MOCK_CAMERAS.map(cam => (
                <option key={cam.id} value={cam.id}>{cam.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-muted mb-1 block">Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-border rounded-lg text-sm"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1 block">Time</label>
              <input 
                type="time" 
                className="w-full p-2 border border-border rounded-lg text-sm"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full bg-ink text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition">
            <Search size={16} />
            Search Archive
          </button>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
            <p className="text-xs text-blue-800 font-medium">
              AI Detection: 3 objects identified in last frame.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}