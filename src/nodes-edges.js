// src/nodes-edges.js

export const nodes = [
  { id: '1', data: { name: 'Andi Baik Hati', position: 'CEO' }, position: { x: 250, y: 5 }, type: 'custom' },
  { id: '2', data: { name: 'Budi Pengertian', position: 'CTO' }, position: { x: 100, y: 100 }, type: 'custom' },
  { id: '3', data: { name: 'Bayu Pemberani', position: 'CFO' }, position: { x: 400, y: 100 }, type: 'custom' },
  { id: '4', data: { name: 'Jono Rendah Hati', position: 'Dev Team' }, position: { x: 100, y: 250 }, type: 'custom' },
  { id: '5', data: { name: 'Rudi Tidak Banyak Bicara', position: 'Finance Team' }, position: { x: 400, y: 250 }, type: 'custom' },
];

export const edges = [
  { id: 'e1-2', source: '1', target: '2' },  // CEO -> CTO
  { id: 'e1-3', source: '1', target: '3' },  // CEO -> CFO
  { id: 'e3-4', source: '3', target: '4' },  // CFO -> Dev Team (mengubah dari e2-4 menjadi e3-4)
  { id: 'e3-5', source: '3', target: '5' },  // CFO -> Finance Team
];
