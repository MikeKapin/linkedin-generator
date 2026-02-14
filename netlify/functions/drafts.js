// Drafts on Netlify use client-side localStorage.
// This function exists as a stub for compatibility.
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ drafts: [], message: 'Drafts are stored in browser localStorage on Netlify deployment.' })
  };
};
