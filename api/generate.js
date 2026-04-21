// ==========================================
// API NAME: Wasifali Web to APK Converter
// DEVELOPER: WASIF ALI
// TELEGRAM: @FREEHACKS95
// VERSION: 1.0.0
// ==========================================

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET request - API Documentation
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      api_name: "Wasifali Web to APK Converter",
      version: "1.0.0",
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95",
      endpoints: {
        generate_apk: {
          method: "POST",
          url: "/api/generate",
          description: "Convert any website to Android APK",
          content_type: "application/json",
          required_fields: {
            url: "Website URL (e.g., https://google.com)",
            app_name: "App display name (e.g., Google App)"
          },
          optional_fields: {
            package_name: "Android package name (e.g., com.google.app)",
            version: "App version (default: 1.0.0)",
            icon_url: "App icon URL (e.g., https://example.com/icon.png)"
          }
        }
      },
      example_requests: {
        curl: `curl -X POST https://wasifali-web-to-apk.vercel.app/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://google.com",
    "app_name": "Google App",
    "package_name": "com.google.app",
    "version": "2.0.0",
    "icon_url": "https://google.com/icon.png"
  }'`,
        
        javascript: `fetch('https://wasifali-web-to-apk.vercel.app/api/generate', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    url: 'https://google.com',
    app_name: 'Google App',
    package_name: 'com.google.app',
    version: '2.0.0',
    icon_url: 'https://google.com/icon.png'
  })
})
.then(res => res.json())
.then(data => console.log(data));`,
        
        python: `import requests
response = requests.post(
    'https://wasifali-web-to-apk.vercel.app/api/generate',
    json={
        'url': 'https://google.com',
        'app_name': 'Google App',
        'package_name': 'com.google.app',
        'version': '2.0.0',
        'icon_url': 'https://google.com/icon.png'
    }
)
print(response.json())`
      },
      sample_response: {
        success: true,
        api_name: "Wasifali Web to APK Converter",
        message: "APK generated successfully",
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95",
        data: {
          app_name: "Google App",
          package_name: "com.google.app",
          version: "2.0.0",
          source_url: "https://google.com",
          apk_download_url: "https://wasifali-web-to-apk.vercel.app/api/generate?download=123456",
          apk_size_mb: "5.23",
          file_name: "google_app_v2_0_0.apk",
          generated_at: "2024-01-15T10:30:00.000Z",
          expires_in: "10 minutes"
        }
      }
    });
  }
  
  // POST request - Generate APK
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      api_name: "Wasifali Web to APK Converter",
      error: "Method not allowed. Use POST method.",
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    });
  }
  
  try {
    const { 
      url, 
      app_name, 
      package_name, 
      version = "1.0.0",
      icon_url = null
    } = req.body;
    
    // Validate required fields
    if (!url) {
      return res.status(400).json({
        success: false,
        api_name: "Wasifali Web to APK Converter",
        error: "URL is required",
        message: "Please provide 'url' field in request body",
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95",
        example: {
          url: "https://example.com",
          app_name: "My App"
        }
      });
    }
    
    if (!app_name) {
      return res.status(400).json({
        success: false,
        api_name: "Wasifali Web to APK Converter",
        error: "App name is required",
        message: "Please provide 'app_name' field in request body",
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95",
        example: {
          url: "https://example.com",
          app_name: "My App"
        }
      });
    }
    
    // Generate package name if not provided
    const cleanName = app_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const finalPackage = package_name || `com.${cleanName}`;
    const requestId = Date.now().toString() + Math.random().toString(36).substring(7);
    const fileName = `${cleanName}_v${version.replace(/\./g, '_')}.apk`;
    
    console.log(`[Wasifali API] Generating APK:`);
    console.log(`  App Name: ${app_name}`);
    console.log(`  URL: ${url}`);
    console.log(`  Package: ${finalPackage}`);
    console.log(`  Version: ${version}`);
    if (icon_url) console.log(`  Icon: ${icon_url}`);
    
    // Prepare form data for external API
    const formData = new URLSearchParams();
    formData.append('url', url);
    formData.append('app_name', app_name);
    formData.append('package_name', finalPackage);
    formData.append('version', version);
    
    if (icon_url) {
      formData.append('icon_url', icon_url);
    }
    
    // Call free APK generation API
    let apiResponse;
    try {
      apiResponse = await fetch('https://pwa2apk.com/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        timeout: 30000
      });
    } catch (fetchError) {
      console.error('API call failed:', fetchError);
      return res.status(503).json({
        success: false,
        api_name: "Wasifali Web to APK Converter",
        error: "APK generation service is currently unavailable",
        message: "Please try again later",
        developer: "WASIF ALI",
        telegram: "@FREEHACKS95"
      });
    }
    
    if (!apiResponse.ok) {
      throw new Error(`External API returned ${apiResponse.status}`);
    }
    
    // Get APK buffer
    const apkBuffer = await apiResponse.arrayBuffer();
    const apkSize = (apkBuffer.byteLength / (1024 * 1024)).toFixed(2);
    
    // Store APK in memory
    if (!global.apkStorage) {
      global.apkStorage = new Map();
    }
    
    // Clean old storage (keep last 50 APKs)
    if (global.apkStorage.size > 50) {
      const oldestKey = global.apkStorage.keys().next().value;
      global.apkStorage.delete(oldestKey);
    }
    
    global.apkStorage.set(requestId, {
      buffer: Buffer.from(apkBuffer),
      fileName: fileName,
      app_name: app_name,
      package_name: finalPackage,
      version: version,
      url: url,
      createdAt: Date.now()
    });
    
    // Auto delete after 10 minutes
    setTimeout(() => {
      global.apkStorage.delete(requestId);
    }, 600000);
    
    const baseUrl = `https://${req.headers.host}`;
    const downloadUrl = `${baseUrl}/api/generate?download=${requestId}`;
    
    // Return success response
    return res.status(200).json({
      success: true,
      api_name: "Wasifali Web to APK Converter",
      message: "APK generated successfully",
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95",
      data: {
        app_name: app_name,
        package_name: finalPackage,
        version: version,
        source_url: url,
        icon_url: icon_url || "default",
        apk_download_url: downloadUrl,
        apk_size_mb: apkSize,
        file_name: fileName,
        generated_at: new Date().toISOString(),
        expires_in: "10 minutes"
      },
      instructions: "Click on apk_download_url to download your APK file"
    });
    
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({
      success: false,
      api_name: "Wasifali Web to APK Converter",
      error: error.message || "Internal server error",
      message: "Failed to generate APK. Please check your inputs and try again.",
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    });
  }
}

// Handle download requests
if (req?.query?.download) {
  const downloadId = req.query.download;
  const apkData = global.apkStorage?.get(downloadId);
  
  if (!apkData) {
    return res.status(404).json({
      success: false,
      api_name: "Wasifali Web to APK Converter",
      error: "APK not found or expired",
      message: "Download link has expired (10 minutes validity)",
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95"
    });
  }
  
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', `attachment; filename="${apkData.fileName}"`);
  res.setHeader('Content-Length', apkData.buffer.length);
  res.setHeader('X-API-Name', 'Wasifali Web to APK Converter');
  res.setHeader('X-Developer', 'WASIF ALI');
  res.setHeader('X-Telegram', '@FREEHACKS95');
  res.setHeader('X-App-Name', apkData.app_name);
  res.setHeader('X-Package-Name', apkData.package_name);
  res.setHeader('X-Version', apkData.version);
  
  return res.send(apkData.buffer);
}
