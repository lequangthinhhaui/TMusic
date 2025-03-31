
function SideBar({ onSelectFolder }) {
    return (
      <div className="flex flex-1 w-64 rounded ">
        {/* <ul className="mt-4 space-y-2">
          <li className="hover:bg-gray-700 p-2 rounded">Library</li>
          <li className="hover:bg-gray-700 p-2 rounded">Top 100</li>
          <li className="hover:bg-gray-700 p-2 rounded">Playlists</li>
        </ul> */}
        <div className="flex flex-col gap-4 pt-2 pr-2">
          <button onClick={onSelectFolder} className="px-4 py-2 rounded text-xl font-bold">
            Select Folder
          </button>
          {/* <button onClick={onSelectFolder} className="bg-purple-500 px-4 py-2 rounded">
            Select Folder
          </button>
          <button onClick={onSelectFolder} className="bg-purple-500 px-4 py-2 rounded">
            Select Folder
          </button> */}
        </div>

      </div>
    );
  }
  
  export default SideBar;

// import { useState, useRef, useEffect } from "react";

// const Sidebar = ({ onAddToPlaylist }) => {
//   const [tree, setTree] = useState([
//     {
//       id: 1,
//       name: "New Folder",
//       children: [],
//       audio: null,
//       subtitle: null,
//       expanded: false,
//     },
//   ]);

//   const [contextMenu, setContextMenu] = useState(null);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = () => setContextMenu(null);
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const toggleFolder = (node) => {
//     node.expanded = !node.expanded;
//     setTree([...tree]);
//     if (node.audio) {
//       onAddToPlaylist(node.audio);
//       console.log("hhh", node.audio);
//     }
//   };

//   const showContextMenu = (event, node) => {
//     event.preventDefault();
//     setSelectedNode(node);
//     setContextMenu({ x: event.clientX, y: event.clientY });
//   };

//   const handleAddNew = () => {
//     setTree([
//       ...tree,
//       { id: Date.now(), name: "New Folder", children: [], audio: null, subtitle: null, expanded: false },
//     ]);
//     setContextMenu(null);
//   };

//   const handleAddSub = () => {
//     if (!selectedNode) return;
//     selectedNode.children.push({
//       id: Date.now(),
//       name: "Sub Folder",
//       children: [],
//       audio: null,
//       subtitle: null,
//       expanded: true,
//     });
//     selectedNode.expanded = true;
//     setTree([...tree]);
//     setContextMenu(null);
//   };

//   const handleAddFile = (type) => {
//     fileInputRef.current.click();
//     fileInputRef.current.onchange = (event) => {
//       const file = event.target.files[0];
//       if (!file) return;
//       selectedNode[type] = { name: file.name, url: URL.createObjectURL(file) };
//       setTree([...tree]);
//       setContextMenu(null);
//     };
//   };

//   const handleRemoveFile = (type) => {
//     selectedNode[type] = null;
//     setTree([...tree]);
//     setContextMenu(null);
//   };

//   const handleRename = () => {
//     const newName = prompt("Enter new name:", selectedNode.name);
//     if (newName) {
//       selectedNode.name = newName;
//       setTree([...tree]);
//     }
//     setContextMenu(null);
//   };

//   const handleDelete = () => {
//     const deleteNode = (nodes) =>
//       nodes.filter((node) => node !== selectedNode).map((node) => ({
//         ...node,
//         children: deleteNode(node.children),
//       }));

//     setTree(deleteNode(tree));
//     setContextMenu(null);
//   };

//   return (
//     <div className="relative w-64 bg-gray-800 text-white p-4 rounded shadow">
//       <ul className="space-y-2">
//         {tree.map((node) => (
//           <FolderNode key={node.id} node={node} toggleFolder={toggleFolder} showContextMenu={showContextMenu} />
//         ))}
//       </ul>

//       {contextMenu && (
//         <div
//           className="absolute bg-gray-700 p-2 rounded shadow-md w-48"
//           style={{ top: contextMenu.y, left: contextMenu.x }}
//         >
//           <button className="block w-full px-4 py-2 hover:bg-gray-600" onClick={handleAddNew}>Create New</button>
//           <button className="block w-full px-4 py-2 hover:bg-gray-600" onClick={handleAddSub}>Create Sub</button>
//           <button className="block w-full px-4 py-2 hover:bg-gray-600" onClick={() => handleAddFile("audio")}>Add/Replace Audio</button>
//           <button className="block w-full px-4 py-2 hover:bg-gray-600" onClick={() => handleAddFile("subtitle")}>Add/Replace Subtitle</button>
//           <button className="block w-full px-4 py-2 hover:bg-gray-600 disabled:opacity-50" onClick={() => handleRemoveFile("audio")} disabled={!selectedNode?.audio}>Remove Audio</button>
//           <button className="block w-full px-4 py-2 hover:bg-gray-600 disabled:opacity-50" onClick={() => handleRemoveFile("subtitle")} disabled={!selectedNode?.subtitle}>Remove Subtitle</button>
//           <button className="block w-full px-4 py-2 hover:bg-gray-600" onClick={handleRename}>Rename</button>
//           <button className="block w-full px-4 py-2 hover:bg-red-600" onClick={handleDelete}>Delete</button>
//         </div>
//       )}

//       <input type="file" ref={fileInputRef} className="hidden" />
//     </div>
//   );
// };

// const FolderNode = ({ node, toggleFolder, showContextMenu }) => {
//   return (
//     <li>
//       <div
//         className={`cursor-pointer flex items-center p-2 rounded ${node.audio || node.subtitle ? "text-purple-400" : "text-gray-300"}`}
//         onClick={() => toggleFolder(node)}
//         onContextMenu={(e) => showContextMenu(e, node)}
//       >
//         {node.children.length > 0 && (
//           <span className="mr-2">{node.expanded ? "📂" : "📁"}</span>
//         )}
//         {node.name}
//       </div>
//       {node.expanded && node.children.length > 0 && (
//         <ul className="pl-4 border-l border-gray-500 mt-2">
//           {node.children.map((child) => (
//             <FolderNode key={child.id} node={child} toggleFolder={toggleFolder} showContextMenu={showContextMenu} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// export default Sidebar;




