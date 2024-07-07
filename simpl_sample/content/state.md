<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
    </marker>
  </defs>
  
  <!-- SimplSite Class Box -->
  <rect x="50" y="50" width="700" height="500" fill="#f0f0f0" stroke="#333" stroke-width="2" />
  <text x="400" y="30" font-family="Arial, sans-serif" font-size="24" text-anchor="middle">SimplSite Class</text>

  <!-- Configuration State -->
  <rect x="70" y="70" width="300" height="200" fill="#e6f3ff" stroke="#0066cc" stroke-width="2" />
  <text x="220" y="100" font-family="Arial, sans-serif" font-size="18" text-anchor="middle">Configuration State</text>
  <text x="90" y="130" font-family="Arial, sans-serif" font-size="14">• contentSources</text>
  <text x="90" y="160" font-family="Arial, sans-serif" font-size="14">• defaultContentType</text>
  <text x="90" y="190" font-family="Arial, sans-serif" font-size="14">• templateDir</text>
  <text x="90" y="220" font-family="Arial, sans-serif" font-size="14">• customPluginsDir</text>
  <text x="90" y="250" font-family="Arial, sans-serif" font-size="14">• siteUrl, siteTitle</text>

  <!-- Operational State -->
  <rect x="430" y="70" width="300" height="200" fill="#fff0e6" stroke="#cc6600" stroke-width="2" />
  <text x="580" y="100" font-family="Arial, sans-serif" font-size="18" text-anchor="middle">Operational State</text>
  <text x="450" y="130" font-family="Arial, sans-serif" font-size="14">• plugins Map</text>
  <text x="450" y="160" font-family="Arial, sans-serif" font-size="14">• markdownProcessor</text>
  <text x="450" y="190" font-family="Arial, sans-serif" font-size="14">• templateEngine</text>

  <!-- Methods -->
  <rect x="70" y="300" width="660" height="230" fill="#e6ffe6" stroke="#006600" stroke-width="2" />
  <text x="400" y="330" font-family="Arial, sans-serif" font-size="18" text-anchor="middle">Methods (Using State)</text>
  <text x="90" y="360" font-family="Arial, sans-serif" font-size="14">• getContent()</text>
  <text x="90" y="390" font-family="Arial, sans-serif" font-size="14">• processContent()</text>
  <text x="90" y="420" font-family="Arial, sans-serif" font-size="14">• renderContent()</text>
  <text x="90" y="450" font-family="Arial, sans-serif" font-size="14">• handleRequest()</text>

  <!-- Arrows -->
  <line x1="220" y1="270" x2="220" y2="300" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)" />
  <line x1="580" y1="270" x2="580" y2="300" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)" />

  <!-- Legend -->
  <rect x="600" y="520" width="20" height="20" fill="#e6f3ff" stroke="#0066cc" stroke-width="2" />
  <text x="630" y="535" font-family="Arial, sans-serif" font-size="14">Configuration State</text>
  <rect x="600" y="550" width="20" height="20" fill="#fff0e6" stroke="#cc6600" stroke-width="2" />
  <text x="630" y="565" font-family="Arial, sans-serif" font-size="14">Operational State</text>
</svg>