// frontend/components/Portfolio/ExportPortfolioButton.jsx
import React, { useState } from "react";
const formats = [
  { id: "html", label: "Export as HTML", icon: "🌐", desc: "Single HTML file" },
];

export default function ExportPortfolioButton({ portfolioData, template }) {
  
  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState(null);

 const handleExport = async () => {

  setLoading("html");

  try {

   const preview =
document.getElementById(
  "portfolio-preview"
);

    if (!preview) {
      alert(
        "portfolio-preview not found"
      );
      return;
    }
    
         const clone =
      preview.cloneNode(true);
       
      clone
  .querySelectorAll(
    '[data-export-ignore="true"]'
  )
  .forEach(el => el.remove());
 
  clone
  .querySelectorAll("*")
  .forEach(el => {
    el.style.opacity = "1";
    el.style.transform = "none";
    //el.style.filter = "none";
  });
    
     
      const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />

<script src="https://cdn.tailwindcss.com"></script>

<title>Portfolio</title>
</head>

<body style="margin:0">
${clone.outerHTML}
</body>

</html>
`;
    



       
    const blob =
      new Blob(
        [html],
        {
          type:"text/html"
        }
      );
    
    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      `portfolio-${template}.html`;

    a.click();

    URL.revokeObjectURL(url);

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(null);

  }

};

  return (
    <div className="relative">
      <button
  onClick={handleExport}

        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#bf00ff] text-black font-bold text-sm hover:shadow-[0_0_25px_#00f0ff40] hover:scale-[1.02] transition-all duration-200"
      >
        {success ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Downloaded!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
            <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </>
        )}
      </button>
    </div>
  );
}