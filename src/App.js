import React, { useEffect, useCallback, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Panel,
  Background,
} from "@xyflow/react";
import styled, { ThemeProvider } from "styled-components";
import { nodes as initialNodes, edges as initialEdges } from "./nodes-edges";
import { darkTheme, lightTheme } from "./Theme";
import CustomNode from "./CustomNode";
import { toPng } from "html-to-image"; // Import pustaka html-to-image
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import "./styles/ReactFlow.css";

// Node types untuk custom node
const nodeTypes = {
  custom: CustomNode,
};

const edgeStyle = {
  stroke: "#aaa", // Warna garis sambung
  strokeWidth: 2, // Ketebalan garis sambung
  strokeLinecap: "round", // Ujung garis sambung yang lebih halus
};

// Styled-components untuk ReactFlow, MiniMap, dan Controls
const ReactFlowStyled = styled(ReactFlow)``;

const MiniMapStyled = styled(MiniMap)`
  background-color: ${(props) => props.theme.bg};

  .react-flow__minimap-mask {
    fill: ${(props) => props.theme.minimapMaskBg};
  }

  .react-flow__minimap-node {
    fill: ${(props) => props.theme.nodeBg};
    stroke: none;
  }
`;

const ControlsStyled = styled(Controls)`
  button {
    background-color: ${(props) => props.theme.controlsBg};
    color: ${(props) => props.theme.controlsColor};
    border-bottom: 1px solid ${(props) => props.theme.controlsBorder};

    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }

    path {
      fill: currentColor;
    }
  }
`;

const layoutNodes = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({});
  g.setDefaultEdgeLabel(() => ({}));

  // Menambahkan node ke dalam grafik dagre
  nodes.forEach((node) => {
    g.setNode(node.id, { width: 172, height: 36 }); // Ukuran node yang digunakan oleh dagre
  });

  // Menambahkan edge ke dalam grafik dagre
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Menjalankan layout
  dagre.layout(g);

  // Menyusun ulang posisi node berdasarkan hasil layout
  nodes.forEach((node) => {
    const nodeWithPosition = g.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 172 / 2, // Mengatur posisi node di tengah
      y: nodeWithPosition.y - 36 / 2, // Menyesuaikan ukuran node dengan layout
    };
  });

  return nodes;
};

// Fungsi untuk mendownload gambar flowchart
const downloadImage = (nodeElement) => {
  // Menyembunyikan panel dan tombol selama pengambilan gambar
  const panelElements = document.querySelectorAll(".react-flow__panel");
  const buttonElements = document.querySelectorAll("button");

  // Simpan state visibility elemen-elemen yang ingin disembunyikan
  panelElements.forEach((el) => (el.style.display = "none"));
  buttonElements.forEach((el) => (el.style.display = "none"));

  // Ambil gambar
  toPng(nodeElement, {
    backgroundColor: "#fff", // Set background warna putih untuk gambar
  })
    .then((dataUrl) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "flowchart.png";
      a.click();
    })
    .catch((err) => {
      console.error("Error downloading image", err);
    })
    .finally(() => {
      // Kembalikan visibilitas elemen setelah gambar diambil
      panelElements.forEach((el) => (el.style.display = "block"));
      buttonElements.forEach((el) => (el.style.display = "inline-block"));
    });
};

// Komponen utama yang membungkus ReactFlow
const Flow = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [newNodeData, setNewNodeData] = useState({
    name: '',
    position: '',
    connectedTo: '', // Node yang akan menjadi sumber koneksi
  });

  // Callback untuk menangani koneksi antar node
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Menambahkan node baru ke dalam flow
  const handleAddNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: {
        name: newNodeData.name,
        position: newNodeData.position,
      },
      position: { x: 0, y: 0 }, // Posisi akan diatur oleh dagre
      type: 'custom',
    };

    setNodes((nds) => [...nds, newNode]);

    // Menambahkan edge yang menghubungkan node baru ke node yang dipilih
    if (newNodeData.connectedTo) {
      const newEdge = {
        id: `e${newNodeData.connectedTo}-${newNode.id}`,
        source: newNodeData.connectedTo,
        target: newNode.id,
      };
      setEdges((eds) => [...eds, newEdge]);
    }

    setNewNodeData({ name: '', position: '', connectedTo: '' }); // Reset form
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh", // Setel tinggi menjadi 100% dari viewport
        backgroundColor: "#f0f0f0",
        position: "relative",
      }}
    >
      <ReactFlowStyled
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="react-flow-container"
      >
        <MiniMapStyled />
        <ControlsStyled />
        {children}
        <Background variant="dots" gap={12} size={1} />
      </ReactFlowStyled>

      {/* Form untuk menambah node */}
      <div style={{ position: "absolute", top: "20px", left: "20px", padding: "10px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <h3>Add New Node</h3>
        <input
          type="text"
          placeholder="Name"
          value={newNodeData.name}
          onChange={(e) => setNewNodeData({ ...newNodeData, name: e.target.value })}
          style={{ marginBottom: "8px", padding: "5px", width: "200px" }}
        />
        <br />
        <input
          type="text"
          placeholder="Position"
          value={newNodeData.position}
          onChange={(e) => setNewNodeData({ ...newNodeData, position: e.target.value })}
          style={{ marginBottom: "8px", padding: "5px", width: "200px" }}
        />
        <br />
        <select
          value={newNodeData.connectedTo}
          onChange={(e) => setNewNodeData({ ...newNodeData, connectedTo: e.target.value })}
          style={{ marginBottom: "8px", padding: "5px", width: "200px" }}
        >
          <option value="">Select Node to Connect</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.data.name} ({node.data.position})
            </option>
          ))}
        </select>
        <br />
        <button onClick={handleAddNode} style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Add Node
        </button>
      </div>
    </div>
  );
};

// Komponen untuk mengatur dan menerapkan mode tema
export default () => {
  const [mode, setMode] = useState("light");
  const theme = mode === "light" ? lightTheme : darkTheme;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Fungsi untuk mengganti tema antara light/dark mode
  const toggleMode = () => {
    setMode((m) => (m === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const layoutedNodes = layoutNodes(nodes, edges); // Menjalankan layout
    setNodes(layoutedNodes); // Memperbarui state nodes dengan posisi yang baru
  }, [nodes, edges]);

  return (
    <ThemeProvider theme={theme}>
      <Flow>
        <Panel position="top-left">
          <button onClick={toggleMode}>Switch Mode</button>
        </Panel>
        <Panel position="top-right">
          <button
            onClick={() =>
              downloadImage(document.querySelector(".react-flow-container"))
            }
          >
            Download Image
          </button>
        </Panel>
      </Flow>
    </ThemeProvider>
  );
};
