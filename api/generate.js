// ==========================================
// WASIFALI WEB TO APK CONVERTER API
// DEVELOPER: WASIF ALI
// TELEGRAM: @FREEHACKS95
// VERSION: 2.0.0 (FULLY WORKING)
// ==========================================

// Simple in-memory storage
const apkStorage = new Map();

export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 2. Handle OPTIONS Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 3. HANDLE DOWNLOAD (GET request with ?download=ID)
  if (req.method === 'GET' && req.query.download) {
    const id = req.query.download;
    const apk = apkStorage.get(id);
    
    if (!apk) {
      return res.status(404).json({
        success: false,
        error: 'APK not found or expired (valid for 10 minutes only)',
        developer: 'WASIF ALI',
        telegram: '@FREEHACKS95'
      });
    }
    
    // Send APK file
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${apk.fileName}"`);
    res.setHeader('X-Developer', 'WASIF ALI');
    res.setHeader('X-Telegram', '@FREEHACKS95');
    return res.send(apk.buffer);
  }
  
  // 4. HANDLE API INFO (GET request without download)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      api_name: 'Wasifali Web to APK Converter',
      version: '2.0.0',
      developer: 'WASIF ALI',
      telegram: '@FREEHACKS95',
      endpoints: {
        generate: {
          method: 'POST',
          url: '/api/generate',
          description: 'Generate APK from website URL',
          body_example: {
            url: 'https://google.com',
            app_name: 'Google App',
            package_name: 'com.google.app',
            version: '1.0.0',
            icon_url: 'https://example.com/icon.png'
          }
        },
        download: {
          method: 'GET',
          url: '/api/generate?download={request_id}',
          description: 'Download generated APK'
        }
      },
      sample_curl: `curl -X POST https://wasifali-web-to-apk.vercel.app/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://google.com","app_name":"Google App"}'`
    });
  }
  
  // 5. HANDLE APK GENERATION (POST request)
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Use POST method to generate APK',
      developer: 'WASIF ALI',
      telegram: '@FREEHACKS95'
    });
  }
  
  try {
    // Parse request body
    const { url, app_name, package_name, version = '1.0.0', icon_url = null } = req.body;
    
    // Validate required fields
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'url is required',
        message: 'Please provide website URL',
        developer: 'WASIF ALI',
        telegram: '@FREEHACKS95'
      });
    }
    
    if (!app_name) {
      return res.status(400).json({
        success: false,
        error: 'app_name is required',
        message: 'Please provide app name',
        developer: 'WASIF ALI',
        telegram: '@FREEHACKS95'
      });
    }
    
    // Generate package name if not provided
    const cleanName = app_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const finalPackage = package_name || `com.${cleanName}`;
    const requestId = Date.now().toString() + Math.random().toString(36).substring(5);
    const fileName = `${cleanName}_v${version.replace(/\./g, '_')}.apk`;
    
    console.log(`[${requestId}] Generating APK:`);
    console.log(`  App: ${app_name}`);
    console.log(`  URL: ${url}`);
    console.log(`  Package: ${finalPackage}`);
    
    // Call external APK generation API
    const formData = new URLSearchParams();
    formData.append('url', url);
    formData.append('app_name', app_name);
    formData.append('package_name', finalPackage);
    formData.append('version', version);
    if (icon_url) formData.append('icon_url', icon_url);
    
    const externalResponse = await fetch('https://pwa2apk.com/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });
    
    if (!externalResponse.ok) {
      throw new Error(`External API failed with status ${externalResponse.status}`);
    }
    
    // Get APK buffer
    const apkBuffer = await externalResponse.arrayBuffer();
    const apkSizeMB = (apkBuffer.byteLength / (1024 * 1024)).toFixed(2);
    
    // Store APK in memory
    apkStorage.set(requestId, {
      buffer: Buffer.from(apkBuffer),
      fileName: fileName,
      app_name: app_name,
      createdAt: Date.now()
    });
    
    // Auto cleanup after 10 minutes
    setTimeout(() => {
      apkStorage.delete(requestId);
    }, 600000);
    
    // Clean old entries if storage gets too large
    if (apkStorage.size > 50) {
      const oldestKey = apkStorage.keys().next().value;
      apkStorage.delete(oldestKey);
    }
    
    // Construct download URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    const downloadUrl = `${protocol}://${host}/api/generate?download=${requestId}`;
    
    // Return success response
    return res.status(200).json({
      success: true,
      developer: 'WASIF ALI',
      telegram: '@FREEHACKS95',
      message: 'APK generated successfully',
      data: {
        app_name: app_name,
        package_name: finalPackage,
        version: version,
        source_url: url,
        icon_url: icon_url || 'default',
        apk_download_url: downloadUrl,
        apk_size_mb: apkSizeMB,
        file_name: fileName,
        generated_at: new Date().toISOString(),
        expires_in: '10 minutes'
      },
      instructions: 'Use the apk_download_url to download your APK file'
    });
    
  } catch (error) {
    console.error('Generation Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      message: 'Failed to generate APK. Please try again.',
      developer: 'WASIF ALI',
      telegram: '@FREEHACKS95'
    });
  }
}
