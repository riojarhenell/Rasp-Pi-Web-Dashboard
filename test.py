import websockets

async def handle_command(websocket, path):
    # Handle WebSocket connections here

start_server = websockets.serve(handle_command, "0.0.0.0", 8000)

# Add CORS headers
import asyncio
from aiohttp import web

async def add_cors_headers(request):
    response = web.Response()
    response.headers['Access-Control-Allow-Origin'] = 'https://emsbot.me'  # Adjust the origin accordingly
    return response

app = web.Application()
app.router.add_route('GET', '/', add_cors_headers)
app.router.add_route('POST', '/', add_cors_headers)
runner = web.AppRunner(app)
await runner.setup()
site = web.TCPSite(runner, '0.0.0.0', 8000)
await site.start()

await asyncio.gather(start_server, runner.cleanup())
