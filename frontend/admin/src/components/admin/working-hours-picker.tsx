'use client'

import { useState } from 'react'
import { Clock, Calendar, CheckCircle2 } from 'lucide-react'

export interface WorkingHoursData {
  openHour: string
  openMinute: string
  openPeriod: 'AM' | 'PM'
  closeHour: string
  closeMinute: string
  closePeriod: 'AM' | 'PM'
  workingDays: string[] // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
}

interface WorkingHoursPickerProps {
  value: WorkingHoursData
  onChange: (val: WorkingHoursData) => void
}

const allDays = [
  { key: 'Mon', label: 'Mon', tamil: 'திங்கள்' },
  { key: 'Tue', label: 'Tue', tamil: 'செவ்வாய்' },
  { key: 'Wed', label: 'Wed', tamil: 'புதன்' },
  { key: 'Thu', label: 'Thu', tamil: 'வியாழன்' },
  { key: 'Fri', label: 'Fri', tamil: 'வெள்ளி' },
  { key: 'Sat', label: 'Sat', tamil: 'சனி' },
  { key: 'Sun', label: 'Sun', tamil: 'ஞாயிறு' },
]

export function WorkingHoursPicker({ value, onChange }: WorkingHoursPickerProps) {
  const toggleDay = (day: string) => {
    const next = value.workingDays.includes(day)
      ? value.workingDays.filter(d => d !== day)
      : [...value.workingDays, day]
    onChange({ ...value, workingDays: next })
  }

  const setAllDays = () => {
    onChange({ ...value, workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] })
  }

  const setMonToSat = () => {
    onChange({ ...value, workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] })
  }

  return (
    <div className="space-y-5">
      {/* ── Working Days Selector ──────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider font-sans flex items-center gap-1.5">
            <Calendar size={14} className="text-[#14532D]" />
            Operating Days (கடை இயங்கும் நாட்கள்)
          </label>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={setAllDays}
              className="text-[#14532D] hover:underline font-medium cursor-pointer"
            >
              All 7 Days
            </button>
            <span className="text-stone-300">·</span>
            <button
              type="button"
              onClick={setMonToSat}
              className="text-stone-500 hover:underline font-medium cursor-pointer"
            >
              Mon - Sat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {allDays.map(d => {
            const isSelected = value.workingDays.includes(d.key)
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => toggleDay(d.key)}
                className={`py-2.5 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#14532D] text-white border-[#14532D] shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span className="text-xs font-bold block">{d.label}</span>
                <span className={`text-[9px] block mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                  {d.tamil.slice(0, 3)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── AM / PM Opening & Closing Times ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opening Time */}
        <div className="p-3.5 bg-[#FAFAF6] rounded-xl border border-stone-200">
          <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider font-sans block mb-2">
            Opening Time (திறக்கும் நேரம்)
          </label>
          <div className="flex items-center gap-2">
            {/* Hour */}
            <select
              value={value.openHour}
              onChange={(e) => onChange({ ...value, openHour: e.target.value })}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-[#1A1A1A] outline-none focus:border-[#14532D]"
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <span className="font-bold text-stone-400">:</span>
            {/* Minute */}
            <select
              value={value.openMinute}
              onChange={(e) => onChange({ ...value, openMinute: e.target.value })}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-[#1A1A1A] outline-none focus:border-[#14532D]"
            >
              {['00', '15', '30', '45'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {/* AM / PM Toggle */}
            <div className="flex rounded-xl bg-stone-200/70 p-0.5 ml-auto border border-stone-200">
              <button
                type="button"
                onClick={() => onChange({ ...value, openPeriod: 'AM' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  value.openPeriod === 'AM' ? 'bg-[#14532D] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...value, openPeriod: 'PM' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  value.openPeriod === 'PM' ? 'bg-[#14532D] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        {/* Closing Time */}
        <div className="p-3.5 bg-[#FAFAF6] rounded-xl border border-stone-200">
          <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider font-sans block mb-2">
            Closing Time (மூடும் நேரம்)
          </label>
          <div className="flex items-center gap-2">
            {/* Hour */}
            <select
              value={value.closeHour}
              onChange={(e) => onChange({ ...value, closeHour: e.target.value })}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-[#1A1A1A] outline-none focus:border-[#14532D]"
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <span className="font-bold text-stone-400">:</span>
            {/* Minute */}
            <select
              value={value.closeMinute}
              onChange={(e) => onChange({ ...value, closeMinute: e.target.value })}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold text-[#1A1A1A] outline-none focus:border-[#14532D]"
            >
              {['00', '15', '30', '45'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {/* AM / PM Toggle */}
            <div className="flex rounded-xl bg-stone-200/70 p-0.5 ml-auto border border-stone-200">
              <button
                type="button"
                onClick={() => onChange({ ...value, closePeriod: 'AM' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  value.closePeriod === 'AM' ? 'bg-[#14532D] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...value, closePeriod: 'PM' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  value.closePeriod === 'PM' ? 'bg-[#14532D] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Hours Summary Badge */}
      <div className="p-3 bg-[#DCFCE7]/60 border border-[#14532D]/20 rounded-xl flex items-center justify-between text-xs font-sans text-[#14532D]">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="font-semibold">
            Store Timings: {value.openHour}:{value.openMinute} {value.openPeriod} – {value.closeHour}:{value.closeMinute} {value.closePeriod}
          </span>
        </div>
        <span className="font-medium text-[11px] bg-white px-2.5 py-1 rounded-full border border-stone-200 shadow-xs">
          {value.workingDays.length === 7 ? 'Daily (All 7 Days)' : `${value.workingDays.length} Days / Week`}
        </span>
      </div>
    </div>
  )
}
