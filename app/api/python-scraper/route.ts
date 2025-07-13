import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const action = searchParams.get('action') || 'recent';
    
    console.log(`🐍 Running Python scraper: ${action} ${limit}`);
    
    return new Promise((resolve) => {
      const pythonProcess = spawn('python', ['pump_scraper_mongodb.py', action, limit], {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data: Buffer) => {
        const text = data.toString().trim();
        output += text + '\n';
        console.log(`🐍 Python Output: ${text}`);
      });

      pythonProcess.stderr.on('data', (data: Buffer) => {
        const text = data.toString().trim();
        errorOutput += text + '\n';
        console.error(`🐍 Python Error: ${text}`);
      });

      pythonProcess.on('close', (code: number) => {
        if (code === 0) {
          console.log('✅ Python scraper completed successfully');
          resolve(NextResponse.json({
            success: true,
            message: `Python scraper completed successfully for ${action} ${limit}`,
            output: output,
            timestamp: new Date().toISOString()
          }));
        } else {
          console.error(`❌ Python scraper failed with code ${code}`);
          resolve(NextResponse.json({
            success: false,
            message: `Python scraper failed with code ${code}`,
            output: output,
            error: errorOutput,
            timestamp: new Date().toISOString()
          }, { status: 500 }));
        }
      });

      pythonProcess.on('error', (error: Error) => {
        console.error('❌ Failed to start Python scraper:', error);
        resolve(NextResponse.json({
          success: false,
          message: `Failed to start Python scraper: ${error.message}`,
          timestamp: new Date().toISOString()
        }, { status: 500 }));
      });
    });
    
  } catch (error) {
    console.error('❌ Python scraper API error:', error);
    
    return NextResponse.json({
      success: false,
      message: `Python scraper API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request); // Allow both GET and POST
}
