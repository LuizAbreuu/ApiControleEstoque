param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]] $NpmArgs
)

$ErrorActionPreference = 'Stop'

$version = '22.22.3'
$nodeHome = "C:\tmp\node-v$version-win-x64"

if (!(Test-Path $nodeHome)) {
  throw "Node.js $version nao encontrado em $nodeHome. Rode novamente o script de instalacao do Node 22."
}

$env:PATH = "$nodeHome;$env:PATH"

Write-Host "Using Node: $(& node -v)  NPM: $(& npm -v)"

if (!$NpmArgs -or $NpmArgs.Count -eq 0) {
  Write-Host "Run: npm run dev"
  exit 0
}

& npm @NpmArgs
