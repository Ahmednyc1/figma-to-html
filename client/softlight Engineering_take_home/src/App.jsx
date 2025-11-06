
const CLIENT_ID = "y01inUFrTraJh76tPhETvE";
const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPES = [
  'file_content:read',
  'file_metadata:read',
  'file_versions:read',
].join('%20');
const STATE= 'abc';

export default function App() {
    const handleLogin = () => {
      const authUrl = `https://www.figma.com/oauth?client_id=${CLIENT_ID}` +
                      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
                      `&scope=${SCOPES}` + 
                      `&state=${STATE}` +
                      `&response_type=code`;
              window.location.href= authUrl;
    }
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900'>
        <h1 className='text-3xl font-bold mb-8'>
        Softlight Figma -> HTML/CSS
        </h1>
        <button
        onClick={handleLogin}
        className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
      >
        Connect Figma
      </button>
      <p className='text-xs text-gray-500 leading-relaxed text-center'>
        Clicking the "Connect Figma" button will open the Figma OAuth. After you Allow, Figma will send you back to /callback with a code.

      </p>
      </div>
    )

       
}


