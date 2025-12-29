@echo off
REM Mudar para o diretório do script
cd /d "%~dp0"

REM Verificar e instalar dependências se necessário
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)

REM Verificar e criar .env.local se necessário
if not exist ".env.local" (
    echo Criando arquivo .env.local...
    (
        echo NEXT_PUBLIC_SUPABASE_URL=https://fdlglyqbfonmintvzhvm.supabase.co
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGdseXFiZm9ubWludHZ6aHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MDY3NjIsImV4cCI6MjA4MTk4Mjc2Mn0.cjcG5oDDIouFFJOVu9D9dFrlf8Lwq_r1JIxYN5rNuno
        echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbGdseXFiZm9ubWludHZ6aHZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjQwNjc2MiwiZXhwIjoyMDgxOTgyNzYyfQ.KYE-O-ETSWsW5dtub3jjBEU5irzju662GDoCKciosdU
        echo MAILTRAP_API_TOKEN=4b125b5b72581617724cb6ed15e2c618
        echo MAILTRAP_FROM_EMAIL=comercial@plugnrent.com.br
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
    ) > ".env.local"
)

REM Abrir navegador após 3 segundos
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

REM Iniciar servidor
echo.
echo Iniciando servidor em http://localhost:3000
echo.
call npm run dev
