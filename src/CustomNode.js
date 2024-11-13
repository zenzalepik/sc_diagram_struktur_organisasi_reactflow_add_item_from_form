// src/CustomNode.js

import React from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data }) => {
  return (
    <>
      <div className="flex flex-col justify-center text-center">
      <span>{data.name}</span>
      <span><b>{data.position}</b></span>
      </div>

      {/* Menambahkan handle untuk koneksi */}
      <Handle
        type="target" // Tipe ini menunjukkan koneksi dari node lain ke node ini
        position="top" // Menentukan posisi handle di bagian atas node
        style={{ background: '#555' }} // Styling handle
      />
      <Handle
        type="source" // Tipe ini menunjukkan koneksi dari node ini ke node lain
        position="bottom" // Menentukan posisi handle di bagian bawah node
        style={{ background: '#555' }} // Styling handle
      />
    </>
  );
};

export default CustomNode;
