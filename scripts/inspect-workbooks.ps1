Add-Type -AssemblyName System.IO.Compression.FileSystem

function Inspect-Workbook([string]$filePath) {
    Write-Output "=== File: $filePath ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $filePath).Path)
    $entry = $zip.GetEntry("xl/workbook.xml")
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xml = [xml]$reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $zip.Dispose()
    
    foreach ($s in $xml.workbook.sheets.sheet) {
        Write-Output " - $($s.name) (id: $($s.sheetId), r:id: $($s.id))"
    }
}

Inspect-Workbook "Meat Port 2.xlsx"
Inspect-Workbook "Meat Port 2_latest.xlsx"
Inspect-Workbook "Meat_Port_Downloaded.xlsx"
