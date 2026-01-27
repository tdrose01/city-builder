param(
  [string]$Message
)
Add-Content -Path 'progress.txt' -Value "$((Get-Date).ToString('s')) $Message"