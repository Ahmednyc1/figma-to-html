import {useEffect,useState} from 'react';
import RenderNode from './RenderNode';
export default function Callback() {
    const [status,setStatus] = useState('Exchanging code...')
    const [fileData,setFileData] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code");

        async function run() {
            try {
                console.log("Got code from URL:", code);
                const tokenRes = await fetch("http://localhost:4000/api/exchange-token",{
                    method: "POST",
                    headers: { "Content-Type" :"application/json" },
                    body: JSON.stringify({code}),
                });
                console.log("tokenRes status",tokenRes.status);

                const tokenJson = await tokenRes.json();
                console.log("tokenJson:",tokenJson);
                const access_token = tokenJson.access_token;
                if (!access_token){
                    setStatus("Failed to get access token (see console)");
                    return;
                }
                setStatus("Got token. Fetching Figma file...");
                
                const FILE_KEY = "SESqJVzNvMuNa5p8Ss39ok";

                const fileRes = await fetch("http://localhost:4000/api/get-figma-file",{
                    method: "POST",
                    headers : {"Content-Type" :"application/json"},
                    body : JSON.stringify({
                        access_token,
                        file_key: FILE_KEY
                    }),
                });
                console.log("fileRes status:", fileRes.status);

                const fileJson = await fileRes.json();
                console.log("fileJson:",fileJson);

                setFileData(fileJson);
                setStatus("File fetched");
            } catch (err){
                console.error("Callback error:",err);
                setStatus(" Something broke (check console)");
        }
    }

        run();
},[]);

const handleDownload = () => {
  const el = document.querySelector("#figma-render-root");
    const html = el ? el.innerHTML : "<!-- no render -->";
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "figma-output.html";
    a.click();
    URL.revokeObjectURL(url);
  
};
const firstChild = fileData?.document?.children?.[0];
const frameBox = firstChild?.absoluteBoundingBox;


return (
  <div className="p-6 text-gray-900">
    <h1 className="text-2xl font-bold mb-4">OAuth Callback</h1>
    <div className="mb-4">{status}</div>

    {fileData && (
      <div className="mt-6 space-y-6">
        
        <div>
          <div className="text-sm text-gray-600 mb-2">
            Top-level document name:
          </div>
          <div className="font-mono text-sm bg-gray-100 p-3 rounded-lg overflow-x-auto">
            {fileData.document?.name ?? "(no name?)"}
          </div>
        </div>

        
        <div>
          <div className="text-sm text-gray-600 mb-2">
            Raw JSON (first part):
          </div>
          <pre className="font-mono text-xs bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto max-h-64">
            {JSON.stringify(fileData.document, null, 2)}
          </pre>
        </div>

        
        {firstChild && (
          <div className="mt-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="text-sm text-gray-600">Rendered frame:</div>
              <button
                onClick={handleDownload}
                className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
              >
                Download HTML
              </button>
            </div>

            <div
              id="figma-render-root"
              className="relative border rounded-xl bg-white overflow-hidden min-h-screen"
              style={{
                width: frameBox?.width || 400,
                height: frameBox?.height || 900,
              }}
            >
             
              <RenderNode node={firstChild} />
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);
}
