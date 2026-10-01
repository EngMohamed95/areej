$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$workspace = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $workspace 'public\tenants\areej\products'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('areej-drive-' + [Guid]::NewGuid().ToString('N'))

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

# Only confident name/category matches are included. One source may serve multiple
# menu variants when Drive provides a single generic photo for the dish.
$images = @(
  @{ id='1RDSy3iwKXXLPHsuG2rW9lrQfTNsYfluR'; products=@('areej-p-01'); ext='cr3' },
  @{ id='1mdne5jV0Bp737WKUeaKm8T6II6wVoDS-'; products=@('areej-p-02'); ext='cr3' },
  @{ id='1S26StpgHob3FWQ21Ld1G-Na5CdoMt08l'; products=@('areej-p-03'); ext='cr3' },
  @{ id='1ZsMorwjqprKzvKsbj6kwsdQ4Lw_PxFub'; products=@('areej-p-04'); ext='cr3' },
  @{ id='1SeJWPVcC-BlZXMlAt62U1xCvJdCxRH_I'; products=@('areej-p-05'); ext='cr3' },
  @{ id='1u3Ignp4I3uKVQeu-FV3uxKj1Og40JiNE'; products=@('areej-p-06'); ext='cr3' },
  @{ id='1uPz38Sksnd5kenpoVXXqSStZ1z0yRI_W'; products=@('areej-p-07'); ext='cr3' },
  @{ id='1WiRHGAfbA-N85A1MGMDEQKg_bbur3kBI'; products=@('areej-p-08'); ext='cr3' },
  @{ id='1c0qrBs3IPPLm_Ntg4rqCtqBsi3tVFNFP'; products=@('areej-p-09'); ext='cr3' },
  @{ id='1lEe0d2wuPYfouhwiLEtyM05dn3HwcSXi'; products=@('areej-p-10'); ext='cr3' },
  @{ id='1t4NLs7IYq-xK_-K-iUkC8oxS0RGK2_zk'; products=@('areej-p-11'); ext='cr3' },
  @{ id='1O4HKEp8EBxsU08nDhtrofek9L8PiTL59'; products=@('areej-p-13'); ext='cr3' },
  @{ id='1E6sV8yYSImcY9S-N3SkitiDRpTwrBpZ7'; products=@('areej-p-14'); ext='cr3' },
  @{ id='1IAjQEspk1ubgv3gMxwQYvUixy2KuyUbx'; products=@('areej-p-15'); ext='cr3' },
  @{ id='14rIo8s-r_ckh0gMnwqwBbWi5ufLz3c7n'; products=@('areej-p-16'); ext='cr3' },
  @{ id='1M0D3wYq2hAeGi3Uu7Vk9MHBGc01Ls1g3'; products=@('areej-p-17'); ext='cr3' },
  @{ id='1WE2FDOq_ML-r9HLZCDvt_8k1PzpS0tTd'; products=@('areej-p-18'); ext='cr3' },
  @{ id='1mE3Iqo45Z3FojRjx-QhE8XYBITfevgPf'; products=@('areej-p-19'); ext='cr3' },
  @{ id='1SsaIyQqmjF9HNT7Sob6MWvlHgXdcGPxd'; products=@('areej-p-21'); ext='cr3' },
  @{ id='1vRPthz7wCJlOsbR3PjRCZdfnGOI1jHgI'; products=@('areej-p-22'); ext='cr3' },
  @{ id='1AyMBciCZzLBhccweO0VHuUAY8B9v_EeW'; products=@('areej-p-23'); ext='cr3' },
  @{ id='1siUiNOerGX6-pqYoA3u0NqBnRhw12vSN'; products=@('areej-p-24'); ext='cr3' },
  @{ id='1eQk242PmXrwCI9tr_sBxcKCONV8e5ydE'; products=@('areej-p-25'); ext='cr3' },
  @{ id='1pOI60kxVvCO1MnStMcJmov3dLKBCbhyc'; products=@('areej-p-26'); ext='cr3' },
  @{ id='16gwW6q1TOhaLHp32CU2WFs2PftyCVHJF'; products=@('areej-p-27'); ext='cr3' },
  @{ id='1L053lWhV412bTWh2PmBZ5XKZ12_tmzN2'; products=@('areej-p-28'); ext='cr3' },
  @{ id='1bfUlBTkYBuOIjnwzuWozVn7whOVhj0kN'; products=@('areej-p-29'); ext='cr3' },
  @{ id='1K1-DSskBKq1jZ1ezwyY12zF5S-v-pjVU'; products=@('areej-p-30','areej-p-31'); ext='cr3' },
  @{ id='1ZS6yhQQgo_fxGzBDVR4W-KmReJt1pXeJ'; products=@('areej-p-33'); ext='cr3' },
  @{ id='1Md0V7exfWXuin639I0H8uucvz1AqebJr'; products=@('areej-p-34'); ext='cr3' },
  @{ id='1InO7CF-Hwz-_xd3OL5Afk4aKIKnLhPhD'; products=@('areej-p-35'); ext='cr3' },
  @{ id='1zTEKWhVSMxdEgIxNRRl7Q13jRuA0KK_e'; products=@('areej-p-36'); ext='cr3' },
  @{ id='1O_lkAlRSoAWzHp4YZgRJbNxox30DXpxy'; products=@('areej-p-37'); ext='cr3' },
  @{ id='1ZSmOCk0whaTgnKLcZesbLrqt0IVBM1Ya'; products=@('areej-p-38'); ext='jpg' },
  @{ id='1snqkmgrVeSMG0DbMeS3UuADjFb389r2A'; products=@('areej-p-40'); ext='cr3' },
  @{ id='1elucOAIGYc0W4Lyos19XwjmyDwosgtQk'; products=@('areej-p-41'); ext='cr3' },
  @{ id='1M5YtlIclTuSxnriJl052GDj3a0GmeGia'; products=@('areej-p-42'); ext='cr3' },
  @{ id='1EmSjBnrSqXBD2XoLxutZYJFtvCWNktCW'; products=@('areej-p-43'); ext='cr3' },
  @{ id='1gRMCCFvMCLZQHB62-SIPwIR4DGL0v-ns'; products=@('areej-p-44'); ext='cr3' },
  @{ id='1gu2ZdIVLgGqsnSugqfWC46rf1_JfiZiv'; products=@('areej-p-45'); ext='cr3' },
  @{ id='1dXiBLpXI8NE9cSi4H2Ol0Kilnt2WBnx6'; products=@('areej-p-46'); ext='cr3' },
  @{ id='1u-c0R9zy0rfu_mwJ8_-ssEyzJ36AYOw-'; products=@('areej-p-47'); ext='cr3' },
  @{ id='1REcOTZTG38dPilOiMEVQ5RZUq_VZEIID'; products=@('areej-p-48'); ext='cr3' },
  @{ id='1i01c4Yy10Lj0cjQ4c5r-KQbXGqkKaNmX'; products=@('areej-p-49'); ext='cr3' },
  @{ id='1nyfrQmA7yst0WXtLD4TIUE4WN7rME8C7'; products=@('areej-p-50'); ext='cr3' },
  @{ id='1EfjMZiJWtn7BUUXlgcZuh-FY0b3oGH_Z'; products=@('areej-p-51'); ext='cr3' },
  @{ id='1twqBZ7FyG7jTAARw9pjqzO-WghozwDns'; products=@('areej-p-54'); ext='cr3' },
  @{ id='1qAQFQhNjflEaYtDTFaQPQ5h2bnc-Xzv8'; products=@('areej-p-55'); ext='cr3' },
  @{ id='1PQNAI2hemHv7KYvJgZV23sjQxGi4go3a'; products=@('areej-p-57'); ext='cr3' },
  @{ id='1C5flKZ3xaCq7a6azv4EK_EQxHs5P_BJN'; products=@('areej-p-58'); ext='cr3' },
  @{ id='1AkbjCR02pbGpD8A83dkGJPlSsT0DDZwD'; products=@('areej-p-61'); ext='cr3' },
  @{ id='1W0WX3u0lommc0iTRgNOSe3SF6SaoeRYP'; products=@('areej-p-62'); ext='cr3' },
  @{ id='1leCHJTmogL9ulG91HtaQk4oXv311mafu'; products=@('areej-p-63'); ext='cr3' },
  @{ id='1ZIpESEVPOHsyBs15uRE6JT-hpvgpr4IS'; products=@('areej-p-64'); ext='cr3' },
  @{ id='1hd68775sPuKZw3t0Dp-vgZyh_db4QLh7'; products=@('areej-p-65'); ext='cr3' },
  @{ id='1D1qzIJjaxXsEhB1kZO9TXitdEaO4eZT2'; products=@('areej-p-66'); ext='cr3' },
  @{ id='1yFqhBB_es6M-rWyGO80HWjpAUZLLF7U0'; products=@('areej-p-67'); ext='cr3' },
  @{ id='1rV9Zr7JKRkd3ijQ8ZFHqxJgilzWNTUsJ'; products=@('areej-p-68'); ext='cr3' },
  @{ id='1ouEeHEhi7VjOfghwVrgfslKlzqwdkShv'; products=@('areej-p-69'); ext='cr3' },
  @{ id='18i3lHRK3sJRXaPddswXAeZHf9gzOjJ4R'; products=@('areej-p-70'); ext='cr3' },
  @{ id='14lMZkPAps16VcUdnxjgA1mRxg8EUi1NY'; products=@('areej-p-71'); ext='cr3' },
  @{ id='1SZih0BMxprXqV7MWqWkAxCCUlqYtVWl4'; products=@('areej-p-73'); ext='cr3' },
  @{ id='1a2pZa7Rc5gWgNjsn4g9CSodcreDhoBHA'; products=@('areej-p-75'); ext='cr3' },
  @{ id='19JKpACwcBo5TiaL3541OCcN2CJ5_CBNO'; products=@('areej-p-76'); ext='cr3' },
  @{ id='1jw_L_m7Rqr-yjjBibTJC0OQIeUo0OFOj'; products=@('areej-p-77'); ext='cr3' },
  @{ id='1zujQWq1Jqq_wnpVec54nv1dSiPdrdnb_'; products=@('areej-p-79'); ext='cr3' },
  @{ id='1KL2gTA0IIZPqo5uJGt0DmWlouKO3WAuL'; products=@('areej-p-82'); ext='cr3' },
  @{ id='111TyG2RQw6qyH4zYKIVCiS94jlswYSKv'; products=@('areej-p-83'); ext='cr3' },
  @{ id='1gx2kOCGIf9AChmDV5eHfm7YH00FGHQ8a'; products=@('areej-p-84'); ext='cr3' },
  @{ id='1QhbGHQV2yaxIScp_OmLyY0v3HD1bkydE'; products=@('areej-p-85'); ext='cr3' },
  @{ id='1mXsmkyfjUVFFBcml7y0K2y2LFPQqLYC9'; products=@('areej-p-86'); ext='cr3' },
  @{ id='1WsvJXSQQA9RanLzwnhd0IQR3-FRUc6Y4'; products=@('areej-p-87'); ext='cr3' }
)

function Save-OptimizedJpeg {
  param([string]$Source, [string]$Target)

  $sourceImage = [System.Drawing.Image]::FromFile($Source)
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
      } finally {
        $graphics.Dispose()
      }

      $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
      $quality = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $quality.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]84)
      $bitmap.Save($Target, $codec, $quality)
      $quality.Dispose()
    } finally {
      $bitmap.Dispose()
    }
  } finally {
    $sourceImage.Dispose()
  }
}

try {
  $completed = 0
  foreach ($image in $images) {
    $missingTargets = @($image.products | Where-Object { -not (Test-Path (Join-Path $outputDir ($_.ToString() + '.jpg'))) })
    if ($missingTargets.Count -eq 0) {
      $completed += $image.products.Count
      continue
    }

    $rawPath = Join-Path $tempRoot ('source.' + $image.ext)
    $previewPath = Join-Path $tempRoot 'preview.jpg'
    $downloadUrl = 'https://drive.usercontent.google.com/download?id=' + $image.id + '&export=download&confirm=t'
    & curl.exe -L --fail --silent --show-error $downloadUrl -o $rawPath
    if ($LASTEXITCODE -ne 0) { throw "Download failed for $($image.id)" }

    if ($image.ext -eq 'cr3') {
      & node (Join-Path $PSScriptRoot 'extract-cr3-preview.cjs') $rawPath $previewPath | Out-Null
      if ($LASTEXITCODE -ne 0) { throw "CR3 preview extraction failed for $($image.id)" }
    } else {
      Copy-Item -LiteralPath $rawPath -Destination $previewPath -Force
    }

    $firstTarget = Join-Path $outputDir ($image.products[0] + '.jpg')
    Save-OptimizedJpeg -Source $previewPath -Target $firstTarget
    foreach ($productId in $image.products | Select-Object -Skip 1) {
      Copy-Item -LiteralPath $firstTarget -Destination (Join-Path $outputDir ($productId + '.jpg')) -Force
    }

    Remove-Item -LiteralPath $rawPath,$previewPath -Force -ErrorAction SilentlyContinue
    $completed += $image.products.Count
    Write-Output ("Imported {0}/{1}: {2}" -f $completed, (($images.products | Measure-Object).Count), ($image.products -join ', '))
  }
} finally {
  $resolvedTemp = [System.IO.Path]::GetFullPath($tempRoot)
  $systemTemp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
  if ($resolvedTemp.StartsWith($systemTemp, [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path $resolvedTemp)) {
    Remove-Item -LiteralPath $resolvedTemp -Recurse -Force
  }
}

Write-Output ("Product images ready in {0}" -f $outputDir)
