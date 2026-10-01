$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$workspace = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $workspace 'public\tenants\areej\products'
$files = @(Get-ChildItem -LiteralPath $outputDir -Filter 'areej-p-*.jpg' -File)
$index = 0

foreach ($file in $files) {
  $tempFile = $file.FullName + '.optimized.jpg'
  $sourceImage = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    $maxWidth = 1600
    $maxHeight = 1200
    $scale = [Math]::Min(1.0, [Math]::Min($maxWidth / $sourceImage.Width, $maxHeight / $sourceImage.Height))
    $width = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($sourceImage, 0, 0, $width, $height)
      } finally { $graphics.Dispose() }

      $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
      $quality = New-Object System.Drawing.Imaging.EncoderParameters(1)
      try {
        $quality.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]84)
        $bitmap.Save($tempFile, $codec, $quality)
      } finally { $quality.Dispose() }
    } finally { $bitmap.Dispose() }
  } finally { $sourceImage.Dispose() }

  Move-Item -LiteralPath $tempFile -Destination $file.FullName -Force
  $index += 1
  Write-Output ("Optimized {0}/{1}: {2}" -f $index, $files.Count, $file.Name)
}
