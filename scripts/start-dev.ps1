param(
  [int]$DefaultPort = 5173
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

function Resolve-Port {
  param([int]$Fallback)

  foreach ($candidate in @($env:DEV_SERVER_PORT, $env:VITE_PORT, $env:PORT)) {
    if ([string]::IsNullOrWhiteSpace($candidate)) {
      continue
    }

    $parsed = 0
    if ([int]::TryParse($candidate, [ref]$parsed)) {
      return $parsed
    }
  }

  return $Fallback
}

function Stop-ProcessesOnPort {
  param([int]$Port)

  $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
  if (-not $connections) {
    Write-Host "No process listening on port $Port."
    return
  }

  $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($pid in $pids) {
    try {
      $process = Get-Process -Id $pid -ErrorAction Stop
      Write-Host ("Stopping process {0} (PID {1})" -f $process.ProcessName, $pid)
      Stop-Process -Id $pid -Force -ErrorAction Stop
    } catch {
      Write-Warning ("Failed to stop PID {0}: {1}" -f $pid, $_.Exception.Message)
    }
  }
}

$port = Resolve-Port -Fallback $DefaultPort
Write-Host "Ensuring port $port is free..."
Stop-ProcessesOnPort -Port $port

$npm = Get-Command npm -ErrorAction Stop
Write-Host "Starting Vite dev server on port $port..."
& $npm.Source run dev:serve
exit $LASTEXITCODE
